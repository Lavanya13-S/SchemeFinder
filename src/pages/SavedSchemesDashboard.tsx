import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSavedSchemes } from '../contexts/SavedSchemesContext';
import { Heart, ArrowRight, LogIn, MapPin, Calendar, Users } from 'lucide-react';
import { useState } from 'react';

// Custom card component for saved schemes dashboard
const SavedSchemeCard = ({ scheme }: { scheme: any }) => {
  const location = useLocation();
  const { removeSavedScheme } = useSavedSchemes();
  const [savingState, setSavingState] = useState<'idle' | 'loading' | 'success'>('idle');

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const truncateLines = (text: string, maxLines: number) => {
    const lines = text.split('\n').slice(0, maxLines);
    const truncated = lines.join('\n');
    return truncated.length > 300 ? truncated.substring(0, 300) + '...' : truncated;
  };

  const handleRemoveScheme = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setSavingState('loading');
      await removeSavedScheme(scheme.scheme_id);
      setSavingState('success');
      setTimeout(() => setSavingState('idle'), 1500);
    } catch (error) {
      console.error('Error removing scheme:', error);
      setSavingState('idle');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-4 md:p-6">
        {/* Badges */}
        <div className="flex gap-2 mb-3 flex-wrap">
          <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-semibold ${
            scheme.classified_state === 'Central/National' 
              ? 'bg-blue-100 text-blue-700' 
              : 'bg-purple-100 text-purple-700'
          }`}>
            {scheme.classified_state === 'Central/National' ? 'Central' : scheme.classified_state}
          </span>
          {scheme.filter_benefit_type && (
            <span className="px-2 md:px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
              {scheme.filter_benefit_type}
            </span>
          )}
        </div>

        {/* Title */}
        <Link 
          to={`/scheme/${scheme.scheme_id}`} 
          state={{ from: location.pathname + location.search }}
          className="block mb-3 touch-manipulation"
        >
          <h3 className="text-lg md:text-xl font-bold text-gray-900 hover:text-green-600 transition-colors line-clamp-2">
            {truncateText(scheme.title, 80)}
          </h3>
        </Link>

        {/* Description - Max 8 lines */}
        <p className="text-sm md:text-base text-gray-600 mb-4 leading-relaxed whitespace-pre-wrap">
          {scheme.details 
            ? truncateLines(scheme.details.replace(/\n/g, ' '), 8)
            : 'No description available.'
          }
        </p>

        {/* Quick Info */}
        <div className="space-y-2 mb-4">
          {scheme.ministry && scheme.ministry !== 'Not Available' && (
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-gray-400" />
              <span className="text-sm text-gray-600">{truncateText(scheme.ministry, 50)}</span>
            </div>
          )}
          
          {scheme.age_tags && scheme.age_tags.length > 0 && (
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-400" />
              <span className="text-sm text-gray-600">Ages: {scheme.age_tags.slice(0, 2).join(', ')}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Users size={16} className="text-gray-400" />
            <span className="text-sm text-gray-600">
              {[
                scheme.filter_gender !== 'All' ? scheme.filter_gender : null,
                scheme.filter_caste !== 'All' ? scheme.filter_caste : null
              ].filter(Boolean).join(', ') || 'General Public'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100 relative">
          <Link 
            to={`/scheme/${scheme.scheme_id}`}
            state={{ from: location.pathname + location.search }}
            className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            View Details
          </Link>
          <div className="relative">
            <button
              onClick={handleRemoveScheme}
              disabled={savingState === 'loading'}
              className={`p-2 transition-colors text-red-500 ${savingState === 'loading' ? 'opacity-50 cursor-not-allowed' : ''}`}
              title="Remove from saved"
            >
              <Heart
                size={20}
                fill="currentColor"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function SavedSchemesDashboard() {
  const { user, loading: authLoading } = useAuth();
  const { savedSchemes, loading: schemesLoading } = useSavedSchemes();

  if (authLoading || schemesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <LogIn size={48} className="mx-auto mb-4 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Sign In to View Saved Schemes</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Create an account or sign in to save your favorite schemes and access them anytime.
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              Go to Home
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="text-red-500" size={32} fill="currentColor" />
            <h1 className="text-3xl font-bold text-gray-900">My Saved Schemes</h1>
          </div>
          <p className="text-gray-600">
            {savedSchemes.length === 0 ? 'No saved schemes yet' : `${savedSchemes.length} scheme${savedSchemes.length !== 1 ? 's' : ''} saved`}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {savedSchemes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <Heart size={48} className="mx-auto mb-4 text-gray-300" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Saved Schemes Yet</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start exploring schemes and click the save button to add them to your dashboard.
            </p>
            <Link
              to="/schemes"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              Explore Schemes
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedSchemes.map((scheme) => (
              <SavedSchemeCard key={scheme.scheme_id} scheme={scheme as any} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}