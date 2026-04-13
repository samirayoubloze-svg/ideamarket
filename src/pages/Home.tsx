import { Link } from 'react-router-dom';
import { Lightbulb, TrendingUp, Users, Zap } from 'lucide-react';
import { useIdeaStore } from '../store/ideaStore';
import IdeaCard from '../components/IdeaCard';

export default function Home() {
  const ideas = useIdeaStore((state) => state.ideas);
  const featuredIdeas = ideas.filter((idea) => idea.isFeatured).slice(0, 3);
  const trendingIdeas = ideas.sort((a, b) => b.views - a.views).slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Your Ideas Have Value
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Buy and sell innovative ideas on the world's leading idea marketplace
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/explore"
                className="bg-white text-orange-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
              >
                Browse Ideas
              </Link>
              <Link
                to="/register"
                className="border-2 border-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-orange-600 transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          How It Works
        </h2>
        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Share Your Idea</h3>
            <p className="text-gray-600">
              Post your innovative idea with detailed description and pricing
            </p>
          </div>

          <div className="text-center">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Find Buyers</h3>
            <p className="text-gray-600">
              Connect with people interested in your ideas
            </p>
          </div>

          <div className="text-center">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Get Feedback</h3>
            <p className="text-gray-600">
              Receive ratings, comments, and improve your ideas
            </p>
          </div>

          <div className="text-center">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Earn Money</h3>
            <p className="text-gray-600">
              Get paid for your ideas and scale your income
            </p>
          </div>
        </div>
      </section>

      {/* Featured Ideas */}
      {featuredIdeas.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-4">Featured Ideas</h2>
            <p className="text-gray-600 mb-8">
              Curated ideas from our top creators
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {featuredIdeas.map((idea) => (
                <IdeaCard key={idea.id} idea={idea} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trending Ideas */}
      {trendingIdeas.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold mb-4">Trending Now</h2>
          <p className="text-gray-600 mb-8">
            Most viewed ideas this week
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {trendingIdeas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/explore"
              className="inline-block bg-orange-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-600 transition"
            >
              View All Ideas
            </Link>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-orange-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Share Your Ideas?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of creators earning from their ideas. Sign up today and start building your passive income stream.
          </p>
          <Link
            to="/register"
            className="inline-block bg-orange-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-600 transition"
          >
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
}
