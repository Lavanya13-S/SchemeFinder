import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building, ArrowRight } from 'lucide-react';
import { schemes } from '../data/schemes';

export default function MinistriesPage() {
  const navigate = useNavigate();

  const handleMinistryClick = (ministry: string) => {
    navigate(`/schemes?ministry=${encodeURIComponent(ministry)}`);
  };

  // More strict filter for ministries
  const isValidMinistry = (ministryName: string) => {
    const normalizedName = ministryName.trim();
    
    // Exclude obvious scheme descriptions and very long text
    const excludePatterns = [
      /Scholarship-Free Education/i,
      /Stationary-Text Books/i,
      /welfare scheme that/i,
      /financial support to/i,
      /The objective of this scheme/i,
      /provides financial support/i,
      /cash award.*author/i,
      /subsidy.*provided/i,
      /Training by Department for/i,
      /Stipend Scheme \(/i,
      /Braille Watches by/i,
      /Book Binder Training/i,
      /Educational Assistance for Government/i,
      /@ \d+%/i,  // @ 25% etc
      /\d+th Std/i,  // 12th Std etc
      /Fellowship.*awarded/i,
      /Government of [A-Z][a-z]/i,  // Government of specific states
      /for the educational upliftment/i,
      /aims to promote/i,
      /personality development/i,
      /observation skills/i,
      /through funding/i,
      /educational tours/i,
      /Empowerment for the/i,
      /Govt\. of India\./i,
      /and Co-operation\./i
    ];

    // Check if it matches exclude patterns (scheme descriptions)
    const hasExcludePattern = excludePatterns.some(pattern => pattern.test(normalizedName));
    if (hasExcludePattern) return false;

    // Exclude if too long (likely scheme descriptions)
    if (normalizedName.length > 200) return false;

    // Exclude entries that are just fragments or incomplete
    if (normalizedName.length < 10) return false;

    // Exclude entries ending with periods (likely scheme descriptions)
    if (normalizedName.endsWith('.')) return false;

    // Exclude entries with generic department names that are too vague
    const vagueDepartments = [
      /^Department of Social Justice\.?$/i,
      /^Department of Education\.?$/i,
      /^Department of Agriculture\.?$/i,
      /^Department of Govt\. of India\.?$/i,
      /^Department of Agriculture and Co-operation\.?$/i,
      /^Empowerment for the/i
    ];

    const isVagueDepartment = vagueDepartments.some(pattern => pattern.test(normalizedName));
    if (isVagueDepartment) return false;

    // Include known central government entities
    const validCentralEntities = [
      /^Ministry [Oo]f/i,
      /^Ministry [Oo]F/i,
      /^Comptroller And Auditor General/i,
      /^NITI Aayog/i,
      /^The Lokpal of India/i,
      /^Cabinet Secretariat/i,
      /^Prime Minister/i,
      /^Department of Atomic Energy/i,
      /^Department of Space/i,
      /^National/i,
      /^Central/i
    ];

    // Check if it matches valid central entity patterns
    const hasValidPattern = validCentralEntities.some(pattern => pattern.test(normalizedName));
    if (hasValidPattern) return true;

    // For entries starting with "Department of", be very selective
    if (normalizedName.startsWith('Department of')) {
      // Must be a proper central department name (not too short, not ending in period)
      if (normalizedName.length < 25 || normalizedName.length > 150) return false;
      
      // Exclude state-specific departments and scheme descriptions
      const stateSpecificTerms = [
        'Government of', 'State of', 'Union Territory of',
        ', Government of', ', State of',
        'Puducherry', 'Goa', 'Karnataka', 'Arunachal Pradesh', 
        'Madhya Pradesh', 'Tripura', 'Sikkim', 'Haryana', 
        'Chhattisgarh', 'Uttar Pradesh', 'Andaman and Nicobar',
        'Tamil Nadu', 'Kerala', 'West Bengal', 'Odisha',
        'aims to', 'provides', 'for the', 'through', 'with the objective',
        'educational upliftment', 'personality development'
      ];
      
      const hasStateTerms = stateSpecificTerms.some(term => 
        normalizedName.toLowerCase().includes(term.toLowerCase())
      );
      
      return !hasStateTerms;
    }

    return false;
  };

  // Get unique ministries, filter them, and get their scheme counts
  const allMinistries = [...new Set(schemes.map(s => s.ministry))];
  const validMinistries = allMinistries.filter((ministry): ministry is string => ministry != null).filter(ministry => isValidMinistry(ministry));
  
  const ministries = validMinistries.map(ministry => ({
    name: ministry,
    count: schemes.filter(s => s.ministry === ministry).length,
    shortName: ministry.length > 60 ? ministry.substring(0, 57) + '...' : ministry
  })).sort((a, b) => b.count - a.count);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium mb-4"
          >
            <ArrowLeft size={20} />
            Back to Home
          </button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              All <span className="text-purple-600">Central Ministries</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore government schemes organized by their implementing central ministries and departments
            </p>
            <div className="mt-4">
              <span className="text-sm text-gray-500">
                Showing {ministries.length} central government ministries and departments
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Ministries Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {ministries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ministries.map((ministry, index) => (
              <button
                key={index}
                onClick={() => handleMinistryClick(ministry.name)}
                className="bg-gradient-to-br from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 rounded-xl p-6 border border-purple-200 hover:border-purple-300 hover:shadow-lg transition-all duration-200 text-left group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Building className="text-white" size={24} />
                  </div>
                  <ArrowRight className="text-gray-400 group-hover:text-purple-600 transition-colors" size={18} />
                </div>
                
                <h3 className="font-bold text-gray-900 mb-3 line-clamp-3 text-base leading-tight">
                  {ministry.name}
                </h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-purple-700">
                      {ministry.count}
                    </span>
                    <span className="text-sm text-gray-600 ml-2 font-medium">schemes</span>
                  </div>
                  <span className="text-xs bg-purple-600 text-white px-3 py-1 rounded-full font-semibold">Central</span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="text-center py-12">
            <Building className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Valid Ministries Found</h3>
            <p className="text-gray-600 mb-4">
              The data appears to contain mostly state-level departments rather than central government ministries.
            </p>
            <button
              onClick={() => navigate('/schemes')}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Browse All Schemes Instead
            </button>
          </div>
        )}
      </div>
    </div>
  );
}