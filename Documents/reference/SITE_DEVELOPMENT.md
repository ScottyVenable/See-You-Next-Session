# Site Development Plan

**Project:** See You Next Session - Developer Portal  
**Version:** 1.0  
**Last Updated:** December 15, 2025  
**Authors:** Scott & Kiki

---

## 1. Overview

The **Dev Portal** is a password-protected website hosted on GitHub Pages that serves as the central hub for project collaboration between Scott and Kiki. It provides:

- **Browser playtesting** of the latest game build
- **Release downloads** for Windows/macOS/Linux
- **Document links** to Google Docs/Drive
- **Asset management** with Google Drive integration
- **Team discussions** for quick communication
- **Repository access** with embedded GitHub info

---

## 2. Architecture

### 2.1 Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | React 18 + Vite |
| Hosting | GitHub Pages |
| Routing | React Router (HashRouter) |
| Auth | Client-side SHA-256 hash verification |
| CI/CD | GitHub Actions |

### 2.2 Directory Structure

```
portal/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx           # Entry point
    ├── App.jsx            # Routes & auth wrapper
    ├── components/
    │   └── Layout.jsx     # Sidebar navigation
    ├── context/
    │   └── AuthContext.jsx # Authentication state
    ├── pages/
    │   ├── Login.jsx      # Password gate
    │   ├── Dashboard.jsx  # Home/overview
    │   ├── PlayGame.jsx   # Embedded game
    │   ├── Releases.jsx   # Download builds
    │   ├── Documents.jsx  # Google Docs links
    │   ├── Assets.jsx     # Google Drive links
    │   ├── Repository.jsx # GitHub info
    │   ├── Discussions.jsx# Team chat
    │   └── Settings.jsx   # Password management
    └── styles/
        └── main.css       # Global styles
```

---

## 3. Authentication System

### 3.1 How It Works

Since GitHub Pages is static (no backend), authentication uses **client-side password hashing**:

1. Password is hashed with SHA-256 in the browser
2. Hash is compared against `VITE_DEV_PASSWORD_HASH` (injected at build time)
3. If matched, a session is stored in localStorage (7-day expiry)

**[WARNING] Security Disclaimer:**

This authentication model is **not a true access control system**. It provides a basic password gate to deter casual visitors, but it cannot reliably protect sensitive content because:

- All authentication logic runs in the browser where users can inspect, modify, or bypass it
- The password hash is embedded in the deployed JavaScript bundle and can be extracted
- Users can manipulate their localStorage to forge valid sessions
- There is no server-side validation or enforcement

**This should be treated as a convenience feature, not a security boundary.** If you need genuine access restriction:
- Move the portal behind a backend with server-side authentication, or
- Use GitHub's built-in authentication features, or
- Treat all portal content as effectively public and avoid storing sensitive documents, private asset links, or confidential information

### 3.2 Setting Up Credentials

**Initial Setup:**

1. Choose a team password (min 8 characters)
2. Generate SHA-256 hash:
   - Use the Settings page hash generator, OR
   - Run: `echo -n "yourpassword" | sha256sum`
3. Add the hash to GitHub:
   - Go to Repository → Settings → Secrets → Actions
   - Create secret: `DEV_PASSWORD_HASH`
   - Paste the hash value

**Changing Password:**

1. Go to Settings page in portal
2. Enter current password
3. Enter new password
4. Copy the generated hash
5. Update `DEV_PASSWORD_HASH` in GitHub Secrets
6. Wait for next deployment

### 3.3 Security Notes

**[WARNING] This is NOT production-grade security.** It's designed to:
- Keep the portal private from casual visitors
- Provide basic access control for a 2-person team

The password hash is visible in the deployed JavaScript. For true security, use a backend authentication service.

---

## 4. Page Specifications

### 4.1 Dashboard
**Purpose:** Overview of project status

**Features:**
- GitHub repo stats (stars, forks, issues)
- Latest 3 releases
- Open issues list
- Quick navigation links
- Team member display

### 4.2 Play Game
**Purpose:** Test latest build in browser

**Features:**
- Embedded iframe of game build
- Refresh button
- Open in new tab link
- Controls documentation
- Bug report link to GitHub Issues

**Setup Required:**
- Deploy game build to `/game/` path on Pages
- Or update the `gameUrl` in PlayGame.jsx

### 4.3 Releases
**Purpose:** Download native builds

**Features:**
- List all GitHub releases
- Download links for each platform asset
- Release notes display
- "Latest" badge on newest release

**How to Create Releases:**
1. Run `npm run tauri:build` locally
2. Go to GitHub → Releases → Draft new release
3. Upload builds from `src-tauri/target/release/bundle/`
4. Publish release

### 4.4 Documents
**Purpose:** Central link hub for design docs

**Categories:**
- **Design:** GDD, Technical Architecture, Roadmap, Patient Roster
- **Art:** Asset List, Style Guide, Character Designs
- **Writing:** Dialogue Scripts, Sensitivity Guidelines

**Adding Document Links:**
1. Edit `portal/src/pages/Documents.jsx`
2. Add Google Docs sharing link to appropriate category
3. Commit and push

### 4.5 Assets
**Purpose:** Link to Google Drive asset folders

**Categories:**
- Character Sprites
- UI Elements
- Backgrounds
- Audio - Music
- Audio - SFX
- Fonts

**Asset Tracking:**
Each folder includes a checklist with status:
- Complete
- In Progress
- Pending

**Setup for Kiki:**
1. Create Google Drive folders matching categories
2. Upload assets to folders
3. Set sharing to "Anyone with link can view"
4. Copy folder link
5. Edit `portal/src/pages/Assets.jsx`
6. Add link to `driveUrl` field

### 4.6 Repository
**Purpose:** Quick access to GitHub repository

**Features:**
- Quick links to Issues, PRs, Actions, etc.
- Common Git commands reference
- Project structure overview
- Development commands

### 4.7 Discussions
**Purpose:** Quick team communication

**Features:**
- Create new discussion posts
- Reply to existing posts
- Delete discussions
- Link to GitHub Discussions for permanent threads

**Note:** Local discussions are stored in browser localStorage (not synced between devices). Use GitHub Discussions for important items.

### 4.8 Settings
**Purpose:** Portal configuration

**Features:**
- Password change flow
- SHA-256 hash generator
- Links to GitHub settings
- Portal version info

---

## 5. Deployment

### 5.1 GitHub Actions Workflow

The portal auto-deploys when changes are pushed to `main` in the `/portal` directory.

**Workflow:** `.github/workflows/deploy-pages.yml`

**Triggers:**
- Push to `main` branch with changes in `portal/**`
- Manual trigger (workflow_dispatch)

### 5.2 Enabling GitHub Pages

1. Go to Repository → Settings → Pages
2. Source: GitHub Actions
3. Wait for first deployment

### 5.3 Environment Variables

| Variable | Description | Set In |
|----------|-------------|--------|
| `VITE_DEV_PASSWORD_HASH` | SHA-256 of team password | GitHub Secrets |
| `VITE_REPO_OWNER` | GitHub username | Auto-injected |
| `VITE_REPO_NAME` | Repository name | Auto-injected |

---

## 6. Google Integration Guide

### 6.1 Google Docs Setup

**For Design Documents:**

1. Create document in Google Docs
2. Click Share → Anyone with link → Viewer
3. Copy the link
4. Add to `portal/src/pages/Documents.jsx`

**Recommended Folder Structure:**
```
SYNS Project (Drive)/
├── Design/
│   ├── Game Design Document
│   ├── Technical Architecture
│   └── Development Roadmap
├── Art/
│   ├── Style Guide
│   └── Character Concepts
└── Writing/
    ├── Dialogue Scripts
    └── Patient Profiles
```

### 6.2 Google Drive Setup

**For Asset Storage:**

1. Create folders in Google Drive:
   - `Character Sprites`
   - `UI Elements`
   - `Backgrounds`
   - `Audio - Music`
   - `Audio - SFX`
   - `Fonts`

2. Share each folder:
   - Right-click → Share → Anyone with link → Viewer

3. Update portal:
   - Edit `portal/src/pages/Assets.jsx`
   - Add folder links to `driveUrl` fields

### 6.3 Sync Workflow

**For Kiki (Art/Writing):**
1. Work in Clip Studio Paint / Google Docs
2. Export to Google Drive folders
3. Update asset checklist status in Assets.jsx
4. Push changes to update portal

**For Scott (Code):**
1. Work in VS Code
2. Commit and push to GitHub
3. Portal auto-updates on deployment

---

## 7. Customization

### 7.1 Adding New Pages

1. Create `portal/src/pages/NewPage.jsx`
2. Add route in `portal/src/App.jsx`
3. Add nav link in `portal/src/components/Layout.jsx`

### 7.2 Styling

All styles are in `portal/src/styles/main.css`

**CSS Variables:**
```css
--bg-primary: #0f1419;    /* Main background */
--bg-secondary: #1a1f26;  /* Sidebar */
--bg-card: #242a33;       /* Cards */
--text-primary: #e7e9ea;  /* Main text */
--text-secondary: #8b98a5;/* Muted text */
--accent: #1d9bf0;        /* Links/buttons */
```

### 7.3 Branding

To update branding:
1. Change favicon: `portal/public/favicon.svg`
2. Update title in `portal/index.html`
3. Modify sidebar header in `Layout.jsx`

---

## 8. Troubleshooting

### Portal Won't Deploy
- Check GitHub Actions tab for errors
- Verify `DEV_PASSWORD_HASH` secret exists
- Ensure Pages is set to "GitHub Actions" source

### Can't Login
- Verify password matches the hash in secrets
- Clear localStorage and try again
- Check browser console for errors

### Assets/Documents Not Showing
- Verify Google Drive/Docs sharing is set to "Anyone with link"
- Check that URLs are correctly added to the JSX files
- Ensure changes are committed and pushed

### Game Iframe Not Loading
- Deploy game build to `/game/` path
- Check browser console for CORS errors
- Try opening game URL directly first

---

## 9. Future Enhancements

### Phase 2 (Post-MVP)
- [ ] Cloud-synced discussions (Firebase/Supabase)
- [ ] Real-time collaboration presence
- [ ] Build status notifications
- [ ] Automated asset checklist from Drive API
- [ ] Embedded Google Docs viewer

### Phase 3 (If Needed)
- [ ] Backend authentication (Netlify/Vercel)
- [ ] User roles (Admin/Viewer)
- [ ] Comment system on releases
- [ ] Analytics dashboard

---

## 10. Quick Reference

### URLs
- **Portal:** `https://scottyvenable.github.io/See-You-Next-Session/`
- **Repository:** `https://github.com/ScottyVenable/See-You-Next-Session`

### Commands
```bash
# Development
cd portal
npm install
npm run dev

# Build
npm run build

# Preview production build
npm run preview
```

### File Locations
| What | Where |
|------|-------|
| Add document links | `portal/src/pages/Documents.jsx` |
| Add asset folders | `portal/src/pages/Assets.jsx` |
| Update styles | `portal/src/styles/main.css` |
| Deployment workflow | `.github/workflows/deploy-pages.yml` |
| Password hash | GitHub Secrets → `DEV_PASSWORD_HASH` |

---

*Document maintained by Scott. Last reviewed: December 15, 2025*
