import React from 'react';
import { Zap, Heart, Leaf, Activity } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Zap className="h-8 w-8 text-green-500" />,
      title: "জিরো সুগার",
      description: "কোনো চিনি নেই, শুধু প্রাকৃতিক মিষ্টতা"
    },
    {
      icon: <Heart className="h-8 w-8 text-green-500" />,
      title: "জিরো ট্রান্স ফ্যাট",
      description: "হৃদয়ের জন্য সম্পূর্ণ নিরাপদ এবং স্বাস্থ্যকর"
    },
    {
      icon: <Leaf className="h-8 w-8 text-green-500" />,
      title: "জিরো প্রিজার্ভেটিভ",
      description: "কোনো রাসায়নিক নেই, শুধু প্রাকৃতিক উপাদান"
    },
    {
      icon: <Activity className="h-8 w-8 text-green-500" />,
      title: "লো কার্ব, হাই প্রোটিন",
      description: "ডায়াবেটিক-ফ্রেন্ডলি এবং ফিটনেসের জন্য উপযুক্ত"
    }
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
      {features.map((feature, index) => (
        <div 
          key={index} 
          className="text-center p-6 rounded-xl bg-gray-50 hover:bg-coffee-100 transition-all duration-300 hover:shadow-lg group"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md mb-4 group-hover:shadow-lg transition-all duration-300">
            {React.cloneElement(feature.icon, { className: "h-8 w-8 text-coffee-500" })}
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            {feature.title}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>
  );
};

export default Features;