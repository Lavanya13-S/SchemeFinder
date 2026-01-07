import { useState, useCallback, useMemo, useEffect } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { schemes } from '../data/schemes';

interface FilterSidebarProps {
  filters: any;
  onFiltersChange: (filters: any) => void;
}

export default function FilterSidebar({ filters, onFiltersChange }: FilterSidebarProps) {
  const handleFilterChange = useCallback((filterKey: string, option: string, checked: boolean) => {
    const currentValues = filters[filterKey] || [];
    let newValues;
    
    if (checked) {
      // If "All" is selected, clear all other options and only keep "All"
      if (option === 'All') {
        newValues = [];
      } else {
        // If another option is selected, remove "All" if it exists
        newValues = currentValues.filter((item: string) => item !== 'All');
        // Add the new option if not already present
        if (!newValues.includes(option)) {
          newValues = [...newValues, option];
        }
      }
    } else {
      // Remove if present
      newValues = currentValues.filter((item: string) => item !== option);
    }
    
    // Pass all filters with the updated filter
    onFiltersChange({
      ...filters,
      [filterKey]: newValues
    });
  }, [filters, onFiltersChange]);

  const [expandedSections, setExpandedSections] = useState({
    category: true,
    state: false,
    gender: false,
    caste: false,
    residence: false,
    benefitType: false,
    maritalStatus: false,
    employmentStatus: false,
    occupation: false,
    specialCategories: false,
    disabilityPercentage: false,
    ageGroup: false,
    ministry: false,
  });

  // Auto-expand sections that have active filters
  useEffect(() => {
    const newExpandedSections = { ...expandedSections };
    
    if (filters.states && filters.states.length > 0) {
      newExpandedSections.state = true;
    }
    if (filters.gender && filters.gender.length > 0) {
      newExpandedSections.gender = true;
    }
    if (filters.caste && filters.caste.length > 0) {
      newExpandedSections.caste = true;
    }
    if (filters.categories && filters.categories.length > 0) {
      newExpandedSections.category = true;
    }
    if (filters.residence && filters.residence.length > 0) {
      newExpandedSections.residence = true;
    }
    if (filters.benefitType && filters.benefitType.length > 0) {
      newExpandedSections.benefitType = true;
    }
    if (filters.maritalStatus && filters.maritalStatus.length > 0) {
      newExpandedSections.maritalStatus = true;
    }
    if (filters.employmentStatus && filters.employmentStatus.length > 0) {
      newExpandedSections.employmentStatus = true;
    }
    if (filters.occupation && filters.occupation.length > 0) {
      newExpandedSections.occupation = true;
    }
    if (filters.specialCategories && filters.specialCategories.length > 0) {
      newExpandedSections.specialCategories = true;
    }
    if (filters.disabilityPercentage && filters.disabilityPercentage.length > 0) {
      newExpandedSections.disabilityPercentage = true;
    }
    if (filters.ageGroup && filters.ageGroup.length > 0) {
      newExpandedSections.ageGroup = true;
    }
    if (filters.ministry && filters.ministry.length > 0) {
      newExpandedSections.ministry = true;
    }
    
    setExpandedSections(newExpandedSections);
  }, [filters]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }));
  };

  // Dynamically calculate counts from schemes data
  const stateOptions = useMemo(() => {
    const stateCounts = new Map<string, number>();
    schemes.forEach(scheme => {
      const state = scheme.classified_state || 'Unknown';
      // Exclude Central/National and other non-state values from filter
      if (state !== 'Central/National' && state !== 'Central' && state !== 'Not specified' && state !== 'Unknown') {
        stateCounts.set(state, (stateCounts.get(state) || 0) + 1);
      }
    });
    
    const options = Array.from(stateCounts.entries())
      .map(([state, count]) => ({ value: state, label: state, count }))
      .sort((a, b) => a.label.localeCompare(b.label));
    
    return [{ value: 'All', label: 'All', count: schemes.length }, ...options];
  }, []);

  const ageGroupOptions = useMemo(() => {
    const ageCounts = new Map<string, number>();
    schemes.forEach(scheme => {
      const tags = scheme.age_tags || [];
      tags.forEach(tag => {
        ageCounts.set(tag, (ageCounts.get(tag) || 0) + 1);
      });
    });
    
    const ageRanges = ['0-10', '11-20', '21-30', '31-40', '41-50', '51-60', '61-70', '71-80', '81-90', '91-100', '101-110'];
    return [
      { value: 'All', label: 'All Ages', count: schemes.length },
      ...ageRanges.map(range => ({
        value: range,
        label: `${range} years`,
        count: ageCounts.get(range) || 0
      }))
    ];
  }, []);

  const ministryOptions = useMemo(() => {
    const ministryCounts = new Map<string, number>();
    schemes.forEach(scheme => {
      const ministry = scheme.ministry;
      if (ministry) {
        ministryCounts.set(ministry, (ministryCounts.get(ministry) || 0) + 1);
      }
    });
    
    const options = Array.from(ministryCounts.entries())
      .map(([ministry, count]) => ({ 
        value: ministry, 
        label: ministry.replace('Ministry Of ', '').replace('Ministry of ', ''),
        count 
      }))
      .sort((a, b) => a.label.localeCompare(b.label))
      .slice(0, 20);
    
    return [{ value: 'All', label: 'All', count: schemes.length }, ...options];
  }, []);

  // NEW SPECIAL CATEGORIES OPTIONS WITH COUNTS FROM YOUR DATASET
  const specialCategoriesOptions = useMemo(() => {
    const specialCounts = new Map<string, number>();
    schemes.forEach(scheme => {
      const specials = Array.isArray(scheme.filter_special_categories) 
        ? scheme.filter_special_categories 
        : (scheme.filter_special_categories ? [scheme.filter_special_categories] : []);
      specials.forEach(special => {
        specialCounts.set(special, (specialCounts.get(special) || 0) + 1);
      });
    });
    
    const options = Array.from(specialCounts.entries())
      .map(([special, count]) => ({ value: special, label: special, count }))
      .sort((a, b) => a.label.localeCompare(b.label));
    
    return [{ value: 'All', label: 'All', count: schemes.length }, ...options];
  }, []);

  const casteOptions = useMemo(() => {
    const casteCounts = new Map<string, number>();
    schemes.forEach(scheme => {
      const castes = scheme.filter_caste || [];
      // Count each caste value in the array
      castes.forEach(caste => {
        if (caste && caste !== 'All') {
          casteCounts.set(caste, (casteCounts.get(caste) || 0) + 1);
        }
      });
    });
    
    const options = Array.from(casteCounts.entries())
      .map(([caste, count]) => ({ 
        value: caste, 
        label: caste.replace('Scheduled Caste (SC)', 'SC')
                    .replace('Scheduled Tribe (ST)', 'ST')
                    .replace('Other Backward Class (OBC)', 'OBC')
                    .replace('De-Notified, Nomadic, and Semi-Nomadic (DNT) communities', 'DNT')
                    .replace('Particularly Vulnerable Tribal Group (PVTG)', 'PVTG'), 
        count 
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
    
    return [{ value: 'All', label: 'All', count: schemes.length }, ...options];
  }, []);

  const maritalStatusOptions = useMemo(() => {
    const maritalCounts = new Map<string, number>();
    schemes.forEach(scheme => {
      const marital = scheme.filter_marital_status;
      if (marital && marital !== 'All') {
        maritalCounts.set(marital, (maritalCounts.get(marital) || 0) + 1);
      }
    });
    
    const options = Array.from(maritalCounts.entries())
      .map(([marital, count]) => ({ value: marital, label: marital, count }))
      .sort((a, b) => a.label.localeCompare(b.label));
    
    return [{ value: 'All', label: 'All', count: schemes.length }, ...options];
  }, []);

  const employmentOptions = useMemo(() => {
    const employmentCounts = new Map<string, number>();
    schemes.forEach(scheme => {
      const employment = scheme.filter_employment_status;
      if (employment && employment !== 'All') {
        employmentCounts.set(employment, (employmentCounts.get(employment) || 0) + 1);
      }
    });
    
    const options = Array.from(employmentCounts.entries())
      .map(([employment, count]) => ({ value: employment, label: employment, count }))
      .sort((a, b) => a.label.localeCompare(b.label));
    
    return [{ value: 'All', label: 'All', count: schemes.length }, ...options];
  }, []);

  const residenceOptions = useMemo(() => {
    const residenceCounts = new Map<string, number>();
    schemes.forEach(scheme => {
      const residence = scheme.filter_residence;
      if (residence && residence !== 'All') {
        residenceCounts.set(residence, (residenceCounts.get(residence) || 0) + 1);
      }
    });
    
    const options = Array.from(residenceCounts.entries())
      .map(([residence, count]) => ({ value: residence, label: residence, count }))
      .sort((a, b) => a.label.localeCompare(b.label));
    
    return [{ value: 'All', label: 'All', count: schemes.length }, ...options];
  }, []);

  const genderOptions = useMemo(() => {
    const genderCounts = new Map<string, number>();
    schemes.forEach(scheme => {
      const gender = scheme.filter_gender;
      if (gender && gender !== 'All') {
        genderCounts.set(gender, (genderCounts.get(gender) || 0) + 1);
      }
    });
    
    const options = Array.from(genderCounts.entries())
      .map(([gender, count]) => ({ value: gender, label: gender, count }))
      .sort((a, b) => a.label.localeCompare(b.label));
    
    return [{ value: 'All', label: 'All', count: schemes.length }, ...options];
  }, []);

  const benefitTypeOptions = useMemo(() => {
    const benefitCounts = new Map<string, number>();
    schemes.forEach(scheme => {
      const benefit = scheme.filter_benefit_type;
      if (benefit) {
        benefitCounts.set(benefit, (benefitCounts.get(benefit) || 0) + 1);
      }
    });
    
    const options = Array.from(benefitCounts.entries())
      .map(([benefit, count]) => ({ value: benefit, label: benefit, count }))
      .sort((a, b) => a.label.localeCompare(b.label));
    
    return [{ value: 'All', label: 'All', count: schemes.length }, ...options];
  }, []);

  const occupationOptions = useMemo(() => {
    const occupationCounts = new Map<string, number>();
    schemes.forEach(scheme => {
      const occupation = scheme.filter_occupation;
      if (occupation && occupation !== 'All') {
        occupationCounts.set(occupation, (occupationCounts.get(occupation) || 0) + 1);
      }
    });
    
    const options = Array.from(occupationCounts.entries())
      .map(([occupation, count]) => ({ 
        value: occupation, 
        label: occupation === 'No' ? 'No Specific Occupation' : occupation, 
        count 
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
    
    return [{ value: 'All', label: 'All', count: schemes.length }, ...options];
  }, []);

  const disabilityPercentageOptions = useMemo(() => {
    const disabilityCounts = new Map<string, number>();
    schemes.forEach(scheme => {
      const disability = scheme.filter_disability_percentage;
      if (disability) {
        disabilityCounts.set(disability, (disabilityCounts.get(disability) || 0) + 1);
      }
    });
    
    const options = Array.from(disabilityCounts.entries())
      .map(([disability, count]) => ({ value: disability, label: disability, count }))
      .sort((a, b) => a.label.localeCompare(b.label));
    
    return [{ value: 'All', label: 'All', count: schemes.length }, ...options];
  }, []);

  const categoryOptions = useMemo(() => {
    const categoryCounts = new Map<string, number>();
    schemes.forEach(scheme => {
      const cats = scheme.filter_scheme_category || [];
      cats.forEach(cat => {
        categoryCounts.set(cat, (categoryCounts.get(cat) || 0) + 1);
      });
    });
    
    const options = Array.from(categoryCounts.entries())
      .map(([cat, count]) => ({ value: cat, label: cat, count }))
      .sort((a, b) => a.label.localeCompare(b.label));
    
    return [{ value: 'All', label: 'All', count: schemes.length }, ...options];
  }, []);

  const clearAllFilters = () => {
    onFiltersChange({
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
    });
  };

  const hasActiveFilters = Object.values(filters).some((filterArray: any) => 
    Array.isArray(filterArray) && filterArray.length > 0
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
          >
            <X size={16} />
            Clear All
          </button>
        )}
      </div>

      {/* Filter Sections */}
      <div className="space-y-6">
        {/* State/UT Section with counts */}
        <div className="border-b border-gray-200 pb-4">
          <button
            onClick={() => toggleSection('state')}
            className="flex items-center justify-between w-full py-3 text-left"
          >
            <h3 className="font-semibold text-gray-900">State/UT</h3>
            {!expandedSections.state ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          </button>
          
          <div className="space-y-2 mt-2">
            {(expandedSections.state ? stateOptions : stateOptions.slice(0, 6)).map((option) => (
              <label key={option.value} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.states?.includes(option.value) || false}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleFilterChange('states', option.value, e.target.checked);
                  }}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {option.label} ({option.count})
                </span>
              </label>
            ))}
          </div>
          
          {!expandedSections.state && stateOptions.length > 6 && (
            <button
              onClick={() => toggleSection('state')}
              className="text-green-600 text-sm mt-2 hover:text-green-700"
            >
              Show more ({stateOptions.length - 6})
            </button>
          )}
        </div>

        {/* Category Section with counts */}
        <div className="border-b border-gray-200 pb-4">
          <button
            onClick={() => toggleSection('category')}
            className="flex items-center justify-between w-full py-3 text-left"
          >
            <h3 className="font-semibold text-gray-900">Category</h3>
            {!expandedSections.category ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          </button>
          
          <div className="space-y-2 mt-2">
            {(expandedSections.category ? categoryOptions : categoryOptions.slice(0, 3)).map((option) => (
              <label key={option.value} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.categories?.includes(option.value) || false}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleFilterChange('categories', option.value, e.target.checked);
                  }}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {option.label} ({option.count})
                </span>
              </label>
            ))}
          </div>
          
          {!expandedSections.category && categoryOptions.length > 3 && (
            <button
              onClick={() => toggleSection('category')}
              className="text-green-600 text-sm mt-2 hover:text-green-700"
            >
              Show more ({categoryOptions.length - 3})
            </button>
          )}
        </div>

        {/* Ministry Section with counts */}
        <div className="border-b border-gray-200 pb-4">
          <button
            onClick={() => toggleSection('ministry')}
            className="flex items-center justify-between w-full py-3 text-left"
          >
            <h3 className="font-semibold text-gray-900">Ministry</h3>
            {!expandedSections.ministry ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          </button>
          
          <div className="space-y-2 mt-2">
            {(expandedSections.ministry ? ministryOptions : ministryOptions.slice(0, 11)).map((option) => (
              <label key={option.value} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.ministry?.includes(option.value) || false}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleFilterChange('ministry', option.value, e.target.checked);
                  }}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {option.label} ({option.count})
                </span>
              </label>
            ))}
          </div>
          
          {!expandedSections.ministry && ministryOptions.length > 11 && (
            <button
              onClick={() => toggleSection('ministry')}
              className="text-green-600 text-sm mt-2 hover:text-green-700"
            >
              Show more ({ministryOptions.length - 11})
            </button>
          )}
        </div>

        {/* Gender Section with counts */}
        <div className="border-b border-gray-200 pb-4">
          <div className="flex items-center justify-between w-full py-3 text-left">
            <h3 className="font-semibold text-gray-900">Gender</h3>
          </div>
          
          <div className="space-y-2 mt-2">
            {genderOptions.map((option) => (
              <label key={option.value} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.gender?.includes(option.value) || false}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleFilterChange('gender', option.value, e.target.checked);
                  }}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {option.label} ({option.count})
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Caste Category Section */}
        <div className="border-b border-gray-200 pb-4">
          <div className="flex items-center justify-between w-full py-3 text-left">
            <h3 className="font-semibold text-gray-900">Caste Category</h3>
          </div>
          
          <div className="space-y-2 mt-2">
            {casteOptions.map((option) => (
              <label key={option.value} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.caste?.includes(option.value) || false}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleFilterChange('caste', option.value, e.target.checked);
                  }}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {option.label} ({option.count})
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Residence Type Section with counts */}
        <div className="border-b border-gray-200 pb-4">
          <div className="flex items-center justify-between w-full py-3 text-left">
            <h3 className="font-semibold text-gray-900">Residence Type</h3>
          </div>
          
          <div className="space-y-2 mt-2">
            {residenceOptions.map((option) => (
              <label key={option.value} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.residence?.includes(option.value) || false}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleFilterChange('residence', option.value, e.target.checked);
                  }}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {option.label} ({option.count})
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Benefit Type Section with counts */}
        <div className="border-b border-gray-200 pb-4">
          <div className="flex items-center justify-between w-full py-3 text-left">
            <h3 className="font-semibold text-gray-900">Benefit Type</h3>
          </div>
          
          <div className="space-y-2 mt-2">
            {benefitTypeOptions.map((option) => (
              <label key={option.value} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.benefitType?.includes(option.value) || false}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleFilterChange('benefitType', option.value, e.target.checked);
                  }}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {option.label} ({option.count})
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Age Group Section with counts */}
        <div className="border-b border-gray-200 pb-4">
          <button
            onClick={() => toggleSection('ageGroup')}
            className="flex items-center justify-between w-full py-3 text-left"
          >
            <h3 className="font-semibold text-gray-900">Age Group</h3>
            {!expandedSections.ageGroup ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          </button>
          
          <div className="space-y-2 mt-2">
            {(expandedSections.ageGroup ? ageGroupOptions : ageGroupOptions.slice(0, 5)).map((option) => (
              <label key={option.value} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.ageGroup?.includes(option.value) || false}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleFilterChange('ageGroup', option.value, e.target.checked);
                  }}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {option.label} ({option.count})
                </span>
              </label>
            ))}
          </div>
          
          {!expandedSections.ageGroup && ageGroupOptions.length > 5 && (
            <button
              onClick={() => toggleSection('ageGroup')}
              className="text-green-600 text-sm mt-2 hover:text-green-700"
            >
              Show more ({ageGroupOptions.length - 5})
            </button>
          )}
        </div>

        {/* Marital Status Section */}
        <div className="border-b border-gray-200 pb-4">
          <div className="flex items-center justify-between w-full py-3 text-left">
            <h3 className="font-semibold text-gray-900">Marital Status</h3>
          </div>
          
          <div className="space-y-2 mt-2">
            {maritalStatusOptions.map((option) => (
              <label key={option.value} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.maritalStatus?.includes(option.value) || false}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleFilterChange('maritalStatus', option.value, e.target.checked);
                  }}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {option.label} ({option.count})
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Employment Status Section with counts */}
        <div className="border-b border-gray-200 pb-4">
          <div className="flex items-center justify-between w-full py-3 text-left">
            <h3 className="font-semibold text-gray-900">Employment Status</h3>
          </div>
          
          <div className="space-y-2 mt-2">
            {employmentOptions.map((option) => (
              <label key={option.value} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.employmentStatus?.includes(option.value) || false}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleFilterChange('employmentStatus', option.value, e.target.checked);
                  }}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {option.label} ({option.count})
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Occupation Section with counts */}
        <div className="border-b border-gray-200 pb-4">
          <button
            onClick={() => toggleSection('occupation')}
            className="flex items-center justify-between w-full py-3 text-left"
          >
            <h3 className="font-semibold text-gray-900">Occupation</h3>
            {!expandedSections.occupation ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          </button>
          
          <div className="space-y-2 mt-2">
            {(expandedSections.occupation ? occupationOptions : occupationOptions.slice(0, 5)).map((option) => (
              <label key={option.value} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.occupation?.includes(option.value) || false}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleFilterChange('occupation', option.value, e.target.checked);
                  }}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {option.label} ({option.count})
                </span>
              </label>
            ))}
          </div>
          
          {!expandedSections.occupation && occupationOptions.length > 5 && (
            <button
              onClick={() => toggleSection('occupation')}
              className="text-green-600 text-sm mt-2 hover:text-green-700"
            >
              Show more ({occupationOptions.length - 5})
            </button>
          )}
        </div>

        {/* Special Categories Section with counts */}
        <div className="border-b border-gray-200 pb-4">
          <button
            onClick={() => toggleSection('specialCategories')}
            className="flex items-center justify-between w-full py-3 text-left"
          >
            <h3 className="font-semibold text-gray-900">Special Categories</h3>
            {!expandedSections.specialCategories ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          </button>
          
          <div className="space-y-2 mt-2">
            {(expandedSections.specialCategories ? specialCategoriesOptions : specialCategoriesOptions.slice(0, 4)).map((option) => (
              <label key={option.value} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.specialCategories?.includes(option.value) || false}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleFilterChange('specialCategories', option.value, e.target.checked);
                  }}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {option.label} ({option.count})
                </span>
              </label>
            ))}
          </div>
          
          {!expandedSections.specialCategories && specialCategoriesOptions.length > 4 && (
            <button
              onClick={() => toggleSection('specialCategories')}
              className="text-green-600 text-sm mt-2 hover:text-green-700"
            >
              Show more ({specialCategoriesOptions.length - 4})
            </button>
          )}
        </div>

        {/* Disability Percentage Section with counts - EXPANDABLE */}
        <div className="border-b border-gray-200 pb-4">
          <button
            onClick={() => toggleSection('disabilityPercentage')}
            className="flex items-center justify-between w-full py-3 text-left"
          >
            <h3 className="font-semibold text-gray-900">Disability Percentage</h3>
            {!expandedSections.disabilityPercentage ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          </button>
          
          <div className="space-y-2 mt-2">
            {(expandedSections.disabilityPercentage ? disabilityPercentageOptions : disabilityPercentageOptions.slice(0, 4)).map((option) => (
              <label key={option.value} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.disabilityPercentage?.includes(option.value) || false}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleFilterChange('disabilityPercentage', option.value, e.target.checked);
                  }}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {option.label} ({option.count})
                </span>
              </label>
            ))}
          </div>
          
          {!expandedSections.disabilityPercentage && disabilityPercentageOptions.length > 4 && (
            <button
              onClick={() => toggleSection('disabilityPercentage')}
              className="text-green-600 text-sm mt-2 hover:text-green-700"
            >
              Show more ({disabilityPercentageOptions.length - 4})
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

3