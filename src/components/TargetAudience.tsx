import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const TargetAudience = () => {
  const audiences = [
    {
      title: "ফিটনেস সচেতন",
      description: "জিম করেন, ওজন কমান, অথচ স্বাদ ছাড়তে চান না",
      image: 'https://img.freepik.com/free-photo/attractive-fitness-couple-sporty-male-holds-barbell-slim-blond-female-holds-dumbbells-grey-background_613910-16001.jpg?semt=ais_items_boosted&w=740',
    },
    {
      title: "ডায়াবেটিক পেশেন্ট",
      description: "নিয়ম মেনে চলেন, কিন্তু কখনো কখনো মিষ্টি খেতে ইচ্ছা হয়",
      image: 'https://img.freepik.com/free-photo/close-up-doctor-with-stethoscope_23-2149191355.jpg?semt=ais_items_boosted&w=740',
    },
    {
      title: "পরিবার সচেতন",
      description: "যারা বাচ্চাদের বা নিজের জন্য স্বাস্থ্যকর বিকল্প চান",
      image: 'https://img.freepik.com/free-photo/family-autumn-park-man-black-jacket-cute-little-girl-with-parents_1157-44730.jpg?semt=ais_hybrid&w=740',
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            কাদের জন্য ZeroTreat?
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            আমাদের স্বাস্থ্যকর স্ন্যাক্স বিশেষভাবে তৈরি বিভিন্ন ধরনের স্বাস্থ্য সচেতন মানুষের জন্য
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
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
                className="relative group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 p-6"
              >
                <div className="relative mb-6 overflow-hidden rounded-xl">
                  {isLoaded ? (
                    <img
                      src={audience.image}
                      alt={audience.title}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-56 bg-gray-200 animate-pulse rounded-xl" />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-opacity duration-300">
                    <span className="text-white text-4xl font-bold drop-shadow-lg">✓</span>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3">{audience.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{audience.description}</p>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Link
            to="/order"
            className="inline-flex items-center space-x-2 bg-coffee-500 text-white px-8 py-4 rounded-full text-xl font-semibold hover:bg-coffee-600 transition-all duration-300 transform hover:scale-105"
          >
            <span>আজই অর্ডার করুন</span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.6s ease-out forwards;
          }
        `}
      </style>
    </section>
  );
};

export default TargetAudience;