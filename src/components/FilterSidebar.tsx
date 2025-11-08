import { useState, useCallback } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

interface FilterSidebarProps {
  filters: any;
  onFiltersChange: (filters: any) => void;
}

export default function FilterSidebar({ filters, onFiltersChange }: FilterSidebarProps) {
  const handleFilterChange = useCallback((filterKey: string, option: string, checked: boolean) => {
    const currentValues = filters[filterKey] || [];
    let newValues;
    
    if (checked) {
      // Add if not already present
      if (!currentValues.includes(option)) {
        newValues = [...currentValues, option];
      } else {
        return; // Already checked, don't update
      }
    } else {
      // Remove if present
      newValues = currentValues.filter((item: string) => item !== option);
    }

    console.log(`Filter changed: ${filterKey} = ${newValues.join(', ')}`);
    
    // Pass only the changed filter
    onFiltersChange({
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

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }));
  };

  const filterOptions = {
    ministry: [
      'All',
      'Ministry of Agriculture',
      'Ministry of Education',
      'Ministry of Health and Family Welfare',
      'Ministry of Social Justice and Empowerment',
      'Ministry of Labour and Employment',
      'Ministry of Housing and Urban Affairs',
      'Ministry of Women and Child Development'
    ],
    state: [
      'All',
      'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
      'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
      'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
      'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
      'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
      'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir',
      'Ladakh', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
      'Lakshadweep', 'Puducherry', 'Andaman and Nicobar Islands'
    ],
    gender: ['All', 'Male', 'Female', 'Transgender'],
    caste: [
      'All',
      'Scheduled Caste (SC)',
      'Scheduled Tribe (ST)',
      'General',
      'Other Backward Class (OBC)',
      'De-Notified, Nomadic, and Semi-Nomadic (DNT) communities',
      'Particularly Vulnerable Tribal Group (PVTG)'
    ],
    residence: ['All', 'Urban', 'Rural'],
    benefitType: [
      'All',
      'Financial Assistance', 'Scholarship', 'Subsidy', 'Insurance',
      'Training', 'Employment', 'Healthcare', 'Housing', 'Education'
    ],
    maritalStatus: ['All', 'Never Married', 'Married', 'Widowed', 'Separated', 'Divorced'],
    employmentStatus: ['All', 'Employed', 'Unemployed', 'Self-Employed', 'Student'],
    ageGroup: [
      'All',
      '0-10', '11-20', '21-30', '31-40', '41-50', '51-60', '61-70', '71-80', '81+'
    ],
    category: [
      'All',
      'Agriculture,Rural & Environment',
      'Banking,Financial Services and Insurance',
      'Business & Entrepreneurship',
      'Education & Learning',
      'Health & Wellness',
      'Housing & Shelter',
      'Skills & Employment',
      'Social welfare & Empowerment',
      'Women and Child'
    ]
  };

  // NEW SPECIAL CATEGORIES OPTIONS WITH COUNTS FROM YOUR DATASET
  const specialCategoriesOptions = [
    { value: 'All', label: 'All', count: 3809 },
    { value: 'Student', label: 'Student', count: 797 },
    { value: 'Below Poverty Line', label: 'Below Poverty Line', count: 442 },
    { value: 'Differently Abled', label: 'Differently Abled', count: 419 },
    { value: 'DBT Scheme', label: 'DBT Scheme', count: 274 },
    { value: 'Minority', label: 'Minority', count: 118 },
    { value: 'Government Employee', label: 'Government Employee', count: 22 },
    { value: 'Economic Distress', label: 'Economic Distress', count: 20 }
  ];

  const casteOptions = [
    { value: 'All', label: 'All', count: 2726 },
    { value: 'Scheduled Caste (SC)', label: 'SC', count: 599 },
    { value: 'Scheduled Tribe (ST)', label: 'ST', count: 201 },
    { value: 'General', label: 'General', count: 149 },
    { value: 'Other Backward Class (OBC)', label: 'OBC', count: 64 },
    { 
      value: 'De-Notified, Nomadic, and Semi-Nomadic (DNT) communities', 
      label: 'DNT', 
      count: 63 
    },
    { 
      value: 'Particularly Vulnerable Tribal Group (PVTG)', 
      label: 'PVTG', 
      count: 7 
    },
  ];

  const maritalStatusOptions = [
    { value: 'All', label: 'All', count: 3142 },
    { value: 'Never Married', label: 'Never Married', count: 255 },
    { value: 'Married', label: 'Married', count: 251 },
    { value: 'Widowed', label: 'Widowed', count: 155 },
    { value: 'Separated', label: 'Separated', count: 3 },
    { value: 'Divorced', label: 'Divorced', count: 3 },
  ];

  const employmentOptions = [
    { value: 'All', label: 'All', count: 2452 },
    { value: 'Employed', label: 'Employed', count: 1098 },
    { value: 'Self-Employed/ Entrepreneur', label: 'Self-Employed', count: 128 },
    { value: 'Unemployed', label: 'Unemployed', count: 131 },
  ];

  const residenceOptions = [
    { value: 'All', label: 'All', count: 3009 },
    { value: 'Urban', label: 'Urban', count: 105 },
    { value: 'Rural', label: 'Rural', count: 695 },
  ];

  const genderOptions = [
    { value: 'All', label: 'All', count: 2890 },
    { value: 'Female', label: 'Female', count: 769 },
    { value: 'Male', label: 'Male', count: 97 },
    { value: 'Transgender', label: 'Transgender', count: 53 },
  ];

  const benefitTypeOptions = [
    { value: 'Cash', label: 'Cash', count: 1716 },
    { value: 'In Kind', label: 'In Kind', count: 2090 },
    { value: 'Composite', label: 'Composite', count: 3 },
  ];

  const occupationOptions = [
    { value: 'All', label: 'All', count: 3809 },
    { value: 'No', label: 'No Specific Occupation', count: 2319 },
    { value: 'Construction Worker', label: 'Construction Worker', count: 463 },
    { value: 'Farmer', label: 'Farmer', count: 343 },
    { value: 'Teacher / Faculty', label: 'Teacher / Faculty', count: 114 },
    { value: 'Ex Servicemen', label: 'Ex Servicemen', count: 84 },
    { value: 'Fishermen', label: 'Fishermen', count: 83 },
    { value: 'Artist', label: 'Artist', count: 80 },
    { value: 'Artisans, Spinners & Weavers', label: 'Artisans, Spinners & Weavers', count: 75 },
    { value: 'Health Worker', label: 'Health Worker', count: 52 },
    { value: 'Unorganized Worker', label: 'Unorganized Worker', count: 45 },
    { value: 'Sportsperson', label: 'Sportsperson', count: 35 },
    { value: 'Safai Karamchari', label: 'Safai Karamchari', count: 31 },
    { value: 'Khadi Artisan', label: 'Khadi Artisan', count: 27 },
    { value: 'Journalist', label: 'Journalist', count: 26 },
    { value: 'Street Vendor', label: 'Street Vendor', count: 14 },
    { value: 'Tea and Ex-Tea Garden tribes', label: 'Tea Garden Worker', count: 8 },
    { value: 'Coir Worker', label: 'Coir Worker', count: 7 },
    { value: 'Organized Worker', label: 'Organized Worker', count: 3 }
  ];

  // CORRECTED disability percentage options to match actual dataset
  const disabilityPercentageOptions = [
    { value: 'All', label: 'All', count: 3809 },
    { value: 'No Disability Requirement', label: 'No Disability Requirement', count: 3173 },
    { value: 'Any Disability (1%+)', label: 'Any Disability (1%+)', count: 446 },
    { value: 'Mild Disability (1-39%)', label: 'Mild Disability (1-39%)', count: 23 },
    { value: 'Moderate Disability (40-59%)', label: 'Moderate Disability (40-59%)', count: 127 },
    { value: 'Severe Disability (60-79%)', label: 'Severe Disability (60-79%)', count: 104 },
    { value: 'Very Severe Disability (80%+)', label: 'Very Severe Disability (80%+)', count: 47 }
  ];

  const categoryOptions = [
    { value: 'All', label: 'All', count: 3809 },
    { value: 'Science, IT & Communications', label: 'Science, IT & Communications', count: 11 },
    { value: 'Travel & Tourism', label: 'Travel & Tourism', count: 1167 },
    { value: 'Women and Child', label: 'Women and Child', count: 1440 },
    { value: 'Business & Entrepreneurship', label: 'Business & Entrepreneurship', count: 91 },
    { value: 'Social welfare & Empowerment', label: 'Social welfare & Empowerment', count: 184 },
    { value: 'Public Safety,Law & Justice', label: 'Public Safety, Law & Justice', count: 210 },
    { value: 'Transport & Infrastructure', label: 'Transport & Infrastructure', count: 106 },
    { value: 'Banking,Financial Services and Insurance', label: 'Banking, Financial Services and Insurance', count: 170 },
    { value: 'Housing & Shelter', label: 'Housing & Shelter', count: 163 },
    { value: 'Sports & Culture', label: 'Sports & Culture', count: 83 },
    { value: 'Health & Wellness', label: 'Health & Wellness', count: 66 },
    { value: 'Utility & Sanitation', label: 'Utility & Sanitation', count: 5 },
    { value: 'Agriculture,Rural & Environment', label: 'Agriculture, Rural & Environment', count: 57 },
    { value: 'Skills & Employment', label: 'Skills & Employment', count: 50 },
    { value: 'Education & Learning', label: 'Education & Learning', count: 6 }
  ];

  const FilterSection = ({ 
    title, 
    filterKey, 
    options, 
    showCount = 5 
  }: { 
    title: string; 
    filterKey: string; 
    options: string[]; 
    showCount?: number; 
  }) => {
    const isExpanded = expandedSections[filterKey as keyof typeof expandedSections];
    const displayOptions = isExpanded ? options : options.slice(0, showCount);
    const hasMore = options.length > showCount;

    return (
      <div className="border-b border-gray-200 pb-4">
        <button
          onClick={() => toggleSection(filterKey)}
          className="flex items-center justify-between w-full py-3 text-left"
        >
          <h3 className="font-semibold text-gray-900">{title}</h3>
          {hasMore && (
            isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />
          )}
        </button>
        
        <div className="space-y-2 mt-2">
          {displayOptions.map((option) => {
            const currentValues = filters[filterKey] || [];
            const isChecked = currentValues.includes(option);
            
            return (
              <label key={option} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleFilterChange(filterKey, option, e.target.checked);
                  }}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-700">{option}</span>
              </label>
            );
          })}
        </div>
        
        {hasMore && !isExpanded && (
          <button
            onClick={() => toggleSection(filterKey)}
            className="text-green-600 text-sm mt-2 hover:text-green-700"
          >
            Show more ({options.length - showCount})
          </button>
        )}
      </div>
    );
  };

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
        <FilterSection
          title="State/UT"
          filterKey="states"
          options={filterOptions.state}
          showCount={5}
        />

        {/* Special Gender Section with counts */}
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

        {/* Special Caste Section */}
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

        {/* Special Residence Section with counts */}
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

        {/* Special Benefit Type Section with counts */}
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

        <FilterSection
          title="Age Group"
          filterKey="ageGroup"
          options={filterOptions.ageGroup}
          showCount={5}
        />

        {/* Special Marital Status Section */}
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

        {/* Special Employment Status Section with counts */}
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

        {/* Special Occupation Section with counts */}
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

        {/* Special Disability Percentage Section with counts - EXPANDABLE */}
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

        {/* Special Category Section with counts */}
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

        <FilterSection
          title="Ministry"
          filterKey="ministry"
          options={filterOptions.ministry}
          showCount={4}
        />
      </div>
    </div>
  );
}

3