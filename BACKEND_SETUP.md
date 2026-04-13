# IdeaMarket Backend Setup Guide

## 📋 Backend Architecture Overview

```
Backend (Node.js + Express + MongoDB)
├── Authentication (JWT)
├── Database (MongoDB)
├── Payment Processing (Stripe)
├── File Storage (AWS S3 or Local)
└── Email Service (Nodemailer)
```

---

## 🚀 Quick Start - Backend Setup

### 1️⃣ **Create Backend Project**

```bash
mkdir ideamarket-backend
cd ideamarket-backend
npm init -y
```

### 2️⃣ **Install Dependencies**

```bash
npm install express cors dotenv mongoose bcryptjs jsonwebtoken axios nodemailer stripe
npm install --save-dev typescript ts-node @types/express @types/node @types/jsonwebtoken nodemon
```

### 3️⃣ **Create Project Structure**

```
ideamarket-backend/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   └── env.ts
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── ideaController.ts
│   │   ├── paymentController.ts
│   │   └── reviewController.ts
│   ├── models/
│   │   ├── User.ts
│   │   ├── Idea.ts
│   │   ├── Purchase.ts
│   │   └── Review.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── errorHandler.ts
│   │   └── validation.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── ideas.ts
│   │   ├── users.ts
│   │   ├── payments.ts
│   │   └── reviews.ts
│   ├── utils/
│   │   ├── jwt.ts
│   │   ├── password.ts
│   │   └── email.ts
│   └── server.ts
├── .env
├── .env.example
├── tsconfig.json
├── package.json
└── README.md
```

---

## 🔧 Backend Code Examples

### **1. Server Setup (src/server.ts)**

```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import authRoutes from './routes/auth';
import ideaRoutes from './routes/ideas';
import userRoutes from './routes/users';
import paymentRoutes from './routes/payments';
import reviewRoutes from './routes/reviews';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect Database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ideas', ideaRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
```

### **2. Environment Variables (.env)**

```env
# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb://localhost:27017/ideamarket
# OR MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ideamarket

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d

# Stripe
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_key

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# AWS S3 (Optional)
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_S3_BUCKET=ideamarket-bucket
AWS_REGION=us-east-1
```

### **3. Authentication Controller**

```typescript
import { Request, Response } from 'express';
import User from '../models/User';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = new User({
      email,
      password: hashedPassword,
      name,
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Send response
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};
```

### **4. Idea Model (MongoDB)**

```typescript
import mongoose from 'mongoose';

const ideaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  author: {
    id: mongoose.Schema.Types.ObjectId,
    name: String,
  },
  image: String,
  tags: [String],
  purchasedBy: [mongoose.Schema.Types.ObjectId],
  views: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Idea', ideaSchema);
```

---

## 💳 Payment Integration (Stripe)

### **Stripe Implementation**

```typescript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export const createPaymentIntent = async (req: Request, res: Response) => {
  try {
    const { amount, ideaId, userId } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        ideaId,
        userId,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(400).json({ error: 'Payment intent creation failed' });
  }
};

export const handlePaymentWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  const event = stripe.webhooks.constructEvent(
    req.body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET || ''
  );

  if (event.type === 'payment_intent.succeeded') {
    const { metadata } = event.data.object;
    // Create purchase record
    // Send confirmation email
  }

  res.json({ received: true });
};
```

---

## 🗄️ Database Setup

### **MongoDB Local Setup**

```bash
# macOS
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Windows
# Download from https://www.mongodb.com/try/download/community
# Run installer and start MongoDB service

# Linux
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

### **MongoDB Atlas (Cloud)**

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Add to `.env`: `MONGODB_URI=mongodb+srv://...`

---

## 🚀 Deployment

### **Deploy to Heroku**

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create ideamarket-api

# Set environment variables
heroku config:set JWT_SECRET=your_secret
heroku config:set MONGODB_URI=your_mongo_url
heroku config:set STRIPE_SECRET_KEY=your_stripe_key

# Deploy
git push heroku main
```

### **Deploy to Railway**

1. Go to https://railway.app
2. Connect GitHub
3. Select repo
4. Set environment variables
5. Auto-deploy on push

### **Deploy to DigitalOcean**

```bash
# SSH into server
ssh root@your_server_ip

# Install Node & npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repo
git clone your-repo
cd ideamarket-backend

# Install dependencies
npm install
npm run build

# Install PM2
npm install -g pm2
pm2 start npm --name "ideamarket" -- start
```

---

## 📊 API Endpoints

### **Authentication**
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### **Ideas**
- `GET /api/ideas` - List all ideas
- `POST /api/ideas` - Create idea
- `GET /api/ideas/:id` - Get idea detail
- `PUT /api/ideas/:id` - Update idea
- `DELETE /api/ideas/:id` - Delete idea
- `GET /api/ideas/search?q=query` - Search ideas
- `GET /api/ideas/trending` - Get trending ideas

### **Payments**
- `POST /api/payments/create-intent` - Create payment intent
- `POST /api/payments/confirm` - Confirm payment
- `POST /api/payments/webhook` - Stripe webhook

### **Reviews**
- `GET /api/ideas/:ideaId/reviews` - List reviews
- `POST /api/ideas/:ideaId/reviews` - Create review
- `PUT /api/ideas/:ideaId/reviews/:reviewId` - Update review
- `DELETE /api/ideas/:ideaId/reviews/:reviewId` - Delete review

---

## ✅ Testing Backend

### **Test with cURL**

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456","name":"John"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'

# Get all ideas
curl http://localhost:5000/api/ideas

# Create idea (requires token)
curl -X POST http://localhost:5000/api/ideas \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"My Idea",
    "description":"Description",
    "category":"Startup",
    "price":49
  }'
```

---

## 🔗 Connect Frontend to Backend

### **Update Frontend API Configuration**

In `src/config/api.ts`:

```typescript
const API_BASE_URL = 'http://localhost:5000/api';
// OR for production
const API_BASE_URL = 'https://ideamarket-api.herokuapp.com/api';
```

Or use environment variable:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

Create `.env.local` in frontend:

```
VITE_API_URL=http://localhost:5000/api
```

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Stripe API Reference](https://stripe.com/docs/api)
- [JWT Guide](https://jwt.io/introduction)

---

That's it! Your backend is ready to serve the IdeaMarket frontend! 🚀
