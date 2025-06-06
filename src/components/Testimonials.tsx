import React from "react";
import { Star, Quote } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "সিল্লু দ্য বিল্লু",
      review:
        "এবরা কা ডেবরা",
    },
    {
      name: "সবজি",
      review:
        "এবরা কা ডেবরা",
    },
    {
      name: "রাইসা",
      review:
        "এবরা কা ডেবরা",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            গ্রাহকদের মতামত
          </h2>
          <p className="text-lg text-gray-600">আমাদের সন্তুষ্ট গ্রাহকদের অভিজ্ঞতা শুনুন</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 relative"
            >
              <div className="absolute top-4 right-4 text-green-500">
                <Quote className="h-8 w-8 opacity-20" />
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900">{testimonial.name}</h3>
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed italic">"{testimonial.review}"</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 bg-green-100 px-6 py-3 rounded-full">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="text-gray-700 font-semibold">৪.৯/৫ রেটিং</span>
            <span className="text-gray-500">৫০০+ রিভিউ</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;