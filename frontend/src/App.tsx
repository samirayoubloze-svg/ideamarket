import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
/** * تنبيه: تأكد أن ملف authStore.ts مكتوب بحروف صغيرة في مجلد store 
 * إذا كان مكتوب AuthStore.ts (A كبيرة) فقم بتغييرها هنا أيضاً.
 */
import { useAuthStore } from './store/authStore'; 
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import Explore from './pages/Explore';
import IdeaDetail from './pages/IdeaDetail';
import AddIdea from './pages/AddIdea';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

function App() {
  // إضافة ": any" هنا هي السر باش Vercel ما يعطيش خطأ TS7006
  const user = useAuthStore((state: any) => state.user);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-white">
        <Navigation />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/idea/:id" element={<IdeaDetail />} />
            
            {/* حماية المسارات (Protected Routes) */}
            <Route 
              path="/add-idea" 
              element={user ? <AddIdea /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/dashboard" 
              element={user ? <Dashboard /> : <Navigate to="/login" />} 
            />
            
            <Route path="/profile/:userId" element={<Profile />} />
            
            {/* إذا كان المستخدم مسجل الدخول، يتم منعه من دخول صفحة الـ Login */}
            <Route 
              path="/login" 
              element={!user ? <Login /> : <Navigate to="/" />} 
            />
            <Route 
              path="/register" 
              element={!user ? <Register /> : <Navigate to="/" />} 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;