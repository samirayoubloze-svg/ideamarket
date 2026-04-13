# IdeaMarket Frontend

Professional React + Vite + Tailwind CSS frontend for the IdeaMarket marketplace platform.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Setup Environment
Create `.env.local`:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Run Development Server
```bash
npm run dev
```

Frontend runs on: `http://localhost:5173`

### 4. Build for Production
```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable components
│   ├── pages/           # Page components
│   ├── store/           # Zustand stores (state management)
│   ├── hooks/           # Custom React hooks
│   ├── config/          # Configuration
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
└── tailwind.config.js   # Tailwind CSS configuration
```

---

## 🎨 Features

- ✅ User Authentication (Register/Login)
- ✅ Idea Marketplace (Create, Read, Update, Delete)
- ✅ Browse & Search Ideas
- ✅ User Profiles
- ✅ Comments & Ratings
- ✅ Follow/Unfollow Users
- ✅ Dashboard (User Ideas & Earnings)
- ✅ Responsive Design
- ✅ Modern UI/UX

---

## 🔗 API Integration

Frontend communicates with backend API at:
```
http://localhost:5000/api
```

All requests use JWT tokens for authentication (stored in localStorage).

---

## 🛠️ Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **HTTP Client:** Axios
- **Routing:** React Router
- **Icons:** Lucide React

---

## 📦 Key Dependencies

- `react-router-dom` - Client-side routing
- `axios` - HTTP requests
- `zustand` - State management
- `lucide-react` - Icon library
- `date-fns` - Date formatting

---

## 🔐 Authentication

- Tokens stored in localStorage as `token`
- Automatically sent in API request headers
- Token included in: `Authorization: Bearer <token>`

---

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy dist/ folder to Vercel
```

### Netlify
1. Connect GitHub repo
2. Build command: `npm run build`
3. Publish directory: `dist`

### Self-hosted
```bash
npm run build
# Serve dist/ folder with any static server
```

---

## 📝 Environment Variables

Create `.env.local`:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🐛 Troubleshooting

### API calls not working?
- Check backend is running on port 5000
- Check `.env.local` has correct API URL
- Check browser console for CORS errors

### Styling issues?
- Run `npm install` again
- Clear browser cache
- Check Tailwind CSS is properly configured

---

## 📧 Support

For issues, create a GitHub issue in the main repo.
