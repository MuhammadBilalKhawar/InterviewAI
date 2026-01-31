# 🤖 AI Question Generation - Cron Job Setup Guide

This guide walks you through setting up automatic AI question generation using a free cron service.

---

## **📋 What Was Added**

### **Backend Changes:**
1. **New function** in `backend/controllers/questionController.js`:
   - `generateQuestionsAI()` - Calls Gemini AI to create 10 questions every 2 days

2. **New route** in `backend/routes/questionRouter.js`:
   - `POST /api/questions/generate-ai-questions` - Endpoint for cron job to call

3. **New environment variable** in `backend/.env`:
   - `CRON_SECRET` - Secret key to authorize cron requests

---

## **✅ Step 1: Update Your Environment Variable**

1. Open `backend/.env` file
2. Find the line: `CRON_SECRET=your_secure_cron_secret_key_here_change_this`
3. **Replace it with a secure random string**, for example:
   - Use an online generator: https://www.random.org/strings/
   - Or use terminal: `openssl rand -hex 32`
   - Copy the generated random string into the CRON_SECRET value

4. **Save the file** - Keep this secret safe!

---

## **✅ Step 2: Deploy Updated Code to Render**

1. Open PowerShell in your project directory
2. Run these commands:

```powershell
git add .
git commit -m "Add AI question generation cron job feature"
git push
```

3. Wait 2-3 minutes for Render to automatically redeploy your backend
4. You should see the deployment succeed in Render dashboard

---

## **✅ Step 3: Set Environment Variable in Render**

1. Go to **Render.com** → Your backend service
2. Click **"Environment"** tab
3. Click **"Add Environment Variable"**
4. Set:
   - **Key**: `CRON_SECRET`
   - **Value**: (paste the same secret from your `.env` file)
5. Click **"Save Changes"**
6. Render will restart your service

---

## **✅ Step 4: Test the Endpoint Locally**

Before setting up the cron job, test if the endpoint works:

1. **Local testing** (if running backend locally on port 5000):
   ```powershell
   $headers = @{"x-cron-secret" = "your-secret-value-here"}
   Invoke-WebRequest -Uri "http://localhost:5000/api/questions/generate-ai-questions" `
     -Method POST `
     -Headers $headers
   ```

2. **Remote testing** (your Render URL):
   ```powershell
   $headers = @{"x-cron-secret" = "your-secret-value-here"}
   Invoke-WebRequest -Uri "https://interviewai-zmzj.onrender.com/api/questions/generate-ai-questions" `
     -Method POST `
     -Headers $headers
   ```

3. You should see a JSON response with:
   ```json
   {
     "success": true,
     "message": "Successfully generated and stored 10 questions",
     "count": 10
   }
   ```

---

## **✅ Step 5: Set Up Free Cron Service**

### **Option A: Cron-Job.org (Easiest)**

1. Go to https://cron-job.org/en/
2. Create Account (optional, helps manage jobs)
3. Click **"CREATE CRONJOB"**
4. Fill in:
   - **Title**: `InterviewAI - Generate Questions`
   - **URL**: `https://interviewai-zmzj.onrender.com/api/questions/generate-ai-questions`
   - **Method**: `POST`
   - **Execution time**: Choose your timezone
   - **Schedule**: Use `0 2 */2 * *` for every 2 days at 2 AM

5. **Add Header**:
   - Under "HTTP Headers", add:
     - **Header**: `x-cron-secret`
     - **Value**: (your CRON_SECRET - same value from Render)

6. Click **"Save"** 
7. You'll see it appear in your jobs list with status "OK"

---

### **Option B: EasyCron (Alternative)**

1. Go to https://www.easycron.com/
2. Click **"Create Cron Job"**
3. Fill in:
   - **URL to call**: `https://interviewai-zmzj.onrender.com/api/questions/generate-ai-questions`
   - **HTTP Method**: `POST`
   - **HTTP Headers**: `x-cron-secret: your-secret-value`
   - **Cron Expression**: `0 2 */2 * *`

4. Click **"Create"**

---

## **📅 Cron Schedule Explained**

The cron expression `0 2 */2 * *` means:
- **0** = at minute 0
- **2** = at 2 AM
- **\*/2** = every 2 days
- **\*** = every month
- **\*** = every day of week

**Other useful schedules:**
- Every day at 2 AM: `0 2 * * *`
- Every 3 days at 2 AM: `0 2 */3 * *`
- Every 6 hours: `0 */6 * * *`

---

## **✅ Step 6: Monitor Your Cron Job**

### **Check Cron-Job.org Status:**
- Log in to Cron-Job.org
- You'll see:
  - **Last Run**: When it last executed
  - **Status**: "OK" if successful, "FAILED" if error
  - **HTTP Status**: Should be 200
  - **Execution Time**: Duration

### **Check Database for New Questions:**
1. Go to MongoDB Atlas
2. Browse your `questions` collection
3. Look for questions with `"generatedByAI": true`
4. They should appear after each cron execution

### **Monitor Render Logs:**
1. Render dashboard → Your service
2. **Logs** tab → See request logs
3. Should show POST requests from cron service

---

## **🔧 Troubleshooting**

### **Cron job shows "FAILED" status**

**Common issues:**
1. **Wrong secret** - Check that header matches your env variable exactly
2. **URL incorrect** - Verify your Render URL is correct
3. **Service spun down** - Render free tier spins down after 15 min inactivity
   - Solution: First request wakes it up (~30 seconds), then cron succeeds
   - Try running it twice in a row
4. **API limit hit** - Google Gemini has rate limits
   - Solution: Space out cron jobs more (e.g., every 3 days)

### **Questions not appearing in database**

1. Check MongoDB connection in `.env`
2. Verify `GEMINI_API_KEY` is set correctly
3. Check Render logs for error messages
4. Test endpoint manually to see exact error

### **"Invalid cron secret" error**

- Go to Render → Environment variables
- Copy your `CRON_SECRET` value **exactly**
- Paste it in cron service header without extra spaces

---

## **🎯 What Happens Now**

Every 2 days at 2 AM (your timezone):
1. ✅ Cron service makes POST request to your endpoint
2. ✅ Backend receives request with secret header
3. ✅ Validates secret key matches env variable
4. ✅ Calls Gemini AI with prompt for 10 questions
5. ✅ AI returns 10 unique questions
6. ✅ Backend validates and stores in MongoDB
7. ✅ Questions available for users to practice
8. ✅ Your question bank keeps growing automatically!

---

## **🚀 Next Steps (Optional)**

1. Monitor questions quality - Check if AI-generated questions are good
2. Add manual approval - Create admin feature to review before publishing
3. Adjust frequency - Change from 2 days to daily as needed
4. Add notifications - Email admin when new questions generated
5. Upgrade service - When users grow, upgrade to proper background jobs

---

## **📝 File Changes Summary**

| File | Change |
|------|--------|
| `backend/controllers/questionController.js` | Added `generateQuestionsAI()` function |
| `backend/routes/questionRouter.js` | Added POST `/generate-ai-questions` route |
| `backend/.env` | Added `CRON_SECRET` environment variable |

---

**Setup complete! Your AI question generation will run automatically. 🎉**
