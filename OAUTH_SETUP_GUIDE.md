# 🔐 OAuth Setup Guide - Google & GitHub Authentication

This guide shows you how to set up Google and GitHub OAuth for your InterviewAI application.

---

## **What Was Added**

✅ Google OAuth login
✅ GitHub OAuth login  
✅ Automatic user account creation
✅ Account merging if email exists
✅ Profile picture support

---

## **🔵 Step 1: Set Up Google OAuth**

### **A. Create Google OAuth App**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google+ API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. Create OAuth credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: **Web application**
   - Name: `InterviewAI`

5. Add authorized URIs:
   - **Authorized JavaScript origins**:
     - `http://localhost:5000`
     - `http://localhost:5173`
   - **Authorized redirect URIs**:
     - `http://localhost:5000/api/oauth/google/callback`

6. Click "Create"
7. Copy your **Client ID** and **Client Secret**

### **B. Update .env File**

Open `backend/.env` and update:
```
GOOGLE_CLIENT_ID=your-actual-client-id-here
GOOGLE_CLIENT_SECRET=your-actual-client-secret-here
```

---

## **🐙 Step 2: Set Up GitHub OAuth**

### **A. Create GitHub OAuth App**

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: `InterviewAI`
   - **Homepage URL**: `http://localhost:5173`
   - **Authorization callback URL**: `http://localhost:5000/api/oauth/github/callback`

4. Click "Register application"
5. Click "Generate a new client secret"
6. Copy your **Client ID** and **Client Secret**

### **B. Update .env File**

Open `backend/.env` and update:
```
GITHUB_CLIENT_ID=your-actual-client-id-here
GITHUB_CLIENT_SECRET=your-actual-client-secret-here
```

---

## **✅ Step 3: Test Locally**

1. **Restart Backend Server** (to load new env variables):
   - Stop the current backend (Ctrl+C in terminal)
   - Run: `cd backend && npm run dev`

2. **Open Frontend**: Go to `http://localhost:5173/login`

3. **Test Google Login**:
   - Click "Google" button
   - Select your Google account
   - Should redirect back and log you in ✅

4. **Test GitHub Login**:
   - Click "GitHub" button
   - Authorize the app
   - Should redirect back and log you in ✅

---

## **📝 For Production Deployment (Render + Vercel)**

### **Update Google OAuth**:
1. Go back to Google Cloud Console → Credentials
2. Edit your OAuth client
3. Add production URIs:
   - **Authorized JavaScript origins**:
     - `https://interviewai-zmzj.onrender.com`
     - `https://interview-ai-opal.vercel.app`
   - **Authorized redirect URIs**:
     - `https://interviewai-zmzj.onrender.com/api/oauth/google/callback`

### **Update GitHub OAuth**:
1. Go to GitHub OAuth Apps
2. Edit your app
3. Update:
   - **Homepage URL**: `https://interview-ai-opal.vercel.app`
   - **Callback URL**: `https://interviewai-zmzj.onrender.com/api/oauth/github/callback`

### **Update Render Environment Variables**:
1. Go to Render → Your service → Environment
2. Add all OAuth variables:
   ```
   SESSION_SECRET=your-random-secret
   FRONTEND_URL=https://interview-ai-opal.vercel.app
   GOOGLE_CLIENT_ID=your-id
   GOOGLE_CLIENT_SECRET=your-secret
   GOOGLE_CALLBACK_URL=https://interviewai-zmzj.onrender.com/api/oauth/google/callback
   GITHUB_CLIENT_ID=your-id
   GITHUB_CLIENT_SECRET=your-secret
   GITHUB_CALLBACK_URL=https://interviewai-zmzj.onrender.com/api/oauth/github/callback
   ```

### **Update Frontend OAuth URLs**:
In `Login.jsx` and `Register.jsx`, change:
```jsx
// From:
href="http://localhost:5000/api/oauth/google"

// To:
href="https://interviewai-zmzj.onrender.com/api/oauth/google"
```

---

## **🔧 Troubleshooting**

### **"Redirect URI mismatch" Error**
- Double-check your callback URLs match exactly
- Make sure you added them in Google/GitHub settings
- Restart backend after changing .env

### **"Cannot GET /api/oauth/google"**
- Backend server not running
- Check `server.js` has OAuth routes registered
- Verify passport.js is configured

### **No email in profile**
- **GitHub**: User's email must be public or you need email scope
- **Google**: Always returns email

### **Session errors**
- Add `SESSION_SECRET` to .env
- Restart backend server

---

## **✨ Features**

✅ **One-click login** with Google/GitHub
✅ **Auto account creation** for new users
✅ **Account merging** if email already exists
✅ **Profile pictures** from OAuth providers
✅ **Secure authentication** with JWT tokens
✅ **Same dashboard** experience as regular login

---

## **📁 Files Changed**

| File | Change |
|------|--------|
| `backend/models/user.js` | Added OAuth fields (googleId, githubId, avatar) |
| `backend/config/passport.js` | Passport.js configuration |
| `backend/routes/oauthRouter.js` | OAuth routes |
| `backend/server.js` | Added passport middleware |
| `frontend/src/pages/AuthCallback.jsx` | OAuth callback handler |
| `frontend/src/pages/Login.jsx` | Added OAuth buttons |
| `frontend/src/pages/Register.jsx` | Added OAuth buttons |
| `frontend/src/App.jsx` | Added callback route |

---

**Setup complete! Users can now sign in with Google or GitHub. 🎉**
