import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure environment variables are loaded from server directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// AI Provider Configuration - Groq Only
let AI_PROVIDER = process.env.AI_PROVIDER || 'groq'; // 'groq' or 'mock'
let groqApiKey = null;

// Initialize Groq API Key (Free Tier - Fast & Reliable)
const groqKey = process.env.GROQ_API_KEY;
if (groqKey && groqKey !== 'your-groq-api-key-here' && groqKey.trim().length > 0) {
  groqApiKey = groqKey.trim();
  console.log('✅ Groq API key configured successfully');
}

// Auto-detect provider - Groq or Mock
const requestedProvider = (process.env.AI_PROVIDER || 'groq').toLowerCase();

if (groqApiKey && requestedProvider !== 'mock') {
  // Use Groq if available and not explicitly set to mock
  AI_PROVIDER = 'groq';
  console.log('🔄 Using GROQ (available)');
} else {
  // No API key available or explicitly set to mock, use mock
  AI_PROVIDER = 'mock';
  if (requestedProvider === 'mock') {
    console.log('🔄 Using MOCK mode (explicitly requested)');
    console.log('💡 Tip: Set AI_PROVIDER=groq in your .env file to use Groq');
  } else {
    console.log('⚠️  No Groq API key found. Using MOCK mode.');
    console.log('💡 Tip: Add GROQ_API_KEY=your-key-here to your .env file');
  }
}

// Log current provider
console.log(`🤖 Using AI Provider: ${AI_PROVIDER.toUpperCase()}`);

/**
 * Generate the first interview question based on role, difficulty, and interview type
 */
export const generateFirstQuestion = async (role, difficulty, interviewType) => {
  const startTime = Date.now();
  const systemPrompt = getSystemPrompt(role, difficulty, interviewType);
  
  // More explicit user prompt based on interview type
  let userPrompt = '';
  if (interviewType === 'HR' || interviewType === 'Behavioral') {
    userPrompt = `Ask the first behavioral/HR question for a ${role} position at ${difficulty} level. Focus on soft skills, past experiences, or work style. DO NOT ask technical questions.`;
  } else if (interviewType === 'Technical') {
    userPrompt = `Ask the first technical question for a ${role} position at ${difficulty} level. Focus on ${role} technical skills and knowledge. DO NOT ask behavioral questions.`;
  } else {
    userPrompt = `Ask the first question for a ${role} position at ${difficulty} level. This is a mixed interview, so you can ask either technical or behavioral questions.`;
  }

  // Use Groq if available
  if (AI_PROVIDER === 'groq' && groqApiKey) {
    try {
      const result = await generateWithGroq(systemPrompt, userPrompt);
      console.log(`⚡ First question generated in ${Date.now() - startTime}ms (Groq)`);
      return result;
    } catch (error) {
      console.error('❌ Groq failed, falling back to mock:', error.message);
      return getMockQuestion(role, difficulty, interviewType, 1);
    }
  } else {
    // Fallback to mock questions
    return getMockQuestion(role, difficulty, interviewType, 1);
  }
};

/**
 * Generate follow-up question based on previous conversation
 */
export const generateFollowUpQuestion = async (role, difficulty, interviewType, conversationHistory, previousAnswer, questionNumber = null) => {
  const startTime = Date.now();
  const systemPrompt = getSystemPrompt(role, difficulty, interviewType);
  const contextPrompt = buildContextPrompt(conversationHistory, previousAnswer, role, difficulty, interviewType);

  // Use provided question number, or calculate from conversation history
  const currentQuestionNum = questionNumber || (conversationHistory.filter(m => m.role === 'assistant').length + 1);

  // Use Groq if available
  if (AI_PROVIDER === 'groq' && groqApiKey) {
    try {
      const result = await generateWithGroq(systemPrompt, contextPrompt);
      console.log(`⚡ Follow-up question generated in ${Date.now() - startTime}ms (Groq)`);
      return result;
    } catch (error) {
      console.error('❌ Groq failed, falling back to mock:', error.message);
      return getMockQuestion(role, difficulty, interviewType, currentQuestionNum);
    }
  } else {
    // Use mock questions - ensure different question each time
    return getMockQuestion(role, difficulty, interviewType, currentQuestionNum);
  }
};

/**
 * Evaluate the entire interview and generate comprehensive feedback
 */
export const evaluateInterview = async (role, difficulty, interviewType, conversationHistory) => {
  const systemPrompt = getEvaluationSystemPrompt(role, difficulty, interviewType);
  
  // Limit conversation history to last 10 messages for faster processing
  const recentHistory = conversationHistory.slice(-10);
  const conversationText = recentHistory
    .map(msg => `${msg.role === 'assistant' ? 'I' : 'C'}: ${msg.content.substring(0, 200)}`) // Limit each message to 200 chars
    .join('\n');

  const evaluationPrompt = `Evaluate this interview (${role}, ${difficulty}, ${interviewType}):

${conversationText}

Return JSON only:
{
  "overallScore": <0-100>,
  "strengths": [<array>],
  "weaknesses": [<array>],
  "missedTopics": [<array>],
  "suggestions": [<array>],
  "roleSpecificFeedback": "<text>",
  "detailedEvaluation": "<text>"
}

Score based on: technical accuracy, understanding depth, communication, problem-solving, role knowledge.`;

  // Use Groq if available
  if (AI_PROVIDER === 'groq' && groqApiKey) {
    try {
      return await evaluateWithGroq(systemPrompt, evaluationPrompt);
    } catch (error) {
      console.error('❌ Groq evaluation failed, using smart mock evaluation:', error.message);
      return getSmartMockEvaluation(role, difficulty, conversationHistory);
    }
  } else {
    // Fallback to smart mock evaluation
    return getSmartMockEvaluation(role, difficulty, conversationHistory);
  }
};

// ========== Groq API Functions ==========

async function generateWithGroq(systemPrompt, userPrompt) {
  if (!groqApiKey) {
    throw new Error('Groq API not configured');
  }

  const url = 'https://api.groq.com/openai/v1/chat/completions';

  const payload = {
    model: 'llama-3.1-8b-instant', // Fast and free model
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: userPrompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 150,
  };

  try {
    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${groqApiKey}`,
      },
    });

    const text = response.data?.choices?.[0]?.message?.content;

    if (!text) {
      throw new Error('Empty response from Groq');
    }

    return text.trim();
  } catch (error) {
    if (error.response) {
      console.error('Groq API Error:', error.response.status, error.response.data);
      throw new Error(`Groq API error: ${error.response.data?.error?.message || error.message}`);
    }
    throw error;
  }
}

async function evaluateWithGroq(systemPrompt, evaluationPrompt) {
  if (!groqApiKey) {
    throw new Error('Groq API not configured');
  }

  // Optimize prompt length - limit conversation history
  const optimizedPrompt = evaluationPrompt.length > 2000 
    ? evaluationPrompt.substring(0, 2000) + '...' 
    : evaluationPrompt;

  const url = 'https://api.groq.com/openai/v1/chat/completions';

  const payload = {
    model: 'llama-3.3-70b-versatile', // Updated to supported model for evaluation
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: optimizedPrompt,
      },
    ],
    temperature: 0.3,
    max_tokens: 1200,
  };

  try {
    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${groqApiKey}`,
      },
    });

    let jsonText = response.data?.choices?.[0]?.message?.content;

    if (!jsonText) {
      throw new Error('Empty response from Groq');
    }

    jsonText = jsonText.trim();

    // Try to parse JSON, handle potential markdown code blocks
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '').trim();
    }

    const evaluation = JSON.parse(jsonText);

    // Validate and ensure all required fields exist
    if (typeof evaluation.overallScore !== 'number' || evaluation.overallScore < 0 || evaluation.overallScore > 100) {
      evaluation.overallScore = Math.max(0, Math.min(100, evaluation.overallScore || 0));
    }
    if (!Array.isArray(evaluation.strengths)) {
      evaluation.strengths = [];
    }
    if (!Array.isArray(evaluation.weaknesses)) {
      evaluation.weaknesses = [];
    }
    if (!Array.isArray(evaluation.missedTopics)) {
      evaluation.missedTopics = [];
    }
    if (!Array.isArray(evaluation.suggestions)) {
      evaluation.suggestions = [];
    }
    if (!evaluation.roleSpecificFeedback) {
      evaluation.roleSpecificFeedback = 'No specific feedback provided.';
    }
    if (!evaluation.detailedEvaluation) {
      evaluation.detailedEvaluation = 'Evaluation completed.';
    }

    return evaluation;
  } catch (error) {
    if (error.response) {
      console.error('Groq API Error:', error.response.status, error.response.data);
      throw new Error(`Groq API error: ${error.response.data?.error?.message || error.message}`);
    }
    if (error instanceof SyntaxError) {
      console.error('Groq JSON Parse Error:', error.message);
      throw new Error('Invalid JSON response from Groq');
    }
    throw error;
  }
}


// ========== Mock Functions (Fallback) ==========

function getMockQuestion(role, difficulty, interviewType, questionNum) {
  const questions = {
    'Frontend': {
      'Beginner': {
        'Technical': [
          'What is React and why is it popular?',
          'Explain the difference between props and state in React.',
          'What is JSX and how does it work?',
          'How do you handle events in React?',
          'What are React hooks? Give examples.',
          'Explain the difference between functional and class components.',
          'What is the Virtual DOM and why is it important?',
          'How do you conditionally render components in React?',
          'What is the purpose of keys in React lists?',
          'How do you pass data from parent to child components?',
        ],
        'HR': [
          'Tell me about yourself and your experience with frontend development.',
          'Why are you interested in frontend development?',
          'Describe a challenging frontend project you worked on.',
          'How do you handle tight deadlines in frontend projects?',
          'What motivates you in your work?',
          'How do you stay updated with frontend technologies?',
          'Describe a time you had to learn a new frontend framework quickly.',
          'How do you collaborate with designers?',
          'What is your approach to code reviews?',
          'Tell me about a time you improved user experience.',
        ],
        'Mixed': [
          'What is React and why do you prefer it over other frameworks?',
          'Tell me about a React project you built and the challenges you faced.',
          'How do you handle state management in React applications?',
          'Describe a time you debugged a complex frontend issue.',
          'What is your approach to responsive design?',
          'How do you ensure code quality in frontend projects?',
          'What frontend technologies are you most excited about?',
          'How do you handle browser compatibility issues?',
          'Describe your experience with CSS frameworks.',
          'What is your approach to testing frontend code?',
        ],
      },
      'Intermediate': {
        'Technical': [
          'Explain React component lifecycle methods.',
          'How does React handle re-rendering and optimization?',
          'What is the Virtual DOM and how does diffing work?',
          'Explain state management patterns in React applications.',
          'How do you optimize React performance?',
          'What are Higher-Order Components (HOCs)?',
          'Explain React Context API and when to use it.',
          'How do you handle side effects in React?',
          'What is the difference between useMemo and useCallback?',
          'How do you implement error boundaries in React?',
        ],
        'HR': [
          'Describe your experience leading a frontend team.',
          'How do you mentor junior frontend developers?',
          'Tell me about a time you had to refactor a large frontend codebase.',
          'How do you handle conflicting requirements from stakeholders?',
          'What is your approach to frontend code reviews?',
          'Describe a challenging technical problem you solved.',
          'How do you balance performance with development speed?',
          'Tell me about a time you improved team productivity.',
          'How do you handle technical disagreements in your team?',
          'What is your approach to frontend architecture decisions?',
        ],
        'Mixed': [
          'How do you structure a large React application?',
          'Describe a performance optimization you implemented in React.',
          'How do you handle authentication in frontend applications?',
          'Tell me about a time you had to learn a new frontend framework quickly.',
          'What is your approach to testing React components?',
          'How do you handle API integration in React?',
          'Describe your experience with build tools and bundlers.',
          'How do you implement real-time features in frontend?',
          'What is your strategy for handling large component trees?',
          'How do you ensure accessibility in React applications?',
        ],
      },
      'Advanced': {
        'Technical': [
          'Explain React Fiber architecture and its benefits.',
          'How do you implement code splitting and lazy loading in React?',
          'Discuss React Server Components and their use cases.',
          'How do you handle complex state management at scale?',
          'Explain React concurrent features and Suspense.',
          'How do you implement custom hooks for reusable logic?',
          'Discuss performance optimization techniques for large React apps.',
          'How do you handle memory leaks in React applications?',
          'Explain React\'s reconciliation algorithm in detail.',
          'How do you implement advanced patterns like render props and compound components?',
        ],
        'HR': [
          'How do you architect frontend systems for scalability?',
          'Describe your experience with micro-frontends.',
          'How do you handle technical debt in large frontend codebases?',
          'What is your approach to frontend architecture decisions?',
          'How do you ensure accessibility in your applications?',
          'Describe a time you had to make a difficult technical decision.',
          'How do you stay ahead of frontend technology trends?',
          'Tell me about a time you led a major frontend migration.',
          'How do you handle performance optimization at scale?',
          'What is your approach to frontend security?',
        ],
        'Mixed': [
          'Design a scalable frontend architecture for a large application.',
          'How would you optimize a slow React application?',
          'Explain your approach to state management in complex React apps.',
          'Describe a challenging frontend problem you solved.',
          'How do you implement real-time features in React?',
          'What is your strategy for handling large datasets in the frontend?',
          'How do you ensure type safety in large React projects?',
          'Describe your experience with advanced React patterns.',
          'How do you handle internationalization in React apps?',
          'What is your approach to frontend monitoring and error tracking?',
        ],
      },
    },
    'Backend': {
      'Beginner': {
        'Technical': [
          'What is REST API and how does it work?',
          'Explain the difference between GET and POST requests.',
          'What is a database and why do we need it?',
          'Explain authentication vs authorization.',
          'What is middleware in Express.js?',
          'How do you handle errors in Node.js?',
          'What is the difference between SQL and NoSQL databases?',
          'How do you connect to a database in Node.js?',
          'What is an API endpoint?',
          'Explain the request-response cycle.',
        ],
        'HR': [
          'Tell me about yourself and your backend development experience.',
          'Why are you interested in backend development?',
          'Describe a backend project you worked on.',
          'How do you handle pressure in backend development?',
          'What motivates you in backend work?',
          'How do you stay updated with backend technologies?',
          'Describe a time you had to learn a new backend technology.',
          'How do you handle debugging backend issues?',
          'What is your approach to backend code organization?',
          'Tell me about a time you improved backend performance.',
        ],
        'Mixed': [
          'What is REST API and when would you use it?',
          'Tell me about a backend API you designed.',
          'How do you handle database connections?',
          'Describe a time you debugged a backend issue.',
          'What is your approach to API security?',
          'How do you ensure backend code quality?',
          'What backend technologies are you most excited about?',
          'How do you handle API versioning?',
          'Describe your experience with database design.',
          'What is your approach to error handling in APIs?',
        ],
      },
      'Intermediate': {
        'Technical': [
          'How do you handle database transactions?',
          'Explain API rate limiting and its implementation.',
          'What is caching and how do you implement it?',
          'How do you secure an API?',
          'Explain microservices architecture.',
          'How do you handle file uploads in Node.js?',
          'What is JWT and how do you implement it?',
          'How do you implement pagination in APIs?',
          'Explain database indexing and its importance.',
          'How do you handle background jobs and queues?',
        ],
        'HR': [
          'Describe your experience designing backend systems.',
          'How do you mentor junior backend developers?',
          'Tell me about a time you had to scale a backend system.',
          'How do you handle conflicting technical requirements?',
          'What is your approach to database design?',
          'Describe a challenging backend problem you solved.',
          'How do you balance performance with maintainability?',
          'Tell me about a time you improved system reliability.',
          'How do you handle technical debt in backend code?',
          'What is your approach to backend architecture decisions?',
        ],
        'Mixed': [
          'How do you structure a scalable backend application?',
          'Describe a performance optimization you implemented.',
          'How do you handle authentication and authorization?',
          'Tell me about a time you had to refactor backend code.',
          'What is your approach to API versioning?',
          'How do you handle background jobs and queues?',
          'Describe your experience with database optimization.',
          'How do you implement logging and monitoring?',
          'What is your strategy for handling high traffic?',
          'How do you ensure data consistency in distributed systems?',
        ],
      },
      'Advanced': {
        'Technical': [
          'How do you design a scalable distributed system?',
          'Explain database sharding and partitioning strategies.',
          'How do you handle distributed transactions?',
          'Discuss event-driven architecture patterns.',
          'How do you implement real-time features at scale?',
          'Explain CAP theorem and its implications.',
          'How do you handle service discovery in microservices?',
          'Discuss different database replication strategies.',
          'How do you implement circuit breakers and retries?',
          'Explain eventual consistency and its trade-offs.',
        ],
        'HR': [
          'How do you architect backend systems for millions of users?',
          'Describe your experience with distributed systems.',
          'How do you handle technical debt in backend codebases?',
          'What is your approach to system design decisions?',
          'How do you ensure data consistency in distributed systems?',
          'Describe a time you had to make a critical architecture decision.',
          'How do you stay current with backend technology trends?',
          'Tell me about a time you led a major system migration.',
          'How do you handle system reliability and fault tolerance?',
          'What is your approach to backend security at scale?',
        ],
        'Mixed': [
          'Design a scalable backend architecture for a high-traffic application.',
          'How would you optimize a slow database query?',
          'Explain your approach to handling high concurrency.',
          'Describe a challenging distributed systems problem you solved.',
          'How do you implement event sourcing and CQRS?',
          'What is your strategy for handling large-scale data processing?',
          'How do you ensure system reliability and fault tolerance?',
          'Describe your experience with message queues and brokers.',
          'How do you handle data consistency across microservices?',
          'What is your approach to monitoring and observability?',
        ],
      },
    },
    'MERN': {
      'Beginner': {
        'Technical': [
          'What is the MERN stack and its components?',
          'Explain how React connects to the Express backend.',
          'What is MongoDB and why use it?',
          'How do you structure a MERN application?',
          'What is Express.js and its role in MERN?',
          'How do you handle API calls from React to Express?',
          'What is the role of Node.js in the MERN stack?',
          'How do you create RESTful APIs in Express?',
          'Explain how data flows in a MERN application.',
          'What is Mongoose and how do you use it?',
        ],
        'HR': [
          'Tell me about yourself and your MERN stack experience.',
          'Why are you interested in full-stack development?',
          'Describe a MERN project you built.',
          'How do you handle full-stack development challenges?',
          'What motivates you in full-stack work?',
          'How do you stay updated with MERN technologies?',
          'Describe a time you learned a new MERN technology.',
          'How do you handle debugging full-stack applications?',
          'What is your approach to full-stack code organization?',
          'Tell me about a time you improved a MERN application.',
        ],
        'Mixed': [
          'What is the MERN stack and why did you choose it?',
          'Tell me about a full-stack application you built with MERN.',
          'How do you handle data flow from frontend to backend?',
          'Describe a time you debugged a full-stack issue.',
          'What is your approach to full-stack architecture?',
          'How do you ensure consistency between frontend and backend?',
          'What MERN technologies are you most excited about?',
          'How do you handle authentication in MERN applications?',
          'Describe your experience with MongoDB.',
          'What is your approach to full-stack testing?',
        ],
      },
      'Intermediate': {
        'Technical': [
          'How do you handle authentication in a MERN application?',
          'Explain data flow in a MERN application.',
          'How do you structure MongoDB schemas?',
          'What is JWT and how do you use it in MERN?',
          'How do you handle file uploads in MERN?',
          'Explain state management in MERN applications.',
          'How do you handle API errors in MERN?',
          'How do you implement pagination in MERN?',
          'Explain MongoDB aggregation pipelines.',
          'How do you handle real-time features in MERN?',
        ],
        'HR': [
          'Describe your experience building full-stack applications.',
          'How do you mentor junior MERN developers?',
          'Tell me about a time you had to refactor a MERN application.',
          'How do you handle full-stack debugging?',
          'What is your approach to full-stack testing?',
          'Describe a challenging MERN problem you solved.',
          'How do you balance frontend and backend development?',
          'Tell me about a time you improved MERN application performance.',
          'How do you handle technical debt in MERN projects?',
          'What is your approach to full-stack architecture decisions?',
        ],
        'Mixed': [
          'How do you structure a scalable MERN application?',
          'Describe a performance optimization you implemented in MERN.',
          'How do you handle real-time features in MERN?',
          'Tell me about a time you integrated a third-party API.',
          'What is your approach to database design in MERN?',
          'How do you handle authentication and authorization?',
          'Describe your experience with MERN deployment.',
          'How do you implement caching in MERN applications?',
          'What is your strategy for handling large datasets?',
          'How do you ensure security in MERN applications?',
        ],
      },
      'Advanced': {
        'Technical': [
          'How do you optimize MERN stack performance?',
          'Explain server-side rendering with MERN.',
          'How do you implement real-time features in MERN?',
          'Discuss MERN stack security best practices.',
          'How do you scale a MERN application?',
          'Explain advanced MongoDB aggregation pipelines.',
          'How do you handle microservices with MERN?',
          'Discuss advanced state management patterns in MERN.',
          'How do you implement advanced caching strategies?',
          'Explain database optimization techniques for MongoDB.',
        ],
        'HR': [
          'How do you architect large-scale MERN applications?',
          'Describe your experience with MERN at scale.',
          'How do you handle technical debt in MERN projects?',
          'What is your approach to full-stack architecture decisions?',
          'How do you ensure security in MERN applications?',
          'Describe a time you made a critical MERN architecture decision.',
          'How do you stay ahead of MERN technology trends?',
          'Tell me about a time you led a major MERN migration.',
          'How do you handle performance optimization at scale?',
          'What is your approach to full-stack monitoring?',
        ],
        'Mixed': [
          'Design a scalable MERN architecture for a large application.',
          'How would you optimize a slow MERN application?',
          'Explain your approach to handling high traffic in MERN.',
          'Describe a challenging full-stack problem you solved.',
          'How do you implement advanced features in MERN?',
          'What is your strategy for handling large datasets in MERN?',
          'How do you ensure type safety across the MERN stack?',
          'Describe your experience with advanced MERN patterns.',
          'How do you handle internationalization in MERN apps?',
          'What is your approach to full-stack monitoring and error tracking?',
        ],
      },
    },
    'Full Stack': {
      'Beginner': {
        'Technical': [
          'What is full-stack development?',
          'Explain the difference between frontend and backend.',
          'What technologies are used in full-stack development?',
          'How do frontend and backend communicate?',
          'What is an API and why is it important?',
          'Explain the request-response cycle.',
          'What is the role of a database in full-stack applications?',
          'How do you structure a full-stack application?',
          'What is the difference between client-side and server-side rendering?',
          'How do you handle errors in full-stack applications?',
        ],
        'HR': [
          'Tell me about yourself and your full-stack experience.',
          'Why are you interested in full-stack development?',
          'Describe a full-stack project you worked on.',
          'How do you handle full-stack development challenges?',
          'What motivates you in full-stack work?',
          'How do you stay updated with full-stack technologies?',
          'Describe a time you learned a new full-stack technology.',
          'How do you handle debugging full-stack issues?',
          'What is your approach to full-stack code organization?',
          'Tell me about a time you improved a full-stack application.',
        ],
        'Mixed': [
          'What is full-stack development and why do you like it?',
          'Tell me about a full-stack application you built.',
          'How do you handle the full development lifecycle?',
          'Describe a time you debugged a full-stack issue.',
          'What is your approach to full-stack architecture?',
          'How do you ensure quality in full-stack projects?',
          'What full-stack technologies are you most excited about?',
          'How do you handle API design in full-stack apps?',
          'Describe your experience with database design.',
          'What is your approach to full-stack testing?',
        ],
      },
      'Intermediate': {
        'Technical': [
          'How do you design a full-stack application architecture?',
          'Explain authentication flow in full-stack applications.',
          'How do you handle state management across frontend and backend?',
          'What is your approach to API design?',
          'How do you handle database design in full-stack apps?',
          'Explain deployment strategies for full-stack applications.',
          'How do you ensure security in full-stack applications?',
          'How do you handle real-time features in full-stack apps?',
          'Explain caching strategies in full-stack applications.',
          'How do you implement error handling across the stack?',
        ],
        'HR': [
          'Describe your experience leading full-stack projects.',
          'How do you mentor junior full-stack developers?',
          'Tell me about a time you had to refactor a full-stack application.',
          'How do you handle full-stack debugging?',
          'What is your approach to full-stack testing?',
          'Describe a challenging full-stack problem you solved.',
          'How do you balance frontend and backend priorities?',
          'Tell me about a time you improved full-stack performance.',
          'How do you handle technical debt in full-stack projects?',
          'What is your approach to full-stack architecture decisions?',
        ],
        'Mixed': [
          'How do you structure a scalable full-stack application?',
          'Describe a performance optimization you implemented.',
          'How do you handle real-time features in full-stack apps?',
          'Tell me about a time you integrated multiple services.',
          'What is your approach to database optimization?',
          'How do you handle authentication and authorization?',
          'Describe your experience with full-stack deployment.',
          'How do you implement logging and monitoring?',
          'What is your strategy for handling high traffic?',
          'How do you ensure data consistency?',
        ],
      },
      'Advanced': {
        'Technical': [
          'How do you design a scalable full-stack architecture?',
          'Explain microservices architecture in full-stack context.',
          'How do you handle distributed systems in full-stack apps?',
          'Discuss advanced security patterns in full-stack development.',
          'How do you scale full-stack applications?',
          'Explain event-driven architecture in full-stack systems.',
          'How do you handle high concurrency in full-stack applications?',
          'Discuss advanced caching strategies.',
          'How do you implement advanced authentication patterns?',
          'Explain database optimization at scale.',
        ],
        'HR': [
          'How do you architect enterprise-level full-stack systems?',
          'Describe your experience with full-stack at scale.',
          'How do you handle technical debt in large full-stack projects?',
          'What is your approach to full-stack architecture decisions?',
          'How do you ensure system reliability in full-stack apps?',
          'Describe a time you made a critical full-stack architecture decision.',
          'How do you stay ahead of full-stack technology trends?',
          'Tell me about a time you led a major full-stack migration.',
          'How do you handle performance optimization at scale?',
          'What is your approach to full-stack security?',
        ],
        'Mixed': [
          'Design a scalable full-stack architecture for millions of users.',
          'How would you optimize a slow full-stack application?',
          'Explain your approach to handling high traffic.',
          'Describe a challenging distributed systems problem you solved.',
          'How do you implement advanced features in full-stack apps?',
          'What is your strategy for handling large-scale data processing?',
          'How do you ensure type safety and consistency across the stack?',
          'Describe your experience with advanced full-stack patterns.',
          'How do you handle internationalization in full-stack apps?',
          'What is your approach to full-stack monitoring and observability?',
        ],
      },
    },
  };

  // Get questions for the specific role, difficulty, and interview type
  const roleQuestions = questions[role] || questions['MERN'];
  const difficultyQuestions = roleQuestions[difficulty] || roleQuestions['Intermediate'];
  const typeQuestions = difficultyQuestions[interviewType] || difficultyQuestions['Technical'];
  
  // Ensure we have questions
  if (!typeQuestions || typeQuestions.length === 0) {
    return `Tell me about your experience with ${role} development.`;
  }
  
  // Get question by index (cycle through available questions)
  const index = (questionNum - 1) % typeQuestions.length;
  const question = typeQuestions[index];
  
  console.log(`📝 Generating mock question ${questionNum} for ${role}/${difficulty}/${interviewType}: ${question.substring(0, 50)}...`);
  
  return question;
}

function getMockEvaluation(role, difficulty) {
  return {
    overallScore: 75,
    strengths: [
      'Good understanding of basic concepts',
      'Clear communication',
      'Demonstrated practical knowledge',
    ],
    weaknesses: [
      'Could go deeper into advanced topics',
      'Some areas need more practice',
    ],
    missedTopics: [
      'Advanced optimization techniques',
      'System design patterns',
    ],
    suggestions: [
      'Practice more advanced scenarios',
      'Study system architecture',
      'Work on problem-solving skills',
    ],
    roleSpecificFeedback: `You showed good understanding of ${role} fundamentals. Continue practicing and exploring advanced topics.`,
    detailedEvaluation: `The candidate demonstrated a solid understanding of ${role} development at the ${difficulty} level. They showed good communication skills and practical knowledge. With continued practice, they can improve in advanced areas.`,
  };
}

function getSmartMockEvaluation(role, difficulty, conversationHistory) {
  // Analyze conversation to determine score
  const answers = conversationHistory.filter(msg => msg.role === 'user');
  const questions = conversationHistory.filter(msg => msg.role === 'assistant');
  
  // Simple heuristic: if answers are very short or contain "I don't know", lower score
  let score = 50; // Start with average
  let wrongAnswers = 0;
  let correctIndicators = 0;
  
  answers.forEach(answer => {
    const answerText = answer.content.toLowerCase();
    if (answerText.length < 20 || answerText.includes("don't know") || answerText.includes("not sure") || answerText.includes("wrong")) {
      wrongAnswers++;
      score -= 10;
    } else if (answerText.length > 100 && !answerText.includes("don't know")) {
      correctIndicators++;
      score += 5;
    }
  });
  
  // Ensure score is between 0-100
  score = Math.max(0, Math.min(100, score));
  
  // If user mentioned they gave wrong answers, reflect that
  if (wrongAnswers > correctIndicators) {
    score = Math.min(score, 40);
  }
  
  // If 5 wrong answers, score should be very low
  if (wrongAnswers >= 5) {
    score = Math.min(score, 30);
  }
  
  return {
    overallScore: Math.round(score),
    strengths: correctIndicators > 0 ? [
      'Attempted to answer questions',
      'Showed engagement',
      correctIndicators > 2 ? 'Some technical knowledge demonstrated' : 'Basic understanding',
    ] : ['Willingness to participate'],
    weaknesses: wrongAnswers > 0 ? [
      'Several answers were incomplete or incorrect',
      'Need to strengthen fundamental concepts',
      'Should practice more before interviews',
      wrongAnswers >= 5 ? 'Multiple incorrect answers indicate significant knowledge gaps' : '',
    ].filter(Boolean) : [
      'Could provide more detailed answers',
      'Need deeper technical understanding',
    ],
    missedTopics: [
      `${role} specific advanced topics`,
      'Practical implementation details',
      'Best practices and patterns',
    ],
    suggestions: [
      'Study core concepts more thoroughly',
      'Practice explaining technical concepts',
      'Work on problem-solving skills',
      `Focus on ${role} specific technologies`,
      wrongAnswers >= 5 ? 'Consider taking a fundamentals course before advanced interviews' : '',
    ].filter(Boolean),
    roleSpecificFeedback: `Based on your answers, you need to strengthen your ${role} knowledge. ${wrongAnswers >= 5 ? 'Multiple incorrect answers suggest you should focus on fundamentals first. ' : ''}Focus on core concepts and practice explaining them clearly.`,
    detailedEvaluation: `The candidate answered ${answers.length} questions. ${wrongAnswers > 0 ? `${wrongAnswers} answer(s) were incomplete or showed gaps in understanding. ` : ''}The overall performance indicates a ${score < 30 ? 'need for significant preparation and study' : score < 50 ? 'need for more preparation' : score < 70 ? 'basic understanding that needs improvement' : 'solid foundation'}. Continue practicing ${role} concepts to improve.`,
  };
}

// ========== Helper Functions ==========

const getSystemPrompt = (role, difficulty, interviewType) => {
  // Role-specific focus areas
  const roleMap = {
    Frontend: 'React, JavaScript, TypeScript, CSS, frontend frameworks, state management, UI/UX',
    Backend: 'Node.js, Express, APIs, databases (SQL/NoSQL), server architecture, authentication, security',
    MERN: 'MongoDB, Express.js, React, Node.js - full-stack MERN stack concepts and integration',
    'Full Stack': 'Both frontend (React, HTML, CSS, JS) and backend (Node.js, databases, APIs) technologies and system design',
  };

  const difficultyMap = {
    Beginner: 'Fundamental, basic concepts. Be encouraging and clear.',
    Intermediate: 'Practical, scenario-based questions requiring deeper understanding.',
    Advanced: 'Complex, system-level questions with edge cases and optimization.',
  };

  // CRITICAL: Explicit interview type instructions with examples
  let typeInstructions = '';
  if (interviewType === 'HR' || interviewType === 'Behavioral') {
    typeInstructions = `🚨 CRITICAL: This is a BEHAVIORAL/HR interview ONLY. 
- ABSOLUTELY FORBIDDEN: Do NOT ask ANY technical questions about ${roleMap[role] || 'programming'}
- FORBIDDEN: No questions about code, React, Node.js, databases, frameworks, APIs, or any technical implementation
- FORBIDDEN: No questions about programming languages, tools, or technical skills
- ONLY ALLOWED: Behavioral questions about:
  * Past work experiences and projects (describe the experience, not the technical details)
  * Teamwork and collaboration situations
  * How you handle conflicts, deadlines, or pressure
  * Leadership examples and decision-making
  * Work style, motivation, and career goals
  * Problem-solving approaches (focus on the process, not technical solutions)
  * Communication and interpersonal skills
- Question format: "Tell me about a time when...", "Describe a situation where...", "How do you handle...", "What is your approach to...", "Give an example of..."
- Example GOOD questions: "Tell me about a challenging project you worked on and how you handled it", "Describe a time you had to work with a difficult team member", "How do you prioritize tasks when facing tight deadlines?"
- Example BAD questions (DO NOT ASK): "What is React?", "How do you optimize database queries?", "Explain Node.js event loop"`;
  } else if (interviewType === 'Technical') {
    typeInstructions = `🚨 CRITICAL: This is a TECHNICAL interview ONLY.
- ABSOLUTELY FORBIDDEN: Do NOT ask behavioral, HR, or soft skills questions
- FORBIDDEN: No questions about past experiences, teamwork, or work style (unless asking about technical decision-making)
- ONLY ALLOWED: Technical questions about ${roleMap[role] || 'programming'}:
  * Coding concepts, syntax, and best practices
  * Architecture and system design
  * Problem-solving and algorithms
  * Implementation details and technical solutions
  * Tools, frameworks, and technologies specific to ${role}
  * Performance optimization and debugging
- Question format: "Explain...", "How would you...", "What is...", "Describe the difference between...", "Write code to..."
- Example GOOD questions: "Explain how ${role === 'Frontend' ? 'React' : role === 'Backend' ? 'Node.js' : 'MERN'} works", "How would you optimize ${role === 'Frontend' ? 'a React component' : role === 'Backend' ? 'an API endpoint' : 'a full-stack application'}", "What is the difference between..."
- Example BAD questions (DO NOT ASK): "Tell me about yourself", "How do you handle stress?", "Describe your work style"`;
  } else if (interviewType === 'Mixed') {
    typeInstructions = `This is a MIXED interview.
- You can ask BOTH technical and behavioral questions
- Alternate or mix: 
  * Technical: ${roleMap[role] || 'programming'} concepts, coding, architecture
  * Behavioral: past experiences, teamwork, problem-solving, work style
- Balance both types throughout the interview`;
  }

  return `You are a senior ${role} interviewer conducting a ${difficulty} level ${interviewType} interview.

${typeInstructions}

Role Focus: ${roleMap[role] || 'General development'}
Difficulty Level: ${difficultyMap[difficulty] || 'Moderate'}

Rules:
- Ask ONE concise question (1-2 sentences max)
- Stay STRICTLY within the interview type (${interviewType})
- Ask contextual follow-ups based on answers, but maintain the interview type
- Don't reveal question count or provide hints
- Be professional, neutral, concise`;
};

const getEvaluationSystemPrompt = (role, difficulty, interviewType) => {
  return `You are an expert ${role} interviewer evaluating a ${difficulty} level ${interviewType} interview.

Evaluate STRICTLY and FAIRLY:
- Technical accuracy is CRITICAL - wrong answers should result in lower scores
- If candidate gave 5 wrong answers, score should be LOW (20-40 range)
- If candidate gave mostly correct answers, score should be HIGH (70-90 range)
- Depth of understanding matters more than surface knowledge
- Communication skills are important but secondary to technical accuracy
- Problem-solving approach shows real skill
- Role-specific knowledge is essential

Scoring Guidelines:
- 0-30: Poor performance, many incorrect answers, lack of understanding
- 31-50: Below average, some correct answers but many mistakes
- 51-70: Average performance, mix of correct and incorrect answers
- 71-85: Good performance, mostly correct answers with minor gaps
- 86-100: Excellent performance, correct answers with deep understanding

Be HONEST and STRICT. If answers are wrong, reflect that in the score. Do not give high scores for wrong answers.

Provide honest, constructive feedback that helps the candidate improve.`;
};

const buildContextPrompt = (conversationHistory, previousAnswer, role, difficulty, interviewType) => {
  // Use only the last question for context to reduce token count
  const lastQuestion = conversationHistory[conversationHistory.length - 2]?.content || '';
  const lastQuestionShort = lastQuestion.length > 100 ? lastQuestion.substring(0, 100) + '...' : lastQuestion;
  const answerShort = previousAnswer.length > 150 ? previousAnswer.substring(0, 150) + '...' : previousAnswer;
  
  // Count how many questions have been asked
  const questionCount = conversationHistory.filter(m => m.role === 'assistant').length;
  
  // Reinforce interview type in follow-up prompts
  let typeReminder = '';
  if (interviewType === 'HR' || interviewType === 'Behavioral') {
    typeReminder = `🚨 CRITICAL: This is a BEHAVIORAL/HR interview ONLY.
- ABSOLUTELY FORBIDDEN: Do NOT ask ANY technical questions about ${role}
- FORBIDDEN: No code, frameworks, or technical implementation questions
- ONLY ask behavioral questions about experiences, teamwork, problem-solving, work style`;
  } else if (interviewType === 'Technical') {
    typeReminder = `🚨 CRITICAL: This is a TECHNICAL interview ONLY.
- ABSOLUTELY FORBIDDEN: Do NOT ask behavioral or HR questions
- ONLY ask technical questions about ${role} technologies and concepts`;
  } else {
    typeReminder = 'Remember: This is a MIXED interview. You can ask either technical or behavioral questions.';
  }
  
  return `Previous Q: "${lastQuestionShort}"
Previous A: "${answerShort}"

${typeReminder}

Role: ${role}, Difficulty: ${difficulty}, Question #${questionCount + 1}

You can either:
1. Ask a follow-up question related to the previous answer (if it makes sense)
2. Ask a NEW question on a different topic (to cover more areas)

IMPORTANT:
- Stay STRICTLY within the ${interviewType} interview type
- Maintain focus on ${role} role at ${difficulty} level
- Ask a concise question (1-2 sentences)
- If the previous answer was brief or the user seems to want to move on, ask a NEW question instead of following up`;
};
