import { useParams, useNavigate } from 'react-router-dom';
import { Star, MessageSquare, ShoppingCart, Edit2, Trash2, Eye, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useIdeaStore, Rating } from '../store/ideaStore';
import { useAuthStore } from '../store/authStore';

export default function IdeaDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const idea = useIdeaStore((state) => state.getIdeaById(id!));
  const purchaseIdea = useIdeaStore((state) => state.purchaseIdea);
  const addRating = useIdeaStore((state) => state.addRating);
  const deleteIdea = useIdeaStore((state) => state.deleteIdea);
  const user = useAuthStore((state) => state.user);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isPurchased, setIsPurchased] = useState(idea?.purchasedBy.includes(user?.id || '') || false);

  if (!idea) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Idea not found</h1>
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

  const avgRating = idea.ratings.length > 0
    ? (idea.ratings.reduce((sum, r) => sum + r.rating, 0) / idea.ratings.length).toFixed(1)
    : null;

  const isAuthor = user?.id === idea.author.id;

  const handlePurchase = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    purchaseIdea(idea.id, user.id);
    setIsPurchased(true);
  };

  const handleAddRating = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !isPurchased || rating === 0) return;

    const newRating: Rating = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };

    addRating(idea.id, newRating);
    setRating(0);
    setComment('');
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this idea?')) {
      deleteIdea(idea.id);
      navigate('/dashboard');
    }
  };

  const categoryColors: Record<string, string> = {
    'Startup': 'bg-blue-100 text-blue-800',
    'Business': 'bg-purple-100 text-purple-800',
    'Content': 'bg-green-100 text-green-800',
    'Marketing': 'bg-pink-100 text-pink-800',
    'Tech': 'bg-indigo-100 text-indigo-800',
  };

  const categoryColor = categoryColors[idea.category] || 'bg-gray-100 text-gray-800';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-orange-500 mb-8 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {idea.title}
              </h1>
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${categoryColor}`}>
                {idea.category}
              </span>
            </div>
            {isAuthor && (
              <div className="flex gap-2">
                <button className="p-2 text-gray-600 hover:text-orange-500 hover:bg-gray-100 rounded-lg transition">
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Author Info */}
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-200">
            {idea.author.avatar && (
              <img
                src={idea.author.avatar}
                alt={idea.author.name}
                className="w-12 h-12 rounded-full"
              />
            )}
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{idea.author.name}</p>
              <p className="text-sm text-gray-500">
                {new Date(idea.createdAt).toLocaleDateString()}
              </p>
            </div>
            {!isAuthor && (
              <button className="text-orange-500 hover:text-orange-600 font-medium text-sm">
                View Profile
              </button>
            )}
          </div>

          {/* Two Column Layout */}
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Description - 2 cols */}
            <div className="md:col-span-2">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {isPurchased || isAuthor ? idea.description : `${idea.description.substring(0, 200)}...`}
              </p>
              {!isPurchased && !isAuthor && (
                <p className="mt-4 text-sm text-gray-600 italic">
                  Purchase this idea to see the full description
                </p>
              )}
            </div>

            {/* Purchase Card */}
            <div className="bg-gray-50 rounded-lg p-6 h-fit">
              <p className="text-5xl font-bold text-orange-500 mb-6">
                ${idea.price}
              </p>

              {isPurchased || isAuthor ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <p className="text-green-800 font-medium">
                    ✓ Purchased
                  </p>
                </div>
              ) : (
                <button
                  onClick={handlePurchase}
                  className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition flex items-center justify-center gap-2 mb-4"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Buy Now
                </button>
              )}

              {/* Stats */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">{idea.views} views</span>
                </div>
                {avgRating && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm">
                      {avgRating} ({idea.ratings.length} reviews)
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-sm">{idea.purchasedBy.length} purchased</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Reviews ({idea.ratings.length})
            </h2>

            {/* Add Review Form */}
            {isPurchased && !isAuthor && (
              <form onSubmit={handleAddRating} className="bg-gray-50 rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">Leave a Review</h3>

                {/* Rating */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRating(r)}
                        className={`p-2 transition ${
                          rating >= r
                            ? 'text-yellow-400'
                            : 'text-gray-300 hover:text-yellow-300'
                        }`}
                      >
                        <Star className="w-6 h-6 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comment (optional)
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts about this idea..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={rating === 0}
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Review
                </button>
              </form>
            )}

            {/* Reviews List */}
            <div className="space-y-6">
              {idea.ratings.length > 0 ? (
                idea.ratings.map((review) => (
                  <div
                    key={review.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {review.userName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((r) => (
                          <Star
                            key={r}
                            className={`w-4 h-4 ${
                              r <= review.rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-gray-700">{review.comment}</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-600">
                  No reviews yet. {isPurchased && 'Be the first to review!'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
