import { Play } from 'lucide-react';

export default function AboutSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">About SchemeFinder</h2>
            <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
              <p>
                SchemeFinder is a National Platform that aims to offer one-stop search and discovery of
                Government schemes. It provides an innovative, technology-based solution to discover
                scheme information based on the eligibility of the citizen.
              </p>
              <p>
                The platform helps citizens find schemes that they are eligible for and provides
                information about application processes, documents required, and other relevant details.
              </p>
              <p>
                This initiative is part of Digital India's vision to transform the country into a
                digitally empowered society and knowledge economy.
              </p>
            </div>
            <button className="mt-8 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
              Learn More
            </button>
          </div>

          {/* Video Placeholder */}
          <div className="relative">
            <div className="aspect-video bg-gradient-to-br from-green-400 to-green-600 rounded-xl shadow-xl flex items-center justify-center">
              <button className="w-20 h-20 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                <Play size={32} className="text-green-600 ml-1" fill="currentColor" />
              </button>
            </div>
            <div className="mt-4 text-center text-gray-600">
              <p className="font-semibold">Watch How SchemeFinder Works</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
