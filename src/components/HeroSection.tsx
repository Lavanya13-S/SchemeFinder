import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const slides = [
    {
      title: 'Discover Government Schemes',
      subtitle: 'Find schemes that are right for you',
      bgColor: 'from-green-500 to-green-600',
    },
    {
      title: 'Access Benefits Easily',
      subtitle: 'One platform for all government schemes',
      bgColor: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Empowering Citizens',
      subtitle: 'Digital India initiative for better governance',
      bgColor: 'from-orange-500 to-orange-600',
    },
  ];

  const categoryMap: { [key: string]: string } = {
    'Education & Learning': 'education',
    'Health & Wellness': 'health',
    'Agriculture': 'agriculture',
    'Social Welfare': 'social-welfare',
    'Women & Child': 'women-child',
    'Business & Entrepreneurship': 'business',
    'Skills & Employment': 'skills-employment',
    'Housing & Shelter': 'housing',
    'Banking': 'banking'
  };

  const categories = Object.keys(categoryMap);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative">
      {/* Carousel */}
      <div className="relative h-96 overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className={`w-full h-full bg-gradient-to-r ${slide.bgColor} flex items-center justify-center`}>
              <div className="text-center text-white px-4">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">{slide.title}</h2>
                <p className="text-xl md:text-2xl">{slide.subtitle}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full transition-colors"
        >
          <ChevronRight size={24} />
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="bg-white rounded-xl shadow-xl p-8">
          <h3 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">
            Find Schemes For You
          </h3>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for schemes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    navigate(`/schemes?search=${encodeURIComponent(searchQuery)}`);
                  }
                }}
                className="w-full px-6 py-4 pr-12 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 text-lg"
              />
              <button
                onClick={() => {
                  if (searchQuery.trim()) {
                    navigate(`/schemes?search=${encodeURIComponent(searchQuery)}`);
                  } else {
                    navigate('/schemes');
                  }
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Search size={20} />
              </button>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold text-gray-700 mb-4 text-center">Browse by Category</h4>
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => navigate(`/schemes?category=${categoryMap[category]}`)}
                  className="px-5 py-2 bg-green-50 text-green-700 rounded-full hover:bg-green-100 transition-colors font-medium"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
