import { Link } from 'react-router-dom';
import { Plus, Eye, Star, DollarSign } from 'lucide-react';
import { useIdeaStore } from '../store/ideaStore';
import { useAuthStore } from '../store/XStore';
import IdeaCard from '../components/IdeaCard';

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const ideas = useIdeaStore((state) => state.ideas);

  const userIdeas = ideas.filter((idea) => idea.author.id === user?.id);
  const totalEarnings = userIdeas.reduce((sum, idea) => {
    return sum + (idea.purchasedBy.length * idea.price);
  }, 0);
  const totalViews = userIdeas.reduce((sum, idea) => sum + idea.views, 0);
  const totalRatings = userIdeas.reduce((sum, idea) => sum + idea.ratings.length, 0);

  const avgRating = totalRatings > 0
    ? (userIdeas.reduce((sum, idea) => {
        const avg = idea.ratings.length > 0
          ? idea.ratings.reduce((s, r) => s + r.rating, 0) / idea.ratings.length
          : 0;
        return sum + avg * idea.ratings.length;
      }, 0) / totalRatings).toFixed(1)
    : '0';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Manage your ideas and track your earnings
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Ideas</p>
                <p className="text-3xl font-bold text-gray-900">{userIdeas.length}</p>
              </div>
              <Plus className="w-10 h-10 text-orange-100" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Views</p>
                <p className="text-3xl font-bold text-gray-900">{totalViews}</p>
              </div>
              <Eye className="w-10 h-10 text-blue-100" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Avg Rating</p>
                <p className="text-3xl font-bold text-gray-900">{avgRating}★</p>
              </div>
              <Star className="w-10 h-10 text-yellow-100" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Earnings</p>
                <p className="text-3xl font-bold text-green-600">${totalEarnings}</p>
              </div>
              <DollarSign className="w-10 h-10 text-green-100" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-12">
          <Link
            to="/add-idea"
            className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-600 transition"
          >
            <Plus className="w-5 h-5" />
            Post New Idea
          </Link>
        </div>

        {/* Ideas List */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Ideas</h2>
          {userIdeas.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {userIdeas.map((idea) => (
                <IdeaCard key={idea.id} idea={idea} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <Plus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No ideas yet
              </h3>
              <p className="text-gray-500 mb-6">
                Start sharing your ideas and begin earning money
              </p>
              <Link
                to="/add-idea"
                className="inline-block bg-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600 transition"
              >
                Post Your First Idea
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
