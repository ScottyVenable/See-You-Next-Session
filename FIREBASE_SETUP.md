# Firebase Hosting Setup Guide

## Step 1: Install Firebase CLI
```bash
npm install -g firebase-tools
```

## Step 2: Login to Firebase
```bash
firebase login
```
This opens a browser to authenticate your Firebase account.

## Step 3: Initialize Firebase Project
```bash
firebase init hosting
```
When prompted:
- Select your Firebase project
- **Public directory**: `dist` (this is where vite builds to)
- **Configure as single-page app**: `Yes` (this enables routing)
- **Overwrite**: `No` (don't overwrite existing files)

## Step 4: Update .firebaserc
Edit `.firebaserc` and replace `YOUR_PROJECT_ID` with your actual Firebase project ID:
```json
{
  "projects": {
    "default": "your-actual-project-id"
  }
}
```

## Step 5: Deploy Manually (Test)
```bash
npm run deploy
```

## Step 6: Setup GitHub Actions for Auto-Deploy

### 6a. Generate Firebase Service Account Key
1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. This downloads a JSON file

### 6b. Add Secret to GitHub
1. Go to GitHub repo → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `FIREBASE_SERVICE_ACCOUNT_KEY`
4. Paste the entire JSON content from the service account file

### 6c. Add Project ID Secret
1. Same location, create another secret
2. Name: `FIREBASE_PROJECT_ID`
3. Value: Your Firebase project ID

## Step 7: Deploy
Now whenever you push to `develop` or `stable` branches, it automatically deploys!

Or deploy manually anytime with:
```bash
npm run deploy
```

## Verification
After deployment, your site will be live at:
```
https://see-you-next-session-site.web.app
```

## Troubleshooting

### Build Fails
- Make sure both `npm run build` and `cd portal && npm run build` work locally first
- Check that `dist` folder is created with the game files

### Routing Issues
- firebase.json includes a rewrite rule to handle SPA routing
- All requests go to /index.html so React Router can handle them

### Storage Concerns
Firebase free tier includes 5GB. Your game is likely:
- Game assets: ~2-5MB per build
- Portal assets: ~1-2MB per build
- Total with history: Well under limits

Monitor usage: Firebase Console → Storage
