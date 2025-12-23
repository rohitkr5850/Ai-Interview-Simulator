# Architecture Documentation

## System Architecture

### High-Level Overview

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Client    │────────▶│   Backend   │────────▶│   MongoDB   │
│  (React)    │◀────────│  (Express)  │         │   Atlas     │
└─────────────┘         └─────────────┘         └─────────────┘
                              │
                              ▼
                       ┌─────────────┐
                       │   OpenAI    │
                       │     API     │
                       └─────────────┘
```

## Backend Architecture

### Folder Structure
```
server/
├── config/          # Configuration files
│   ├── database.js  # MongoDB connection
│   └── passport.js  # OAuth configuration
├── controllers/      # Request handlers
│   ├── authController.js
│   └── interviewController.js
├── middleware/      # Express middleware
│   ├── auth.js      # JWT authentication
│   ├── errorHandler.js
│   └── validation.js
├── models/          # Mongoose schemas
│   ├── User.js
│   └── InterviewSession.js
├── routes/          # API routes
│   ├── authRoutes.js
│   └── interviewRoutes.js
├── services/        # Business logic
│   └── aiService.js # OpenAI integration
└── utils/           # Helper functions
    └── generateToken.js
```

### Request Flow

1. **Client Request** → Express Router
2. **Middleware** → Authentication, Validation
3. **Controller** → Business logic orchestration
4. **Service** → External API calls, complex logic
5. **Model** → Database operations
6. **Response** → JSON to client

### Authentication Flow

```
User Login
  ↓
POST /api/auth/login
  ↓
authController.login()
  ↓
User.comparePassword()
  ↓
generateToken()
  ↓
Return JWT + User Data
  ↓
Client stores token
  ↓
Subsequent requests include: Authorization: Bearer <token>
  ↓
protect middleware validates token
```

### Interview Flow

```
Start Interview
  ↓
POST /api/interviews/start
  ↓
interviewController.startInterview()
  ↓
aiService.generateFirstQuestion()
  ↓
OpenAI API call
  ↓
Create InterviewSession
  ↓
Return session + first question
  ↓
─────────────────────────────
  ↓
Submit Answer
  ↓
POST /api/interviews/:id/answer
  ↓
Save answer to session
  ↓
If not last question:
  ↓
  aiService.generateFollowUpQuestion()
  ↓
  Return next question
  ↓
If last question:
  ↓
  aiService.evaluateInterview()
  ↓
  Calculate score
  ↓
  Return feedback
```

## Frontend Architecture

### Folder Structure
```
client/src/
├── components/      # Reusable UI components
│   └── Layout.jsx
├── pages/           # Page components
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── Interview.jsx
│   └── ...
├── context/         # React Context
│   └── AuthContext.jsx
├── hooks/           # Custom hooks
│   └── useSpeechToText.js
├── services/        # API services
│   ├── api.js
│   ├── authService.js
│   └── interviewService.js
└── utils/           # Helper functions
    └── PrivateRoute.jsx
```

### State Management

- **Auth State**: React Context (`AuthContext`)
- **Component State**: React Hooks (`useState`, `useEffect`)
- **API State**: Service layer with Axios interceptors

### Routing

```
/                    → Home
/login               → Login
/register            → Register
/dashboard           → Dashboard (Protected)
/interviews/new      → New Interview (Protected)
/interviews/:id      → Interview Session (Protected)
/interviews          → Interview History (Protected)
/analytics           → Analytics (Protected)
/profile             → Profile (Protected)
/auth/callback       → OAuth Callback
```

## Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  googleId: String (optional),
  role: Enum['Frontend', 'Backend', 'MERN', 'Full Stack'],
  experienceLevel: Enum['Beginner', 'Intermediate', 'Advanced'],
  interviewHistory: [ObjectId], // References to InterviewSession
  createdAt: Date
}
```

### InterviewSession Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  role: String,
  difficulty: String,
  interviewType: String,
  questions: [{
    question: String,
    questionNumber: Number,
    askedAt: Date,
    context: String
  }],
  answers: [{
    answer: String,
    questionNumber: Number,
    submittedAt: Date,
    timeSpent: Number,
    isVoiceAnswer: Boolean
  }],
  aiFeedback: {
    overallScore: Number,
    strengths: [String],
    weaknesses: [String],
    missedTopics: [String],
    suggestions: [String],
    roleSpecificFeedback: String,
    detailedEvaluation: String
  },
  score: Number,
  status: Enum['in-progress', 'completed', 'abandoned'],
  currentQuestionNumber: Number,
  totalQuestions: Number,
  conversationHistory: [{
    role: String,
    content: String,
    timestamp: Date
  }],
  createdAt: Date,
  completedAt: Date
}
```

## AI Service Architecture

### Prompt Engineering Strategy

1. **System Prompt**: Defines AI behavior
   - Role: Senior interviewer
   - Interview style based on difficulty
   - Focus areas based on role

2. **Context Management**: Maintains conversation history
   - Previous questions and answers
   - Interview flow
   - User's demonstrated knowledge

3. **Question Generation**:
   - First question: Role + difficulty specific
   - Follow-up: Context-aware, probes deeper

4. **Evaluation**:
   - Comprehensive analysis
   - Structured JSON response
   - Score calculation (0-100)

### OpenAI API Usage

- **Model**: GPT-4
- **Temperature**: 0.7 (questions), 0.3 (evaluation)
- **Max Tokens**: 200 (questions), 1500 (evaluation)
- **Response Format**: JSON for evaluation

## Security Architecture

### Authentication
- **JWT Tokens**: Stateless authentication
- **Token Storage**: localStorage (client)
- **Token Expiry**: 30 days
- **Password Hashing**: bcrypt (12 rounds)

### Authorization
- **Protected Routes**: Middleware check
- **User Isolation**: User can only access own data
- **Session Validation**: JWT verification on each request

### Data Protection
- **Input Validation**: express-validator
- **SQL Injection**: N/A (MongoDB)
- **XSS**: React auto-escaping
- **CSRF**: SameSite cookies (if using cookies)

## API Design

### RESTful Principles
- **Resources**: `/interviews`, `/auth`
- **HTTP Methods**: GET, POST, PUT, DELETE
- **Status Codes**: 200, 201, 400, 401, 404, 500
- **Response Format**: JSON

### Error Handling
```javascript
{
  success: false,
  message: "Error message",
  errors: [...] // Validation errors
}
```

### Success Response
```javascript
{
  success: true,
  data: {...},
  // or
  token: "...",
  user: {...}
}
```

## Performance Considerations

### Backend
- **Database Indexing**: email (unique), userId
- **Connection Pooling**: Mongoose default
- **Async/Await**: Non-blocking operations

### Frontend
- **Code Splitting**: React Router lazy loading (optional)
- **API Caching**: Consider React Query (future)
- **Bundle Size**: Vite optimization

### AI Service
- **Caching**: Not implemented (consider for common questions)
- **Rate Limiting**: Consider adding middleware
- **Timeout Handling**: Axios timeout configuration

## Scalability

### Horizontal Scaling
- **Stateless Backend**: JWT enables multiple instances
- **Database**: MongoDB Atlas sharding
- **CDN**: Vercel edge network

### Vertical Scaling
- **Database**: MongoDB Atlas auto-scaling
- **Backend**: Render/Railway auto-scaling

## Monitoring & Logging

### Recommended
- **Application Logs**: Console logs (production: structured logging)
- **Error Tracking**: Sentry
- **Performance**: APM tools
- **Database**: MongoDB Atlas monitoring

## Future Enhancements

1. **Real-time Updates**: WebSockets for live interview
2. **Caching Layer**: Redis for sessions
3. **Rate Limiting**: Prevent abuse
4. **Analytics**: Enhanced tracking
5. **PDF Export**: Interview reports
6. **Dark Mode**: UI enhancement
7. **Multi-language**: Internationalization

