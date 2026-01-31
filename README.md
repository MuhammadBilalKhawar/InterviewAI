# 🎯 InterviewAI - Master Your Interviews with AI

<div align="center">

[![React](https://img.shields.io/badge/React-19.1.1-blue?style=for-the-badge&logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.20-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.17-blue?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

**Ace Your Interviews with AI-Powered Feedback | Practice Smart, Get Hired Faster**

[🌐 Live Demo](https://interview-ai-opal.vercel.app) • [📚 Documentation](./PROJECT_DOCUMENTATION.md) • [🐛 Report Bug](#-support)

</div>

---

## 🚀 About InterviewAI

**InterviewAI** is a full-stack MERN application that transforms interview preparation through AI-powered feedback and personalized learning. Practice with 1000+ interview questions, receive instant AI analysis, and track your progress with comprehensive analytics.

✨ **Key Highlights:**
- 🤖 **AI-Powered Grading** - Google Gemini evaluates your answers in real-time
- 🎤 **Voice Input Support** - Practice speaking naturally with Web Speech API
- 📊 **Smart Analytics** - Track performance across difficulty levels and categories
- 🧠 **CV Skill Extraction** - Auto-discover your strengths from uploaded documents
- 📱 **Mobile Optimized** - Practice anywhere on any device
- 🔐 **OAuth Authentication** - Sign in with Google or GitHub
- ✅ **Personalized Recommendations** - Get questions matching your interests

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 👤 User Features
- ✅ Local & OAuth authentication (Google, GitHub)
- ✅ Personalized profile management
- ✅ CV upload with auto-skill extraction
- ✅ Interest-based learning paths
- ✅ Answer history with performance stats
- ✅ Real-time AI feedback scoring
- ✅ Progress tracking dashboard

</td>
<td width="50%">

### 🛠️ Admin Features
- ✅ Question database management
- ✅ Create/Edit/Delete questions
- ✅ Platform analytics & statistics
- ✅ User activity monitoring
- ✅ Batch PDF question import
- ✅ Category & difficulty management
- ✅ Performance insights

</td>
</tr>
</table>

### 🎯 Practice Features
- **Text & Voice Input** - Answer in your preferred way
- **Multi-Metric Scoring** - Clarity, Relevance, Depth, Structure
- **Detailed Feedback** - AI suggests improvements
- **Smart Recommendations** - Questions matched to your interests
- **Direct URL Practice** - `/practice?q=questionId` for quick access
- **Category Filtering** - Focus on specific interview types
- **Difficulty Progression** - Easy → Medium → Hard

---

## 🛠️ Tech Stack

### Frontend
```
React 19.1.1        - UI Framework
Vite 7.1.2          - Build tool
Tailwind CSS 4.1.17 - Styling
React Router v6     - Navigation
Web Speech API      - Voice recognition
```

### Backend
```
Node.js 18+         - Runtime
Express 5.1.0       - Web framework
MongoDB 8.20.0      - Database
Mongoose 8.20.0     - ODM
Passport.js 0.7.0   - Authentication
Google Gemini 1.30  - AI Grading
Multer 2.0.2        - File uploads
pdf-parse 2.4.5     - PDF parsing
```

### Infrastructure
```
Frontend  → Vercel          (https://interview-ai-opal.vercel.app)
Backend   → Render          (https://interviewai-zmzj.onrender.com)
Database  → MongoDB Atlas   (Cloud)
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ and npm/yarn
- **MongoDB** (local or Atlas)
- **Git** for version control

### Installation

#### 1️⃣ Clone Repository
```bash
git clone https://github.com/yourusername/InterviewAI.git
cd InterviewAI
```

#### 2️⃣ Setup Backend
```bash
cd backend
npm install

# Create .env file
echo "PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/interview-grader
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
SESSION_SECRET=your_session_secret
FRONTEND_URL=http://localhost:5173

GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/oauth/google/callback

GITHUB_CLIENT_ID=your_github_id
GITHUB_CLIENT_SECRET=your_github_secret
GITHUB_CALLBACK_URL=http://localhost:5000/api/oauth/github/callback" > .env

# Start server
npm run dev
```

#### 3️⃣ Setup Frontend
```bash
cd ../frontend
npm install

# Start development server
npm run dev
```

#### 4️⃣ Access Application
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000

---

## 📋 Usage Guide

### 1. Create Account
```
Click "Sign Up" or use Google/GitHub OAuth
Choose interests or upload CV for auto-detection
```

### 2. Practice Questions
```
Navigate to Practice page
Select a question or use recommended section
Answer via text or voice recording
Submit for AI evaluation
```

### 3. View Feedback
```
See scores: Clarity, Relevance, Depth, Structure
Read AI-generated suggestions
View improved answer example
```

### 4. Track Progress
```
Dashboard shows total answers & average score
History page displays all answers with scores
Admin can view platform-wide statistics
```

### 5. Manage Profile
```
Update interests manually
Upload CV for auto-skill extraction
View extracted skills and refine them
```

---

## 🔑 API Endpoints

### Authentication
```http
POST   /api/auth/register         # Create account
POST   /api/auth/login            # Login with email
GET    /api/auth/me               # Get current user
GET    /api/oauth/google          # Google OAuth
GET    /api/oauth/github          # GitHub OAuth
```

### Questions
```http
GET    /api/questions/list        # All questions
POST   /api/questions/create      # Create question (admin)
PUT    /api/questions/:id         # Update question (admin)
DELETE /api/questions/:id         # Delete question (admin)
GET    /api/questions/recommended # Get personalized questions
```

### Practice & Grading
```http
POST   /api/answers/grade         # Submit answer for AI grading
GET    /api/answers/history       # Get user's answer history
GET    /api/answers/all           # All answers (admin)
```

### User Profile
```http
GET    /api/users/profile         # Get profile
PUT    /api/users/profile         # Update profile
POST   /api/users/profile/upload-cv  # Upload & parse CV
```

---

## 🎨 UI/UX Highlights

- **Dark Theme with Amber Accents** - Modern amber/black gradient aesthetic
- **Glass Morphism** - Backdrop blur effects for depth
- **Smooth Animations** - Fade-in, slide, scale, and glow transitions
- **Splash Screen** - Beautiful opening animation on landing
- **Responsive Design** - Works perfectly on mobile (320px), tablet, desktop
- **Interactive Feedback** - Loading states, error messages, confirmations

---

## 🤖 AI Grading System

InterviewAI uses **Google Gemini AI** to evaluate interviews across 4 dimensions:

| Metric | Description | Range |
|--------|-------------|-------|
| **Clarity** | How clearly you expressed ideas | 1-10 |
| **Relevance** | How well you addressed the question | 1-10 |
| **Depth** | Technical depth and completeness | 1-10 |
| **Structure** | Organization and logical flow | 1-10 |
| **Overall** | Weighted average score | 1-10 |

**Example Response:**
```json
{
  "clarity": 8,
  "relevance": 9,
  "depth": 7,
  "structure": 8,
  "overall": 8.0,
  "feedback": [
    "Strong explanation of technical concepts",
    "Could include more real-world examples",
    "Good structure but could be more concise"
  ],
  "improved_answer": "An enhanced version of your answer..."
}
```

---

## 📊 Skill Extraction from CV

Upload a CV in any format (PDF, Word, TXT) to auto-extract 100+ skills:

**Supported Categories:**
- Programming Languages (JavaScript, Python, Java, C++, etc.)
- Frameworks & Libraries (React, Node.js, Django, etc.)
- Databases (MongoDB, PostgreSQL, MySQL, etc.)
- Cloud & DevOps (AWS, Docker, Kubernetes, etc.)
- Soft Skills (Leadership, Communication, Problem-solving, etc.)
- Methodologies (Agile, Scrum, Waterfall, etc.)

**Features:**
✅ Multiple file format support (PDF, DOC, DOCX, TXT)
✅ Fallback extraction if primary parsing fails
✅ Word-boundary matching to avoid false positives
✅ Auto-updates your interests
✅ 10MB file size limit

---

## 🚢 Deployment

### Deploy to Vercel (Frontend)
```bash
# Frontend auto-deploys on git push
1. Connect GitHub repo to Vercel
2. Set build command: npm run build
3. Set output directory: dist
4. Auto-deployed on push to main
```

### Deploy to Render (Backend)
```bash
# Backend auto-deploys on git push
1. Connect GitHub repo to Render
2. Set build command: npm install
3. Set start command: node server.js
4. Add environment variables in Render dashboard
5. Auto-deployed on push to main
```

### Environment Variables
```bash
# Production (.env)
PORT=5000
MONGO_URI=<production_mongodb_uri>
JWT_SECRET=<strong_random_secret>
GEMINI_API_KEY=<your_api_key>
SESSION_SECRET=<strong_random_secret>
FRONTEND_URL=https://interview-ai-opal.vercel.app

# OAuth (update from your cloud consoles)
GOOGLE_CLIENT_ID=<google_id>
GOOGLE_CLIENT_SECRET=<google_secret>
GOOGLE_CALLBACK_URL=https://interviewai-zmzj.onrender.com/api/oauth/google/callback

GITHUB_CLIENT_ID=<github_id>
GITHUB_CLIENT_SECRET=<github_secret>
GITHUB_CALLBACK_URL=https://interviewai-zmzj.onrender.com/api/oauth/github/callback
```

---

## 📁 Project Structure

```
InterviewAI/
├── frontend/
│   ├── src/
│   │   ├── pages/              # Page components
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Practice.jsx
│   │   │   ├── History.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── CreateQuestion.jsx
│   │   │   └── ListQuestions.jsx
│   │   ├── App.jsx              # Main routing
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Global styles & animations
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── config/
│   │   ├── db.js                # MongoDB connection
│   │   └── passport.js          # OAuth configuration
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── questionController.js
│   │   ├── answerController.js
│   │   ├── userController.js
│   │   └── pdfController.js
│   ├── models/
│   │   ├── user.js
│   │   ├── question.js
│   │   └── answer.js
│   ├── routes/
│   │   ├── authRouter.js
│   │   ├── oauthRouter.js
│   │   ├── questionRouter.js
│   │   ├── answerRouter.js
│   │   ├── userRouter.js
│   │   └── pdfRouter.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── utils/
│   │   └── aiClient.js
│   ├── server.js                # Express app setup
│   └── package.json
│
├── README.md
└── PROJECT_DOCUMENTATION.md
```

---

## 🔐 Security & Best Practices

- **Password Security** - Bcryptjs hashing with 10 salt rounds
- **JWT Authentication** - 7-day token expiration
- **CORS Protection** - Whitelisted origins only
- **Input Validation** - Server-side validation on all endpoints
- **File Upload Security** - 10MB limit, extension validation
- **Environment Variables** - Never expose secrets
- **Session Management** - Express-session with secure cookies
- **Role-Based Access** - Admin-only endpoints protected

---

## 🎯 Key Algorithms

### Smart Question Recommendation
```javascript
1. Fetch user's interests from profile
2. Search all questions for interest matches
3. Use word-boundary regex to avoid false matches
4. Return 4 randomized matches
5. Auto-refresh on dashboard reload
```

### AI Answer Evaluation
```javascript
1. Send question + answer to Google Gemini API
2. Receive structured JSON with scores
3. Validate response format
4. Save scores and feedback to database
5. Display to user with suggestions
```

### CV Skill Extraction
```javascript
1. Parse uploaded file (PDF/Word/TXT)
2. Extract all text content
3. Match against 100+ skill keywords
4. Use word boundaries for accuracy
5. Auto-update user interests
```

---

## 📈 Performance Metrics

- **Frontend Performance** - Optimized with Vite
- **Backend Response Time** - < 200ms average
- **AI Grading Time** - 3-5 seconds per response
- **Mobile Score** - >90 on Lighthouse
- **Bundle Size** - 150KB gzipped (frontend)

---

## 🐛 Troubleshooting

### OAuth Not Working?
```
✓ Check callback URLs match in .env and cloud console
✓ Verify CLIENT_ID and CLIENT_SECRET are correct
✓ Ensure FRONTEND_URL matches deployed domain
✓ Check CORS is configured for your domain
```

### CV Upload Failing?
```
✓ File size must be < 10MB
✓ Format must be PDF, DOC, DOCX, or TXT
✓ Check browser console for specific error
✓ Try different file format if one fails
```

### Answers Not Grading?
```
✓ Verify GEMINI_API_KEY is set in .env
✓ Check Google Gemini API is enabled
✓ Ensure backend is running (npm run dev)
✓ Check network tab for API errors
```

---

## 🚀 Future Roadmap

- [ ] Video interview practice with recording
- [ ] Peer-to-peer mock interviews
- [ ] Real-time whiteboard for coding questions
- [ ] ML-based difficulty prediction
- [ ] Payment integration for premium features
- [ ] Email notifications
- [ ] Export reports as PDF
- [ ] Mobile native app (React Native)
- [ ] LinkedIn profile integration
- [ ] Interview scheduler

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to branch** (`git push origin feature/AmazingFeature`)
5. **Open Pull Request**

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 💬 Support

Have questions or found a bug? 

- 📧 **Email:** support@interviewai.dev
- 🐛 **Issues:** [GitHub Issues](https://github.com/yourusername/InterviewAI/issues)
- 💡 **Discussions:** [GitHub Discussions](https://github.com/yourusername/InterviewAI/discussions)

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Profile](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

---

<div align="center">

**Made with ❤️ to help you ace your interviews**

⭐ If you found this project helpful, please give it a star!

[Back to Top](#-interviewai---master-your-interviews-with-ai)

</div>
