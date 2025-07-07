import React, { useState, useEffect } from 'react';
import zeroSugar from '../assets/images/zero-sugar.jpg';
import zeroTransFat from '../assets/images/zero-trans-fat.jpg';
import zeroPreservatives from '../assets/images/zero-preservatives.jpg';
import lowCarbHighProtein from '../assets/images/low-carb-high-protein.jpg';

const Features = () => {
  const features = [
    {
      title: "জিরো সুগার",
      description: "কোনো চিনি নেই, শুধু প্রাকৃতিক মিষ্টতা",
      image: zeroSugar,
    },
    {
      title: "জিরো ট্রান্স ফ্যাট",
      description: "হার্টের জন্য সম্পূর্ণ নিরাপদ এবং স্বাস্থ্যকর",
      image: zeroTransFat,
    },
    {
      title: "জিরো প্রিজার্ভেটিভ",
      description: "কোনো রাসায়নিক নেই, শুধু প্রাকৃতিক উপাদান",
      image: zeroPreservatives,
    },
    {
      title: "লো কার্ব, হাই প্রোটিন",
      description: "ডায়াবেটিক-ফ্রেন্ডলি এবং ফিটনেসের জন্য উপযুক্ত",
      image: lowCarbHighProtein,
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            আমাদের বিশেষত্ব
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            ZeroTreat এর প্রতিটি পণ্য তৈরি হয়েছে আপনার স্বাস্থ্য এবং স্বাদ দুটোকেই মাথায় রেখে 
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const [isLoaded, setIsLoaded] = useState(false);

            useEffect(() => {
              const img = new Image();
              img.src = feature.image;
              img.onload = () => setIsLoaded(true);
            }, [feature.image]);

            return (
              <div
                key={index}
                className="relative group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 p-6"
              >
                <div className="relative mb-6 overflow-hidden rounded-xl">
                  {isLoaded ? (
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 animate-pulse rounded-xl" />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-opacity duration-300">
                    <span className="text-red-600 text-9xl font-semibold drop-shadow-md">✗</span>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
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
          /* Ensure cross sign size */
          .text-8xl {
            font-size: 18rem; /* Custom size for extra large cross */
          }
        `}
      </style>
    </section>
  );
};

export default Features;