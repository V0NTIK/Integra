# Integra - Setup Instructions

## Overview
Integra is a Canvas assignment analysis tool that helps students understand the true weight of their assignments and make strategic decisions about time allocation.

## Project Structure
```
integra/
├── frontend/          # React frontend (Vite)
└── database/          # Supabase SQL schema
```

---

## Step 1: Create Project Directory

```bash
mkdir integra
cd integra
```

---

## Step 2: Set Up Frontend

### Create React App with Vite

```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install
```

### Install Dependencies

```bash
npm install @supabase/supabase-js react-router-dom
```

### Create Folder Structure

```bash
mkdir -p src/components
```

### Copy Files

1. Copy `package.json` to `frontend/package.json`
2. Copy `vite.config.js` to `frontend/vite.config.js`
3. Copy `.env.template` to `frontend/.env` and fill in your values
4. Copy all files to their respective locations:
   - `src/main.jsx`
   - `src/App.jsx`
   - `src/App.css`
   - `src/index.css`
   - `src/supabaseClient.js`
   - `src/components/Login.jsx`
   - `src/components/Login.css`
   - `src/components/TokenSetup.jsx`
   - `src/components/TokenSetup.css`
   - `src/components/Dashboard.jsx`
   - `src/components/Dashboard.css`

---

## Step 3: Set Up Supabase

### Create Supabase Project

1. Go to https://supabase.com
2. Click "New Project"
3. Name: "Integra"
4. Database Password: (save this!)
5. Region: Choose closest to you
6. Wait for initialization (~2 minutes)

### Get API Credentials

1. Go to Project Settings → API
2. Copy `Project URL`
3. Copy `anon` `public` key
4. Add to `frontend/.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_CANVAS_BASE_URL=https://canvas.oneschoolglobal.com
```

### Run Database Schema

1. Go to Supabase Dashboard → SQL Editor
2. Open `database-schema.sql`
3. Copy entire file
4. Paste into SQL Editor
5. Click "Run"

This creates all tables with proper Row Level Security policies.

---

## Step 4: Run the App

### Start Development Server

```bash
cd frontend
npm run dev
```

The app will open at `http://localhost:3000`

---

## Step 5: Test the Flow

### Test Authentication
1. Enter your email
2. Check inbox for magic link
3. Click link to log in

### Test Canvas Token Setup
1. Go to Canvas Settings
2. Create new access token
3. Paste into Integra
4. Should validate and save

### View Dashboard
After token setup, you'll see the dashboard placeholder.

---

## Next Steps

The foundation is complete! Next phases:

1. **Canvas Data Fetching** - Fetch courses, assignments, grades
2. **Prediction Algorithm** - Calculate true weight
3. **Impact Analysis** - Show grade scenarios
4. **Dashboard UI** - Build assignment analysis interface

---

## File Mapping

```
integra/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx              ← integra-Login.jsx
│   │   │   ├── Login.css              ← integra-Login.css
│   │   │   ├── TokenSetup.jsx         ← integra-TokenSetup.jsx
│   │   │   ├── TokenSetup.css         ← integra-TokenSetup.css
│   │   │   ├── Dashboard.jsx          ← integra-Dashboard.jsx
│   │   │   └── Dashboard.css          ← integra-Dashboard.css
│   │   ├── App.jsx                    ← integra-App.jsx
│   │   ├── App.css                    ← integra-App.css
│   │   ├── main.jsx                   ← integra-main.jsx
│   │   ├── index.css                  ← integra-index.css
│   │   └── supabaseClient.js          ← integra-supabaseClient.js
│   ├── .env                           ← integra-frontend-env-template.txt
│   ├── package.json                   ← integra-frontend-package.json
│   └── vite.config.js                 ← integra-vite-config.js
└── database/
    └── schema.sql                     ← integra-database-schema.sql
```

---

## Troubleshooting

### "Supabase URL not found"
- Check `.env` file exists in `frontend/` folder
- Restart dev server after adding .env

### "Invalid Canvas token"
- Make sure you copied the full token
- Check token hasn't expired
- Verify you're using canvas.oneschoolglobal.com

### Magic link not arriving
- Check spam folder
- Make sure email is correct
- Wait a few minutes

---

## Security Notes

- Canvas tokens are stored encrypted in Supabase
- Row Level Security prevents data leaks
- Magic links expire after use
- Never commit `.env` to git

---

Ready to build the next phase!
