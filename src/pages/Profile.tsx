import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useIdeaStore } from '../store/ideaStore';
import IdeaCard from '../components/IdeaCard';

export default function Profile() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const ideas = useIdeaStore((state) => state.ideas);

  const userIdeas = ideas.filter((idea) => idea.author.id === userId);
  
  if (userIdeas.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">User not found</h1>
          <button
            onClick={() => navigate('/explore')}
            className="text-orange-500 hover:text-orange-600 font-medium"
          >
            Back to explore
          </button>
        </div>
      </div>
    );
  }

  const author = userIdeas[0].author;
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
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-orange-500 mb-8 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex items-center gap-6 mb-6">
            {author.avatar && (
              <img
                src={author.avatar}
                alt={author.name}
                className="w-24 h-24 rounded-full"
              />
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{author.name}</h1>
              <p className="text-gray-600 mt-1">Idea Creator</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center border-r border-gray-200 last:border-r-0">
              <p className="text-3xl font-bold text-gray-900">{userIdeas.length}</p>
              <p className="text-gray-600 text-sm mt-1">Ideas</p>
            </div>
            <div className="text-center border-r border-gray-200 last:border-r-0">
              <p className="text-3xl font-bold text-gray-900">{totalViews}</p>
              <p className="text-gray-600 text-sm mt-1">Views</p>
            </div>
            <div className="text-center border-r border-gray-200 last:border-r-0">
              <p className="text-3xl font-bold text-gray-900">{avgRating}★</p>
              <p className="text-gray-600 text-sm mt-1">Avg Rating</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{totalRatings}</p>
              <p className="text-gray-600 text-sm mt-1">Reviews</p>
            </div>
          </div>
        </div>

        {/* Ideas */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Ideas by {author.name}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {userIdeas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
