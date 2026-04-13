# IdeaMarket - Complete Deployment Guide

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    IdeaMarket Platform                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Frontend (React + Vite)          Backend (Node + Express)   │
│  ↓                                 ↓                          │
│  Vercel / Netlify              Railway / Heroku              │
│  CDN: Vercel Edge              Database: MongoDB Atlas       │
│                                Payment: Stripe               │
│  Domain: custom.com            Domain: api.custom.com        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Part 1: Deploy Frontend to Vercel

### ✅ **Step 1: Push to GitHub**

```bash
cd ideamarket
git add .
git commit -m "Production ready"
git push origin main
```

### ✅ **Step 2: Connect to Vercel**

1. Go to https://vercel.com/new
2. Click **Import Project**
3. Select your GitHub repo
4. Click **Import**

### ✅ **Step 3: Configure Environment**

In Vercel dashboard → Settings → Environment Variables:

```
VITE_API_URL=https://ideamarket-api.railway.app/api
```

### ✅ **Step 4: Deploy**

Click **Deploy** button and wait 2-3 minutes.

**Your frontend is now live:** `https://ideamarket.vercel.app`

---

## 🔧 Part 2: Deploy Backend to Railway

### ✅ **Step 1: Prepare Backend**

Create new backend repository structure:

```
ideamarket-backend/
├── src/
│   └── server.ts
├── package.json
├── tsconfig.json
├── .env.example
├── Dockerfile (optional)
└── README.md
```

### ✅ **Step 2: Create package.json**

```json
{
  "name": "ideamarket-backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "ts-node src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "mongoose": "^7.0.0",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3",
    "stripe": "^11.0.0",
    "dotenv": "^16.0.3"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "ts-node": "^10.0.0",
    "@types/express": "^4.17.17",
    "@types/node": "^18.0.0"
  }
}
```

### ✅ **Step 3: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ES2020",
    "lib": ["ES2020"],
    "moduleResolution": "node",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

### ✅ **Step 4: Deploy to Railway**

1. Go to https://railway.app
2. Click **New Project**
3. Select **Deploy from GitHub**
4. Select your backend repo
5. Click **Deploy**

### ✅ **Step 5: Configure Environment Variables**

In Railway → Variables → Add:

```
PORT=8000
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=generate_random_string
STRIPE_SECRET_KEY=sk_live_your_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_key
FRONTEND_URL=https://ideamarket.vercel.app
```

### ✅ **Step 6: Get API URL**

After deployment, Railway provides URL like:
```
https://ideamarket-api-production.railway.app
```

Add to your Vercel environment variables:
```
VITE_API_URL=https://ideamarket-api-production.railway.app/api
```

---

## 🗄️ Part 3: Setup MongoDB Atlas

### ✅ **Step 1: Create Account**

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up (free tier available)
3. Create organization

### ✅ **Step 2: Create Cluster**

1. Click **Create a New Cluster**
2. Choose **Free Tier (M0)**
3. Select region closest to you
4. Click **Create Cluster**

### ✅ **Step 3: Create Database User**

1. Go to **Database Access**
2. Click **Add New Database User**
3. Set username: `ideamarket_user`
4. Set password (save it!)
5. Click **Add User**

### ✅ **Step 4: Get Connection String**

1. Go to **Databases**
2. Click **Connect**
3. Choose **Connect your application**
4. Copy connection string

```
mongodb+srv://ideamarket_user:PASSWORD@cluster.mongodb.net/ideamarket?retryWrites=true&w=majority
```

5. Replace PASSWORD and add to Railway variables

### ✅ **Step 5: Add IP Whitelist**

1. Go to **Network Access**
2. Click **Add IP Address**
3. Enter `0.0.0.0/0` (allow all IPs)
4. Click **Confirm**

---

## 💳 Part 4: Setup Stripe

### ✅ **Step 1: Create Account**

1. Go to https://stripe.com
2. Click **Get started**
3. Sign up for account

### ✅ **Step 2: Get API Keys**

1. Go to **Developers → API Keys**
2. Copy **Secret Key** (starts with `sk_`)
3. Copy **Publishable Key** (starts with `pk_`)

### ✅ **Step 3: Add to Railway**

In Railway environment variables:

```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### ✅ **Step 4: Setup Webhook**

1. Go to **Developers → Webhooks**
2. Click **Add Endpoint**
3. Enter URL: `https://your-api.railway.app/api/payments/webhook`
4. Select events: `payment_intent.succeeded`
5. Copy **Signing Secret**

Add to Railway:
```
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 🌐 Part 5: Custom Domain

### **For Frontend (Vercel)**

1. Go to Vercel Project Settings
2. Click **Domains**
3. Add your domain (e.g., `ideamarket.com`)
4. Follow DNS instructions
5. Point to Vercel nameservers

### **For Backend (Railway)**

1. Go to Railway Project Settings
2. Click **Domain**
3. Add custom domain (e.g., `api.ideamarket.com`)
4. Copy DNS record
5. Add to your domain DNS settings

### **Update Environment Variables**

Frontend (Vercel):
```
VITE_API_URL=https://api.ideamarket.com/api
```

Backend (Railway):
```
FRONTEND_URL=https://ideamarket.com
```

---

## ✅ Part 6: SSL & Security

### **Enable HTTPS**

Both Vercel and Railway automatically provide free SSL certificates.

### **Add Security Headers**

In `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

---

## 🚀 Part 7: CI/CD Pipeline

### **Automatic Deployment on Push**

Both Vercel and Railway support automatic deployment:

1. **Frontend**: Auto-deploys on push to main branch
2. **Backend**: Auto-deploys on push to main branch

No additional setup needed!

### **Preview Deployments**

For pull requests, both platforms auto-create preview URLs for testing.

---

## 📊 Part 8: Monitoring & Analytics

### **Vercel Analytics**

1. Go to Vercel Dashboard
2. Click **Analytics**
3. View traffic, performance, etc.

### **Railway Monitoring**

1. Go to Railway Project
2. Click **Monitoring**
3. View logs, memory usage, etc.

### **MongoDB Monitoring**

1. Go to MongoDB Atlas
2. Click **Performance Advisor**
3. View database metrics

---

## 🔍 Troubleshooting

### **Issue: CORS Error**

**Backend:** Update `FRONTEND_URL` in environment variables

```
FRONTEND_URL=https://your-frontend-url
```

### **Issue: Connection Timeout**

**Check:**
- MongoDB Atlas IP whitelist (add `0.0.0.0/0`)
- Railway network settings
- Database connection string

### **Issue: Stripe Payment Fails**

**Check:**
- Stripe keys are correct (live vs test)
- Webhook signing secret is correct
- Webhook URL is reachable

### **Issue: Image Upload Fails**

**Solution:** Implement AWS S3 or alternative:

```typescript
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export const uploadToS3 = async (file: Express.Multer.File) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET || '',
    Key: `ideas/${Date.now()}-${file.originalname}`,
    Body: file.buffer,
  };

  const result = await s3.upload(params).promise();
  return result.Location;
};
```

---

## 📱 Part 9: Mobile & PWA

### **Make it a PWA**

Add `public/manifest.json`:

```json
{
  "name": "IdeaMarket",
  "short_name": "IdeaMarket",
  "description": "Marketplace for buying and selling ideas",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

Add to `index.html`:

```html
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#3b82f6">
<meta name="mobile-web-app-capable" content="yes">
```

---

## ✨ Part 10: Final Checklist

- ✅ Frontend deployed on Vercel
- ✅ Backend deployed on Railway
- ✅ Database configured on MongoDB Atlas
- ✅ Stripe payment integration active
- ✅ Environment variables set in both Vercel and Railway
- ✅ Custom domain configured
- ✅ SSL certificates active
- ✅ API endpoints tested
- ✅ Analytics enabled
- ✅ Monitoring configured
- ✅ Backup strategy implemented

---

## 🎉 Congratulations!

Your IdeaMarket is now **LIVE** and production-ready! 🚀

**Access your application:**

- **Frontend:** https://ideamarket.com
- **Backend API:** https://api.ideamarket.com
- **Admin Panel:** https://ideamarket.com/admin

---

## 📞 Support & Next Steps

1. Monitor logs and errors
2. Implement user feedback
3. Add more features
4. Scale as needed
5. Consider CDN for static assets

Happy building! 🎊
