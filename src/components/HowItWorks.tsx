import { CircleUser as UserCircle, Search, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HowItWorks() {
  const navigate = useNavigate();
  const steps = [
    {
      icon: UserCircle,
      title: 'Enter Details',
      description: 'Provide basic information about yourself to get personalized scheme recommendations',
    },
    {
      icon: Search,
      title: 'Search Schemes',
      description: 'Our system matches you with relevant government schemes based on your profile',
    },
    {
      icon: CheckCircle,
      title: 'Select & Apply',
      description: 'Choose schemes that fit your needs and apply directly through the portal',
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">How It Works</h2>
          <p className="text-lg text-gray-600">Simple steps to find and apply for government schemes</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600 text-white rounded-full mb-6">
                  <step.icon size={36} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-green-200">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-l-8 border-l-green-200 border-y-4 border-y-transparent"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/check-eligibility')}
            className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors shadow-lg"
          >
            Get Started Now
          </button>
        </div>
      </div>
    </section>
  );
}
