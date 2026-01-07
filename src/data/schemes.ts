import rawData from './Final Dataset 0601.json';

// Define the Scheme type based on your dataset structure
export interface Scheme {
  scheme_id: string;
  id?: string;
  title: string;
  url?: string;
  ministry?: string;
  details: string;
  benefits: string;
  eligibility?: string;
  exclusions?: string;
  application_process?: string;
  documents_required?: string;
  faq?: Array<{
    question: string;
    answer: string;
  }>;
  sources_and_references?: string;
  classified_state: string;
  filter_age_group?: string;
  filter_disability_percentage?: string;
  filter_scheme_category: string[];
  filter_gender: string;
  filter_occupation: string;
  filter_benefit_type: string;
  filter_caste: string[];  // Changed from string to string[]
  filter_residence: string;
  filter_marital_status: string;
  filter_employment_status: string;
  filter_special_categories: string | string[];
  age_tags?: string[];
  age_coverage_description?: string;
  filter_disability_types?: string[];
  disability_percentage_numeric?: number;
  scheme_level?: string;
  implementation_type?: string;
}

// The raw data is an array of schemes
const schemeData = Array.isArray(rawData) ? rawData : [];

// Helper function to convert array to single value or keep as All
const arrayToSingleValue = (arr: any[], defaultValue: string = 'All'): string => {
  if (!arr || !Array.isArray(arr) || arr.length === 0) return defaultValue;
  if (arr.includes('All') || arr.length > 1) return 'All';
  return arr[0];
};

// Helper function to determine disability percentage range
const getDisabilityPercentage = (requiresDisability: boolean, disabilityPercent: any): string => {
  if (!requiresDisability) return 'No Disability Requirement';
  if (!disabilityPercent || (!disabilityPercent.min && !disabilityPercent.max)) {
    return 'Any Disability (1%+)';
  }
  const min = disabilityPercent.min || 0;
  const max = disabilityPercent.max || 100;
  
  if (min >= 80) return 'Profound Disability (80-100%)';
  if (min >= 60) return 'Severe Disability (60-79%)';
  if (min >= 40) return 'Moderate Disability (40-59%)';
  if (min >= 1 && max < 40) return 'Mild Disability (1-39%)';
  return 'Any Disability (1%+)';
};

// Helper to get primary state
const getPrimaryState = (states: string[]): string => {
  if (!states || states.length === 0) return 'Central';
  if (states.includes('All India')) return 'Central';
  // Filter out generic values
  const filtered = states.filter(s => 
    s !== 'Not specified' && 
    s !== 'All India'
  );
  if (filtered.length === 0) return 'Central';
  return filtered[0];
};

// Helper to generate age tags from age_criteria
const generateAgeTags = (ageCriteria: any): string[] => {
  if (!ageCriteria) return [];
  const min = ageCriteria.min || 0;
  const max = ageCriteria.max || 110;
  
  const tags: string[] = [];
  const ranges = [
    { range: '0-10', min: 0, max: 10 },
    { range: '11-20', min: 11, max: 20 },
    { range: '21-30', min: 21, max: 30 },
    { range: '31-40', min: 31, max: 40 },
    { range: '41-50', min: 41, max: 50 },
    { range: '51-60', min: 51, max: 60 },
    { range: '61-70', min: 61, max: 70 },
    { range: '71-80', min: 71, max: 80 },
    { range: '81-90', min: 81, max: 90 },
    { range: '91-100', min: 91, max: 100 },
    { range: '101-110', min: 101, max: 110 }
  ];
  
  for (const r of ranges) {
    // Check if this range overlaps with the age criteria
    if (min <= r.max && max >= r.min) {
      tags.push(r.range);
    }
  }
  
  return tags.length > 0 ? tags : ['0-10', '11-20', '21-30', '31-40', '41-50', '51-60', '61-70', '71-80', '81-90', '91-100', '101-110'];
};

// Transform the new dataset structure to match the old structure
const allSchemes: Scheme[] = (schemeData as any[]).map((rawScheme: any) => {
  // Get primary ministry
  const ministries = rawScheme.ministry || [];
  const primaryMinistry = Array.isArray(ministries) && ministries.length > 0 ? ministries[0] : '';
  
  // Keep ALL categories for the scheme (schemes can be in multiple categories)
  const schemeCategories = Array.isArray(rawScheme.scheme_category) 
    ? rawScheme.scheme_category 
    : [];
  
  return {
    scheme_id: String(rawScheme.scheme_id || ''),
    id: String(rawScheme.scheme_id || ''),
    title: rawScheme.scheme_name || 'Untitled Scheme',
    url: rawScheme.url || '',
    ministry: primaryMinistry,
    details: rawScheme.details || '',
    benefits: rawScheme.benefits || '',
    eligibility: rawScheme.eligibility || '',
    exclusions: rawScheme.exclusions || '',
    application_process: rawScheme.application_process || '',
    documents_required: rawScheme.documents_required || '',
    faq: rawScheme.faqs || [],
    sources_and_references: rawScheme.sources_references || '',
    classified_state: getPrimaryState(rawScheme.states || []),
    filter_scheme_category: schemeCategories,
    filter_gender: arrayToSingleValue(rawScheme.gender),
    filter_caste: Array.isArray(rawScheme.caste_categories) ? rawScheme.caste_categories : ['All'],
    filter_residence: arrayToSingleValue(rawScheme.residence, 'Both') === 'Both' ? 'All' : arrayToSingleValue(rawScheme.residence, 'Both'),
    filter_benefit_type: arrayToSingleValue(rawScheme.benefit_type),
    filter_marital_status: arrayToSingleValue(rawScheme.marital_status),
    filter_employment_status: arrayToSingleValue(rawScheme.employment_status),
    filter_occupation: arrayToSingleValue(rawScheme.occupations, 'No'),
    filter_special_categories: rawScheme.special_categories || [],
    filter_disability_percentage: getDisabilityPercentage(rawScheme.requires_disability, rawScheme.disability_percent),
    age_tags: generateAgeTags(rawScheme.age_criteria),
    age_coverage_description: rawScheme.age_criteria ? 
      `${rawScheme.age_criteria.min || 0} - ${rawScheme.age_criteria.max || 110} years` : undefined,
    scheme_level: rawScheme.scheme_level,
    implementation_type: rawScheme.implementation_type,
  };
});

// Extract unique categories from the dataset
const extractCategories = () => {
  const categorySet = new Set<string>();
  allSchemes.forEach(scheme => {
    // Now filter_scheme_category is an array
    if (Array.isArray(scheme.filter_scheme_category)) {
      scheme.filter_scheme_category.forEach(cat => categorySet.add(cat));
    }
  });
  return Array.from(categorySet).map((name, index) => ({
    id: index + 1,
    name: name
  }));
};

// Extract unique states from the dataset
const extractStates = () => {
  const stateSet = new Set<string>();
  allSchemes.forEach(scheme => {
    if (scheme.classified_state) {
      stateSet.add(scheme.classified_state);
    }
  });
  return Array.from(stateSet).sort();
};

// Export the main data
export const schemes = allSchemes;
export const categories = extractCategories();
export const states = extractStates();
export const metadata = { total_schemes: allSchemes.length };

// Helper function to get scheme counts by category
// Note: Sum will be > total schemes since schemes can be in multiple categories
export const getSchemeCountsByCategory = () => {
  const counts: { [key: string]: number } = {};
  allSchemes.forEach(scheme => {
    // Each scheme can have multiple categories
    if (Array.isArray(scheme.filter_scheme_category)) {
      scheme.filter_scheme_category.forEach(category => {
        counts[category] = (counts[category] || 0) + 1;
      });
    }
  });
  return counts;
};

// Helper function to get scheme counts by state
export const getSchemeCountsByState = () => {
  const counts: { [key: string]: number } = {};
  allSchemes.forEach(scheme => {
    const state = scheme.classified_state;
    if (state) {
      counts[state] = (counts[state] || 0) + 1;
    }
  });
  return counts;
};
