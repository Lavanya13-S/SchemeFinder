import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ChevronDown, ChevronUp, Building, 
  Users, FileText, CheckCircle, AlertCircle, Heart 
} from 'lucide-react';
import { schemes } from '../data/schemes';

interface Scheme {
  scheme_id?: number;
  title: string;
  classified_state: string;
  ministry?: string;
  details?: string;
  benefits?: string;
  eligibility?: string;
  application_process?: string;
  documents_required?: string;
  exclusions?: string;
  filter_scheme_category?: string;
  filter_benefit_type?: string;
  filter_gender?: string;
  filter_caste?: string;
  filter_residence?: string;
  filter_marital_status?: string;
  filter_employment_status?: string;
  filter_occupation?: string;
  filter_special_categories?: string | string[];
  filter_disability_percentage?: string;
  age_tags?: string[];
  sources_and_references?: string;
  faq?: FAQ[];
}

interface FAQ {
  question: string;
  answer: string;
  isOpen?: boolean;
}

export default function SchemeDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Find scheme by scheme_id
  const scheme: Scheme | undefined = schemes.find(s => s.scheme_id?.toString() === id);

  // Add this to your component's state
  const [openFAQs, setOpenFAQs] = useState<Set<number>>(new Set());

  // Add this function to toggle FAQs
  const toggleFAQ = (index: number) => {
    const newOpenFAQs = new Set(openFAQs);
    if (newOpenFAQs.has(index)) {
      newOpenFAQs.delete(index);
    } else {
      newOpenFAQs.add(index);
    }
    setOpenFAQs(newOpenFAQs);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!scheme) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Scheme Not Found</h1>
          <p className="text-gray-600 mb-4">The scheme you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/schemes')}
            className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to All Schemes
          </button>
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

  // Update the formatToPoints function
  const formatToPoints = (text: string) => {
    if (!text) return [];
    
    // First, fix any split letters/numbers (like A2P -> AAP)
    const fixedText = text.replace(/(\w)(\d+)(\w)/g, '$1$1$3');
    
    // Split by periods and clean up
    const points = fixedText
      .split('.')
      .map(point => point.trim())
      .filter(point => point.length > 0)
      // Remove any leading numbers or bullets
      .map(point => point.replace(/^\d+[\.\)]|\•|\-/, '').trim())
      // Remove any empty points
      .filter(point => point.length > 0);
    
    return points;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={handleBackClick}
            className="inline-flex items-center text-green-600 hover:text-green-700 font-medium mb-4"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Schemes
          </button>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              {/* Badges */}
              <div className="flex gap-3 mb-4 flex-wrap">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-100 to-blue-50 
                  text-blue-700 animate-gradient hover:shadow-md transition-shadow ${
                  scheme.classified_state === 'Central/National' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-purple-100 text-purple-700'
                }`}>
                  {scheme.classified_state === 'Central/National' ? 'Central Scheme' : `${scheme.classified_state} State Scheme`}
                </span>
                {scheme.filter_scheme_category && (
                  <span className="px-4 py-2 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                    {scheme.filter_scheme_category}
                  </span>
                )}
                {scheme.filter_benefit_type && (
                  <span className="px-4 py-2 rounded-full text-sm font-semibold bg-orange-100 text-orange-700">
                    {scheme.filter_benefit_type}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{scheme.title}</h1>
              
              {/* Ministry */}
              {scheme.ministry && scheme.ministry !== 'Not Available' && (
                <div className="flex items-center gap-2 mb-6">
                  <Building className="text-gray-400" size={20} />
                  <span className="text-lg text-gray-600 font-medium">{scheme.ministry}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 flex-wrap">
                <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold rounded-lg 
                  hover:from-green-700 hover:to-green-600 transition-all duration-200 shadow-lg 
                  hover:shadow-green-200 transform hover:-translate-y-0.5">
                  Check Eligibility
                </button>
                <button className="inline-flex items-center px-6 py-3 border-2 border-green-600 text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-colors">
                  <Heart className="mr-2" size={18} />
                  Save Scheme
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8"> {/* Changed from grid to single column */}
          {/* Description */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Description</h2>
            <div className="prose max-w-none">
              <div className="text-gray-700 leading-relaxed text-lg">
                {scheme.details ? (
                  <div dangerouslySetInnerHTML={{ __html: scheme.details.replace(/\n/g, '<br />') }} />
                ) : (
                  <p>No detailed description available for this scheme.</p>
                )}
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <FileText className="mr-3 text-green-600" size={24} />
              Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8"> {/* Updated grid layout */}
              {scheme.filter_scheme_category && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Scheme Category</h3>
                  <p className="text-gray-700">{scheme.filter_scheme_category}</p>
                </div>
              )}
              {scheme.filter_benefit_type && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Benefit Type</h3>
                  <p className="text-gray-700">{scheme.filter_benefit_type}</p>
                </div>
              )}
              {scheme.ministry && scheme.ministry !== 'Not Available' && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Ministry</h3>
                  <p className="text-gray-700">{scheme.ministry}</p>
                </div>
              )}
            </div>
          </div>

          {/* Benefits */}
          {scheme.benefits && scheme.benefits !== 'Not Available' && (
            <div className="bg-gradient-to-br from-green-50 to-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <CheckCircle className="mr-3 text-green-600" size={24} />
                Benefits
              </h2>
              <div className="prose max-w-none">
                <div className="text-gray-700 leading-relaxed text-lg">
                  <div dangerouslySetInnerHTML={{ __html: scheme.benefits.replace(/\n/g, '<br />') }} />
                </div>
              </div>
            </div>
          )}

          {/* Eligibility */}
          {scheme.eligibility && scheme.eligibility !== 'Not Available' && (
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Users className="mr-3 text-blue-600" size={24} />
                Eligibility
              </h2>
              <div className="prose max-w-none">
                <div className="text-gray-700 leading-relaxed text-lg">
                  <div dangerouslySetInnerHTML={{ __html: scheme.eligibility.replace(/\n/g, '<br />') }} />
                </div>
              </div>
            </div>
          )}

          {/* Application Process */}
          {scheme.application_process && scheme.application_process !== 'Not Available' && (
            <div className="bg-gradient-to-br from-purple-50 to-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <AlertCircle className="mr-3 text-purple-600" size={24} />
                Application Process
              </h2>
              <ol className="space-y-4">
                {formatToPoints(scheme.application_process).map((step, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-semibold">{index + 1}</span>
                    </div>
                    <span className="text-gray-700 leading-relaxed text-lg pt-1">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Documents Required */}
          {scheme.documents_required && scheme.documents_required !== 'Not Available' && (
            <div className="bg-gradient-to-br from-orange-50 to-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FileText className="mr-3 text-orange-600" size={24} />
                Documents Required
              </h2>
              <ul className="space-y-4">
                {formatToPoints(scheme.documents_required).map((doc, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 mt-1 bg-orange-100 rounded-full flex items-center justify-center">
                      <svg 
                        className="w-4 h-4 text-orange-600" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M5 13l4 4L19 7" 
                        />
                      </svg>
                    </div>
                    <span className="text-gray-700 leading-relaxed text-lg">{doc}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Frequently Asked Questions */}
          {scheme.faq && Array.isArray(scheme.faq) && scheme.faq.length > 0 && (
            <div className="bg-gradient-to-br from-emerald-50 to-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FileText className="mr-3 text-emerald-600" size={24} />
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {scheme.faq.map((item, index) => (
                  <div 
                    key={index} 
                    className="border border-emerald-100 rounded-lg overflow-hidden bg-white"
                  >
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-emerald-50 transition-colors"
                    >
                      <h3 className="font-semibold text-gray-800 text-lg">{item.question}</h3>
                      {openFAQs.has(index) ? (
                        <ChevronUp className="text-emerald-500" size={20} />
                      ) : (
                        <ChevronDown className="text-emerald-500" size={20} />
                      )}
                    </button>
                    {openFAQs.has(index) && (
                      <div className="px-6 py-4 border-t border-emerald-100 bg-white">
                        <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Exclusions */}
          {scheme.exclusions && scheme.exclusions !== 'Not Available' && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <AlertCircle className="mr-3 text-red-600" size={24} />
                Exclusions
              </h2>
              <div className="prose max-w-none">
                <div className="text-gray-700 leading-relaxed text-lg">
                  <div dangerouslySetInnerHTML={{ __html: scheme.exclusions.replace(/\n/g, '<br />') }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
