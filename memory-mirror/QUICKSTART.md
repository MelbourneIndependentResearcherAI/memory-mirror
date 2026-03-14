# 🚀 Quick Start Guide

Get Memory Mirror running in 4 steps!

## Step 1: Install Dependencies

```bash
npm install
```

This will install React, Vite, and all required packages.

## Step 2: Configure Your API Key

Copy the example environment file and add your Anthropic API key:

```bash
cp .env.example .env.local
```

Then edit `.env.local` and replace `sk-ant-...` with your real key from [console.anthropic.com](https://console.anthropic.com).

> **Note:** The key is bundled into the browser JS. Rotate it regularly and restrict it by allowed origins in the Anthropic dashboard.

## Step 3: Start Development Server

```bash
npm run dev
```

Your app will start at `http://localhost:5173`

## Step 4: Start Using!

1. Click **"Add Memory"** button
2. Fill in title, date, description
3. Upload a photo (optional)
4. Add tags
5. Click **"Save Memory"**

That's it! 🎉

## Common Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Features Overview

- ✨ Add photos with descriptions
- 🏷️ Tag your memories
- 🔍 Search and filter
- 📅 Timeline view
- 🎯 Grid view
- 💾 Auto-saves to browser

## Need Help?

Check the full README.md for detailed documentation!
