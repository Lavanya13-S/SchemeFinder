import schemeData from './Final Scheme Dataset.json';

// Define the Scheme type based on your dataset structure
export interface Scheme {
  scheme_id?: number;
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
  feedback?: string;
  classified_state: string;
  myscheme_classification?: any;
  filter_age_group?: string;
  filter_disability_percentage?: string;
  filter_scheme_category: string;
  filter_gender: string;
  filter_occupation: string;
  filter_benefit_type: string;
  filter_caste: string;
  filter_residence: string;
  filter_marital_status: string;
  filter_employment_status: string;
  filter_special_categories: string | string[];
  age_tags?: string[];
  age_coverage_description?: string;
  filter_disability_types?: string[];
  disability_percentage_numeric?: number;
}

// Define the structure of your JSON data
interface SchemeData {
  metadata: any;
  schemes_by_state: {
    [state: string]: Scheme[];
  };
}

// Extract all schemes from the state-wise structure
const allSchemes: Scheme[] = Object.values((schemeData as SchemeData).schemes_by_state).flat();

// Extract unique categories from the dataset
const extractCategories = () => {
  const categorySet = new Set<string>();
  allSchemes.forEach(scheme => {
    if (scheme.filter_scheme_category) {
      categorySet.add(scheme.filter_scheme_category);
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
export const metadata = (schemeData as SchemeData).metadata;

// Helper function to get scheme counts by category
export const getSchemeCountsByCategory = () => {
  const counts: { [key: string]: number } = {};
  allSchemes.forEach(scheme => {
    const category = scheme.filter_scheme_category;
    if (category) {
      counts[category] = (counts[category] || 0) + 1;
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
