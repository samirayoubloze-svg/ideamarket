# 💡 IdeaMarket - Buy & Sell Ideas Platform

A modern, full-featured marketplace for buying and selling innovative ideas. Built with React, Vite, and Tailwind CSS.

## 🚀 Features

### Core Features
- ✅ **User Authentication** - Register, login, logout with persistent sessions
- ✅ **Idea Management** - Create, edit, delete, and browse ideas
- ✅ **Marketplace** - Buy ideas with simulated payment system
- ✅ **Ratings & Reviews** - Leave ratings and comments on purchased ideas
- ✅ **User Profiles** - View creator profiles and their ideas
- ✅ **Search & Filters** - Find ideas by category and keywords
- ✅ **Dashboard** - Track your ideas, earnings, and metrics
- ✅ **Responsive Design** - Works perfectly on mobile, tablet, and desktop

### Pages
- **Home Page** - Hero section, featured ideas, trending ideas
- **Explore Page** - Browse all ideas with advanced filtering and search
- **Idea Detail Page** - Full idea description, purchase, and review section
- **Add Idea Page** - Form to create and publish new ideas
- **Dashboard** - User's ideas, earnings, and statistics
- **Profile Page** - Creator profiles with their ideas and metrics
- **Authentication Pages** - Login and registration with validation

## 🛠️ Tech Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Routing**: React Router v6
- **Icons**: Lucide React
- **UI Components**: Custom components with Tailwind CSS

## 📦 Installation & Setup

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Start development server**
```bash
npm run dev
```
The app will be available at `http://localhost:5173`

3. **Build for production**
```bash
npm run build
```

4. **Preview production build**
```bash
npm run preview
```

## 🎯 How to Use

### Getting Started
1. Visit the home page to explore featured and trending ideas
2. Click "Sign Up" to create a new account or use the "Try Demo Account" button
3. Browse ideas using the "Explore Ideas" page with filters and search

### Creating an Idea
1. Click "Post Idea" in the navigation (requires login)
2. Fill in the idea title, category, price, and detailed description
3. Click "Publish Idea" to make it available for purchase

### Buying an Idea
1. Browse ideas or search for specific ones
2. Click on an idea card to view details
3. Click "Buy Now" to purchase (simulated payment)
4. Access full description and leave reviews after purchase

### Managing Your Ideas
1. Go to Dashboard to see all your posted ideas
2. View statistics including total views, ratings, and earnings
3. Edit or delete your ideas
4. Track purchases and revenue

## 📁 Project Structure

```
src/
├── components/
│   ├── Navigation.tsx      # Main navigation bar
│   ├── Footer.tsx          # Footer component
│   └── IdeaCard.tsx        # Idea card component
├── pages/
│   ├── Home.tsx            # Home page
│   ├── Explore.tsx         # Browse ideas page
│   ├── IdeaDetail.tsx      # Idea detail page
│   ├── AddIdea.tsx         # Create idea page
│   ├── Dashboard.tsx       # User dashboard
│   ├── Login.tsx           # Login page
│   ├── Register.tsx        # Registration page
│   └── Profile.tsx         # Creator profile page
├── store/
│   ├── authStore.ts        # Authentication state
│   └── ideaStore.ts        # Ideas and marketplace state
├── App.tsx                 # Main app component
├── main.tsx                # Application entry point
└── index.css               # Global styles
```

## 🔐 Authentication

### Demo Account
- Email: `demo@ideamarket.com`
- Access: Click "Try Demo Account" on login page

### Mock Authentication
The app uses a mock authentication system for demonstration:
- User sessions are stored in localStorage
- Token is generated on login/registration
- Logout clears session data

## 💰 Marketplace Features

### Ideas
- **Categories**: Startup, Business, Content, Marketing, Tech
- **Pricing**: Customizable per idea (recommended $19-99)
- **Purchase System**: Simulated one-click purchase
- **Access Control**: Full descriptions visible only to purchasers

### Reviews & Ratings
- **Star Ratings**: 1-5 star system
- **Comments**: Optional review text
- **Visibility**: All reviews public on idea detail page
- **Average Rating**: Calculated across all reviews

### User Stats
- **Earnings**: Calculated from purchases × idea price
- **Views**: Tracked per idea
- **Ratings**: Number and average rating per idea

## 🎨 Design System

### Color Scheme
- **Primary**: Orange (#FF6B35)
- **Secondary**: Gray (#374151)
- **Background**: White & Light Gray
- **Accent**: Yellow (for ratings)

### Typography
- **Headings**: Bold, gray-900
- **Body**: Regular, gray-700
- **Small Text**: Gray-600

### Component Variants
- **Buttons**: Primary (orange), Secondary (gray border), Danger (red)
- **Cards**: White background with shadows
- **Forms**: Clean inputs with validation feedback

## 🔍 Search & Filtering

### Search
- Real-time search by idea title and description
- Case-insensitive matching

### Filters
- **Category**: Startup, Business, Content, Marketing, Tech
- **Sort**: Newest, Trending, Top Rated, Price (Low-High), Price (High-Low)
- **Results Count**: Real-time display of matching ideas

## 📊 Mock Data

The app includes 5 sample ideas with:
- Realistic titles and descriptions
- Different categories and price points
- Author information with avatars
- Reviews and ratings
- View counts

All data is managed with Zustand state management and stored locally during the session.

## 🚀 Future Enhancements

- Backend API integration (Node.js + Express)
- Real database (MongoDB/PostgreSQL)
- Real payment processing (Stripe/PayPal)
- AI idea generator
- Email notifications
- Advanced analytics
- Admin dashboard
- Idea categories management
- Message/DM system
- Favorite/bookmark ideas
- Top creators page

## 📝 API Endpoints (When Backend Ready)

```
POST   /api/auth/register     - Create account
POST   /api/auth/login        - Login
POST   /api/auth/logout       - Logout
GET    /api/ideas             - Get all ideas
POST   /api/ideas             - Create idea
GET    /api/ideas/:id         - Get idea details
PUT    /api/ideas/:id         - Update idea
DELETE /api/ideas/:id         - Delete idea
POST   /api/ideas/:id/purchase - Purchase idea
POST   /api/ideas/:id/ratings  - Add review/rating
GET    /api/users/:id         - Get user profile
```

## 🤝 Contributing

To contribute to IdeaMarket:

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 🙋 Support

For support, email support@ideamarket.com or open an issue on GitHub.

## 📧 Contact

- Website: ideamarket.com
- Email: hello@ideamarket.com
- Twitter: @ideamarket

---

**Made with ❤️ by the IdeaMarket Team**
