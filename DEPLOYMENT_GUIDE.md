# 🚀 Deploy CS Test Hub to GitHub Pages

Complete step-by-step guide to publish your website on GitHub with full functionality.

---

## 📋 Prerequisites

Before starting, make sure you have:
- ✅ Git installed on your computer
- ✅ Node.js and npm installed
- ✅ A GitHub account
- ✅ Your project working locally

---

## Step 1: Create GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the **+** icon in top-right corner → **New repository**
3. Fill in the details:
   - **Repository name**: `cs-test-hub` (or any name you prefer)
   - **Description**: "Computer Science Test Hub - Online Testing Platform"
   - **Public** (required for free GitHub Pages)
   - ❌ Do NOT initialize with README
   - ❌ Do NOT add .gitignore
   - ❌ Do NOT add license
4. Click **Create repository**

---

## Step 2: Install gh-pages Package

Open your terminal in the project root and run:

```bash
npm install --save-dev gh-pages
```

This package helps deploy your build folder to GitHub Pages.

---

## Step 3: Update package.json Scripts

Open `package.json` and add these scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

**What these do:**
- `predeploy`: Automatically builds your project before deployment
- `deploy`: Uses gh-pages to publish the `dist` folder to GitHub Pages

---

## Step 4: Configure Vite Base Path

Your `vite.config.js` is already configured with:

```javascript
base: '/cs-test-hub/'
```

**Important**: Replace `/cs-test-hub/` with your actual repository name (including the slashes).

For example:
- If repo name is `cs-test-hub` → use `/cs-test-hub/`
- If repo name is `my-testing-app` → use `/my-testing-app/`

---

## Step 5: Initialize Git and Push to GitHub

Run these commands in your terminal (in the project root):

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - CS Test Hub"

# Add GitHub as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/cs-test-hub.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Step 6: Deploy to GitHub Pages

Now deploy your website:

```bash
npm run deploy
```

This will:
1. Build your project (`npm run build`)
2. Create a `gh-pages` branch
3. Push the built files to that branch
4. GitHub will automatically serve it

---

## Step 7: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Click **Pages** in the left sidebar
4. Under "Source", select:
   - **Branch**: `gh-pages`
   - **Folder**: `/ (root)`
5. Click **Save**

---

## Step 8: Access Your Website

After 1-2 minutes, your website will be live at:

```
https://YOUR_USERNAME.github.io/cs-test-hub/
```

Replace:
- `YOUR_USERNAME` with your GitHub username
- `cs-test-hub` with your repository name

---

## 🔄 Updating Your Website

Whenever you make changes:

```bash
# 1. Make your changes to the code

# 2. Commit changes
git add .
git commit -m "Your commit message"

# 3. Push to GitHub
git push

# 4. Deploy to GitHub Pages
npm run deploy
```

Your website will update automatically within 1-2 minutes!

---

## 🐛 Troubleshooting

### Issue: 404 Error on Page Refresh

**Solution**: Your app uses HashRouter, so this shouldn't happen. If it does, check:
- `base` path in `vite.config.js` matches your repo name exactly
- GitHub Pages is enabled on `gh-pages` branch

### Issue: Blank Page After Deployment

**Solution**: 
1. Check browser console for errors
2. Verify `base` path in `vite.config.js`
3. Make sure you ran `npm run deploy`
4. Check that `gh-pages` branch exists

### Issue: Styles Not Loading

**Solution**:
1. Rebuild: `npm run build`
2. Redeploy: `npm run deploy`
3. Hard refresh browser (Ctrl+Shift+R)

### Issue: Changes Not Showing

**Solution**:
1. Clear browser cache
2. Wait 2-3 minutes for GitHub Pages to update
3. Try incognito/private window

---

## 📊 What Works on GitHub Pages

✅ **Everything works!** Your app uses:
- **HashRouter** - Works perfectly with static hosting
- **localStorage** - All data stored in browser
- **Client-side only** - No backend needed
- **All features** - Tests, results, admin panel, etc.

---

## 🎯 Alternative: Deploy to Netlify (Easier)

If GitHub Pages gives you trouble, try Netlify:

1. Go to [netlify.com](https://netlify.com)
2. Sign up/Login
3. Click **Add new site** → **Deploy manually**
4. Drag and drop your `dist` folder
5. Your site is live instantly!

**Or use Netlify CLI:**
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

---

## 🎯 Alternative: Deploy to Vercel (Fastest)

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click **New Project**
4. Import your GitHub repository
5. Click **Deploy**
6. Done! Auto-deploys on every push

---

## 📝 Important Notes

### localStorage Data
- Data is stored in each user's browser
- Different users see different data
- Clearing browser data resets everything
- Perfect for demo/testing purposes

### Admin Account
Your admin credentials:
- **Email**: abdulrafayqureshi@gmail.com
- **Password**: Rafay123@#

### Student Registration
- Students can register themselves
- Each student gets their own data
- Admin can view all student results

---

## 🎉 Success Checklist

- [ ] Created GitHub repository
- [ ] Installed gh-pages package
- [ ] Updated package.json scripts
- [ ] Configured vite.config.js base path
- [ ] Pushed code to GitHub
- [ ] Ran `npm run deploy`
- [ ] Enabled GitHub Pages in settings
- [ ] Website is live and working
- [ ] Can login with admin credentials
- [ ] Can register as student
- [ ] Can take tests
- [ ] Can view results

---

## 🚀 Quick Deploy Commands

```bash
# First time setup
npm install --save-dev gh-pages
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/cs-test-hub.git
git push -u origin main
npm run deploy

# Update website
git add .
git commit -m "Update message"
git push
npm run deploy
```

---

## 💡 Pro Tips

1. **Custom Domain**: You can add a custom domain in GitHub Pages settings
2. **HTTPS**: GitHub Pages automatically provides HTTPS
3. **Analytics**: Add Google Analytics by including the script in `index.html`
4. **SEO**: Add meta tags to `index.html` for better search visibility
5. **Favicon**: Add a favicon.ico to the `public` folder

---

## 🆘 Need Help?

If you encounter any issues:
1. Check the troubleshooting section above
2. Look at browser console for errors (F12)
3. Verify all configuration files
4. Try clearing browser cache
5. Check GitHub Pages settings

---

## 🎊 Congratulations!

Your CS Test Hub is now live on the internet! Share your website URL with students and start testing!

**Your website URL**: `https://YOUR_USERNAME.github.io/cs-test-hub/`

Happy testing! 🎓✨
