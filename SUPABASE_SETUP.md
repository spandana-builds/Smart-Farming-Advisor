# Supabase Setup Guide - Smart Farming Advisor

This guide explains how to deploy the Supabase Edge Function and database schema for the Smart Farming Advisor application.

## Prerequisites

- Supabase account (free tier works)
- Supabase CLI installed: `npm install -g supabase`
- Git repository with this code

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create an account
2. Click "New Project"
3. Choose organization, project name, database password, region
4. Wait for project to initialize (5-10 minutes)

## Step 2: Get Your Supabase Credentials

1. Go to **Project Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://your-project.supabase.co`
   - **Anon Key**: Public key for frontend (starts with `eyJh...`)
   - **Service Role Key**: Private key for functions (keep secret!)

3. Create `.env.local` in your project root:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 3: Install Supabase CLI & Link Project

```bash
# Install Supabase CLI globally
npm install -g supabase

# Or use npx (no installation needed)
npx supabase --version

# Link your Supabase project
supabase link --project-ref your_project_id

# You'll be asked for your database password (from Step 1)
```

**Get Project ID from:** Supabase Dashboard → Settings → General → Project ID

## Step 4: Deploy Database Schema

```bash
# Deploy the database migrations
supabase db push

# This will:
# ✅ Create farming_sessions table
# ✅ Create chat_messages table
# ✅ Set up indexes for performance
# ✅ Enable Row Level Security (RLS)
```

**Verify in Dashboard:**
1. Go to **SQL Editor** in Supabase Dashboard
2. You should see `farming_sessions` and `chat_messages` tables

## Step 5: Deploy Edge Function

```bash
# Deploy the farming-advisor Edge Function
supabase functions deploy farming-advisor

# The function will be available at:
# https://your-project.supabase.co/functions/v1/farming-advisor
```

**Verify in Dashboard:**
1. Go to **Functions** in Supabase Dashboard
2. You should see `farming-advisor` listed
3. Click on it to see logs

## Step 6: Test the Endpoints

### Test Recommendations Endpoint

```bash
curl -X POST https://your-project.supabase.co/functions/v1/farming-advisor/recommendations \
  -H "Authorization: Bearer your_anon_key" \
  -H "Content-Type: application/json" \
  -d '{
    "cropId": "rice",
    "cropName": "Rice",
    "location": "Punjab",
    "temperature": 28,
    "humidity": 65,
    "rainfall": 50,
    "windSpeed": 12,
    "soilType": "loamy",
    "season": "summer",
    "sessionId": "test-session-123"
  }'
```

**Expected Response:**
```json
{
  "recommendations": {
    "irrigation": "5-7 cm standing water | Daily or alternate day irrigation",
    "fertilizer": "NPK 50:40:40 kg/ha | ...",
    "pestControl": "..."
  },
  "sessionRecord": {
    "id": "uuid-here"
  }
}
```

### Test Chat Endpoint

```bash
curl -X POST https://your-project.supabase.co/functions/v1/farming-advisor/chat \
  -H "Authorization: Bearer your_anon_key" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "How much water should I give to rice?",
    "cropId": "rice",
    "temperature": 28,
    "humidity": 65,
    "farmingSessionId": "session-uuid",
    "sessionId": "test-session-123",
    "context": "Rice crop in summer season"
  }'
```

**Expected Response:**
```json
{
  "answer": "For 5-7 cm standing water, the key is maintaining consistent soil moisture..."
}
```

### Test History Endpoint

```bash
curl https://your-project.supabase.co/functions/v1/farming-advisor/history?session_id=test-session-123 \
  -H "Authorization: Bearer your_anon_key"
```

**Expected Response:**
```json
{
  "history": [
    {
      "id": "uuid",
      "crop_name": "Rice",
      "temperature": 28,
      "humidity": 65,
      "created_at": "2025-05-01T10:30:00Z",
      ...
    }
  ]
}
```

## Step 7: Run Frontend

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Visit http://localhost:5173
# Test: Dashboard → Crop Advisor → Select Crop → Set Conditions → Get Recommendations
```

## Troubleshooting

### Issue: "Edge function not found" (404)

**Solution:**
1. Verify function is deployed: `supabase functions list`
2. Check function logs: `supabase functions list` and click the function
3. Redeploy: `supabase functions deploy farming-advisor`

### Issue: "CORS error"

**Solution:**
- CORS headers are already set in the function
- Ensure your `.env.local` has the correct Supabase URL
- Verify Anon Key has API access (should by default)

### Issue: "Authorization denied"

**Solution:**
1. Go to **Supabase Dashboard** → **Project Settings** → **API**
2. Verify Anon Key is correct in `.env.local`
3. Check that RLS policies allow public access (already configured)

### Issue: Tables not created after `supabase db push`

**Solution:**
1. Check Supabase logs: Dashboard → **Functions** → Select function → **Logs**
2. Run migrations manually in SQL Editor:
   - Go to **SQL Editor**
   - Paste contents of `supabase/migrations/20250501_create_farming_tables.sql`
   - Click **Run**

### Issue: Function returns error in logs

**Check logs:**
```bash
supabase functions logs farming-advisor
```

**Common errors:**
- `SUPABASE_URL not found`: Function environment variables not set
  - Go to Dashboard → Functions → farming-advisor → Settings
  - Add environment variables manually if needed

## Environment Variables for Edge Function

The Edge Function needs these environment variables set in Supabase:

Go to **Supabase Dashboard** → **Functions** → **farming-advisor** → **Settings**:

| Variable | Value |
|----------|-------|
| `SUPABASE_URL` | Your project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service role key (from Settings → API) |

These are usually auto-configured, but verify if function returns database errors.

## API Documentation

### POST `/farming-advisor/recommendations`

Generate farming recommendations based on crop and weather.

**Request:**
```json
{
  "cropId": "rice|tomato|maize|wheat|potato",
  "cropName": "Human readable crop name",
  "location": "Optional location name",
  "temperature": 28,
  "humidity": 65,
  "rainfall": 50,
  "windSpeed": 12,
  "soilType": "loamy|sandy|clay|alluvial",
  "season": "summer|winter|rainy",
  "sessionId": "unique-session-id"
}
```

**Response:**
```json
{
  "recommendations": {
    "irrigation": "Irrigation advice",
    "fertilizer": "Fertilizer recommendations",
    "pestControl": "Pest control measures",
    "warning": null
  },
  "sessionRecord": {
    "id": "uuid-of-saved-session"
  }
}
```

### POST `/farming-advisor/chat`

Get AI chat responses for farming questions.

**Request:**
```json
{
  "question": "User question",
  "cropId": "crop-id",
  "temperature": 28,
  "humidity": 65,
  "farmingSessionId": "session-uuid",
  "sessionId": "unique-session-id",
  "context": "Additional context"
}
```

**Response:**
```json
{
  "answer": "AI-generated farming advice"
}
```

### GET `/farming-advisor/history?session_id=xxx`

Retrieve previous farming sessions for a user.

**Query Parameters:**
- `session_id` (required): User session ID

**Response:**
```json
{
  "history": [
    {
      "id": "uuid",
      "crop_id": "rice",
      "crop_name": "Rice",
      "temperature": 28,
      "humidity": 65,
      "recommendations": {...},
      "created_at": "2025-05-01T10:30:00Z"
    }
  ]
}
```

## Next Steps

1. ✅ Deploy database and Edge Function
2. ✅ Add environment variables to `.env.local`
3. ✅ Test endpoints with curl
4. ✅ Run frontend with `npm run dev`
5. 📱 Deploy frontend to Vercel
6. 🚀 Deploy main branch to production

## Support

- Supabase Docs: https://supabase.com/docs
- Edge Functions: https://supabase.com/docs/guides/functions
- React + Supabase: https://supabase.com/docs/guides/getting-started/quickstarts/reactjs

## Security Notes

⚠️ **Important:**
- Never commit `.env.local` to Git (add to `.gitignore`)
- Service Role Key is private - keep it secret!
- RLS policies are configured to allow public access for demo purposes
- For production, implement proper user authentication and scoped RLS policies

