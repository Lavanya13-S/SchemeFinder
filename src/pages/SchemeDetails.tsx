import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Users, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { schemes } from '../data/schemes';
import { useEffect, useState } from 'react';

const occupationOptions = [
  'No',
  'Ex Servicemen',
  'Safai Karamchari', 
  'Health Worker',
  'Street Vendor',
  'Unorganized Worker',
  'Organized Worker',
  'Construction Worker',
  'Artist',
  'Sportsperson',
  'Journalist',
  'Tea and Ex-Tea Garden tribes',
  'Coir Worker',
  'Khadi Artisan',
  'Farmer',
  'Fishermen',
  'Artisans, Spinners & Weavers',
  'Teacher / Faculty'
];

export default function SchemeDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Find scheme by scheme_id or id
  const scheme = schemes.find(s => 
    s.scheme_id?.toString() === id || 
    (s as any).id?.toString() === id
  );
  
  const [selectedOccupation, setSelectedOccupation] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!scheme) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Scheme not found</h1>
          <Link 
            to="/schemes"
            className="text-green-600 hover:text-green-700 font-medium"
          >
            Back to all schemes
          </Link>
        </div>
      </div>
    );
  }

  const handleBackClick = () => {
    if (location.state?.from) {
      navigate(location.state.from);
    } else {
      navigate('/schemes');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={handleBackClick}
            className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium mb-4"
          >
            <ArrowLeft size={20} />
            Back to schemes
          </button>
          
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex gap-2 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  scheme.classified_state === 'Central' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-purple-100 text-purple-700'
                }`}>
                  {scheme.classified_state === 'Central' ? 'Central' : 'State'}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                  {scheme.filter_scheme_category}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{scheme.title}</h1>
              <p className="text-lg text-gray-600 mb-4">
                {scheme.details ? scheme.details.substring(0, 200) + '...' : 'No description available'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8">
          {/* Quick Info Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MapPin className="text-blue-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Coverage</p>
                  <p className="font-semibold">{scheme.classified_state}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="text-green-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Target Group</p>
                  <p className="font-semibold">
                    {scheme.filter_gender !== 'All' ? scheme.filter_gender : 'All Citizens'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar className="text-purple-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-semibold text-green-600">Active</p>
                </div>
              </div>
            </div>
          </div>

          {/* Overview */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FileText size={20} />
              Overview
            </h2>
            <div className="prose max-w-none">
              <p className="text-gray-700">{scheme.details}</p>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <CheckCircle size={20} />
              Key Benefits
            </h2>
            <div className="text-gray-700">
              {scheme.benefits}
            </div>
          </div>

          {/* Eligibility Criteria */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Users size={20} />
              Eligibility Criteria
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {scheme.age_tags && scheme.age_tags.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Age Requirements</h3>
                  <p className="text-gray-700">{scheme.age_tags.join(', ')}</p>
                </div>
              )}

              {scheme.filter_gender && scheme.filter_gender !== 'All' && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Gender</h3>
                  <p className="text-gray-700">{scheme.filter_gender}</p>
                </div>
              )}

              {scheme.filter_caste && scheme.filter_caste !== 'All' && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Caste Category</h3>
                  <p className="text-gray-700">{scheme.filter_caste}</p>
                </div>
              )}

              {scheme.filter_residence && scheme.filter_residence !== 'All' && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Area Type</h3>
                  <p className="text-gray-700">{scheme.filter_residence}</p>
                </div>
              )}

              {scheme.filter_occupation && scheme.filter_occupation !== 'No' && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Occupation</h3>
                  <p className="text-gray-700">{scheme.filter_occupation}</p>
                </div>
              )}

              {scheme.filter_employment_status && scheme.filter_employment_status !== 'All' && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Employment Status</h3>
                  <p className="text-gray-700">{scheme.filter_employment_status}</p>
                </div>
              )}

              {scheme.filter_marital_status && scheme.filter_marital_status !== 'All' && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Marital Status</h3>
                  <p className="text-gray-700">{scheme.filter_marital_status}</p>
                </div>
              )}

              {scheme.filter_disability_percentage && scheme.filter_disability_percentage !== 'No Disability Requirement' && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Disability Requirement</h3>
                  <p className="text-gray-700">{scheme.filter_disability_percentage}</p>
                </div>
              )}
            </div>
          </div>

          {/* Full Eligibility */}
          {scheme.eligibility && scheme.eligibility !== 'Not Available' && (
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <AlertCircle size={20} />
                Detailed Eligibility
              </h2>
              <div className="text-gray-700">{scheme.eligibility}</div>
            </div>
          )}

          {/* Documents Required */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FileText size={20} />
              Documents Required
            </h2>
            <div className="text-gray-700">
              {scheme.documents_required || 'No specific documents listed'}
            </div>
          </div>

          {/* Application Process */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <AlertCircle size={20} />
              How to Apply
            </h2>
            <div className="text-gray-700">
              {scheme.application_process || 'Application process not specified'}
            </div>
          </div>

          {/* Exclusions */}
          {scheme.exclusions && scheme.exclusions !== 'Not Available' && (
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <AlertCircle size={20} />
                Exclusions
              </h2>
              <div className="text-gray-700">{scheme.exclusions}</div>
            </div>
          )}

          {/* FAQ Section */}
          {scheme.faq && Array.isArray(scheme.faq) && scheme.faq.length > 0 && (
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FileText size={20} />
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {scheme.faq.map((item, index) => (
                  <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <h3 className="font-semibold text-gray-800 mb-2">{item.question}</h3>
                    <p className="text-gray-700">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ministry Information */}
          <div className="bg-gray-100 rounded-lg p-6">
            <h3 className="font-semibold text-gray-800 mb-2">Implementing Ministry</h3>
            <p className="text-gray-700">{scheme.ministry || 'Not Available'}</p>
          </div>

          {/* Occupation Selection */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Users size={20} />
              Select Your Occupation
            </h2>
            <div className="mb-4">
              <select
                className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500 focus:outline-none"
                value={selectedOccupation}
                onChange={e => setSelectedOccupation(e.target.value)}
              >
                <option value="">Select Occupation</option>
                {occupationOptions.map(occ => (
                  <option key={occ} value={occ}>{occ}</option>
                ))}
              </select>
            </div>
            {selectedOccupation && (
              <div className="text-green-700 font-semibold">
                Selected Occupation: {selectedOccupation}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}