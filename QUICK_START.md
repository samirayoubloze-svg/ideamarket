# IdeaMarket - Quick Start Guide

## 🚀 Start in 2 Minutes

### Step 1: Install & Run
```bash
npm install
npm run dev
```

### Step 2: Open Browser
```
http://localhost:5173
```

### Step 3: Try Demo
Click **"Try Demo Account"** on login page

## 📝 What Can You Do?

### 🏠 Home Page
- View featured ideas
- See trending ideas
- Learn how the platform works

### 🔍 Explore Ideas
- Search by title/description
- Filter by category
- Sort by price, popularity, ratings
- Click idea to view details

### 💡 Create Your Idea
1. Click **"Post Idea"** (top right)
2. Fill form:
   - Title: "Your brilliant idea"
   - Category: Choose one
   - Price: $19-99 (recommended)
   - Description: Detailed explanation
3. Click **"Publish Idea"**
4. See it in Dashboard!

### 💰 Buy an Idea
1. Click idea card
2. View full details
3. Click **"Buy Now"**
4. Leave a review ⭐

### 📊 Dashboard
- See all your ideas
- Check earnings
- View stats (views, ratings)
- Edit or delete ideas

## 🎯 Key Pages

| Page | URL | What It Does |
|------|-----|-------------|
| Home | `/` | Browse trending & featured ideas |
| Explore | `/explore` | Search & filter all ideas |
| Idea Detail | `/idea/:id` | View full idea + buy + review |
| Dashboard | `/dashboard` | Manage your ideas & earnings |
| Profile | `/profile/:id` | View creator's ideas |
| Add Idea | `/add-idea` | Create new idea |
| Login | `/login` | Sign in |
| Register | `/register` | Create account |

## 🎨 How It Works

### 1. **Post Idea**
```
You → Publish Idea → Appears in Explore/Home → Buyers find it
```

### 2. **Buy Idea**
```
Buyer → Click "Buy Now" → Purchase → See full content + Review
```

### 3. **Earn Money**
```
You get: $Price × Number of Buyers = Total Earnings
```

## 💾 Where's My Data?

- **User Session**: Stored in browser (`localStorage`)
- **Ideas**: Stored in browser (Zustand state)
- **Reviews**: Attached to ideas
- **Purchases**: Tracked in idea's `purchasedBy` array

> **Note**: Data resets on page refresh. Use backend for persistence!

## 📱 Mobile Ready

The app works great on:
- ✅ Desktop
- ✅ Tablet
- ✅ Mobile phone

Try resizing your browser to see responsive design!

## 🧪 Try These Actions

### Create Multiple Ideas
1. Post idea 1: "AI App" ($49)
2. Post idea 2: "Content Strategy" ($29)
3. Post idea 3: "Marketplace" ($79)

### Test Search
1. Go to Explore
2. Search: "AI"
3. Search: "strategy"
4. Filter by "Content" category

### Test Purchasing
1. Use demo account
2. Go to explore
3. Buy 2-3 ideas
4. Go to Dashboard (logout first!)
5. Check earnings calculation

### Test Reviews
1. Buy an idea
2. Go to idea detail page
3. Scroll to reviews section
4. Leave a 5-star review
5. Refresh - see your review!

## ⚙️ Troubleshooting

### App Won't Start
```bash
# Try clearing everything
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Data Disappeared
> This is normal! Data is temporary (in-browser). It resets on refresh.
> When you connect a backend database, data will be permanent.

### Can't Login
1. Click "Try Demo Account"
2. Or register a new account
3. Use any email (no validation needed)

### Can't See My Idea
1. Go to Dashboard
2. Should see it there
3. Check if logged in with same account

## 🔑 Key Features to Test

- [ ] Register/Login
- [ ] Post an idea
- [ ] Search ideas
- [ ] Filter by category
- [ ] Buy an idea
- [ ] Leave a review
- [ ] Check Dashboard
- [ ] View creator profile
- [ ] Logout and login again

## 📞 Getting Help

1. **Check error in browser console** (F12)
2. **Read README.md** for detailed docs
3. **Check SETUP_GUIDE.md** for technical setup
4. **Check FEATURES.md** for feature details

## 🎓 Learn the Code

Start with these files:

1. **src/App.tsx** - Main app structure
2. **src/pages/Home.tsx** - Home page example
3. **src/store/authStore.ts** - Authentication
4. **src/store/ideaStore.ts** - Ideas data
5. **src/components/IdeaCard.tsx** - Reusable component

## 🚀 Next: Deploy or Integrate Backend

### Option 1: Deploy Now
```bash
npm run build
# Upload dist/index.html to Vercel/Netlify
```

### Option 2: Add Backend
- Create Node.js API
- Connect database (MongoDB)
- Replace mock API calls
- Add real authentication

See SETUP_GUIDE.md for detailed instructions!

## 🎉 Have Fun!

Experiment with:
- Creating different idea categories
- Searching and filtering
- Trying all pages
- Leaving creative reviews
- Checking earnings calculations

## 📊 Demo Scenarios

### Scenario 1: Creator
1. Register/login
2. Create 5 ideas with different prices
3. Check Dashboard earnings
4. View own profile

### Scenario 2: Buyer
1. Login as different user
2. Explore and find ideas
3. Buy 3 ideas
4. Leave reviews on all
5. View profiles of creators

### Scenario 3: Full Workflow
1. Create account as Alice
2. Post: "Startup Idea" ($49)
3. Create account as Bob
4. Find and buy Alice's idea
5. Leave 5-star review
6. Switch back to Alice
7. See purchase in idea detail

---

**Ready to explore? Start with Step 1! 🚀**
