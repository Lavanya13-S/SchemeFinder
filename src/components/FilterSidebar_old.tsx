import { useState, useCallback } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

interface FilterSidebarProps {
  filters: any;
  onFiltersChange: (filters: any) => void;
}

export default function FilterSidebar({ filters, onFiltersChange }: FilterSidebarProps) {
  const handleFilterChange = useCallback((filterKey: string, option: string, checked: boolean) => {
    console.log(`Filter clicked - Key: ${filterKey}, Option: "${option}", Checked: ${checked}`);
    const currentValues = filters[filterKey] || [];
    console.log('Current values for', filterKey, ':', currentValues);
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
    console.log('Passing to onFiltersChange:', { [filterKey]: newValues });
    
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

  const stateOptions = [
    { value: 'All', label: 'All', count: 3749 },
    { value: 'Gujarat', label: 'Gujarat', count: 567 },
    { value: 'Central/National', label: 'Central/National', count: 358 },
    { value: 'Uttar Pradesh', label: 'Uttar Pradesh', count: 301 },
    { value: 'Haryana', label: 'Haryana', count: 251 },
    { value: 'Tamil Nadu', label: 'Tamil Nadu', count: 211 },
    { value: 'Goa', label: 'Goa', count: 196 },
    { value: 'Puducherry', label: 'Puducherry', count: 184 },
    { value: 'Uttarakhand', label: 'Uttarakhand', count: 170 },
    { value: 'Madhya Pradesh', label: 'Madhya Pradesh', count: 168 },
    { value: 'Rajasthan', label: 'Rajasthan', count: 139 },
    { value: 'Bihar', label: 'Bihar', count: 106 },
    { value: 'Chhattisgarh', label: 'Chhattisgarh', count: 88 },
    { value: 'Jharkhand', label: 'Jharkhand', count: 87 },
    { value: 'Maharashtra', label: 'Maharashtra', count: 82 },
    { value: 'Kerala', label: 'Kerala', count: 78 },
    { value: 'West Bengal', label: 'West Bengal', count: 67 },
    { value: 'Assam', label: 'Assam', count: 63 },
    { value: 'Himachal Pradesh', label: 'Himachal Pradesh', count: 63 },
    { value: 'Odisha', label: 'Odisha', count: 58 },
    { value: 'Unclassified/Others', label: 'Unclassified/Others', count: 58 },
    { value: 'Meghalaya', label: 'Meghalaya', count: 55 },
    { value: 'Karnataka', label: 'Karnataka', count: 55 },
    { value: 'Delhi', label: 'Delhi', count: 54 },
    { value: 'Andhra Pradesh', label: 'Andhra Pradesh', count: 43 },
    { value: 'Dadra and Nagar Haveli and Daman and Diu', label: 'Dadra and Nagar Haveli and Daman and Diu', count: 40 },
    { value: 'Jammu and Kashmir', label: 'Jammu and Kashmir', count: 37 },
    { value: 'Punjab', label: 'Punjab', count: 34 },
    { value: 'Arunachal Pradesh', label: 'Arunachal Pradesh', count: 33 },
    { value: 'Tripura', label: 'Tripura', count: 33 },
    { value: 'Manipur', label: 'Manipur', count: 24 },
    { value: 'Sikkim', label: 'Sikkim', count: 20 },
    { value: 'Telangana', label: 'Telangana', count: 20 },
    { value: 'Nagaland', label: 'Nagaland', count: 19 },
    { value: 'Andaman and Nicobar Islands', label: 'Andaman and Nicobar Islands', count: 18 },
    { value: 'Mizoram', label: 'Mizoram', count: 15 },
    { value: 'Lakshadweep', label: 'Lakshadweep', count: 8 },
    { value: 'Ladakh', label: 'Ladakh', count: 6 },
  ];

  const ageGroupOptions = [
    { value: 'All', label: 'All Ages', count: 3749 },
    { value: '0-10', label: '0-10 years', count: 1896 },
    { value: '11-20', label: '11-20 years', count: 2512 },
    { value: '21-30', label: '21-30 years', count: 2373 },
    { value: '31-40', label: '31-40 years', count: 2271 },
    { value: '41-50', label: '41-50 years', count: 2089 },
    { value: '51-60', label: '51-60 years', count: 1580 },
    { value: '61-70', label: '61-70 years', count: 1579 },
    { value: '71-80', label: '71-80 years', count: 1579 },
    { value: '81-90', label: '81-90 years', count: 1578 },
    { value: '91-100', label: '91-100 years', count: 1578 },
    { value: '101-110', label: '101-110 years', count: 1578 },
  ];

  const ministryOptions = [
    { value: 'All', label: 'All', count: 3749 },
    { value: 'Ministry Of Social Justice and Empowerment', label: 'Social Justice & Empowerment', count: 69 },
    { value: 'Ministry Of Science And Technology', label: 'Science & Technology', count: 48 },
    { value: 'Ministry of Education', label: 'Education', count: 44 },
    { value: 'Ministry Of Agriculture and Farmers Welfare', label: 'Agriculture & Farmers Welfare', count: 27 },
    { value: 'Ministry Of Micro, Small and Medium Enterprises', label: 'MSME', count: 23 },
    { value: 'Ministry Of Textiles', label: 'Textiles', count: 17 },
    { value: 'Ministry Of Commerce And Industry', label: 'Commerce & Industry', count: 17 },
    { value: 'Ministry Of Finance', label: 'Finance', count: 14 },
    { value: 'Ministry Of Culture', label: 'Culture', count: 12 },
    { value: 'Ministry of Fisheries,Animal Husbandry and Dairying', label: 'Fisheries, Animal Husbandry & Dairying', count: 12 },
    { value: 'Ministry Of Minority Affairs', label: 'Minority Affairs', count: 10 },
    { value: 'Ministry Of Defence', label: 'Defence', count: 9 },
    { value: 'Ministry Of Rural Development', label: 'Rural Development', count: 9 },
    { value: 'Ministry Of Labour and Employment', label: 'Labour & Employment', count: 8 },
    { value: 'Ministry of Electronics and Information Technology', label: 'Electronics & IT', count: 8 },
    { value: 'Ministry Of Health & Family Welfare', label: 'Health & Family Welfare', count: 8 },
    { value: 'Ministry Of Home Affairs', label: 'Home Affairs', count: 8 },
    { value: 'Ministry Of Tourism', label: 'Tourism', count: 6 },
    { value: 'Ministry Of Skill Development And Entrepreneurship', label: 'Skill Development & Entrepreneurship', count: 6 },
  ];

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
    { value: 'All', label: 'All', count: 3749 },
    { value: 'Student', label: 'Student', count: 549 },
    { value: 'DBT Scheme', label: 'DBT Scheme', count: 307 },
    { value: 'Differently Abled', label: 'Differently Abled', count: 267 },
    { value: 'Below Poverty Line', label: 'Below Poverty Line', count: 179 },
    { value: 'Minority', label: 'Minority', count: 27 },
    { value: 'Economic Distress', label: 'Economic Distress', count: 19 },
    { value: 'Government Employee', label: 'Government Employee', count: 16 }
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
    { value: 'All', label: 'All', count: 2685 },
    { value: 'Employed', label: 'Employed', count: 712 },
    { value: 'Self-Employed/ Entrepreneur', label: 'Self-Employed/ Entrepreneur', count: 289 },
    { value: 'Unemployed', label: 'Unemployed', count: 123 },
  ];

  const residenceOptions = [
    { value: 'All', label: 'All', count: 2826 },
    { value: 'Rural', label: 'Rural', count: 620 },
    { value: 'Urban', label: 'Urban', count: 363 },
  ];

  const genderOptions = [
    { value: 'All', label: 'All', count: 2571 },
    { value: 'Female', label: 'Female', count: 717 },
    { value: 'Transgender', label: 'Transgender', count: 388 },
    { value: 'Male', label: 'Male', count: 133 },
  ];

  const benefitTypeOptions = [
    { value: 'All', label: 'All', count: 3749 },
    { value: 'Cash', label: 'Cash', count: 3213 },
    { value: 'In Kind', label: 'In Kind', count: 536 },
  ];

  const occupationOptions = [
    { value: 'All', label: 'All', count: 3749 },
    { value: 'No', label: 'No Specific Occupation', count: 1862 },
    { value: 'Construction Worker', label: 'Construction Worker', count: 661 },
    { value: 'Farmer', label: 'Farmer', count: 560 },
    { value: 'Artist', label: 'Artist', count: 151 },
    { value: 'Journalist', label: 'Journalist', count: 106 },
    { value: 'Teacher / Faculty', label: 'Teacher / Faculty', count: 84 },
    { value: 'Ex Servicemen', label: 'Ex Servicemen', count: 65 },
    { value: 'Fishermen', label: 'Fishermen', count: 53 },
    { value: 'Health Worker', label: 'Health Worker', count: 50 },
    { value: 'Sportsperson', label: 'Sportsperson', count: 41 },
    { value: 'Unorganized Worker', label: 'Unorganized Worker', count: 34 },
    { value: 'Safai Karamchari', label: 'Safai Karamchari', count: 24 },
    { value: 'Street Vendor', label: 'Street Vendor', count: 4 }
  ];

  // CORRECTED disability percentage options to match actual dataset
  const disabilityPercentageOptions = [
    { value: 'All', label: 'All', count: 3749 },
    { value: 'No Disability Requirement', label: 'No Disability Requirement', count: 3173 },
    { value: 'Any Disability (1%+)', label: 'Any Disability (1%+)', count: 446 },
    { value: 'Moderate Disability (40-59%)', label: 'Moderate Disability (40-59%)', count: 104 },
    { value: 'Mild Disability (1-39%)', label: 'Mild Disability (1-39%)', count: 47 },
    { value: 'Severe Disability (60-79%)', label: 'Severe Disability (60-79%)', count: 23 },
    { value: 'Profound Disability (80-100%)', label: 'Profound Disability (80-100%)', count: 16 }
  ];

  const categoryOptions = [
    { value: 'All', label: 'All', count: 3749 },
    { value: 'Social welfare & Empowerment', label: 'Social welfare & Empowerment', count: 864 },
    { value: 'Education & Learning', label: 'Education & Learning', count: 807 },
    { value: 'Agriculture,Rural & Environment', label: 'Agriculture, Rural & Environment', count: 418 },
    { value: 'Banking,Financial Services and Insurance', label: 'Banking, Financial Services and Insurance', count: 363 },
    { value: 'Skills & Employment', label: 'Skills & Employment', count: 322 },
    { value: 'Women and Child', label: 'Women and Child', count: 225 },
    { value: 'Business & Entrepreneurship', label: 'Business & Entrepreneurship', count: 199 },
    { value: 'Sports & Culture', label: 'Sports & Culture', count: 199 },
    { value: 'Health & Wellness', label: 'Health & Wellness', count: 122 },
    { value: 'Science, IT & Communications', label: 'Science, IT & Communications', count: 80 },
    { value: 'Housing & Shelter', label: 'Housing & Shelter', count: 58 },
    { value: 'Utility & Sanitation', label: 'Utility & Sanitation', count: 50 },
    { value: 'Public Safety,Law & Justice', label: 'Public Safety, Law & Justice', count: 42 },
    { value: 'Transport & Infrastructure', label: 'Transport & Infrastructure', count: 39 },
    { value: 'Travel & Tourism', label: 'Travel & Tourism', count: 21 }
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
      </div>
    </div>
  );
}

3