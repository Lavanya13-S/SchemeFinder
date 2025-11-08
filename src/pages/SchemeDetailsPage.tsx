import { useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Building, MapPin, Users, Calendar } from 'lucide-react';
import { schemes } from '../data/schemes';

export default function SchemeDetailsPage() {
  const { id } = useParams();
  const location = useLocation();
  const from = location.state?.from || '/schemes';
  
  const scheme = schemes.find(s => s.id === id || s.scheme_id?.toString() === id);

  if (!scheme) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Scheme Not Found</h1>
          <Link
            to="/schemes"
            className="text-green-600 hover:text-green-700 font-medium"
          >
            ← Back to All Schemes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to={from}
            className="inline-flex items-center text-green-600 hover:text-green-700 font-medium mb-4"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Results
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Scheme Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  scheme.classified_state === 'All States' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                }`}>
                  {scheme.classified_state === 'All States' ? 'Central Scheme' : 'State Scheme'}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                  {scheme.filter_scheme_category}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{scheme.title}</h1>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-center gap-3">
              <Building className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-500">Ministry</p>
                <p className="font-medium text-gray-900">
                  {scheme.ministry || 'Not Available'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <MapPin className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-500">State/UT</p>
                <p className="font-medium text-gray-900">{scheme.classified_state}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Users className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-500">Target Beneficiary</p>
                <p className="font-medium text-gray-900">
                  {[
                    scheme.filter_gender !== 'All' ? scheme.filter_gender : null,
                    scheme.filter_caste !== 'All' ? scheme.filter_caste : null,
                    scheme.filter_residence !== 'All' ? scheme.filter_residence : null
                  ].filter(Boolean).join(', ') || 'General Public'}
                </p>
              </div>
            </div>

            {scheme.age_tags && scheme.age_tags.length > 0 && (
              <div className="flex items-center gap-3">
                <Calendar className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Age Group</p>
                  <p className="font-medium text-gray-900">{scheme.age_tags.slice(0, 3).join(', ')}</p>
                </div>
              </div>
            )}
          </div>

          {/* Apply Button */}
          <div className="flex gap-4">
            {scheme.url && (
              <a
                href={scheme.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
              >
                Apply Online
                <ExternalLink className="ml-2" size={18} />
              </a>
            )}
            <button className="px-6 py-3 border-2 border-green-600 text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-colors">
              Save Scheme
            </button>
          </div>
        </div>

        {/* Scheme Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Scheme Description</h2>
              <p className="text-gray-700 leading-relaxed">{scheme.details}</p>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Benefits</h2>
              <div className="text-gray-700 leading-relaxed">
                {scheme.benefits}
              </div>
            </div>

            {/* Eligibility Criteria */}
            {scheme.eligibility && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Eligibility Criteria</h2>
                <div className="text-gray-700 leading-relaxed">
                  {scheme.eligibility}
                </div>
              </div>
            )}

            {/* Application Process */}
            {scheme.application_process && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Application Process</h2>
                <div className="text-gray-700 leading-relaxed">
                  {scheme.application_process}
                </div>
              </div>
            )}

            {/* Documents Required */}
            {scheme.documents_required && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Documents Required</h2>
                <div className="text-gray-700 leading-relaxed">
                  {scheme.documents_required}
                </div>
              </div>
            )}

            {/* Exclusions */}
            {scheme.exclusions && scheme.exclusions !== 'Not Available' && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Exclusions</h2>
                <div className="text-gray-700 leading-relaxed">
                  {scheme.exclusions}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Facts */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Facts</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Scheme Type</p>
                  <p className="font-medium text-gray-900">{scheme.filter_benefit_type}</p>
                </div>
                
                {scheme.filter_employment_status !== 'All' && (
                  <div>
                    <p className="text-sm text-gray-500">Employment Status</p>
                    <p className="font-medium text-gray-900">{scheme.filter_employment_status}</p>
                  </div>
                )}

                {scheme.filter_marital_status !== 'All' && (
                  <div>
                    <p className="text-sm text-gray-500">Marital Status</p>
                    <p className="font-medium text-gray-900">{scheme.filter_marital_status}</p>
                  </div>
                )}

                {scheme.filter_occupation !== 'No' && (
                  <div>
                    <p className="text-sm text-gray-500">Occupation</p>
                    <p className="font-medium text-gray-900">{scheme.filter_occupation}</p>
                  </div>
                )}

                {scheme.filter_disability_percentage !== 'No Disability Requirement' && (
                  <div>
                    <p className="text-sm text-gray-500">Disability Requirement</p>
                    <p className="font-medium text-gray-900">{scheme.filter_disability_percentage}</p>
                  </div>
                )}

                {scheme.filter_special_categories !== 'None' && (
                  <div>
                    <p className="text-sm text-gray-500">Special Categories</p>
                    <p className="font-medium text-gray-900">
                      {Array.isArray(scheme.filter_special_categories) 
                        ? scheme.filter_special_categories.join(', ')
                        : scheme.filter_special_categories
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Need Help?</h3>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  For detailed information and application assistance, visit the official scheme portal.
                </p>
                {scheme.url && (
                  <a
                    href={scheme.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
                  >
                    Official Website
                    <ExternalLink className="ml-1" size={16} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}