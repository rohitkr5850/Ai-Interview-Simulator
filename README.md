# AI Interview Simulator

A production-ready, full-stack AI-powered interview simulation platform built with the MERN stack. Practice technical and HR interviews with AI that behaves like a real senior interviewer.

## 🚀 Features

- **AI-Powered Interviews**: Contextual follow-up questions based on your answers
- **Multiple Interview Types**: Technical, HR, or Mixed interviews
- **Role-Based Questions**: Frontend, Backend, MERN, or Full Stack
- **Difficulty Levels**: Beginner, Intermediate, Advanced
- **Voice & Text Input**: Answer using speech-to-text or typing
- **Comprehensive Feedback**: Detailed evaluation with scores, strengths, weaknesses, and suggestions
- **Analytics Dashboard**: Track progress over time with charts and insights
- **JWT Authentication**: Secure user authentication
- **Interview History**: View all past interviews with scores

## 🛠️ Tech Stack

### Frontend
- React 19 + Vite
- Tailwind CSS
- Recharts for analytics
- React Router
- Axios
- Web Speech API

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- OpenAI API (GPT-4)
- Express Validator

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- Groq API Key (Free - Recommended) or Gemini API Key (Free) or OpenAI API Key (Paid)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AI-Interview-Simulator
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**

   **Backend** (`server/.env`):
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/ai-interview-simulator
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   
   # AI Provider Configuration (Choose one)
   # Option 1: Google Gemini (FREE - Recommended for development)
   AI_PROVIDER=gemini
   GEMINI_API_KEY=your-gemini-api-key
   
   # Option 2: OpenAI (Paid)
   # AI_PROVIDER=openai
   # OPENAI_API_KEY=your-openai-api-key
   
   # Option 3: Mock Mode (No API needed - for testing)
   # AI_PROVIDER=mock
   
   FRONTEND_URL=http://localhost:5173
   ```

   **Frontend** (`client/.env`):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

   > 💡 **Get Free Gemini API Key**: Visit https://aistudio.google.com/app/apikey
   > See [GEMINI_SETUP.md](./GEMINI_SETUP.md) for detailed setup instructions.

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Run the application**
   ```bash
   # Development mode (runs both frontend and backend)
   npm run dev
   ```

   Or run separately:
   ```bash
   # Backend only
   npm run server

   # Frontend only
   npm run client
   ```

## 📁 Project Structure

```
AI-Interview-Simulator/
├── server/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth, error handling
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── services/        # AI service, business logic
│   ├── utils/           # Helper functions
│   └── index.js         # Server entry point
├── client/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context (Auth)
│   │   ├── hooks/       # Custom hooks
│   │   ├── services/    # API services
│   │   ├── utils/       # Helper functions
│   │   └── App.jsx       # Main app component
│   └── ...
└── README.md
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Interviews
- `POST /api/interviews/start` - Start new interview
- `POST /api/interviews/:sessionId/answer` - Submit answer
- `GET /api/interviews/:sessionId` - Get interview session
- `GET /api/interviews` - Get interview history
- `GET /api/interviews/analytics/overview` - Get analytics

## 🤖 AI Interview Engine

The AI interview engine uses GPT-4 with carefully crafted prompts to:
- Ask role-appropriate questions
- Maintain conversation context
- Ask intelligent follow-up questions
- Evaluate answers comprehensively
- Provide structured feedback

### Prompt Engineering

The system prompts are designed to make the AI behave like a senior interviewer:
- Asks one question at a time
- Probes deeper when answers are shallow
- Acknowledges strong answers
- Maintains professional tone
- Evaluates strictly but fairly

## 📊 Database Schemas

### User
- name, email, password
- role, experienceLevel
- interviewHistory (array of ObjectIds)
- createdAt

### InterviewSession
- userId, role, difficulty, interviewType
- questions, answers
- aiFeedback (score, strengths, weaknesses, etc.)
- conversationHistory
- status, createdAt, completedAt

## 🚢 Deployment

### Backend (Render/Railway)
1. Set environment variables
2. Deploy Node.js service
3. Update `FRONTEND_URL` in backend `.env`

### Frontend (Vercel/Netlify)
1. Set `VITE_API_URL` to your backend URL
2. Build: `npm run build`
3. Deploy the `dist` folder

### MongoDB
- Use MongoDB Atlas for production
- Update `MONGODB_URI` in backend `.env`

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Protected API routes
- Input validation
- CORS configuration
- Environment variable protection

## 📝 Usage

1. **Register/Login**: Create an account or sign in
2. **Configure Profile**: Set your target role and experience level
3. **Start Interview**: Choose role, difficulty, and interview type
4. **Answer Questions**: Use text or voice input
5. **Get Feedback**: View detailed evaluation after completion
6. **Track Progress**: Monitor performance in Analytics

## 🎨 Features in Detail

### Interview Flow
1. User selects interview configuration
2. AI generates first question
3. User submits answer (text or voice)
4. AI generates contextual follow-up
5. Process repeats for set number of questions
6. AI evaluates entire interview
7. User receives comprehensive feedback

### Analytics
- Total interviews completed
- Average score
- Score distribution (pie chart)
- Progress over time (line chart)
- Interviews by role (bar chart)
- Interviews by difficulty (bar chart)

## 🐛 Troubleshooting

**MongoDB Connection Error**
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`

**OpenAI API Error**
- Verify `OPENAI_API_KEY` is set correctly
- Check API quota/limits

**CORS Issues**
- Ensure `FRONTEND_URL` matches your frontend URL
- Check backend CORS configuration

## 📄 License

ISC

## 👨‍💻 Development

Built with production-grade practices:
- Clean architecture
- Modular code structure
- Error handling
- Input validation
- Responsive design
- Loading states
- Error states

---

**Note**: This is a production-ready application. Ensure you have proper API keys and database setup before deployment.

