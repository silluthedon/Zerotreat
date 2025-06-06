import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "আপনার পণ্য কি ডায়াবেটিক-ফ্রেন্ডলি?",
      answer: "হ্যাঁ, আমাদের সব পণ্যই ডায়াবেটিক-ফ্রেন্ডলি। আমরা কোনো চিনি ব্যবহার করি না এবং শুধুমাত্র প্রাকৃতিক মিষ্টি ব্যবহার করি যা রক্তে শর্করার মাত্রা বাড়ায় না।"
    },
    {
      question: "ডেলিভারি কবে হয়?",
      answer: "আমরা প্রতি রবিবার ঢাকার মধ্যে ডেলিভারি দিয়ে থাকি। অর্ডার করার সময় আপনি সুবিধাজনক সময় বেছে নিতে পারবেন।"
    },
    {
      question: "পণ্যের শেল্ফ লাইফ কত দিন?",
      answer: "আমাদের পণ্যগুলো কোনো প্রিজার্ভেটিভ ছাড়াই তৈরি, তাই ৫-৭ দিনের মধ্যে খেয়ে ফেলা ভালো। ফ্রিজে রাখলে ১০-১২ দিন পর্যন্ত ভালো থাকে।"
    },
    {
      question: "কীভাবে অর্ডার করব?",
      answer: "আমাদের ওয়েবসাইটের অর্ডার পেজে গিয়ে আপনার পছন্দের পণ্য নির্বাচন করুন। অর্ডার ফর্ম পূরণ করে সাবমিট করুন। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।"
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            সচরাচর জিজ্ঞাসিত প্রশ্ন
          </h2>
          <p className="text-lg text-gray-600">
            আপনার মনে থাকা প্রশ্নগুলোর উত্তর পেয়ে যান
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 flex justify-between items-center transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-green-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-green-500 flex-shrink-0" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-4 bg-gray-50">
                  <p className="text-gray-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            আরও প্রশ্ন আছে? আমাদের সাথে যোগাযোগ করুন
          </p>
          <a 
            href="mailto:hello@zerotreat.com" 
            className="text-green-600 font-semibold hover:text-green-700 transition-colors"
          >
            hello@zerotreat.com
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;