import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Search,
  Leaf, 
  CreditCard, 
  Briefcase, 
  GraduationCap, 
  Heart, 
  Home, 
  Users, 
  Award, 
  Baby,
  MapPin,
  Building,
  ClipboardList,
  Sparkles,
  Send
} from 'lucide-react';
import { schemes } from '../data/schemes';

// Category configuration with proper icons and colors
const categoryConfig = {
  'Agriculture,Rural & Environment': {
    icon: Leaf,
    bgColor: 'bg-green-500',
    description: 'Farming, rural development, and environmental schemes'
  },
  'Banking,Financial Services and Insurance': {
    icon: CreditCard,
    bgColor: 'bg-blue-500',
    description: 'Financial assistance and banking services'
  },
  'Business & Entrepreneurship': {
    icon: Briefcase,
    bgColor: 'bg-purple-500',
    description: 'Startup support and business development'
  },
  'Education & Learning': {
    icon: GraduationCap,
    bgColor: 'bg-indigo-500',
    description: 'Educational scholarships and learning programs'
  },
  'Health & Wellness': {
    icon: Heart,
    bgColor: 'bg-red-500',
    description: 'Healthcare and wellness programs'
  },
  'Housing & Shelter': {
    icon: Home,
    bgColor: 'bg-orange-500',
    description: 'Housing assistance and shelter programs'
  },
  'Skills & Employment': {
    icon: Users,
    bgColor: 'bg-teal-500',
    description: 'Skill development and employment programs'
  },
  'Social welfare & Empowerment': {
    icon: Award,
    bgColor: 'bg-pink-500',
    description: 'Social welfare and empowerment programs'
  },
  'Women and Child': {
    icon: Baby,
    bgColor: 'bg-rose-500',
    description: 'Women and child welfare programs'
  }
};

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('categories');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/schemes?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Category data with counts
  const categoryData = [
    { name: 'Agriculture,Rural & Environment', displayCount: '818 schemes' },
    { name: 'Banking,Financial Services and Insurance', displayCount: '318 schemes' },
    { name: 'Business & Entrepreneurship', displayCount: '705 schemes' },
    { name: 'Education & Learning', displayCount: '1078 schemes' },
    { name: 'Health & Wellness', displayCount: '274 schemes' },
    { name: 'Housing & Shelter', displayCount: '128 schemes' },
    { name: 'Skills & Employment', displayCount: '368 schemes' },
    { name: 'Social welfare & Empowerment', displayCount: '2010 schemes' },
    { name: 'Women and Child', displayCount: '458 schemes' }
  ];

  // Get states data (showing first 6 in alphabetical order)
  const allStates = [...new Set(schemes.map(s => s.classified_state))];
  const validStates = allStates.filter((state): state is string => 
    state != null && 
    state !== 'Central' && 
    state !== 'All States' &&
    state.trim().length > 0
  ).sort();

  const displayStates = validStates.slice(0, 6).map(state => ({
    name: state,
    count: schemes.filter(s => s.classified_state === state).length
  }));

  // Get ministries data (showing first 6 by scheme count)
  const allMinistries = [...new Set(schemes.map(s => s.ministry))];
  const validMinistries = allMinistries.filter((ministry): ministry is string => 
    ministry != null && ministry.startsWith('Ministry')
  );
  
  const displayMinistries = validMinistries.map(ministry => ({
    name: ministry,
    count: schemes.filter(s => s.ministry === ministry).length
  })).sort((a, b) => b.count - a.count).slice(0, 6);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'categories':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryData.map((category) => {
              const config = categoryConfig[category.name as keyof typeof categoryConfig];
              if (!config) return null;
              
              const IconComponent = config.icon;
              
              return (
                <Link
                  key={category.name}
                  to={`/schemes?category=${encodeURIComponent(category.name)}`}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow group border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`${config.bgColor} w-12 h-12 rounded-lg flex items-center justify-center text-white`}>
                      <IconComponent size={24} />
                    </div>
                    <ArrowRight className="text-gray-400 group-hover:text-green-600 transition-colors" size={20} />
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {config.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {category.displayCount}
                    </span>
                    <span className="text-green-600 font-medium group-hover:underline text-sm">
                      Explore Schemes →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        );

      case 'states':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayStates.map((state, index) => (
              <Link
                key={index}
                to={`/schemes?states=${encodeURIComponent(state.name)}`}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow group border border-gray-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-blue-500 w-12 h-12 rounded-lg flex items-center justify-center text-white">
                    <MapPin size={24} />
                  </div>
                  <ArrowRight className="text-gray-400 group-hover:text-blue-600 transition-colors" size={20} />
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
                  {state.name}
                </h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  State and local government schemes
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {state.count} schemes
                  </span>
                  <span className="text-blue-600 font-medium group-hover:underline text-sm">
                    Explore Schemes →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        );

      case 'ministries':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayMinistries.map((ministry, index) => (
              <Link
                key={index}
                to={`/schemes?ministry=${encodeURIComponent(ministry.name)}`}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow group border border-gray-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-purple-500 w-12 h-12 rounded-lg flex items-center justify-center text-white">
                    <Building size={24} />
                  </div>
                  <ArrowRight className="text-gray-400 group-hover:text-purple-600 transition-colors" size={20} />
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight line-clamp-2">
                  {ministry.name}
                </h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  Central government ministry schemes
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {ministry.count} schemes
                  </span>
                  <span className="text-purple-600 font-medium group-hover:underline text-sm">
                    Explore Schemes →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  const getViewAllButton = () => {
    switch (activeTab) {
      case 'categories':
        return (
          <Link
            to="/schemes"
            className="inline-flex items-center bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition-colors shadow-lg"
          >
            View All Schemes
            <ArrowRight className="ml-2" size={18} />
          </Link>
        );
      case 'states':
        return (
          <Link
            to="/states"
            className="inline-flex items-center bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors shadow-lg"
          >
            View All States & UTs
            <ArrowRight className="ml-2" size={18} />
          </Link>
        );
      case 'ministries':
        return (
          <Link
            to="/ministries"
            className="inline-flex items-center bg-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors shadow-lg"
          >
            View All Ministries
            <ArrowRight className="ml-2" size={18} />
          </Link>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-100 to-blue-50 py-20" style={{
        background: 'linear-gradient(135deg, #f1f5f9 0%, #e0f2fe 100%)'
      }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Find Government <span className="text-green-600">Schemes</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            Discover and apply for government schemes that you're eligible for. Get financial
            assistance, welfare benefits, and support programs designed for you.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search for schemes by name, category, or benefits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-32 py-4 text-lg border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-lg bg-white"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors font-medium"
              >
                Search
              </button>
            </div>
          </form>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/schemes"
              className="bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition-colors shadow-lg inline-flex items-center justify-center"
            >
              Browse All Schemes
              <ArrowRight className="ml-2" size={18} />
            </Link>
            <Link
              to="/eligibility"
              className="border-2 border-green-600 text-green-600 px-8 py-3 rounded-full font-semibold hover:bg-green-50 transition-colors"
            >
              Check Eligibility
            </Link>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-500 mb-2">4,242</div>
              <div className="text-gray-600 text-lg font-medium">Total Schemes</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-500 mb-2">564</div>
              <div className="text-gray-600 text-lg font-medium">Central Schemes</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-500 mb-2">15</div>
              <div className="text-gray-600 text-lg font-medium">Categories</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-500 mb-2">37</div>
              <div className="text-gray-600 text-lg font-medium">States & UTs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center py-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button 
                onClick={() => setActiveTab('categories')}
                className={`px-6 py-2 rounded-md font-medium text-sm ${
                  activeTab === 'categories' 
                    ? 'bg-green-500 text-white' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Browse by Category
              </button>
              <button 
                onClick={() => setActiveTab('states')}
                className={`px-6 py-2 rounded-md font-medium text-sm ${
                  activeTab === 'states' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                State/UT
              </button>
              <button 
                onClick={() => setActiveTab('ministries')}
                className={`px-6 py-2 rounded-md font-medium text-sm ${
                  activeTab === 'ministries' 
                    ? 'bg-purple-500 text-white' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Central
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {activeTab === 'categories' && 'Browse by Category'}
            {activeTab === 'states' && 'Browse by State/UT'}
            {activeTab === 'ministries' && 'Browse by Ministry'}
          </h2>
          <p className="text-xl text-gray-600">
            {activeTab === 'categories' && 'Find schemes in the category that matters most to you'}
            {activeTab === 'states' && 'Find schemes available in your state or union territory'}
            {activeTab === 'ministries' && 'Find schemes organized by central government ministries'}
          </p>
        </div>

        {/* Tab Content */}
        {renderTabContent()}

        {/* View All Button */}
        <div className="text-center mt-12">
          {getViewAllButton()}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How it works
            </h2>
            <p className="text-xl text-gray-600">
              Easy steps to apply for Government Schemes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Enter Details */}
            <div className="group relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 border-2 border-blue-200">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <ClipboardList className="text-white" size={32} />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Step 1
                </h3>
                <h4 className="text-xl font-semibold text-blue-700 mb-4">
                  Enter Details
                </h4>
                <p className="text-gray-700 text-base leading-relaxed font-medium">
                  Start by entering your basic information, age, income, and personal details to help us identify the most relevant schemes for your profile.
                </p>
              </div>
            </div>

            {/* Card 2: Search */}
            <div className="group relative bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 border-2 border-green-200">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="text-white" size={32} />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Step 2
                </h3>
                <h4 className="text-xl font-semibold text-green-700 mb-4">
                  Search
                </h4>
                <p className="text-gray-700 text-base leading-relaxed font-medium">
                  Our intelligent search engine instantly filters through thousands of schemes to match your profile and display only the ones you're eligible for.
                </p>
              </div>
            </div>

            {/* Card 3: Select & Apply */}
            <div className="group relative bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 border-2 border-purple-200">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Send className="text-white" size={32} />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Step 3
                </h3>
                <h4 className="text-xl font-semibold text-purple-700 mb-4">
                  Select & Apply
                </h4>
                <p className="text-gray-700 text-base leading-relaxed font-medium">
                  Compare benefits and requirements, select the schemes that work best for you, and complete the application process with guided step-by-step instructions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-green-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Find Your Perfect Scheme?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Use our eligibility checker to find schemes tailored specifically for you
          </p>
          
          <Link
            to="/eligibility"
            className="inline-block bg-white text-green-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-50 transition-colors shadow-lg text-lg"
          >
            Check Your Eligibility
          </Link>
        </div>
      </div>
    </div>
  );
}
