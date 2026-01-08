import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { Filter, X } from 'lucide-react';
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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Debug: Log scheme data on mount
  useEffect(() => {
    console.log('=== SCHEMES DATA DEBUG ===');
    console.log('Total schemes loaded:', schemes.length);
    
    // Check for MSME schemes
    const msmeSchemes = schemes.filter(s => s.ministry === 'Ministry Of Micro, Small and Medium Enterprises');
    console.log('MSME schemes found:', msmeSchemes.length);
    if (msmeSchemes.length > 0) {
      console.log('Sample MSME scheme:', {
        title: msmeSchemes[0].title.substring(0, 50),
        ministry: msmeSchemes[0].ministry
      });
    }
    
    // Check for Fisheries schemes
    const fisheriesSchemes = schemes.filter(s => s.ministry === 'Ministry of Fisheries,Animal Husbandry and Dairying');
    console.log('Fisheries schemes found:', fisheriesSchemes.length);
    if (fisheriesSchemes.length > 0) {
      console.log('Sample Fisheries scheme:', {
        title: fisheriesSchemes[0].title.substring(0, 50),
        ministry: fisheriesSchemes[0].ministry
      });
    }
    
    // Check for undefined/null ministries
    const noMinistry = schemes.filter(s => !s.ministry);
    console.log('Schemes without ministry:', noMinistry.length);
    
    console.log('=== END DEBUG ===');
  }, []);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState(initialFilters);

  // Scroll to top when page loads or when category changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname, searchParams.get('category')]);

  // Initialize filters from URL params
  useEffect(() => {
    // Parse URL parameters - use || delimiter for categories (they contain commas)
    const categoriesParam = searchParams.get('categories');
    let categories: string[] = [];
    
    if (categoriesParam) {
      // Always use || delimiter for consistency (categories may contain commas)
      categories = categoriesParam.split('||').map(v => decodeURIComponent(v)).filter(Boolean);
    } else if (searchParams.get('category')) {
      categories = [searchParams.get('category')!];
    }
    
    const statesParam = searchParams.get('states');
    console.log('URL states param:', statesParam);
    const states = (statesParam?.split(',').filter(Boolean) || []).map(s => s.trim());
    console.log('Parsed states:', states);
    const gender = searchParams.get('gender')?.split(',').filter(Boolean) || [];
    
    // Simplified caste parsing - use || delimiter consistently
    const casteParam = searchParams.get('caste');
    let caste: string[] = [];
    if (casteParam) {
      // Always use || delimiter for consistency
      caste = casteParam.split('||').map(v => decodeURIComponent(v)).filter(Boolean);
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
    
    // Ministry parsing - use || delimiter since ministry names contain commas
    const ministryParam = searchParams.get('ministry');
    let ministry: string[] = [];
    if (ministryParam) {
      if (ministryParam.includes('||')) {
        ministry = ministryParam.split('||').map(v => decodeURIComponent(v)).filter(Boolean);
      } else {
        ministry = [decodeURIComponent(ministryParam)];
      }
    }

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
    
    // Only update URL params - let the useEffect handle state updates
    
    // Update URL params
    const params = new URLSearchParams();
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        if (key === 'categories' || key === 'caste' || key === 'ministry') {
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
        const categories = Array.isArray(scheme.filter_scheme_category) 
          ? scheme.filter_scheme_category.join(' ') 
          : (scheme.filter_scheme_category || '');
        
        const searchableText = [
          scheme.title,
          scheme.details,
          scheme.benefits,
          scheme.ministry,
          scheme.classified_state,
          categories
        ].join(' ').toLowerCase();
        
        // Split query into words and check if all words are found
        const queryWords = query.split(' ').filter(word => word.length > 0);
        return queryWords.every(word => searchableText.includes(word));
      });
      
      console.log('Schemes after search filter:', filtered.length);
    }

    // Category filter - Handle array of categories
    if (filters.categories && filters.categories.length > 0 && !filters.categories.includes('All')) {
      console.log('Filtering by categories:', filters.categories);
      
      const beforeCount = filtered.length;
      
      filtered = filtered.filter(scheme => {
        const schemeCategories = scheme.filter_scheme_category || [];
        // Check if any of the scheme's categories match any of the filter categories
        const isMatch = filters.categories.some(filterCategory => 
          Array.isArray(schemeCategories) 
            ? schemeCategories.includes(filterCategory)
            : schemeCategories === filterCategory
        );
        return isMatch;
      });
      
      const afterCount = filtered.length;
      console.log(`Category filter: ${beforeCount} -> ${afterCount} schemes`);
    }

    // Caste filter - Match schemes that include the selected caste values or "All"
    if (filters.caste && filters.caste.length > 0 && !filters.caste.includes('All')) {
      console.log('Filtering by caste:', filters.caste);
      
      filtered = filtered.filter(scheme => {
        const schemeCastes = scheme.filter_caste || [];
        
        // If scheme has 'All', it's available to everyone - include it
        if (schemeCastes.includes('All')) {
          return true;
        }
        
        // Check if any of the selected castes match any of the scheme's castes
        const matches = filters.caste.some(selectedCaste => 
          schemeCastes.includes(selectedCaste)
        );
        
        return matches;
      });
      
      console.log('Schemes after caste filter:', filtered.length);
    }

    // State filter - EXACT MATCHING ONLY
    if (filters.states && filters.states.length > 0 && !filters.states.includes('All')) {
      console.log('===== STATE FILTER ACTIVE =====');
      console.log('Filter states:', filters.states);
      console.log('Sample scheme states:', schemes.slice(0, 5).map(s => s.classified_state));
      const beforeCount = filtered.length;
      
      // Normalize state names - trim and lowercase for comparison
      const normalizedStates = filters.states.map(s => s.trim().toLowerCase());
      console.log('Normalized filter states:', normalizedStates);
      
      filtered = filtered.filter(scheme => {
        const schemeState = (scheme.classified_state || '').trim().toLowerCase();
        const matches = normalizedStates.some(state => schemeState === state);
        return matches;
      });
      
      const afterCount = filtered.length;
      console.log(`State filter: ${beforeCount} -> ${afterCount} schemes`);
      console.log('===== STATE FILTER COMPLETE =====');
    } else {
      console.log('State filter NOT active. filters.states:', filters.states, 'length:', filters.states?.length);
    }

    // Ministry filter
    if (filters.ministry && filters.ministry.length > 0 && !filters.ministry.includes('All')) {
      console.log('Ministry filter active:', filters.ministry);
      const beforeCount = filtered.length;
      filtered = filtered.filter(scheme => {
        const match = filters.ministry.some(ministry => {
          const isMatch = scheme.ministry === ministry;
          if (isMatch) {
            console.log(`✓ Match found: "${scheme.title.substring(0, 40)}" has ministry "${scheme.ministry}"`);
          }
          return isMatch;
        });
        return match;
      });
      console.log(`Ministry filter: ${beforeCount} -> ${filtered.length} schemes`);
      if (filtered.length === 0) {
        console.warn('⚠️ NO SCHEMES MATCHED THE MINISTRY FILTER!');
        console.log('Looking for ministries:', filters.ministry);
        console.log('Sample scheme ministries from unfiltered:', 
          schemes.slice(0, 5).map(s => ({ title: s.title.substring(0, 30), ministry: s.ministry }))
        );
      }
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
      console.log('Occupation filter active:', filters.occupation);
      const beforeCount = filtered.length;
      filtered = filtered.filter(scheme => {
        const match = filters.occupation.includes(scheme.filter_occupation);
        if (filters.occupation.includes('Artisans, Spinners & Weavers') && match) {
          console.log('Artisan match found:', scheme.title, scheme.filter_occupation);
        }
        return match;
      });
      console.log(`Occupation filter: ${beforeCount} -> ${filtered.length} schemes`);
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
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">Government Schemes</h1>
          <p className="text-base md:text-xl text-green-50">
            Showing {filteredSchemes.length} of {schemes.length} schemes
          </p>
        </div>
      </div>

      {/* Remove the entire Age Tags section */}
      {/* Age Tags section has been removed */}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {/* Mobile Filter Button */}
        <button
          onClick={() => setIsFilterOpen(true)}
          className="lg:hidden mb-4 w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Filter size={20} />
          Filters
        </button>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <FilterSidebar 
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
          </div>

          {/* Mobile Filter Drawer */}
          {isFilterOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setIsFilterOpen(false)}>
              <div 
                className="absolute inset-y-0 left-0 w-full sm:w-96 bg-white shadow-xl overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="p-4">
                  <FilterSidebar 
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                  />
                </div>
                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          <div className="flex-1 min-w-0">
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
                  <div className="flex justify-center items-center gap-1 my-8 flex-wrap">
                    {/* Previous Button */}
                    <button
                      onClick={() => {
                        if (currentPage > 1) {
                          setCurrentPage(currentPage - 1);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                      disabled={currentPage === 1}
                      className={`px-2 py-2 rounded-lg text-sm whitespace-nowrap ${
                        currentPage === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                      }`}
                    >
                      ← Prev
                    </button>

                    {/* Page Numbers - Smart Pagination */}
                    {(() => {
                      const pages: (number | string)[] = [];
                      const leftCount = 4; // Show first 4 pages
                      const rightCount = 3; // Show last 3 pages
                      const middleCount = 2; // Show 2 pages around current page
                      
                      if (totalPages <= leftCount + rightCount + 2) {
                        // Show all pages if total is small
                        for (let i = 1; i <= totalPages; i++) {
                          pages.push(i);
                        }
                      } else {
                        // Always show first 4 pages
                        for (let i = 1; i <= Math.min(leftCount, totalPages); i++) {
                          pages.push(i);
                        }
                        
                        // Add ellipsis and pages around current page if needed
                        const middleStart = Math.max(leftCount + 1, currentPage - middleCount);
                        const middleEnd = Math.min(totalPages - rightCount, currentPage + middleCount);
                        
                        if (middleStart > leftCount + 1) {
                          pages.push('...'); // Left ellipsis
                        }
                        
                        for (let i = middleStart; i <= middleEnd; i++) {
                          if (!pages.includes(i)) {
                            pages.push(i);
                          }
                        }
                        
                        if (middleEnd < totalPages - rightCount) {
                          pages.push('...'); // Right ellipsis
                        }
                        
                        // Always show last 3 pages
                        for (let i = Math.max(middleEnd + 1, totalPages - rightCount + 1); i <= totalPages; i++) {
                          if (!pages.includes(i)) {
                            pages.push(i);
                          }
                        }
                      }
                      
                      return pages.map((page, idx) => (
                        page === '...' ? (
                          <span key={`ellipsis-${idx}`} className="px-2 py-2 text-gray-700">
                            ...
                          </span>
                        ) : (
                          <button
                            key={page}
                            onClick={() => {
                              setCurrentPage(page as number);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className={`px-3 py-2 rounded-lg font-medium text-sm min-w-max ${
                              currentPage === page
                                ? 'bg-green-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                            }`}
                          >
                            {page}
                          </button>
                        )
                      ));
                    })()}

                    {/* Next Button */}
                    <button
                      onClick={() => {
                        if (currentPage < totalPages) {
                          setCurrentPage(currentPage + 1);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                      disabled={currentPage === totalPages}
                      className={`px-2 py-2 rounded-lg text-sm whitespace-nowrap ${
                        currentPage === totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                      }`}
                    >
                      Next →
                    </button>
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