# IdeaMarket - Backend Integration Guide

## Overview

This guide helps you integrate a real backend API with the IdeaMarket frontend. The app currently uses mock data and localStorage. You'll need to replace these with real API calls.

## Backend Stack Recommendations

```
Frontend: React + Vite + Tailwind (✅ Done)
Backend: Node.js + Express
Database: MongoDB or PostgreSQL
Auth: JWT (JSON Web Tokens)
Payment: Stripe or PayPal
```

## API Structure

### Base URL
```
Development: http://localhost:3000/api
Production: https://api.ideamarket.com/api
```

### Response Format
```json
{
  "success": true,
  "data": {...},
  "error": null
}
```

## Authentication Endpoints

### POST `/auth/register`
**Request**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "id": "user123",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

**Frontend Implementation**
```typescript
// src/pages/Register.tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const response = await axios.post(
      `${API_URL}/auth/register`,
      {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }
    );
    const { token, user } = response.data.data;
    register(user, token);
    navigate('/');
  } catch (error) {
    setErrors({ submit: error.response?.data?.error });
  }
};
```

### POST `/auth/login`
**Request**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "id": "user123",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

### POST `/auth/logout`
**Headers**
```
Authorization: Bearer <token>
```

**Response**
```json
{
  "success": true
}
```

## Ideas Endpoints

### GET `/ideas`
**Query Parameters**
```
?search=ai
?category=startup
?sort=newest
?limit=10
?offset=0
```

**Response**
```json
{
  "success": true,
  "data": {
    "ideas": [
      {
        "id": "idea123",
        "title": "AI App",
        "description": "...",
        "category": "Startup",
        "price": 49,
        "author": {
          "id": "user123",
          "name": "John Doe"
        },
        "createdAt": "2024-01-15T10:30:00Z",
        "views": 324,
        "ratings": []
      }
    ],
    "total": 50
  }
}
```

### GET `/ideas/:id`
**Response**
```json
{
  "success": true,
  "data": {
    "idea": {
      "id": "idea123",
      "title": "AI App",
      "description": "Full description...",
      "category": "Startup",
      "price": 49,
      "author": {...},
      "createdAt": "2024-01-15T10:30:00Z",
      "purchasedBy": ["user456"],
      "ratings": [...],
      "views": 324
    }
  }
}
```

### POST `/ideas`
**Headers**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request**
```json
{
  "title": "AI App",
  "description": "Detailed description...",
  "category": "Startup",
  "price": 49
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "idea": {
      "id": "idea123",
      "title": "AI App",
      ...
    }
  }
}
```

**Frontend Implementation**
```typescript
// src/pages/AddIdea.tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validateForm()) return;

  setIsSubmitting(true);
  try {
    const token = useAuthStore.getState().token;
    const response = await axios.post(
      `${API_URL}/ideas`,
      {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: Number(formData.price),
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    
    const newIdea = response.data.data.idea;
    addIdea(newIdea);
    navigate('/dashboard');
  } catch (error) {
    setErrors({ submit: error.response?.data?.error });
  } finally {
    setIsSubmitting(false);
  }
};
```

### PUT `/ideas/:id`
**Headers**
```
Authorization: Bearer <token>
```

**Request**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "category": "Business",
  "price": 59
}
```

### DELETE `/ideas/:id`
**Headers**
```
Authorization: Bearer <token>
```

## Purchase Endpoints

### POST `/ideas/:id/purchase`
**Headers**
```
Authorization: Bearer <token>
```

**Request**
```json
{
  "paymentToken": "stripe_token_123"
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "purchase": {
      "id": "purchase123",
      "ideaId": "idea123",
      "userId": "user123",
      "amount": 49,
      "status": "completed",
      "createdAt": "2024-01-20T15:30:00Z"
    }
  }
}
```

**Frontend Implementation**
```typescript
// src/pages/IdeaDetail.tsx
const handlePurchase = async () => {
  if (!user) {
    navigate('/login');
    return;
  }

  try {
    const token = useAuthStore.getState().token;
    const response = await axios.post(
      `${API_URL}/ideas/${id}/purchase`,
      { paymentToken: 'stripe_token' },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    purchaseIdea(idea.id, user.id);
    setIsPurchased(true);
  } catch (error) {
    console.error('Purchase failed:', error);
  }
};
```

## Ratings Endpoints

### POST `/ideas/:id/ratings`
**Headers**
```
Authorization: Bearer <token>
```

**Request**
```json
{
  "rating": 5,
  "comment": "Amazing idea!"
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "rating": {
      "id": "rating123",
      "userId": "user123",
      "userName": "John Doe",
      "rating": 5,
      "comment": "Amazing idea!",
      "createdAt": "2024-01-20T15:30:00Z"
    }
  }
}
```

**Frontend Implementation**
```typescript
// src/pages/IdeaDetail.tsx
const handleAddRating = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!user || !isPurchased || rating === 0) return;

  try {
    const token = useAuthStore.getState().token;
    const response = await axios.post(
      `${API_URL}/ideas/${idea.id}/ratings`,
      {
        rating,
        comment,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const newRating = response.data.data.rating;
    addRating(idea.id, newRating);
    setRating(0);
    setComment('');
  } catch (error) {
    console.error('Failed to submit rating:', error);
  }
};
```

## User Endpoints

### GET `/users/:id`
**Response**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user123",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "https://...",
      "bio": "Creator of amazing ideas"
    }
  }
}
```

### GET `/users/me` (Current User)
**Headers**
```
Authorization: Bearer <token>
```

**Response** - Same as above

### PUT `/users/me`
**Headers**
```
Authorization: Bearer <token>
```

**Request**
```json
{
  "name": "Jane Doe",
  "bio": "Updated bio",
  "avatar": "base64_image_or_url"
}
```

## Error Handling

### Common Error Responses

**400 Bad Request**
```json
{
  "success": false,
  "error": "Title is required"
}
```

**401 Unauthorized**
```json
{
  "success": false,
  "error": "Invalid token"
}
```

**403 Forbidden**
```json
{
  "success": false,
  "error": "You can only edit your own ideas"
}
```

**404 Not Found**
```json
{
  "success": false,
  "error": "Idea not found"
}
```

**500 Server Error**
```json
{
  "success": false,
  "error": "Internal server error"
}
```

### Frontend Error Handling
```typescript
try {
  const response = await axios.get('/api/ideas');
  // Handle success
} catch (error) {
  if (error.response?.status === 401) {
    // Redirect to login
    useAuthStore.getState().logout();
    navigate('/login');
  } else if (error.response?.status === 404) {
    // Show not found message
    setError('Resource not found');
  } else {
    // Show generic error
    setError(error.response?.data?.error || 'An error occurred');
  }
}
```

## API Integration Helper

Create `src/api/client.ts`:
```typescript
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const client = axios.create({
  baseURL: API_URL,
});

// Add auth token to requests
client.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default client;
```

Usage:
```typescript
import client from '../api/client';

const ideas = await client.get('/ideas');
const idea = await client.post('/ideas', { title, description, ... });
```

## Migration Checklist

- [ ] Create Node.js + Express backend
- [ ] Set up MongoDB/PostgreSQL database
- [ ] Implement all API endpoints
- [ ] Add JWT authentication
- [ ] Add request validation
- [ ] Add error handling
- [ ] Replace mock API calls with real API
- [ ] Add API environment variables
- [ ] Test all endpoints with Postman
- [ ] Set up CORS for frontend
- [ ] Deploy backend to server
- [ ] Update frontend API_URL
- [ ] Test full integration
- [ ] Add payment processing (Stripe)
- [ ] Add email notifications
- [ ] Add admin endpoints

## Environment Variables

Create `.env`:
```
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=IdeaMarket
```

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

## Database Schema (Reference)

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  avatar: String,
  bio: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Ideas Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  category: String,
  price: Number,
  authorId: ObjectId (ref: User),
  purchasedBy: [ObjectId],
  views: Number,
  isFeatured: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Ratings Collection
```javascript
{
  _id: ObjectId,
  ideaId: ObjectId (ref: Idea),
  userId: ObjectId (ref: User),
  rating: Number (1-5),
  comment: String,
  createdAt: Date
}
```

### Purchases Collection
```javascript
{
  _id: ObjectId,
  ideaId: ObjectId (ref: Idea),
  buyerId: ObjectId (ref: User),
  amount: Number,
  stripeTransactionId: String,
  status: String (completed/failed/pending),
  createdAt: Date
}
```

## Deployment

### Environment-Specific APIs
```typescript
const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? 'https://api.ideamarket.com/api'
    : 'http://localhost:3000/api');
```

### Build for Production
```bash
npm run build
```

### Deploy Frontend
- Vercel: Auto-deploy from GitHub
- Netlify: Connect repo and set build command
- Traditional: Upload `dist/` folder to server

---

**You're now ready to build a full-stack application! 🚀**
