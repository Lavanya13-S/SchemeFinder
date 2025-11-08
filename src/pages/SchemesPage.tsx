import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { schemes } from '../data/schemes';
import FilterSidebar from '../components/FilterSidebar';
import SchemeCard from '../components/SchemeCard';

const ITEMS_PER_PAGE = 20;

// Define filter interfaces
interface Filters {
  categories: string[];
  states: string[];
  gender: string[];
  caste: string[];
  residence: string[];
  benefitType: string[];
  maritalStatus: string[];
  employmentStatus: string[];
  occupation: string[];
  specialCategories: string[];
  disabilityPercentage: string[];
  ageGroup: string[];
  searchQuery: string;
  ministry: string[];
}

const initialFilters: Filters = {
  categories: [],
  states: [],
  gender: [],
  caste: [],
  residence: [],
  benefitType: [],
  maritalStatus: [],
  employmentStatus: [],
  occupation: [],
  specialCategories: [],
  disabilityPercentage: [],
  ageGroup: [],
  ministry: [],
  searchQuery: '',
};

// Add this function at the top of your component, before the state declarations
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default function SchemesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState(initialFilters);

  // Scroll to top when page loads or when category changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname, searchParams.get('category')]);

  // Initialize filters from URL params
  useEffect(() => {
    // Parse URL parameters
    const categoriesParam = searchParams.get('categories');
    let categories: string[] = [];
    
    if (categoriesParam) {
      // Handle encoded categories that might contain commas
      if (categoriesParam.includes('||')) {
        categories = categoriesParam.split('||').map(v => decodeURIComponent(v)).filter(Boolean);
      } else {
        // For single category with commas, check against known categories
        const validCategories = [
          'Science, IT & Communications',
          'Travel & Tourism',
          'Women and Child',
          'Business & Entrepreneurship',
          'Social welfare & Empowerment',
          'Public Safety,Law & Justice',
          'Transport & Infrastructure',
          'Banking,Financial Services and Insurance',
          'Housing & Shelter',
          'Sports & Culture',
          'Health & Wellness',
          'Utility & Sanitation',
          'Agriculture,Rural & Environment',
          'Skills & Employment',
          'Education & Learning'
        ];
        
        // Check if it's a complete match for any valid category
        if (validCategories.includes(categoriesParam)) {
          categories = [categoriesParam];
        } else {
          categories = categoriesParam.split(',').filter(v => validCategories.includes(v.trim())).map(v => v.trim());
        }
      }
    } else if (searchParams.get('category')) {
      categories = [searchParams.get('category')!];
    }
    
    const states = searchParams.get('states')?.split(',').filter(Boolean) || [];
    const gender = searchParams.get('gender')?.split(',').filter(Boolean) || [];
    
    // Simplified caste parsing - use exact values from your dataset
    const casteParam = searchParams.get('caste');
    let caste: string[] = [];
    if (casteParam) {
      if (casteParam.includes('||')) {
        // Handle encoded format
        caste = casteParam.split('||').map(v => decodeURIComponent(v)).filter(Boolean);
      } else {
        // Handle comma-separated format, but preserve full DNT name
        const validCasteValues = [
          'All',
          'Scheduled Caste (SC)',
          'Scheduled Tribe (ST)',
          'General',
          'Other Backward Class (OBC)',
          'De-Notified, Nomadic, and Semi-Nomadic (DNT) communities',
          'Particularly Vulnerable Tribal Group (PVTG)'
        ];
        
        // If the param contains the full DNT name, use it as is
        if (casteParam.includes('De-Notified, Nomadic, and Semi-Nomadic (DNT) communities')) {
          caste = ['De-Notified, Nomadic, and Semi-Nomadic (DNT) communities'];
        } else {
          // For other values, split by comma
          caste = casteParam.split(',').filter(v => validCasteValues.includes(v));
        }
      }
    }
    
    const residence = searchParams.get('residence')?.split(',').filter(Boolean) || [];
    const benefitType = searchParams.get('benefitType')?.split(',').filter(Boolean) || [];
    const maritalStatus = searchParams.get('maritalStatus')?.split(',').filter(Boolean) || [];
    const employmentStatus = searchParams.get('employmentStatus')?.split(',').filter(Boolean) || [];
    const occupation = searchParams.get('occupation')?.split(',').filter(Boolean) || [];
    const specialCategories = searchParams.get('specialCategories')?.split(',').filter(Boolean) || [];
    const disabilityPercentage = searchParams.get('disabilityPercentage')?.split(',').filter(Boolean) || [];
    const ageGroup = searchParams.get('ageGroup')?.split(',').filter(Boolean) || [];
    const searchQuery = searchParams.get('q') || '';
    const ministry = searchParams.get('ministry')?.split(',').filter(Boolean) || [];

    setFilters({
      categories,
      states,
      gender,
      caste,
      residence,
      benefitType,
      maritalStatus,
      employmentStatus,
      occupation,
      specialCategories,
      disabilityPercentage,
      ageGroup,
      searchQuery,
      ministry,
    });

    setCurrentPage(1);
  }, [searchParams]);

  // Update URL when filters change
  const handleFiltersChange = (newFilters: Partial<Filters>) => {
    console.log('handleFiltersChange called with:', newFilters);
    
    // IMPORTANT: Merge newFilters with existing filters
    const updatedFilters = {
      ...filters,
      ...newFilters
    };
    
    console.log('Updated filters:', updatedFilters);
    
    setFilters(updatedFilters);
    
    // Update URL params
    const params = new URLSearchParams();
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        if (key === 'categories' || key === 'caste') {
          const encodedValues = value.map(v => encodeURIComponent(v));
          params.set(key, encodedValues.join('||'));
        } else {
          params.set(key, value.join(','));
        }
      } else if (typeof value === 'string' && value) {
        params.set(key, value);
      }
    });
    
    setSearchParams(params);
    setCurrentPage(1);
  };

  // Update search when filters.searchQuery changes
  useEffect(() => {
    // Add your custom debounce logic here
  }, [filters.searchQuery]);

  // Filter schemes based on current filters
  const debouncedSearchQuery = useDebounce(filters.searchQuery, 300);

  const filteredSchemes = useMemo(() => {
    let filtered = schemes;

    console.log('Total schemes:', schemes.length);
    console.log('Current filters:', filters);
    console.log('Search query:', debouncedSearchQuery);

    // Search query filter - Use debounced search query
    if (debouncedSearchQuery && debouncedSearchQuery.trim().length > 0) {
      const query = debouncedSearchQuery.toLowerCase().trim();
      filtered = filtered.filter(scheme => {
        const searchableText = [
          scheme.title,
          scheme.details,
          scheme.benefits,
          scheme.ministry,
          scheme.classified_state,
          scheme.filter_scheme_category
        ].join(' ').toLowerCase();
        
        // Split query into words and check if all words are found
        const queryWords = query.split(' ').filter(word => word.length > 0);
        return queryWords.every(word => searchableText.includes(word));
      });
      
      console.log('Schemes after search filter:', filtered.length);
    }

    // Category filter - FIXED to handle exact matching
    if (filters.categories && filters.categories.length > 0 && !filters.categories.includes('All')) {
      console.log('Filtering by categories:', filters.categories);
      console.log('Sample scheme categories:', schemes.slice(0, 5).map(s => s.filter_scheme_category));
      
      const beforeCount = filtered.length;
      
      filtered = filtered.filter(scheme => {
        const schemeCategory = scheme.filter_scheme_category;
        const isMatch = filters.categories.some(category => {
          // Exact string comparison - no trimming or case changes
          return schemeCategory === category;
        });
        return isMatch;
      });
      
      const afterCount = filtered.length;
      console.log(`Category filter: ${beforeCount} -> ${afterCount} schemes`);
    }

    // Caste filter - EXACT MATCHING ONLY
    if (filters.caste && filters.caste.length > 0 && !filters.caste.includes('All')) {
      console.log('Filtering by caste:', filters.caste);
      
      // Show sample scheme caste values for debugging
      const sampleCasteValues = schemes.slice(0, 10).map(s => s.filter_caste);
      console.log('Sample scheme caste values:', sampleCasteValues);
      
      filtered = filtered.filter(scheme => {
        const schemeCaste = scheme.filter_caste;
        const matches = filters.caste.includes(schemeCaste);
        
        // Log the first few matches for debugging
        if (matches && filtered.length < 5) {
          console.log(`Match found: scheme "${scheme.title}" has caste "${schemeCaste}"`);
        }
        
        return matches;
      });
      
      console.log('Schemes after caste filter:', filtered.length);
    }

    // State filter
    if (filters.states && filters.states.length > 0 && !filters.states.includes('All')) {
      filtered = filtered.filter(scheme => 
        filters.states.some(state => 
          scheme.classified_state?.toLowerCase().includes(state.toLowerCase())
        )
      );
    }

    // Ministry filter
    if (filters.ministry && filters.ministry.length > 0 && !filters.ministry.includes('All')) {
      filtered = filtered.filter(scheme => 
        filters.ministry.some(ministry => 
          scheme.ministry === ministry
        )
      );
    }

    // Gender filter
    if (filters.gender.length > 0 && !filters.gender.includes('All')) {
      filtered = filtered.filter(scheme => filters.gender.includes(scheme.filter_gender));
    }

    // Residence filter
    if (filters.residence.length > 0 && !filters.residence.includes('All')) {
      filtered = filtered.filter(scheme => filters.residence.includes(scheme.filter_residence));
    }

    // Benefit Type filter
    if (filters.benefitType.length > 0 && !filters.benefitType.includes('All')) {
      filtered = filtered.filter(scheme => filters.benefitType.includes(scheme.filter_benefit_type));
    }

    // Marital Status filter
    if (filters.maritalStatus.length > 0 && !filters.maritalStatus.includes('All')) {
      filtered = filtered.filter(scheme => filters.maritalStatus.includes(scheme.filter_marital_status));
    }

    // Employment Status filter
    if (filters.employmentStatus.length > 0 && !filters.employmentStatus.includes('All')) {
      filtered = filtered.filter(scheme => filters.employmentStatus.includes(scheme.filter_employment_status));
    }

    // Occupation filter
    if (filters.occupation.length > 0 && !filters.occupation.includes('All')) {
      filtered = filtered.filter(scheme => filters.occupation.includes(scheme.filter_occupation));
    }

    // Special Categories filter
    if (filters.specialCategories.length > 0 && !filters.specialCategories.includes('All')) {
      filtered = filtered.filter(scheme => {
        const schemeSpecialCategories = Array.isArray(scheme.filter_special_categories) 
          ? scheme.filter_special_categories 
          : [scheme.filter_special_categories].filter(Boolean);
        
        return filters.specialCategories.some(category => 
          schemeSpecialCategories.includes(category)
        );
      });
    }

    // Disability Percentage filter - EXACT MATCH FOR ACTUAL DATASET VALUES
    if (filters.disabilityPercentage.length > 0 && !filters.disabilityPercentage.includes('All')) {
      console.log('Disability filters selected:', filters.disabilityPercentage);
      
      const beforeCount = filtered.length;
      
      filtered = filtered.filter(scheme => {
        const schemeDisability = scheme.filter_disability_percentage || '';
        
        // Direct exact string match - the filter values now match the dataset exactly
        return filters.disabilityPercentage.includes(schemeDisability);
      });
      
      const afterCount = filtered.length;
      console.log(`Disability filter: ${beforeCount} -> ${afterCount} schemes`);
    }

    // Age Group filter
    if (filters.ageGroup.length > 0 && !filters.ageGroup.includes('All')) {
      filtered = filtered.filter(scheme => {
        return filters.ageGroup.some(ageGroup => 
          scheme.age_tags?.includes(ageGroup)
        );
      });
    }

    console.log('Final filtered schemes:', filtered.length);
    return filtered;
  }, [debouncedSearchQuery, filters, schemes]); // Updated dependency array

  // Update the search input handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    
    // Update filters immediately for UI feedback
    const updatedFilters = {
      ...filters,
      searchQuery: query
    };
    
    setFilters(updatedFilters);
    
    // Update URL immediately using the UPDATED filters, not the old filters
    const params = new URLSearchParams();
    if (query.trim()) {
      params.set('q', query);
    }
    
    // Add other existing filters to URL - use updatedFilters instead of filters
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (key !== 'searchQuery' && Array.isArray(value) && value.length > 0) {
        if (key === 'categories' || key === 'caste') {
          const encodedValues = value.map(v => encodeURIComponent(v));
          params.set(key, encodedValues.join('||'));
        } else {
          params.set(key, value.join(','));
        }
      }
    });
    
    setSearchParams(params);
    setCurrentPage(1);
  };

  // Pagination
  const totalPages = Math.ceil(filteredSchemes.length / ITEMS_PER_PAGE);
  const paginatedSchemes = filteredSchemes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Government Schemes</h1>
          <p className="text-xl text-green-50">
            Showing {filteredSchemes.length} of {schemes.length} schemes
          </p>
        </div>
      </div>

      {/* Remove the entire Age Tags section */}
      {/* Age Tags section has been removed */}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-80 flex-shrink-0">
            <FilterSidebar 
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search schemes..."
                  value={filters.searchQuery}
                  onChange={handleSearchChange}
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Active Filters Display */}
            {Object.values(filters).some(filter => 
              Array.isArray(filter) ? filter.length > 0 : filter
            ) && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {Object.entries(filters).map(([key, values]) => {
                    if (Array.isArray(values) && values.length > 0) {
                      return values.map(value => {
                        // Create display label for caste categories
                        let displayLabel = value;
                        if (key === 'caste') {
                          const casteLabels: { [key: string]: string } = {
                            'All': 'All',
                            'Scheduled Caste (SC)': 'SC',
                            'Scheduled Tribe (ST)': 'ST',
                            'General': 'General',
                            'Other Backward Class (OBC)': 'OBC',
                            'De-Notified, Nomadic, and Semi-Nomadic (DNT) communities': 'DNT',
                            'Particularly Vulnerable Tribal Group (PVTG)': 'PVTG'
                          };
                          displayLabel = casteLabels[value] || value;
                        }
                        
                        return (
                          <span
                            key={`${key}-${value}`}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                          >
                            {displayLabel}
                            <button
                              onClick={() => {
                                const newValues = values.filter(v => v !== value);
                                handleFiltersChange({ [key]: newValues });
                              }}
                              className="ml-2 text-green-600 hover:text-green-800"
                            >
                              ×
                            </button>
                          </span>
                        );
                      });
                    }
                    return null;
                  })}
                  
                  <button
                    onClick={() => handleFiltersChange(initialFilters)}
                    className="text-sm text-gray-600 hover:text-gray-800 underline"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            )}

            {/* Results */}
            {paginatedSchemes.length > 0 ? (
              <>
                <div className="grid gap-6 mb-8">
                  {paginatedSchemes.map((scheme) => (
                    <SchemeCard 
                      key={scheme.scheme_id || scheme.id} 
                      scheme={{
                        ...scheme,
                        filter_disability_percentage: scheme.filter_disability_percentage || ''
                      }} 
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-lg ${
                          currentPage === page
                            ? 'bg-green-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No schemes match your current filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}