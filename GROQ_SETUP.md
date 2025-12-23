# Groq API Setup Guide (Free & Fast!)

## 🚀 Why Groq?

- **100% FREE** - No credit card required
- **ULTRA FAST** - Specialized hardware for instant responses
- **RELIABLE** - No more API failures!
- **GENEROUS LIMITS** - Perfect for development and production

## 📋 How to Get Your Free Groq API Key

### Step 1: Get Your API Key

1. **Visit Groq Console**: https://console.groq.com/

2. **Sign up** with your email (or use Google/GitHub)

3. **Go to API Keys**: https://console.groq.com/keys

4. **Click "Create API Key"**

5. **Copy your API key** (it will look like: `gsk_...`)

### Step 2: Configure Your Application

1. **Open** `server/.env` file

2. **Add/Update** these lines:
   ```env
   GROQ_API_KEY=your-actual-groq-api-key-here
   AI_PROVIDER=groq
   ```

3. **Replace** `your-actual-groq-api-key-here` with your actual API key

### Step 3: Restart Your Server

```bash
cd server
npm run dev
```

You should see:
```
✅ Groq API key configured successfully
🤖 Using AI Provider: GROQ
```

## 🆓 Free Tier Limits

Groq Free Tier includes:
- **30 requests per minute (RPM)**
- **Unlimited requests per day**
- **Fast response times** (usually < 1 second!)

This is **more than enough** for development and testing!

## 🔄 Switching Between AI Providers

You can easily switch between providers by changing `AI_PROVIDER` in `.env`:

### Option 1: Groq (Recommended - Free & Fast) ⭐
```env
AI_PROVIDER=groq
GROQ_API_KEY=your-groq-key
```

### Option 2: Google Gemini (Free)
```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your-gemini-key
```

### Option 3: OpenAI (Paid)
```env
AI_PROVIDER=openai
OPENAI_API_KEY=your-openai-key
```

### Option 4: Mock Mode (No API needed - for testing)
```env
AI_PROVIDER=mock
```

## 📊 Comparison

| Feature | Groq (Free) | Gemini (Free) | OpenAI (Paid) | Mock (Free) |
|---------|-------------|---------------|---------------|-------------|
| **Cost** | Free | Free | Paid | Free |
| **Speed** | ⚡ Ultra Fast | Fast | Fast | Instant |
| **Reliability** | ✅ Excellent | ⚠️ Variable | ✅ Excellent | ✅ Perfect |
| **Rate Limits** | 30 RPM | 15 RPM | Varies | None |
| **Setup** | Easy | Easy | Easy | None |

## 🎯 Models Used

- **Questions**: `llama-3.1-8b-instant` (Fast, optimized for quick responses)
- **Evaluation**: `llama-3.1-70b-versatile` (Better quality for detailed analysis)

## ✅ That's It!

Your interview simulator will now use Groq - fast, free, and reliable!


