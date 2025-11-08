import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, Calendar, Users, Heart } from 'lucide-react';

interface Scheme {
  id?: string;
  scheme_id?: number;
  title: string;
  details: string;
  benefits: string;
  filter_scheme_category: string;
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
}

interface SchemeCardProps {
  scheme: Scheme;
}

const SchemeCard: React.FC<SchemeCardProps> = ({ scheme }) => {
  const location = useLocation();

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        {/* Badges */}
        <div className="flex gap-2 mb-3 flex-wrap">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            scheme.classified_state === 'Central/National' 
              ? 'bg-blue-100 text-blue-700' 
              : 'bg-purple-100 text-purple-700'
          }`}>
            {scheme.classified_state === 'Central/National' ? 'Central' : scheme.classified_state}
          </span>
          {scheme.filter_benefit_type && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
              {scheme.filter_benefit_type}
            </span>
          )}
        </div>

        {/* Title */}
        <Link 
          to={`/scheme/${scheme.scheme_id}`} 
          state={{ from: location.pathname + location.search }}
          className="block mb-3"
        >
          <h3 className="text-xl font-bold text-gray-900 hover:text-green-600 transition-colors">
            {truncateText(scheme.title, 80)}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-gray-600 mb-4 leading-relaxed">
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
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <Link 
            to={`/scheme/${scheme.scheme_id}`}
            state={{ from: location.pathname + location.search }}
            className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            View Details
          </Link>
          <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
            <Heart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SchemeCard;