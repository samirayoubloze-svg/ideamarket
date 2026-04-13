# IdeaMarket Backend

Professional Node.js + Express backend for the IdeaMarket marketplace platform.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env
```

Edit `.env` and configure:
- MongoDB URI
- JWT Secret
- Stripe API keys (for payments)
- Cloudinary (for image upload)

### 3. Run Development Server
```bash
npm run dev
```

Server runs on: `http://localhost:5000`

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)

### Ideas
- `GET /api/ideas` - Get all ideas (with search/filter)
- `GET /api/ideas/:id` - Get single idea
- `POST /api/ideas` - Create idea (auth required)
- `PUT /api/ideas/:id` - Update idea (auth required)
- `DELETE /api/ideas/:id` - Delete idea (auth required)
- `GET /api/ideas/user/:userId` - Get user's ideas

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/profile` - Update profile (auth required)
- `POST /api/users/:id/follow` - Follow user (auth required)
- `POST /api/users/:id/unfollow` - Unfollow user (auth required)

### Comments
- `GET /api/comments/idea/:ideaId` - Get idea comments
- `POST /api/comments` - Add comment (auth required)
- `DELETE /api/comments/:id` - Delete comment (auth required)

### Payments
- `POST /api/payments/buy/:ideaId` - Buy idea (auth required)
- `GET /api/payments/purchased` - Get purchased ideas (auth required)
- `GET /api/payments/earnings` - Get user earnings (auth required)

---

## 🗄️ Database Models

### User
```
- name: String
- email: String (unique)
- password: String (hashed)
- avatar: String
- bio: String
- followers: [User]
- following: [User]
- totalEarnings: Number
- createdAt: Date
```

### Idea
```
- title: String
- description: String
- category: String (enum)
- price: Number
- image: String
- author: User (ref)
- buyers: [User]
- rating: Number
- reviewCount: Number
- views: Number
- featured: Boolean
- createdAt: Date
```

### Comment
```
- text: String
- author: User (ref)
- idea: Idea (ref)
- rating: Number (1-5)
- createdAt: Date
```

---

## 🔐 Authentication

Uses JWT tokens. Include in headers:
```
Authorization: Bearer <token>
```

Token expires in 7 days by default.

---

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **Authentication:** JWT
- **Language:** TypeScript
- **Password Hashing:** Bcrypt

---

## 📝 Development Notes

- All routes return JSON
- Error responses include `success: false`
- Timestamps auto-generated on model creation
- Passwords automatically hashed on user creation

---

## 🚢 Deployment

### Heroku
```bash
heroku login
heroku create ideamarket-backend
git push heroku main
```

### Railway.app
1. Connect GitHub repo
2. Set environment variables
3. Deploy automatically

### AWS/DigitalOcean
1. Build: `npm run build`
2. Start: `npm start`
3. Set NODE_ENV=production

---

## 📧 Support

For issues, create a GitHub issue in the main repo.
