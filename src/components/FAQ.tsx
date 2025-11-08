import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'What is SchemeFinder?',
      answer: 'SchemeFinder is a one-stop platform where you can explore government schemes you may be eligible for. The platform provides information about various Central and State Government schemes in a user-friendly manner.',
    },
    {
      question: 'How do I find schemes relevant to me?',
      answer: 'You can search for schemes by entering your details such as age, location, occupation, and other demographic information. The platform will then show you schemes that match your profile.',
    },
    {
      question: 'Is this service free?',
      answer: 'Yes, SchemeFinder is completely free to use. It is a government initiative to help citizens discover and access government schemes easily.',
    },
    {
      question: 'Can I apply for schemes through this platform?',
      answer: 'SchemeFinder helps you discover and learn about various schemes. For application, you will be redirected to the respective scheme\'s official website or portal.',
    },
    {
      question: 'How often is the information updated?',
      answer: 'The scheme information is regularly updated to ensure you get the most current and accurate details about various government schemes.',
    },
    {
      question: 'Do I need to create an account?',
      answer: 'While you can search for schemes without an account, creating an account allows you to save your profile and get personalized scheme recommendations.',
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600">Find answers to common questions about SchemeFinder</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-800 pr-4">{faq.question}</span>
                <ChevronDown
                  size={20}
                  className={`text-gray-500 flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-4 text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
