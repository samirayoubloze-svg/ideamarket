import { Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-6 h-6 text-orange-500" />
              <span className="text-xl font-bold text-white">IdeaMarket</span>
            </div>
            <p className="text-sm">
              The marketplace for buying and selling innovative ideas.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <div className="space-y-2 text-sm">
              <Link to="/" className="hover:text-orange-500 transition">Home</Link>
              <Link to="/explore" className="hover:text-orange-500 transition">Explore</Link>
              <a href="#" className="hover:text-orange-500 transition">Trending</a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <div className="space-y-2 text-sm">
              <a href="#" className="hover:text-orange-500 transition">About Us</a>
              <a href="#" className="hover:text-orange-500 transition">Blog</a>
              <a href="#" className="hover:text-orange-500 transition">Careers</a>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <div className="space-y-2 text-sm">
              <a href="#" className="hover:text-orange-500 transition">Privacy</a>
              <a href="#" className="hover:text-orange-500 transition">Terms</a>
              <a href="#" className="hover:text-orange-500 transition">Contact</a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <p className="text-center text-sm">
            © 2024 IdeaMarket. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
