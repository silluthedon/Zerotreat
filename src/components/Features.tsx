import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Features = () => {
  const features = [
    {
      title: "জিরো সুগার",
      description: "কোনো চিনি নেই, শুধু প্রাকৃতিক মিষ্টতা",
      image: 'https://img.freepik.com/free-photo/world-diabetes-day-sugar-cubes-glass-bowl-dark-floor_1150-26665.jpg?semt=ais_items_boosted&w=740', // Cake (placeholder)
    },
    {
      title: "জিরো ট্রান্স ফ্যাট",
      description: "হৃদয়ের জন্য সম্পূর্ণ নিরাপদ এবং স্বাস্থ্যকর",
      image: 'https://www.shutterstock.com/image-photo/word-trans-fat-made-french-260nw-2245044435.jpg', // Pastry (placeholder)
    },
    {
      title: "জিরো প্রিজার্ভেটিভ",
      description: "কোনো রাসায়নিক নেই, শুধু প্রাকৃতিক উপাদান",
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZ9zbWpwD0NlsysfRPdWLQXN3od9nYhHoHdg&s', // Snacks (placeholder)
    },
    {
      title: "লো কার্ব, হাই প্রোটিন",
      description: "ডায়াবেটিক-ফ্রেন্ডলি এবং ফিটনেসের জন্য উপযুক্ত",
      image: 'https://img.freepik.com/free-photo/flexitarian-diet-food-composition_23-2148955511.jpg?semt=ais_hybrid&w=740', // Fitness food (placeholder)
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            আমাদের বিশেষত্ব
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            ZeroTreat এর প্রতিটি পণ্য তৈরি হয়েছে আপনার স্বাস্থ্য এবং স্বাদ দুটোকেই মাথায় রেখে
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                className="text-center p-6 rounded-xl bg-gray-50 hover:bg-coffee-100 transition-all duration-300 hover:shadow-lg group"
              >
                <div className="relative inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md mb-4 group-hover:shadow-lg transition-all duration-300">
                  {isLoaded && (
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="absolute w-16 h-16 object-cover rounded-full opacity-0 animate-fadeIn"
                    />
                  )}
                  <div className="absolute w-16 h-16 flex items-center justify-center">
                    <span className="text-red-500 text-3xl font-bold">✗</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
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

export default Features;