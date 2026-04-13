import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useIdeaStore, Idea } from '../store/ideaStore';
import { useAuthStore } from '../store/XStore';
import { ArrowLeft } from 'lucide-react';

export default function AddIdea() {
  const navigate = useNavigate();
  const addIdea = useIdeaStore((state) => state.addIdea);
  const user = useAuthStore((state) => state.user);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Startup',
    price: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ['Startup', 'Business', 'Content', 'Marketing', 'Tech'];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 50) {
      newErrors.description = 'Description must be at least 50 characters';
    }

    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const newIdea: Idea = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: Number(formData.price),
        author: {
          id: user!.id,
          name: user!.name,
          avatar: user!.avatar,
        },
        createdAt: new Date().toISOString(),
        purchasedBy: [],
        ratings: [],
        views: 0,
      };

      addIdea(newIdea);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      setErrors({ submit: 'Failed to create idea. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-orange-500 mb-8 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Post a New Idea</h1>
          <p className="text-gray-600 mb-8">
            Share your innovative idea with the community and start earning
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Idea Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="E.g., AI-Powered Personal Finance App"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Price (USD) *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-2 text-gray-500 font-medium">$</span>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="49"
                  min="1"
                  step="0.01"
                  className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price}</p>
              )}
              <p className="text-gray-500 text-sm mt-1">
                Pricing guideline: $19-99 for most ideas
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your idea in detail. Include the problem it solves, target audience, and key features..."
                rows={8}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-vertical ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <div className="flex justify-between items-center mt-2">
                {errors.description && (
                  <p className="text-red-500 text-sm">{errors.description}</p>
                )}
                <p className="text-gray-500 text-sm">
                  {formData.description.length} characters
                </p>
              </div>
            </div>

            {/* Error Message */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Publishing...' : 'Publish Idea'}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>

          {/* Tips */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">Tips for Success</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>✓ Be clear and concise with your title</li>
              <li>✓ Provide detailed description with problem, solution, and benefits</li>
              <li>✓ Price competitively - research similar ideas</li>
              <li>✓ Use specific examples and proof points when possible</li>
              <li>✓ Target a specific audience for best results</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
