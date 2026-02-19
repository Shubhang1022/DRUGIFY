# DRUGIFY Setup Guide

## Multi-Page Website with Authentication

This guide will help you set up the complete DRUGIFY application with authentication and multi-page functionality.

## Prerequisites

- Node.js (v18 or higher)
- Python 3.8+
- Supabase account (free tier available)

## Step 1: Supabase Setup

### 1.1 Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in project details:
   - Name: drugify
   - Database Password: (choose a strong password)
   - Region: (choose closest to you)
5. Wait for project to be created (2-3 minutes)

### 1.2 Get Your Credentials

1. In your Supabase dashboard, go to Settings > API
2. Copy the following:
   - Project URL (looks like: `https://xxxxx.supabase.co`)
   - Anon/Public Key (starts with `eyJ...`)

### 1.3 Configure Google OAuth (Optional but Recommended)

1. In Supabase dashboard, go to Authentication > Providers
2. Find "Google" and click to configure
3. Follow the instructions to set up Google OAuth:
   - Create a Google Cloud project
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs from Supabase
4. Paste Client ID and Client Secret into Supabase
5. Enable the provider

## Step 2: Frontend Configuration

### 2.1 Create .env File

Create a `.env` file in the root directory:

```bash
# Copy from .env.example
cp .env.example .env
```

### 2.2 Update .env with Your Credentials

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key-here

# API Configuration
VITE_API_URL=http://localhost:8000
```

Replace:
- `your-project.supabase.co` with your actual Supabase URL
- `your-anon-key-here` with your actual Anon/Public key

### 2.3 Install Dependencies

```bash
npm install
```

## Step 3: Backend Configuration

### 3.1 Navigate to Backend

```bash
cd backend
```

### 3.2 Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3.3 Install Dependencies

```bash
pip install -r requirements.txt
```

### 3.4 Configure Backend .env

The backend `.env` should already exist. Verify it contains:

```env
DATABASE_URL=sqlite:///./pharmaguard.db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## Step 4: Database Setup (Optional - for Analysis History)

### 4.1 Create Analysis History Table in Supabase

1. Go to Supabase dashboard > SQL Editor
2. Run this SQL:

```sql
-- Create analysis_history table
CREATE TABLE analysis_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  patient_id TEXT,
  drugs_analyzed TEXT[],
  risk_count JSONB,
  report_data JSONB
);

-- Enable Row Level Security
ALTER TABLE analysis_history ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only see their own analyses
CREATE POLICY "Users can view own analyses"
  ON analysis_history
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy: Users can insert their own analyses
CREATE POLICY "Users can insert own analyses"
  ON analysis_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

## Step 5: Run the Application

### 5.1 Start Backend (Terminal 1)

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

Backend will run on: http://localhost:8000

### 5.2 Start Frontend (Terminal 2)

```bash
# From root directory
npm run dev
```

Frontend will run on: http://localhost:8081

## Step 6: Test the Application

### 6.1 Test Authentication

1. Open http://localhost:8081
2. Click "Sign up" in the header
3. Try signing up with:
   - Google OAuth (if configured)
   - Email/Password

### 6.2 Test Pages

Visit these pages to ensure they work:
- Home: http://localhost:8081/
- About: http://localhost:8081/about
- Analyzer: http://localhost:8081/analyzer
- Dashboard: http://localhost:8081/dashboard (requires login)
- Profile: http://localhost:8081/profile (requires login)

### 6.3 Test Analysis Flow

1. Log in to your account
2. Go to "Detection Analyzer" from header or home page
3. Upload a VCF file
4. Select drugs
5. Click "Analyze"
6. View results

## Application Structure

```
drugify/
├── src/
│   ├── pages/
│   │   ├── Home.tsx           # Landing page
│   │   ├── Login.tsx          # Login page
│   │   ├── Signup.tsx         # Signup page
│   │   ├── Dashboard.tsx      # User dashboard (protected)
│   │   ├── Profile.tsx        # User profile (protected)
│   │   ├── Analyzer.tsx       # VCF analysis tool
│   │   └── About.tsx          # About page
│   ├── components/
│   │   └── layout/
│   │       ├── Header.tsx     # Navigation header
│   │       ├── Footer.tsx     # Footer
│   │       └── Layout.tsx     # Layout wrapper
│   ├── contexts/
│   │   └── AuthContext.tsx    # Authentication context
│   └── lib/
│       └── supabase.ts        # Supabase client
└── backend/
    └── app/
        ├── main.py            # FastAPI app
        ├── routers/           # API routes
        └── services/          # Business logic
```

## Features

### Authentication
- ✅ Google OAuth login
- ✅ Email/Password signup and login
- ✅ Protected routes
- ✅ User session management
- ✅ Logout functionality

### Pages
- ✅ Home - Landing page with features and CTA
- ✅ About - Company information and mission
- ✅ Analyzer - VCF file analysis tool
- ✅ Dashboard - User analysis history (protected)
- ✅ Profile - User account settings (protected)
- ✅ Login/Signup - Authentication pages

### UI Components
- ✅ Responsive header with navigation
- ✅ Mobile-friendly sidebar menu
- ✅ Footer with links
- ✅ User dropdown menu
- ✅ Protected route handling

## Troubleshooting

### Issue: "Invalid API key" error

**Solution:** Double-check your Supabase credentials in `.env` file

### Issue: Google OAuth not working

**Solution:** 
1. Verify Google OAuth is enabled in Supabase
2. Check redirect URIs are correctly configured
3. Ensure Google Cloud project has OAuth consent screen configured

### Issue: Dashboard shows "No analyses yet"

**Solution:** This is normal if you haven't run any analyses yet. The analysis history feature requires:
1. Supabase table created (see Step 4.1)
2. Backend integration to save analyses (future enhancement)

### Issue: CORS errors

**Solution:** Backend CORS is already configured for localhost:8081. If using different port, update `backend/app/main.py`

## Next Steps

1. **Add Analysis History Saving**: Integrate Supabase in Analyzer page to save results
2. **Email Verification**: Enable email verification in Supabase settings
3. **Password Reset**: Implement forgot password functionality
4. **Profile Updates**: Add ability to update user profile
5. **Deploy**: Follow deployment guides for production

## Support

For issues or questions:
- Check backend logs: Terminal running uvicorn
- Check frontend console: Browser DevTools
- Check Supabase logs: Supabase Dashboard > Logs

## Security Notes

- Never commit `.env` files to version control
- Use strong passwords for Supabase database
- Enable Row Level Security (RLS) on all tables
- Keep dependencies updated
- Use HTTPS in production
