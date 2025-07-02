import React from 'react';
import { Award, Search, Home, Heart } from 'lucide-react';

const WhyZeroTreat = () => {
  const reasons = [
    {
      icon: <Award className="h-8 w-8 text-green-500" />,
      title: "বাজারে প্রথম",
      description: "হেলদি পেস্ট্রি ও স্ন্যাক্স ব্র্যান্ড"
    },
    {
      icon: <Search className="h-8 w-8 text-green-500" />,
      title: "রিসার্চ-ভিত্তিক",
      description: "বৈজ্ঞানিক পদ্ধতিতে তৈরি রেসিপি"
    },
    {
      icon: <Home className="h-8 w-8 text-green-500" />,
      title: "হোম-বেইজড",
      description: "হাইজেনিক পরিবেশে তৈরি"
    },
    {
      icon: <Heart className="h-8 w-8 text-green-500" />,
      title: "স্বাস্থ্য ও আনন্দ",
      description: "খেতে সুস্বাদু, শরীরও থাকে ভালো"
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        কেন ZeroTreat বেছে নেবেন?
      </h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {reasons.map((reason, index) => (
        <div 
          key={index} 
          className="text-center p-6 rounded-xl bg-gray-50 hover:bg-coffee-100 transition-all duration-300 group"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md mb-4 group-hover:shadow-lg transition-all duration-300">
            {React.cloneElement(reason.icon, { className: "h-8 w-8 text-coffee-500" })}
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            {reason.title}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {reason.description}
          </p>
        </div>
      ))}
    </div>

    <div className="mt-16 bg-coffee-50 rounded-2xl p-8 md:p-12 text-center">
      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
        আমাদের প্রতিশ্রুতি
      </h3>
      <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
        ZeroTreat শুধু একটি ব্র্যান্ড নয়, এটি একটি জীবনযাত্রার পরিবর্তন। আমরা বিশ্বাস করি যে 
        স্বাস্থ্যকর খাবার মানেই স্বাদহীন নয়। আমাদের লক্ষ্য হলো আপনার প্রিয় খাবারগুলোকে আরও স্বাস্থ্যকর 
        করে তোলা, যাতে আপনি কোনো সমঝোতা ছাড়াই উপভোগ করতে পারেন।
      </p>
    </div>
  </div>
</section>
  );
};

export default WhyZeroTreat;