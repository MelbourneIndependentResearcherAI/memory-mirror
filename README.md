# Memory Mirror — Multi-App Repository

This repository contains three React applications, each deployable to Azure App Service via GitHub Actions.

| App | Directory | Description |
|-----|-----------|-------------|
| Memory Mirror | `memory-mirror/` | Photo and memory timeline app |
| Carer Hire AI | `carer-hire-ai/` | AI-powered carer hiring platform |
| Little Ones AI | `little-ones-ai/` | AI-powered early learning & childcare |

---

## 🚀 Deploying to Azure App Service

### Prerequisites

- An [Azure account](https://azure.microsoft.com/free/)
- Three Azure App Service instances (one per app) with **Node 20 LTS** runtime (Linux)
- GitHub repository with the code pushed to the `main` branch

---

### Step 1: Create Azure App Services

For **each** of the three apps, create an Azure App Service:

1. Go to the [Azure Portal](https://portal.azure.com)
2. Click **Create a resource → Web App**
3. Fill in the details:
   - **Subscription**: Your subscription
   - **Resource Group**: Create or select one (e.g. `memory-mirror-rg`)
   - **Name**: A unique app name (e.g. `memory-mirror-app`, `carer-hire-ai-app`, `little-ones-ai-app`)
   - **Publish**: Code
   - **Runtime stack**: Node 20 LTS
   - **Operating System**: Linux
   - **Region**: Choose your preferred region
4. Click **Review + create → Create**

> Repeat for all three apps.

---

### Step 2: Download Publish Profiles

For **each** App Service:

1. Go to your App Service in the Azure Portal
2. Click **Download publish profile** (in the Overview section)
3. Save the downloaded `.PublishSettings` XML file

---

### Step 3: Add GitHub Secrets

In your GitHub repository:

1. Go to **Settings → Secrets and variables → Actions → New repository secret**
2. Add the following secrets:

| Secret Name | Value |
|-------------|-------|
| `MEMORY_MIRROR_APP_NAME` | Your Memory Mirror App Service name (e.g. `memory-mirror-app`) |
| `MEMORY_MIRROR_PUBLISH_PROFILE` | Contents of the Memory Mirror `.PublishSettings` file |
| `CARER_HIRE_AI_APP_NAME` | Your Carer Hire AI App Service name |
| `CARER_HIRE_AI_PUBLISH_PROFILE` | Contents of the Carer Hire AI `.PublishSettings` file |
| `LITTLE_ONES_AI_APP_NAME` | Your Little Ones AI App Service name |
| `LITTLE_ONES_AI_PUBLISH_PROFILE` | Contents of the Little Ones AI `.PublishSettings` file |

---

### Step 4: Configure Azure App Service for Static Files

Since these are Vite-built static apps, configure each App Service to serve the static files correctly:

1. In your App Service → **Configuration → General settings**
2. Set **Startup Command** to:
   ```
   pm2 serve /home/site/wwwroot --no-daemon --spa
   ```
   > This uses pm2 to serve the SPA with HTML5 history API support. You can also use a custom `web.config` (see below).

Alternatively, add a `web.config` file to the `public/` folder of each app (it will be included in the `dist/` output):

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="React SPA" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

---

### Step 5: Trigger Deployment

Deployments are triggered automatically when you push changes to the `main` branch:

- Changes to `memory-mirror/**` → deploys **Memory Mirror**
- Changes to `carer-hire-ai/**` → deploys **Carer Hire AI**
- Changes to `little-ones-ai/**` → deploys **Little Ones AI**

You can also trigger a deployment manually from the **Actions** tab → select the workflow → **Run workflow**.

---

## 🏗️ Local Development

Each app is a standard Vite + React project:

```bash
# Memory Mirror
cd memory-mirror
npm install
npm run dev      # http://localhost:5173

# Carer Hire AI
cd carer-hire-ai
npm install
npm run dev      # http://localhost:5174

# Little Ones AI
cd little-ones-ai
npm install
npm run dev      # http://localhost:5175
```

To build for production:

```bash
npm run build    # outputs to dist/
npm run preview  # preview the production build locally
```

---

## 📁 Repository Structure

```
Memory-mirror-/
├── memory-mirror/           # Memory Mirror app (from memory-mirror-complete.zip)
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom hooks
│   │   ├── styles/          # CSS styles
│   │   └── utils/           # Helper utilities
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── carer-hire-ai/           # Carer Hire AI app
│   ├── src/
│   │   ├── components/
│   │   │   └── CarerHireAI.jsx   # Main component
│   │   └── styles/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── little-ones-ai/          # Little Ones AI app
│   ├── src/
│   │   ├── components/
│   │   │   └── LittleOnesAI.jsx  # Main component
│   │   └── styles/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── .github/
│   └── workflows/
│       ├── deploy-memory-mirror.yml      # CI/CD for Memory Mirror
│       ├── deploy-carer-hire-ai.yml      # CI/CD for Carer Hire AI
│       └── deploy-little-ones-ai.yml    # CI/CD for Little Ones AI
│
└── README.md                # This file
```

---

## 🔧 GitHub Actions Workflows

Each workflow:
1. Triggers on push to `main` (path-filtered) or manual dispatch
2. Checks out the repo
3. Installs Node.js 20 and project dependencies (`npm ci`)
4. Builds the app with Vite (`npm run build`)
5. Deploys the `dist/` folder to Azure App Service using the publish profile

---

## 📝 Notes

- All three apps are **client-side only** — no backend is required
- Memory Mirror stores data in browser **Local Storage**
- Carer Hire AI and Little Ones AI use sample/demo data; extend with a real API as needed
- Make sure your Azure App Service plan supports the traffic you expect; **Free (F1)** tier works for testing
