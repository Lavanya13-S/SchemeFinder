import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, Calendar, Users, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSavedSchemes } from '../contexts/SavedSchemesContext';

interface Scheme {
  id?: string;
  scheme_id: string;
  title: string;
  details: string;
  benefits: string;
  filter_scheme_category: string[];
  classified_state: string;
  filter_gender: string;
  filter_caste: string;
  filter_residence: string;
  filter_benefit_type: string;
  filter_marital_status: string;
  filter_employment_status: string;
  filter_occupation: string;
  filter_special_categories: string | string[];
  filter_disability_percentage: string;
  age_tags?: string[];
  applicationUrl?: string;
  url?: string;
  isCentral?: boolean;
  ministry?: string;
  scheme_level?: string;
  implementation_type?: string;
}

interface SchemeCardProps {
  scheme: Scheme;
}

const SchemeCard: React.FC<SchemeCardProps> = ({ scheme }) => {
  const location = useLocation();
  const { user } = useAuth();
  const { isSchemeSaved, addSavedScheme, removeSavedScheme } = useSavedSchemes();
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);
  const [savingState, setSavingState] = useState<'idle' | 'loading' | 'success'>('idle');

  const isSaved = isSchemeSaved(scheme.scheme_id);

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handleSaveScheme = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      setShowSignInPrompt(true);
      setTimeout(() => setShowSignInPrompt(false), 3000);
      return;
    }

    try {
      setSavingState('loading');
      if (isSaved) {
        await removeSavedScheme(scheme.scheme_id);
        console.log('Scheme removed from card');
      } else {
        await addSavedScheme(scheme);
        console.log('Scheme added from card');
      }
      setSavingState('success');
      setTimeout(() => setSavingState('idle'), 1500);
    } catch (error) {
      console.error('Error saving/removing scheme:', error);
      setSavingState('idle');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-4 md:p-6">
        {/* Badges */}
        <div className="flex gap-2 mb-3 flex-wrap">
          <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-semibold ${
            scheme.classified_state === 'Central' 
              ? 'bg-blue-100 text-blue-700' 
              : 'bg-purple-100 text-purple-700'
          }`}>
            {scheme.classified_state === 'Central' ? 'Central' : scheme.classified_state}
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

        {/* Description */}
        <p className="text-sm md:text-base text-gray-600 mb-4 leading-relaxed line-clamp-3">
          {scheme.details 
            ? truncateText(scheme.details.replace(/\n/g, ' '), 150)
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
              onClick={handleSaveScheme}
              disabled={savingState === 'loading'}
              className={`p-2 transition-colors ${
                isSaved ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
              } ${savingState === 'loading' ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={isSaved ? 'Remove from saved' : 'Save scheme'}
            >
              <Heart
                size={20}
                fill={isSaved ? 'currentColor' : 'none'}
              />
            </button>
            {showSignInPrompt && (
              <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-20 whitespace-nowrap text-sm">
                <p className="text-gray-900 font-medium">Sign in to save schemes</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemeCard;