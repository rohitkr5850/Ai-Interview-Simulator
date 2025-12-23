# Deployment Guide

This guide covers deploying the AI Interview Simulator to production.

## Prerequisites

- MongoDB Atlas account (or MongoDB instance)
- OpenAI API account with API key
- Google OAuth credentials (for Google login)
- Vercel/Netlify account (for frontend)
- Render/Railway account (for backend)

## Backend Deployment (Render/Railway)

### Step 1: Prepare Backend

1. Ensure all environment variables are set in your deployment platform
2. Update `MONGODB_URI` to your MongoDB Atlas connection string
3. Set `FRONTEND_URL` to your production frontend URL

### Step 2: Deploy to Render

1. Create a new **Web Service** on Render
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Environment**: Node
4. Add environment variables:
   ```
   PORT=10000
   NODE_ENV=production
   MONGODB_URI=your-mongodb-atlas-uri
   JWT_SECRET=your-strong-secret-key
   OPENAI_API_KEY=your-openai-key
   FRONTEND_URL=https://your-frontend.vercel.app
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_CALLBACK_URL=https://your-backend.onrender.com/api/auth/google/callback
   ```
5. Deploy

### Step 3: Deploy to Railway

1. Create new project on Railway
2. Connect GitHub repository
3. Add service → Deploy from GitHub repo
4. Set root directory to `server`
5. Add environment variables (same as above)
6. Deploy

## Frontend Deployment (Vercel)

### Step 1: Prepare Frontend

1. Update `client/.env` or Vercel environment variables:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```

### Step 2: Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to client directory: `cd client`
3. Run: `vercel`
4. Follow prompts
5. Add environment variable in Vercel dashboard:
   - `VITE_API_URL` = your backend URL
6. Redeploy

### Alternative: Deploy via GitHub

1. Push code to GitHub
2. Import project in Vercel
3. Set root directory to `client`
4. Add environment variables
5. Deploy

## MongoDB Atlas Setup

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create database user
4. Whitelist IP addresses (0.0.0.0/0 for all, or specific IPs)
5. Get connection string
6. Update `MONGODB_URI` in backend environment variables

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI:
   - Development: `http://localhost:5000/api/auth/google/callback`
   - Production: `https://your-backend.onrender.com/api/auth/google/callback`
6. Copy Client ID and Client Secret
7. Add to backend environment variables

## Environment Variables Summary

### Backend (.env)
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
JWT_SECRET=your-very-strong-secret-key-min-32-chars
OPENAI_API_KEY=sk-...
FRONTEND_URL=https://your-frontend.vercel.app
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://your-backend.onrender.com/api/auth/google/callback
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend.onrender.com/api
```

## Post-Deployment Checklist

- [ ] Backend is accessible and health check works
- [ ] Frontend can connect to backend API
- [ ] User registration works
- [ ] User login works
- [ ] Google OAuth works
- [ ] Interview creation works
- [ ] AI questions are generated
- [ ] Answer submission works
- [ ] Feedback is generated
- [ ] Analytics load correctly
- [ ] MongoDB connection is stable
- [ ] CORS is configured correctly

## Troubleshooting

### CORS Errors
- Ensure `FRONTEND_URL` in backend matches your frontend URL exactly
- Check CORS configuration in `server/index.js`

### MongoDB Connection Issues
- Verify connection string format
- Check IP whitelist in MongoDB Atlas
- Verify database user credentials

### OpenAI API Errors
- Verify API key is correct
- Check API quota/limits
- Ensure sufficient credits

### Google OAuth Issues
- Verify redirect URI matches exactly
- Check Client ID and Secret
- Ensure Google+ API is enabled

## Monitoring

### Recommended Tools
- **Backend**: Render/Railway built-in logs
- **Frontend**: Vercel Analytics
- **Database**: MongoDB Atlas monitoring
- **Errors**: Consider Sentry for error tracking

## Security Best Practices

1. **Never commit `.env` files**
2. **Use strong JWT secrets** (32+ characters, random)
3. **Enable HTTPS** (automatic with Vercel/Render)
4. **Set secure CORS origins**
5. **Use MongoDB Atlas IP whitelist**
6. **Rotate API keys regularly**
7. **Monitor API usage** (OpenAI, MongoDB)

## Scaling Considerations

- **Database**: MongoDB Atlas auto-scaling
- **Backend**: Render/Railway auto-scaling
- **Frontend**: Vercel CDN handles scaling
- **Rate Limiting**: Consider adding rate limiting middleware
- **Caching**: Consider Redis for session caching

## Cost Estimation

### Free Tier (Development)
- **MongoDB Atlas**: 512MB free
- **Render**: Free tier available (with limitations)
- **Vercel**: Free tier available
- **OpenAI**: Pay-as-you-go

### Production (Estimated)
- **MongoDB Atlas**: $9-25/month
- **Render**: $7-25/month
- **Vercel**: Free (Pro $20/month)
- **OpenAI**: $0.01-0.03 per interview (varies)

---

**Note**: Always test thoroughly in a staging environment before deploying to production.

