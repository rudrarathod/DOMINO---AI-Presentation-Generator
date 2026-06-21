# DOMINO - AI Presentation Generator

DOMINO is a state-of-the-art, AI-powered presentation design platform. It allows users to transform text prompts into highly structured, visually stunning, and interactive slide decks within seconds. Users can dynamically refine their decks with a drag-resizable AI Assistant panel, toggle between high-performance language models, customize layout aspect ratios, and seamlessly sync credits and API keys across domains.

---

## 🚀 Key Features

*   **Prompt-to-Presentation Generation**: Instantly drafts presentation outlines and constructs complete slide decks in parallel from single text prompts.
*   **Interactive AI Assistant Panel**:
    *   **Scope Toggling**: Target modifications to either the **Active Slide** or the **Whole Deck**.
    *   **Multi-Model Selector**: Switch between different models (Llama 3.3, Llama 4 Scout, GPT-OSS 120B, etc.) with real-time speed (T/s) and cost metrics.
    *   **Drag-Resizable Workspace**: Drag the sidebar edge to dynamically resize the AI Assistant panel between `280px` and `600px` for optimal workspace layouts.
*   **Credit & Fallback System**:
    *   Generates slides on a 50-credit free tier tracked locally and synced to Firebase Firestore.
    *   Bypasses credit deductions and unlocks **Unlimited Mode** when users input their own custom Groq API Key (`gsk_...`).
*   **Aspect Ratio Adaptability**: Fully supports standard **16:9 Widescreen**, **4:3 Classic**, and **1:1 Square** layouts with responsive slide content auto-scaling.
*   **Keyboard Navigation Shortcuts**: Easily traverse slides in the editor using `ArrowRight` / `ArrowDown` (Next) and `ArrowLeft` / `ArrowUp` (Previous).
*   **Premium Fullscreen Preview**: A center-aligned, letterboxed slideshow player with page indicators, slide-strip hover thumbnails, and keyboard support.
*   **Google OAuth & Firestore Syncing**: Google Identity Services integration to persist user credits, custom API keys, and settings across devices and domains.

---

## 🛠 Tech Stack

*   **Core**: React 18, TypeScript, React Router v7
*   **Build Tool**: Vite 6
*   **Styling**: Tailwind CSS 4, CSS variables design system
*   **Animations**: Motion (Framer Motion)
*   **Database & Sync**: Firebase (Firestore)
*   **Authentication**: Google Identity Services (GSI OAuth 2.0)
*   **Iconography**: Lucide React

---

## 📦 Getting Started

### 1. Installation

Install project dependencies using `npm` or `pnpm`:

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory by copying the template:

```bash
cp .env.example .env
```

Open `.env` and fill in your service credentials:

```ini
# Groq AI Service API Key (Required for system fallback generations)
AI_API=gsk_your_groq_api_key_here

# Google OAuth 2.0 Client ID (Required for Google Sign-In)
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com

# Firebase Configuration (Required for database syncing)
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain_here.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket_here.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_firebase_app_id_here
```

### 3. Development Server

Start the local Vite development server (defaults to port `5000` based on configs):

```bash
npm run dev
```

### 4. Build for Production

Compile and minify the client-side bundle for production:

```bash
npm run build
```

The output assets will be built into the `/dist` directory.

---

## ☁️ Deployment

### Single Page Application (SPA) Routing on Vercel
The repository includes a [vercel.json](file:///Users/dineshpawar/code/AI%20Presentation%20Generator%20UI/vercel.json) file at the root. It contains a catch-all rewrite to route all paths back to `/index.html`. This ensures that refreshing the page or visiting routes like `/builder` directly in production does not trigger a 404 error:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Firebase Firestore Security Rules
Ensure your Firestore database has security rules enabled to allow users to read and write to their own documents under the `users` path. Example rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{email} {
      allow read, write: if true; // Or tighten rules using request.auth != null
    }
  }
}
```