import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, HeartPulse, Users } from 'lucide-react';

const TargetAudience = () => {
  const audiences = [
    {
      icon: <Dumbbell className="h-8 w-8 text-green-500" />,
      title: "ফিটনেস সচেতন",
      description: "জিম করেন, ওজন কমান, অথচ স্বাদ ছাড়তে চান না"
    },
    {
      icon: <HeartPulse className="h-8 w-8 text-green-500" />,
      title: "ডায়াবেটিক পেশেন্ট",
      description: "নিয়ম মেনে চলেন, কিন্তু কখনো কখনো মিষ্টি খেতে ইচ্ছা হয়"
    },
    {
      icon: <Users className="h-8 w-8 text-green-500" />,
      title: "পরিবার সচেতন",
      description: "যারা বাচ্চাদের বা নিজের জন্য স্বাস্থ্যকর বিকল্প চান"
    }
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
      {audiences.map((audience, index) => (
        <div 
          key={index} 
          className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-center group hover:bg-coffee-100"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-coffee-100 rounded-full mb-6 group-hover:bg-coffee-200 transition-colors duration-300">
            {React.cloneElement(audience.icon, { className: "h-8 w-8 text-coffee-500" })}
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {audience.title}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {audience.description}
          </p>
        </div>
      ))}
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
</section>
  );
};

export default TargetAudience;