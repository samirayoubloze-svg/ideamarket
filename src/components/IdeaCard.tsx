import { Link } from 'react-router-dom';
import { Star, Eye, MessageSquare } from 'lucide-react';
import { Idea } from '../store/ideaStore';

interface IdeaCardProps {
  idea: Idea;
}

export default function IdeaCard({ idea }: IdeaCardProps) {
  const avgRating = idea.ratings.length > 0
    ? (idea.ratings.reduce((sum, r) => sum + r.rating, 0) / idea.ratings.length).toFixed(1)
    : null;

  const categoryColors: Record<string, string> = {
    'Startup': 'bg-blue-100 text-blue-800',
    'Business': 'bg-purple-100 text-purple-800',
    'Content': 'bg-green-100 text-green-800',
    'Marketing': 'bg-pink-100 text-pink-800',
    'Tech': 'bg-indigo-100 text-indigo-800',
  };

  const categoryColor = categoryColors[idea.category] || 'bg-gray-100 text-gray-800';

  return (
    <Link
      to={`/idea/${idea.id}`}
      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 hover:text-orange-500">
              {idea.title}
            </h3>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${categoryColor}`}>
              {idea.category}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {idea.description}
        </p>

        {/* Author */}
        <div className="flex items-center gap-2 mb-4">
          {idea.author.avatar && (
            <img
              src={idea.author.avatar}
              alt={idea.author.name}
              className="w-8 h-8 rounded-full"
            />
          )}
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">
              {idea.author.name}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(idea.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{idea.views}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              <span>{idea.ratings.length}</span>
            </div>
            {avgRating && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span>{avgRating}</span>
              </div>
            )}
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-orange-500">${idea.price}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
