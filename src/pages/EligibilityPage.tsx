import { useState, useMemo, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { schemes, states } from '../data/schemes';

interface EligibilityForm {
  // Step 1: Personal Info
  gender: string;
  age: string;
  maritalStatus: string;
  // Step 2: Location
  state: string;
  residenceType: string;
  
  // Step 3: Category
  caste: string;
  
  // Step 4: Disability & Minority
  hasDisability: string;
  disabilityPercentage: string;
  isMinority: string;

  // Step 4.5: Agriculture Land Ownership
  ownsAgriLand: string;
  
  // Step 5: Education & Employment
  isStudent: string;
  employmentStatus: string;
  isGovEmployee: string;
  occupation: string;
  
  // Step 6: Income & BPL
  isBPL: string;
  familyIncome: string;
  parentIncome: string;
}

// Add disability percentage options from 1 to 100
const disabilityPercentageOptions = Array.from({ length: 100 }, (_, i) => (i + 1).toString());

// Add occupation options
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

export default function EligibilityPage() {
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Validation error states
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  // Load form data from localStorage or initialize empty
  const [formData, setFormData] = useState<EligibilityForm>(() => {
    const saved = localStorage.getItem('eligibilityForm');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing saved form data:', e);
      }
    }
    return {
      gender: '',
      age: '',
      maritalStatus: '',
      state: '',
      residenceType: '',
      caste: '',
      hasDisability: '',
      disabilityPercentage: '',
      isMinority: '',
      ownsAgriLand: '',
      isStudent: '',
      employmentStatus: '',
      isGovEmployee: '',
      occupation: '',
      isBPL: '',
      familyIncome: '',
      parentIncome: '',
    };
  });

  // Load results state from localStorage
  const [showResults, setShowResults] = useState(() => {
    return localStorage.getItem('eligibilityResults') === 'true';
  });

  // Validation functions
  const validateAge = (value: string): string => {
    if (!value) return '';
    const num = parseInt(value);
    if (isNaN(num)) return 'Please enter a valid age';
    if (num < 0) return 'Age cannot be negative';
    if (num > 120) return 'Please enter a realistic age (max 120)';
    return '';
  };

  const validateIncome = (value: string, fieldName: string): string => {
    if (!value) return '';
    
    // Check if contains only numbers (no special characters, letters, or commas)
    if (!/^\d+$/.test(value)) {
      return `${fieldName} should contain only numbers (no commas, letters, or special characters)`;
    }
    
    const num = parseInt(value);
    if (num < 0) return `${fieldName} cannot be negative`;
    if (num > 99999999) return `${fieldName} seems too high (max: 9,99,99,999)`;
    
    return '';
  };

  // Enhanced handleInputChange with validation
  const handleInputChange = (field: keyof EligibilityForm, value: string) => {
    let processedValue = value;
    let error = '';

    // Field-specific validation and processing
    switch (field) {
      case 'age':
        // Only allow numbers for age
        if (value && !/^\d+$/.test(value)) return;
        error = validateAge(value);
        break;
      
      case 'familyIncome':
        // Only allow numbers for income
        if (value && !/^\d+$/.test(value)) return;
        error = validateIncome(value, 'Family income');
        break;
      
      case 'parentIncome':
        // Only allow numbers for income
        if (value && !/^\d+$/.test(value)) return;
        error = validateIncome(value, 'Parent income');
        break;
      
      default:
        break;
    }

    // Update form data
    setFormData(prev => ({
      ...prev,
      [field]: processedValue
    }));

    // Update validation errors
    setValidationErrors(prev => ({
      ...prev,
      [field]: error
    }));

    // Clear validation error if field becomes valid
    if (!error && validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Function to save scroll position before navigating to scheme
  const handleSchemeClick = () => {
    sessionStorage.setItem('eligibilityScrollPosition', window.scrollY.toString());
    localStorage.setItem('eligibilityForm', JSON.stringify(formData));
    localStorage.setItem('eligibilityResults', 'true');
  };

  // Restore scroll position when returning from scheme details
  useEffect(() => {
    const savedScrollPosition = sessionStorage.getItem('eligibilityScrollPosition');
    if (savedScrollPosition && showResults) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedScrollPosition));
        sessionStorage.removeItem('eligibilityScrollPosition');
      }, 100);
    }
  }, [showResults]);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('eligibilityForm', JSON.stringify(formData));
  }, [formData]);

  // Save results state to localStorage
  useEffect(() => {
    localStorage.setItem('eligibilityResults', showResults.toString());
  }, [showResults]);

  const totalSteps = 6;

  // Restore eligibility state when returning from scheme details
  useEffect(() => {
    const savedFormData = sessionStorage.getItem('eligibilityFormData');
    const savedResults = sessionStorage.getItem('eligibilityResults');
    const savedScrollPosition = sessionStorage.getItem('eligibilityScrollPosition');
    
    if (savedFormData && savedResults) {
      setFormData(JSON.parse(savedFormData));
      setShowResults(true);
      
      if (savedScrollPosition) {
        setTimeout(() => {
          window.scrollTo(0, parseInt(savedScrollPosition));
          sessionStorage.removeItem('eligibilityScrollPosition');
        }, 100);
      }
    }
  }, []);

  const eligibleSchemes = useMemo(() => {
    if (!showResults) return [];

    return schemes.filter((scheme) => {
      // If user is a student, ONLY show student-specific schemes
      if (formData.isStudent === 'Yes') {
        const schemeText = `${scheme.title} ${scheme.details || ''} ${scheme.benefits || ''}`.toLowerCase();
        
        // Only include schemes that are explicitly FOR students
        const isDirectStudentScheme = 
          // Direct scholarship/stipend schemes
          schemeText.includes('scholarship') || 
          schemeText.includes('stipend') ||
          schemeText.includes('student loan') ||
          schemeText.includes('education loan') ||
          schemeText.includes('fee assistance') ||
          schemeText.includes('tuition fee') ||
          schemeText.includes('education grant') ||
          schemeText.includes('educational assistance') ||
          schemeText.includes('study assistance') ||
          // Schemes specifically targeting students
          schemeText.includes('for students') ||
          schemeText.includes('to students') ||
          schemeText.includes('student benefit') ||
          schemeText.includes('student support') ||
          schemeText.includes('student aid') ||
          schemeText.includes('student welfare') ||
          schemeText.includes('students pursuing') ||
          // Pre/Post matric schemes
          schemeText.includes('pre-matric') ||
          schemeText.includes('post-matric') ||
          schemeText.includes('pre matric') ||
          schemeText.includes('post matric') ||
          schemeText.includes('matric scholarship') ||
          schemeText.includes('pre-metric') ||
          schemeText.includes('post-metric') ||
          // Merit-based student schemes
          schemeText.includes('merit scholarship') ||
          schemeText.includes('academic excellence') ||
          schemeText.includes('topper') ||
          schemeText.includes('meritorious students') ||
          // Educational levels
          schemeText.includes('school students') ||
          schemeText.includes('college students') ||
          schemeText.includes('university students') ||
          schemeText.includes('undergraduate') ||
          schemeText.includes('postgraduate') ||
          schemeText.includes('graduate students') ||
          schemeText.includes('doctoral') ||
          schemeText.includes('phd students') ||
          // Class-specific schemes
          (schemeText.includes('class') && (schemeText.includes('1st') || schemeText.includes('2nd') || 
           schemeText.includes('3rd') || schemeText.includes('4th') || schemeText.includes('5th') ||
           schemeText.includes('6th') || schemeText.includes('7th') || schemeText.includes('8th') ||
           schemeText.includes('9th') || schemeText.includes('10th') || schemeText.includes('11th') ||
           schemeText.includes('12th') || schemeText.includes('i ') || schemeText.includes('ii ') ||
           schemeText.includes('iii ') || schemeText.includes('iv ') || schemeText.includes('v ') ||
           schemeText.includes('vi ') || schemeText.includes('vii ') || schemeText.includes('viii ') ||
           schemeText.includes('ix ') || schemeText.includes('x ') || schemeText.includes('xi ') ||
           schemeText.includes('xii '))) ||
          // Student specific categories
          (schemeText.includes('student') && (
            schemeText.includes('class') || 
            schemeText.includes('grade') ||
            schemeText.includes('studying') ||
            schemeText.includes('enrolled') ||
            schemeText.includes('pursuing') ||
            schemeText.includes('course') ||
            schemeText.includes('education') ||
            schemeText.includes('school') ||
            schemeText.includes('college') ||
            schemeText.includes('university') ||
            schemeText.includes('academic')
          )) ||
          // Category-specific student schemes
          (formData.caste && formData.caste !== 'General' && 
           (schemeText.includes('backward class students') ||
            schemeText.includes('sc students') ||
            schemeText.includes('st students') ||
            schemeText.includes('obc students') ||
            schemeText.includes('scheduled caste students') ||
            schemeText.includes('scheduled tribe students') ||
            schemeText.includes('minority students'))) ||
          // Gender-specific student schemes
          (formData.gender === 'Female' && 
           (schemeText.includes('girl students') ||
            schemeText.includes('female students') ||
            schemeText.includes('women students') ||
            schemeText.includes('girl child education')));
        
        // Exclude schemes that are clearly NOT for students
        const isInstitutionalScheme = 
          schemeText.includes('institution establishment') ||
          schemeText.includes('faculty recruitment') ||
          schemeText.includes('teacher training') ||
          schemeText.includes('college establishment') ||
          schemeText.includes('university grant') ||
          (schemeText.includes('infrastructure') && !schemeText.includes('student')) ||
          schemeText.includes('equipment purchase') ||
          schemeText.includes('building construction') ||
          schemeText.includes('laboratory setup');
          
        const isBusinessScheme = 
          schemeText.includes('msme') ||
          (schemeText.includes('startup') && !schemeText.includes('student startup')) ||
          schemeText.includes('tender') ||
          schemeText.includes('marketing assistance') ||
          (schemeText.includes('loan') && !schemeText.includes('education loan') && !schemeText.includes('student loan'));
        
        const isEmploymentScheme = 
          schemeText.includes('job guarantee') ||
          schemeText.includes('employment generation') ||
          schemeText.includes('skill development') && !schemeText.includes('student') ||
          schemeText.includes('vocational training') && !schemeText.includes('student');
        
        // For students, ONLY return true if it's a direct student scheme and NOT institutional/business/employment
        return isDirectStudentScheme && !isInstitutionalScheme && !isBusinessScheme && !isEmploymentScheme;
      }

      // For non-students, use filtering based on form data and scheme filters
      let isEligible = false;
      let hasRelevantCriteria = false;

      // Use the filter fields from your scheme data structure
      // Gender matching
      if (formData.gender && scheme.filter_gender) {
        hasRelevantCriteria = true;
        if (scheme.filter_gender === 'All' || scheme.filter_gender === formData.gender) {
          isEligible = true;
        } else {
          return false; // Must match gender if specified
        }
      }

      // Age matching using age_tags
      if (formData.age && scheme.age_tags && Array.isArray(scheme.age_tags)) {
        const userAge = parseInt(formData.age);
        hasRelevantCriteria = true;
        
        // Check if user's age falls within any of the scheme's age tags
        const matchesAgeTag = scheme.age_tags.some(ageTag => {
          if (ageTag === 'All Ages') return true;
          
          const [min, max] = ageTag.split('-').map(n => parseInt(n));
          if (!isNaN(min) && !isNaN(max)) {
            return userAge >= min && userAge <= max;
          }
          return false;
        });
        
        if (matchesAgeTag) {
          isEligible = true;
        }
      }

      // State matching
      if (formData.state && scheme.classified_state) {
        hasRelevantCriteria = true;
        if (scheme.classified_state === 'All India' || 
            scheme.classified_state === 'Central' || 
            scheme.classified_state === formData.state) {
          isEligible = true;
        }
      }

      // Caste matching
      if (formData.caste && scheme.filter_caste) {
        hasRelevantCriteria = true;
        if (scheme.filter_caste === 'All' || scheme.filter_caste === formData.caste) {
          isEligible = true;
        } else {
          return false; // Must match caste if specified
        }
      }

      // Residence matching
      if (formData.residenceType && scheme.filter_residence) {
        hasRelevantCriteria = true;
        if (scheme.filter_residence === 'All' || scheme.filter_residence === formData.residenceType) {
          isEligible = true;
        }
      }

      // Employment status matching
      if (formData.employmentStatus && scheme.filter_employment_status) {
        hasRelevantCriteria = true;
        if (scheme.filter_employment_status === 'All' || scheme.filter_employment_status === formData.employmentStatus) {
          isEligible = true;
        }
      }

      // Occupation matching
      if (formData.occupation && scheme.filter_occupation) {
        hasRelevantCriteria = true;
        if (scheme.filter_occupation === 'No' || scheme.filter_occupation === formData.occupation) {
          isEligible = true;
        }
      }

      // Disability matching
      if (formData.hasDisability === 'Yes' && formData.disabilityPercentage && scheme.filter_disability_percentage) {
        hasRelevantCriteria = true;
        const userDisabilityPercent = parseInt(formData.disabilityPercentage);
        
        // If scheme has no disability requirement, still eligible
        if (scheme.filter_disability_percentage === 'No Disability Requirement') {
          isEligible = true;
        } else {
          // Extract numeric requirement from scheme (e.g., "40% and above" -> 40)
          const schemeRequirement = parseInt(scheme.filter_disability_percentage);
          if (!isNaN(schemeRequirement) && userDisabilityPercent >= schemeRequirement) {
            isEligible = true;
          }
        }
      }

      // Special categories matching (BPL, etc.)
      if (formData.isBPL === 'Yes' && scheme.filter_special_categories) {
        hasRelevantCriteria = true;
        const specialCategories = Array.isArray(scheme.filter_special_categories) 
          ? scheme.filter_special_categories 
          : [scheme.filter_special_categories];
        
        if (specialCategories.includes('Below Poverty Line') || specialCategories.includes('BPL')) {
          isEligible = true;
        }
      }

      // Text-based matching for additional context
      const schemeText = `${scheme.title} ${scheme.details || ''} ${scheme.benefits || ''}`.toLowerCase();

      // Gender-specific schemes (text-based)
      if (formData.gender === 'Female') {
        if (schemeText.includes('women') || schemeText.includes('girl') || 
            schemeText.includes('female') || schemeText.includes('mother') ||
            schemeText.includes('maternity') || schemeText.includes('lady')) {
          hasRelevantCriteria = true;
          isEligible = true;
        }
      }
      
      // BPL schemes (text-based)
      if (formData.isBPL === 'Yes') {
        if (schemeText.includes('bpl') || schemeText.includes('below poverty') ||
            schemeText.includes('poor') || schemeText.includes('economically weak')) {
          hasRelevantCriteria = true;
          isEligible = true;
        }
      }
      
      // Disability schemes (text-based)
      if (formData.hasDisability === 'Yes') {
        if (schemeText.includes('disability') || schemeText.includes('disabled') ||
            schemeText.includes('handicapped') || schemeText.includes('divyang') ||
            schemeText.includes('specially abled')) {
          hasRelevantCriteria = true;
          isEligible = true;
        }
      }
      
      // Rural/Urban schemes (text-based)
      if (formData.residenceType === 'Rural') {
        if (schemeText.includes('rural') || schemeText.includes('village') ||
            schemeText.includes('farmer') || schemeText.includes('agriculture')) {
          hasRelevantCriteria = true;
          isEligible = true;
        }
      } else if (formData.residenceType === 'Urban') {
        if (schemeText.includes('urban') || schemeText.includes('city') ||
            schemeText.includes('metropolitan')) {
          hasRelevantCriteria = true;
          isEligible = true;
        }
      }
      
      // Age-based schemes (text-based)
      if (formData.age) {
        const age = parseInt(formData.age);
        if (age <= 25 && (schemeText.includes('youth') || schemeText.includes('young') ||
                          schemeText.includes('adolescent') || schemeText.includes('teenager'))) {
          hasRelevantCriteria = true;
          isEligible = true;
        }
        if (age >= 60 && (schemeText.includes('elderly') || schemeText.includes('senior') ||
                          schemeText.includes('old age') || schemeText.includes('pension'))) {
          hasRelevantCriteria = true;
          isEligible = true;
        }
      }

      // Minority schemes (only if not disabled, as per requirement)
      if (formData.hasDisability !== 'Yes' && formData.isMinority === 'Yes') {
        if (schemeText.includes('minority') || schemeText.includes('muslim') ||
            schemeText.includes('christian') || schemeText.includes('sikh') ||
            schemeText.includes('buddhist') || schemeText.includes('parsi')) {
          hasRelevantCriteria = true;
          isEligible = true;
        }
      }

      // Employment-based schemes (text-based)
      if (formData.employmentStatus === 'Unemployed') {
        if (schemeText.includes('unemployed') || schemeText.includes('job') ||
            schemeText.includes('employment') || schemeText.includes('skill development')) {
          hasRelevantCriteria = true;
          isEligible = true;
        }
      } else if (formData.employmentStatus === 'Self-Employed/ Entrepreneur') {
        if (schemeText.includes('self employed') || schemeText.includes('entrepreneur') ||
            schemeText.includes('business') || schemeText.includes('msme')) {
          hasRelevantCriteria = true;
          isEligible = true;
        }
      }

      // Agriculture-based schemes (text-based)
      if (formData.ownsAgriLand === 'Yes') {
        if (schemeText.includes('farmer') || schemeText.includes('agriculture') ||
            schemeText.includes('farming') || schemeText.includes('crop') ||
            schemeText.includes('agricultural') || schemeText.includes('kisan')) {
          hasRelevantCriteria = true;
          isEligible = true;
        }
      }

      // Only include schemes that have relevant criteria and user meets them
      return hasRelevantCriteria && isEligible;
    });
  }, [formData, showResults]);

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipToResults = () => {
    setShowResults(true);
    setTimeout(() => window.scrollTo(0, 0), 100);
  };

  const submitForm = () => {
    setShowResults(true);
    setTimeout(() => window.scrollTo(0, 0), 100);
  };

  const resetForm = () => {
    setFormData({
      gender: '',
      age: '',
      maritalStatus: '',
      state: '',
      residenceType: '',
      caste: '',
      hasDisability: '',
      disabilityPercentage: '',
      isMinority: '',
      ownsAgriLand: '',
      isStudent: '',
      employmentStatus: '',
      isGovEmployee: '',
      occupation: '',
      isBPL: '',
      familyIncome: '',
      parentIncome: '',
    });
    setValidationErrors({});
    setCurrentStep(1);
    setShowResults(false);
    // Clear session storage
    sessionStorage.removeItem('eligibilityFormData');
    sessionStorage.removeItem('eligibilityResults');
    sessionStorage.removeItem('eligibilityScrollPosition');
    // Clear localStorage
    localStorage.removeItem('eligibilityForm');
    localStorage.removeItem('eligibilityResults');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Tell us about yourself</h3>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">You are a...*</label>
              <div className="space-y-2">
                {['Male', 'Female', 'Transgender'].map(option => (
                  <button
                    key={option}
                    onClick={() => handleInputChange('gender', option)}
                    className={`w-full p-3 text-left border-2 rounded-lg transition-colors ${
                      formData.gender === option
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">And your age is*</label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  className={`flex-1 px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                    validationErrors.age 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-200 focus:border-green-500'
                  }`}
                  placeholder="Enter age (numbers only)"
                  maxLength={3}
                />
                <span className="text-gray-600">years</span>
              </div>
              {validationErrors.age && (
                <p className="text-red-600 text-sm mt-1">{validationErrors.age}</p>
              )}
            </div>

            {parseInt(formData.age) >= 18 && !validationErrors.age && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">What is your marital status?*</label>
                <div className="space-y-2">
                  {['Never Married', 'Married', 'Widowed', 'Divorced'].map(option => (
                    <button
                      key={option}
                      onClick={() => handleInputChange('maritalStatus', option)}
                      className={`w-full p-3 text-left border-2 rounded-lg transition-colors ${
                        formData.maritalStatus === option
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Location Information</h3>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Please select your state*</label>
              <select
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
              >
                <option value="">Select state</option>
                {states.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Please select your area of residence*</label>
              <div className="space-y-2">
                {['Urban', 'Rural'].map(option => (
                  <button
                    key={option}
                    onClick={() => handleInputChange('residenceType', option)}
                    className={`w-full p-3 text-left border-2 rounded-lg transition-colors ${
                      formData.residenceType === option
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Category Information</h3>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">You belong to...*</label>
              <div className="space-y-2">
                {[
                  'General',
                  'Other Backward Class (OBC)',
                  'Particularly Vulnerable Tribal Group (PVTG)',
                  'Scheduled Caste (SC)',
                  'Scheduled Tribe (ST)',
                  'De-Notified, Nomadic, and Semi-Nomadic (DNT) communities'
                ].map(option => (
                  <button
                    key={option}
                    onClick={() => handleInputChange('caste', option)}
                    className={`w-full p-3 text-left border-2 rounded-lg transition-colors ${
                      formData.caste === option
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Additional Information</h3>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Do you identify as a person with a disability?*</label>
              <div className="space-y-2">
                {['Yes', 'No'].map(option => (
                  <button
                    key={option}
                    onClick={() => {
                      handleInputChange('hasDisability', option);
                      // Reset disability percentage when switching to "No"
                      if (option === 'No') {
                        handleInputChange('disabilityPercentage', '');
                      }
                    }}
                    className={`w-full p-3 text-left border-2 rounded-lg transition-colors ${
                      formData.hasDisability === option
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Disability Percentage Question (only if disabled) */}
            {formData.hasDisability === 'Yes' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">What is your differently abled percentage?*</label>
                <select
                  value={formData.disabilityPercentage}
                  onChange={(e) => handleInputChange('disabilityPercentage', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                >
                  <option value="">Select percentage</option>
                  {disabilityPercentageOptions.map((percentage) => (
                    <option key={percentage} value={percentage}>{percentage}%</option>
                  ))}
                </select>
              </div>
            )}

            {/* Minority Question (only if NOT disabled) */}
            {formData.hasDisability !== 'Yes' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Do you belong to minority?*</label>
                <div className="space-y-2">
                  {['Yes', 'No'].map(option => (
                    <button
                      key={option}
                      onClick={() => handleInputChange('isMinority', option)}
                      className={`w-full p-3 text-left border-2 rounded-lg transition-colors ${
                        formData.isMinority === option
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Education & Employment Status</h3>
            
            {/* Question 1: Are you a student? */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Are you a student?*</label>
              <div className="space-y-2">
                {['Yes', 'No'].map(option => (
                  <button
                    key={option}
                    onClick={() => handleInputChange('isStudent', option)}
                    className={`w-full p-3 text-left border-2 rounded-lg transition-colors ${
                      formData.isStudent === option
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 2: Occupation Dropdown (only shows AFTER student selection is made) */}
            {formData.isStudent && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Occupation*</label>
                <select
                  value={formData.occupation}
                  onChange={(e) => handleInputChange('occupation', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                >
                  <option value="">-- Occupation --</option>
                  {occupationOptions.map((occupation) => (
                    <option key={occupation} value={occupation}>{occupation}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Question 3: Employment Status (only if NOT a student) */}
            {formData.isStudent === 'No' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">What is your current employment status?*</label>
                <div className="space-y-2">
                  {[
                    'Employed',
                    'Unemployed', 
                    'Self-Employed/ Entrepreneur'
                  ].map(option => (
                    <button
                      key={option}
                      onClick={() => handleInputChange('employmentStatus', option)}
                      className={`w-full p-3 text-left border-2 rounded-lg transition-colors ${
                        formData.employmentStatus === option
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Question 4: Government Employee (only if employed and not a student) */}
            {formData.isStudent === 'No' && formData.employmentStatus === 'Employed' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Are you currently working as a government employee?*</label>
                <div className="space-y-2">
                  {['Yes', 'No'].map(option => (
                    <button
                      key={option}
                      onClick={() => handleInputChange('isGovEmployee', option)}
                      className={`w-full p-3 text-left border-2 rounded-lg transition-colors ${
                        formData.isGovEmployee === option
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Income Information</h3>
            
            {/* BPL Question */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Do you belong to BPL category?*</label>
              <div className="grid grid-cols-2 gap-3">
                {['Yes', 'No'].map(option => (
                  <button
                    key={option}
                    onClick={() => handleInputChange('isBPL', option)}
                    className={`p-3 text-center border-2 rounded-lg transition-colors ${
                      formData.isBPL === option
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Family Income with validation */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">What is your family's annual income? (₹)</label>
              <input
                type="text"
                value={formData.familyIncome}
                onChange={(e) => handleInputChange('familyIncome', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                  validationErrors.familyIncome 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-gray-200 focus:border-green-500'
                }`}
                placeholder="Enter annual income (numbers only, no commas)"
                maxLength={8}
              />
              {validationErrors.familyIncome && (
                <p className="text-red-600 text-sm mt-1">{validationErrors.familyIncome}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">Enter numbers only (e.g., 500000 instead of 5,00,000)</p>
            </div>

            {/* Parent Income (only for students) with validation */}
            {formData.isStudent === 'Yes' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">What is your parent / guardian's annual income? (₹)</label>
                <input
                  type="text"
                  value={formData.parentIncome}
                  onChange={(e) => handleInputChange('parentIncome', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                    validationErrors.parentIncome 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-200 focus:border-green-500'
                  }`}
                  placeholder="Enter parent/guardian annual income (numbers only)"
                  maxLength={8}
                />
                {validationErrors.parentIncome && (
                  <p className="text-red-600 text-sm mt-1">{validationErrors.parentIncome}</p>
                )}
                <p className="text-gray-500 text-xs mt-1">Enter numbers only (e.g., 300000 instead of 3,00,000)</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Enhanced validation logic for the Next button
  const getValidationForStep = (): boolean => {
    switch (currentStep) {
      case 1: {
        const hasAge1Errors = !!validationErrors.age || !formData.gender || !formData.age;
        const needsMaritalStatus = parseInt(formData.age) >= 18 && !validationErrors.age;
        return !!(hasAge1Errors || (needsMaritalStatus && !formData.maritalStatus));
      }
      case 2:
        return !formData.state || !formData.residenceType;
      case 3:
        return !formData.caste;
      case 4:
        // If disabled, need disability percentage; if not disabled, need minority status
        if (formData.hasDisability === 'Yes') {
          return !formData.hasDisability || !formData.disabilityPercentage;
        } else {
          return !formData.hasDisability || !formData.isMinority;
        }
      case 5:
        // Student status is required first
        if (!formData.isStudent) return true;
        
        // Occupation is required for everyone (after student selection)
        if (!formData.occupation) return true;
        
        // If not a student, employment status is required
        if (formData.isStudent === 'No') {
          if (!formData.employmentStatus) return true;
          // If employed, government employee status is required
          if (formData.employmentStatus === 'Employed' && !formData.isGovEmployee) {
            return true;
          }
        }
        return false;
      case 6: {
        const hasIncomeErrors = !!validationErrors.familyIncome || !!validationErrors.parentIncome;
        return !formData.isBPL || hasIncomeErrors;
      }
      default:
        return false;
    }
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4">Your Results</h1>
            <p className="text-xl text-green-50">
              Based on your information, you may be eligible for {eligibleSchemes.length} scheme{eligibleSchemes.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Eligibility Results</h2>
                <p className="text-gray-600">
                  Found {eligibleSchemes.length} matching scheme{eligibleSchemes.length !== 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={resetForm}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Start Over
              </button>
            </div>
          </div>

          {/* Results List */}
          {eligibleSchemes.length > 0 ? (
            <div className="space-y-6">
              {eligibleSchemes.map((scheme) => (
                <div key={scheme.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          scheme.classified_state === 'Central' || scheme.classified_state === 'All India' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                        }`}>
                          {scheme.classified_state === 'Central' || scheme.classified_state === 'All India' ? 'Central' : 'State'}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                          {scheme.filter_scheme_category}
                        </span>
                      </div>
                      <CheckCircle className="text-green-500" size={24} />
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-2">{scheme.title}</h3>
                    <p className="text-gray-600 mb-4">{scheme.details}</p>

                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Key Benefits:</h4>
                      <div className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-green-600 mt-1">•</span>
                        <span>{scheme.benefits}</span>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Link
                        to={`/scheme/${scheme.id}`}
                        state={{ from: `${location.pathname}${location.search}` }}
                        onClick={handleSchemeClick}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                      >
                        View Details
                      </Link>
                      <a
                        href={scheme.url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors font-semibold"
                      >
                        Apply Now
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <AlertCircle className="mx-auto text-yellow-500 mb-4" size={48} />
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Exact Matches Found</h3>
              <p className="text-gray-600 mb-6">
                We couldn't find schemes matching all your criteria. Try adjusting your filters or browse all schemes.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={resetForm}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                  Try Different Criteria
                </button>
                <Link
                  to="/schemes"
                  className="px-6 py-3 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors font-semibold"
                >
                  Browse All Schemes
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Check Your Eligibility</h1>
          <p className="text-xl text-green-50">
            Help us find the best schemes for you
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-600">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm text-gray-500">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Form Content */}
          {renderStep()}

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            <div>
              {currentStep > 1 && (
                <button
                  onClick={prevStep}
                  className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft size={18} />
                  Back
                </button>
              )}
            </div>

            <div className="flex gap-3">
              {currentStep > 2 && (
                <button
                  onClick={skipToResults}
                  className="px-4 py-2 text-green-600 hover:text-green-700 transition-colors font-semibold"
                >
                  Skip to Results
                </button>
              )}
              
              {currentStep < totalSteps ? (
                <button
                  onClick={nextStep}
                  disabled={getValidationForStep()}
                  className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold"
                >
                  Next
                  <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  onClick={submitForm}
                  disabled={getValidationForStep()}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold"
                >
                  Submit
                </button>
              )}
            </div>
          </div>

          {/* Reset Button */}
          <div className="mt-4 text-center">
            <button
              onClick={resetForm}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Reset Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
