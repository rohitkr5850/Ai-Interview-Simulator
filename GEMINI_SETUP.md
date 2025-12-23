# Google Gemini API Setup Guide (Free Tier)

## 🎉 Great News!

Your application now supports **Google Gemini API** which has a **generous free tier**! This is perfect for development and testing.

## 📋 How to Get Your Free Gemini API Key

### Step 1: Get Your API Key

1. **Visit Google AI Studio**: https://aistudio.google.com/app/apikey

2. **Sign in** with your Google account

3. **Click "Create API Key"**

4. **Copy your API key** (it will look like: `AIzaSy...`)

### Step 2: Configure Your Application

1. **Open** `server/.env` file

2. **Add/Update** these lines:
   ```env
   GEMINI_API_KEY=your-actual-gemini-api-key-here
   AI_PROVIDER=gemini
   ```

3. **Replace** `your-actual-gemini-api-key-here` with your actual API key

### Step 3: Restart Your Server

```bash
cd server
npm run dev
```

You should see:
```
✅ Google Gemini API configured successfully
🤖 Using AI Provider: GEMINI
```

## 🆓 Free Tier Limits

Google Gemini Free Tier includes:
- **15 requests per minute (RPM)**
- **1,500 requests per day (RPD)**
- **32,000 tokens per minute**
- **1 million tokens per day**

This is **more than enough** for development and testing!

## 🔄 Switching Between AI Providers

You can easily switch between providers by changing `AI_PROVIDER` in `.env`:

### Option 1: Google Gemini (Recommended - Free)
```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your-gemini-key
```

### Option 2: OpenAI (Paid)
```env
AI_PROVIDER=openai
OPENAI_API_KEY=your-openai-key
```

### Option 3: Mock Mode (No API needed - for testing)
```env
AI_PROVIDER=mock
```

## 🧪 Testing Without API Key

If you want to test the application without any API key, set:
```env
AI_PROVIDER=mock
```

This will use pre-defined mock questions and evaluations. Perfect for UI testing!

## 📊 Comparison

| Feature | Gemini (Free) | OpenAI (Paid) | Mock (Free) |
|---------|---------------|---------------|-------------|
| **Cost** | Free | Paid | Free |
| **Quality** | Excellent | Excellent | Basic |
| **Rate Limits** | 15 RPM | Varies | None |
| **Best For** | Development | Production | Testing |

## ✅ Verification

After setting up, try starting an interview. You should see:
- Questions generated successfully
- No quota errors
- Smooth interview flow

## 🆘 Troubleshooting

### "Gemini API key not configured"
- Make sure `GEMINI_API_KEY` is set in `.env`
- Restart your server after updating `.env`

### "Failed to generate question"
- Check your API key is correct
- Verify you haven't exceeded free tier limits
- Check server logs for detailed error messages

### Still having issues?
- Try `AI_PROVIDER=mock` to test without API
- Check your internet connection
- Verify the API key at https://aistudio.google.com/app/apikey

## 🎯 Next Steps

1. Get your Gemini API key from https://aistudio.google.com/app/apikey
2. Add it to `server/.env`
3. Set `AI_PROVIDER=gemini`
4. Restart your server
5. Start interviewing! 🚀

---

**Note**: The free tier is perfect for development. For production with high traffic, consider upgrading to a paid plan or using OpenAI.

