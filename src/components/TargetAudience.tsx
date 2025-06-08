import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const TargetAudience = () => {
  const audiences = [
    {
      title: "ফিটনেস সচেতন",
      description: "জিম করেন, ওজন কমান, অথচ স্বাদ ছাড়তে চান না",
      image: 'https://img.freepik.com/free-photo/attractive-fitness-couple-sporty-male-holds-barbell-slim-blond-female-holds-dumbbells-grey-background_613910-16001.jpg?semt=ais_items_boosted&w=740', // Fitness person
    },
    {
      title: "ডায়াবেটিক পেশেন্ট",
      description: "নিয়ম মেনে চলেন, কিন্তু কখনো কখনো মিষ্টি খেতে ইচ্ছা হয়",
      image: 'https://img.freepik.com/free-photo/close-up-doctor-with-stethoscope_23-2149191355.jpg?semt=ais_items_boosted&w=740', // Person with health focus
    },
    {
      title: "পরিবার সচেতন",
      description: "যারা বাচ্চাদের বা নিজের জন্য স্বাস্থ্যকর বিকল্প চান",
      image: 'https://img.freepik.com/free-photo/family-autumn-park-man-black-jacket-cute-little-girl-with-parents_1157-44730.jpg?semt=ais_hybrid&w=740', // Family
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            কাদের জন্য ZeroTreat?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            আমাদের স্বাস্থ্যকর স্ন্যাক্স বিশেষভাবে তৈরি বিভিন্ন ধরনের স্বাস্থ্য সচেতন মানুষের জন্য
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {audiences.map((audience, index) => {
            const [isLoaded, setIsLoaded] = useState(false);

            useEffect(() => {
              const img = new Image();
              img.src = audience.image;
              img.onload = () => setIsLoaded(true);
            }, [audience.image]);

            return (
              <div 
                key={index} 
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-center group hover:bg-coffee-100"
              >
                <div className="relative mb-6">
                  <div
                    className={`w-16 h-16 bg-coffee-100 rounded-full mx-auto flex items-center justify-center transition-colors duration-300 group-hover:bg-coffee-200 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                  />
                  {isLoaded && (
                    <img
                      src={audience.image}
                      alt={audience.title}
                      className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-16 object-cover rounded-full opacity-0 animate-fadeIn"
                    />
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {audience.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {audience.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Link 
            to="/order" 
            className="inline-flex items-center space-x-2 bg-coffee-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-coffee-600 transition-all duration-200"
          >
            <span>আজই অর্ডার করুন</span>
          </Link>
        </div>
      </div>

      {/* CSS for fade-in animation */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 50%; }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-in-out forwards;
          }
        `}
      </style>
    </section>
  );
};

export default TargetAudience;