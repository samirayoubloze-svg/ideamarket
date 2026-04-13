# IdeaMarket - Developer's Cheat Sheet

Quick reference for developers working with IdeaMarket codebase.

## 🚀 Essential Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Kill process on port 5173 (if stuck)
kill $(lsof -t -i:5173)  # macOS/Linux
taskkill /F /IM node.exe # Windows
```

## 📁 File Navigation

| What | Where |
|------|-------|
| Home page | `src/pages/Home.tsx` |
| Explore page | `src/pages/Explore.tsx` |
| Idea detail | `src/pages/IdeaDetail.tsx` |
| Add idea | `src/pages/AddIdea.tsx` |
| Dashboard | `src/pages/Dashboard.tsx` |
| Auth store | `src/store/authStore.ts` |
| Idea store | `src/store/ideaStore.ts` |
| Routing | `src/App.tsx` |
| Navigation | `src/components/Navigation.tsx` |

## 💾 State Management (Zustand)

### Get State
```typescript
import { useAuthStore } from './store/authStore';

const user = useAuthStore((state) => state.user);
const token = useAuthStore((state) => state.token);
```

### Update State
```typescript
const login = useAuthStore((state) => state.login);
login(user, token);

const logout = useAuthStore((state) => state.logout);
logout();
```

### Ideas Store
```typescript
import { useIdeaStore } from './store/ideaStore';

const ideas = useIdeaStore((state) => state.ideas);
const idea = useIdeaStore((state) => state.getIdeaById)('id');

// Add/Update/Delete
useIdeaStore((state) => state.addIdea)(newIdea);
useIdeaStore((state) => state.updateIdea)(updatedIdea);
useIdeaStore((state) => state.deleteIdea)('ideaId');

// Purchase/Rate
useIdeaStore((state) => state.purchaseIdea)('ideaId', 'userId');
useIdeaStore((state) => state.addRating)('ideaId', rating);
```

## 🎨 Tailwind CSS Quick Reference

### Common Classes
```tsx
// Spacing
<div className="p-4 m-4 px-6 py-3 gap-4">

// Colors
<div className="bg-orange-500 text-white">

// Layout
<div className="flex items-center justify-between">
<div className="grid md:grid-cols-3 gap-6">

// Responsive
<div className="hidden md:flex"> {/* hidden on mobile */}
<div className="md:grid-cols-3"> {/* 3 columns on desktop */}

// Effects
<button className="hover:bg-orange-600 transition rounded-lg shadow-lg">
```

### Color Shortcuts
```tsx
// Orange (primary)
bg-orange-500, text-orange-500, border-orange-500

// Gray (secondary)
bg-gray-100, text-gray-700, border-gray-300

// Category colors
bg-blue-100, bg-purple-100, bg-green-100, bg-pink-100, bg-indigo-100

// Status
bg-red-50, bg-green-50, text-red-800, text-green-800
```

## 🔄 Common Patterns

### Protected Route
```typescript
<Route 
  path="/dashboard" 
  element={user ? <Dashboard /> : <Navigate to="/login" />} 
/>
```

### Form Validation
```typescript
const validateForm = () => {
  const newErrors: Record<string, string> = {};
  if (!formData.email) newErrors.email = 'Email required';
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

### Handle Submit
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validateForm()) return;
  
  setIsLoading(true);
  try {
    // Do something
  } catch (error) {
    setErrors({ submit: 'Error message' });
  } finally {
    setIsLoading(false);
  }
};
```

### Navigate Programmatically
```typescript
const navigate = useNavigate();

// Go to page
navigate('/dashboard');

// Go back
navigate(-1);

// Go to dynamic path
navigate(`/idea/${ideaId}`);
```

## 🔐 Authentication Pattern

### Check User
```typescript
const user = useAuthStore((state) => state.user);

if (!user) {
  navigate('/login');
  return;
}
```

### Login
```typescript
const user = { id: 'user123', email: 'test@example.com', name: 'John' };
const token = 'jwt-token-123';
useAuthStore((state) => state.login)(user, token);
```

### Logout
```typescript
useAuthStore((state) => state.logout)();
navigate('/');
```

## 🎯 Common Imports

```typescript
// React
import { useState, useEffect } from 'react';

// Routing
import { useNavigate, useParams, Link } from 'react-router-dom';

// Icons
import { Lightbulb, Menu, X, Plus, ArrowLeft } from 'lucide-react';

// Store
import { useAuthStore } from '../store/authStore';
import { useIdeaStore } from '../store/ideaStore';
```

## 📊 Data Structures

### User Type
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  bio?: string;
  avatar?: string;
}
```

### Idea Type
```typescript
interface Idea {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  author: { id: string; name: string; avatar?: string };
  createdAt: string;
  purchasedBy: string[];
  ratings: Rating[];
  views: number;
  isFeatured?: boolean;
}
```

### Rating Type
```typescript
interface Rating {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}
```

## 🐛 Debugging Tips

### Check User Session
```typescript
// In browser console
localStorage.getItem('token')
localStorage.getItem('user')
JSON.parse(localStorage.getItem('user'))
```

### Check Store State
```typescript
// In browser console
useAuthStore.getState()
useIdeaStore.getState()
```

### Clear localStorage
```typescript
// In browser console
localStorage.clear()
// Then refresh page
```

### View React DevTools
1. Open DevTools (F12)
2. Find Components tab
3. Expand component tree
4. Click component to inspect state/props

## 📱 Responsive Testing

### Mobile View
- Open DevTools (F12)
- Click device toggle (Ctrl+Shift+M)
- Choose iPhone 12 or similar
- Test touch interactions

### Breakpoints to Test
- 320px (small phone)
- 375px (normal phone)
- 768px (tablet)
- 1024px (desktop)

## 🌐 Adding Backend API

### 1. Create axios instance
```typescript
// src/api/client.ts
import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
});

export default client;
```

### 2. Replace mock calls
```typescript
// Before (mock)
const ideas = useIdeaStore((state) => state.ideas);

// After (API)
useEffect(() => {
  client.get('/ideas')
    .then(res => useIdeaStore((state) => state.setIdeas)(res.data))
    .catch(err => console.error(err));
}, []);
```

### 3. Add auth header
```typescript
const token = useAuthStore.getState().token;
client.get('/ideas', {
  headers: { Authorization: `Bearer ${token}` }
});
```

## 📦 Adding New Dependencies

```bash
# Add package
npm install package-name

# Add dev dependency
npm install --save-dev @types/package-name

# You cannot edit package.json directly!
# Use npm install tool
```

## 🎨 Creating New Page

1. Create file: `src/pages/NewPage.tsx`
```typescript
export default function NewPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold">New Page</h1>
    </div>
  );
}
```

2. Add route in `src/App.tsx`
```typescript
import NewPage from './pages/NewPage';

<Route path="/new-page" element={<NewPage />} />
```

3. Add link in Navigation (if needed)
```typescript
<Link to="/new-page">New Page</Link>
```

## 🎨 Creating New Component

1. Create file: `src/components/NewComponent.tsx`
```typescript
interface NewComponentProps {
  title: string;
  onClick: () => void;
}

export default function NewComponent({ title, onClick }: NewComponentProps) {
  return (
    <button onClick={onClick} className="px-4 py-2 bg-orange-500 text-white rounded">
      {title}
    </button>
  );
}
```

2. Use in page
```typescript
import NewComponent from '../components/NewComponent';

<NewComponent title="Click me" onClick={() => alert('Clicked!')} />
```

## 🚀 Deployment Checklist

- [ ] Build: `npm run build`
- [ ] No errors in console
- [ ] All pages accessible
- [ ] Mobile responsive
- [ ] Forms work correctly
- [ ] Logout works
- [ ] Demo account works
- [ ] Ready to deploy!

### Deploy to Vercel
```bash
npm install -g vercel
vercel login
vercel
```

### Deploy to Netlify
1. Push to GitHub
2. Connect repo to Netlify
3. Set build: `npm run build`
4. Set publish: `dist`
5. Deploy!

## 🔍 Environment Variables

### Add Variables
Create `.env` file:
```
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=IdeaMarket
```

### Use Variables
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
const appName = import.meta.env.VITE_APP_NAME;
```

## 📝 Git Commands

```bash
# Check status
git status

# Add all changes
git add .

# Commit
git commit -m "Add new feature"

# Push to GitHub
git push origin main

# Pull latest
git pull origin main
```

## 🎓 Learning Resources

- React: https://react.dev
- Tailwind: https://tailwindcss.com
- Zustand: https://github.com/pmndrs/zustand
- Vite: https://vitejs.dev
- TypeScript: https://www.typescriptlang.org

## 💡 Pro Tips

1. **Use React DevTools** for debugging state
2. **Test on mobile** regularly
3. **Check console** for errors
4. **Use localStorage** inspector
5. **Keep components small** and focused
6. **Document complex logic** with comments
7. **Test all flows** before deploying
8. **Use meaningful names** for variables

## ⚡ Performance Tips

- Minimize re-renders with proper keys
- Use React.memo for expensive components
- Lazy load routes with React.lazy
- Optimize images and assets
- Remove console.logs before production

## 🆘 Quick Fixes

| Issue | Fix |
|-------|-----|
| App won't load | Clear cache, `Ctrl+Shift+Del`, hard refresh |
| State lost | Check localStorage, verify store updates |
| Styles not applying | Check Tailwind class names, rebuild CSS |
| Images not showing | Check image paths, verify file exists |
| Routes not working | Check route paths, verify components imported |
| Form not submitting | Check validation, verify handler called |

---

## Quick Links

- 📖 [Full README](./README.md)
- 🚀 [Quick Start](./QUICK_START.md)
- 🛠️ [Setup Guide](./SETUP_GUIDE.md)
- ✨ [Features](./FEATURES.md)
- 🔌 [Backend Integration](./BACKEND_INTEGRATION.md)

**Happy coding! 🎉**
