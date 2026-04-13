import { Link, useNavigate } from 'react-router-dom';
import { Lightbulb, LogOut, Menu, X, Plus } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../store/XStore';

export default function Navigation() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80">
            <Lightbulb className="w-6 h-6 text-orange-500" />
            <span className="text-xl font-bold text-gray-900">IdeaMarket</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/explore"
              className="text-gray-700 hover:text-orange-500 font-medium transition"
            >
              Explore Ideas
            </Link>
            {user && (
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-orange-500 font-medium transition"
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Desktop Auth/User */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link
                  to="/add-idea"
                  className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Post Idea
                </Link>
                <div className="relative group">
                  <button className="text-gray-700 font-medium hover:text-orange-500 transition">
                    {user.name}
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
                    <Link
                      to={`/profile/${user.id}`}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 first:rounded-t-lg"
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 last:rounded-b-lg flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-orange-500 font-medium transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-orange-500"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200">
            <Link
              to="/explore"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              Explore Ideas
            </Link>
            {user && (
              <Link
                to="/dashboard"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
            )}
            <div className="border-t border-gray-200 mt-4 pt-4">
              {user ? (
                <>
                  <Link
                    to="/add-idea"
                    className="block px-4 py-2 text-orange-500 font-medium hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    Post Idea
                  </Link>
                  <Link
                    to={`/profile/${user.id}`}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-2 text-orange-500 font-medium hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
