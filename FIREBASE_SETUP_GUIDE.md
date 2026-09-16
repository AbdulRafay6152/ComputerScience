# 🔥 Firebase Setup Guide - Complete Sync Across All Devices

This guide will help you set up Firebase so all visitors see the same tests, results, and student data in real-time.

---

## 📋 Step-by-Step Setup

### Step 1: Create Firebase Account

1. Go to: **https://console.firebase.google.com/**
2. Click **"Get started"** or **"Add project"**
3. Sign in with your Google account (abdulrafayqureshi@gmail.com)

---

### Step 2: Create a New Project

1. Click **"Add project"** (or "Create a project")
2. **Project name**: `cs-test-hub` (or any name you like)
3. You can disable Google Analytics (optional) - click **Continue**
4. Click **"Create project"**
5. Wait for it to finish (30 seconds)
6. Click **"Continue"**

---

### Step 3: Create a Web App

1. On the project overview page, click the **web icon** (`</>`)
2. **App nickname**: `CS Test Hub`
3. ❌ Don't check "Also set up Firebase Hosting"
4. Click **"Register app"**
5. **IMPORTANT**: You'll see a config object like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "cs-test-hub-xxxxx.firebaseapp.com",
  projectId: "cs-test-hub-xxxxx",
  storageBucket: "cs-test-hub-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

6. **COPY THIS ENTIRE CONFIG** - you'll need it next
7. Click **"Continue to console"**

---

### Step 4: Enable Firestore Database

1. In the left sidebar, click **"Build"** → **"Firestore Database"**
2. Click **"Create database"**
3. Select **"Start in test mode"** (we'll add security later)
4. **Location**: Choose `nam5 (United States)` or closest to you
5. Click **"Enable"**
6. Wait for it to finish

---

### Step 5: Enable Authentication

1. In the left sidebar, click **"Build"** → **"Authentication"**
2. Click **"Get started"**
3. Under "Sign-in method", click **"Email/Password"**
4. Toggle **"Enable"** to ON
5. Click **"Save"**

---

### Step 6: Share Your Config With Me

Now you need to share your Firebase config with me so I can update the code.

**Option A: Edit the file directly**

1. Open the file: `src/lib/firebase.ts`
2. Replace the placeholder values with your actual config:

```typescript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXX",  // Your actual API key
  authDomain: "cs-test-hub-xxxxx.firebaseapp.com",  // Your actual domain
  projectId: "cs-test-hub-xxxxx",  // Your actual project ID
  storageBucket: "cs-test-hub-xxxxx.appspot.com",  // Your actual bucket
  messagingSenderId: "123456789",  // Your actual sender ID
  appId: "1:123456789:web:abcdef123456"  // Your actual app ID
};
```

3. Save the file

**Option B: Share the config here**

Just paste your config object here and I'll update the code for you.

---

## ✅ What Happens Next

Once Firebase is set up:

1. **All visitors see the same tests** - Tests are stored in cloud database
2. **Real-time sync** - When you add/delete a test, everyone sees it instantly
3. **Student results sync** - Admin can see all students' results from any device
4. **No more localStorage** - Everything is in the cloud database

---

## 🎯 After You Share Your Config

I will:
1. Update the Firebase config file
2. Create a new Firebase data layer
3. Replace localStorage with Firebase
4. Update all components to use Firebase
5. Test everything
6. Deploy the updated version

---

## 📊 Firebase Free Tier Limits

Firebase's free tier (Spark Plan) includes:
- **Firestore**: 1 GB storage, 50K reads/day, 20K writes/day
- **Authentication**: Unlimited users
- **More than enough** for your testing platform

---

## 🚀 Ready?

**Go to https://console.firebase.google.com/ and follow the steps above.**

Once you have your config, either:
- Edit `src/lib/firebase.ts` directly, OR
- Share the config here and I'll update it

Then I'll complete the Firebase integration! 🔥
