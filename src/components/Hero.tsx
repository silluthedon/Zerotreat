import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white pt-16">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2322c55e' fill-opacity='0.1'%3E%3Cpath d='m0 40l40-40h-40z'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            নিশ্চিন্তে উপভোগ করুন প্রিয় <span className="text-green-600">কেক, স্ন্যাক্স পেস্ট্রি</span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-green-600 mb-8">
            হেলদি, কিন্তু দারুণ টেস্টি
          </h2>
          
          <p className="text-lg md:text-xl text-gray-700 mb-10 leading-relaxed max-w-3xl mx-auto">
            ডায়াবেটিস, ওজন বৃদ্ধি কিংবা হৃদরোগের ভয়ে আর নয় প্রিয় খাবার থেকে দূরে থাকা। 
            এবার থেকে খাওয়ার আনন্দ হবে এখন একদম <span className="font-semibold text-green-600">guilt-free!</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/order" 
              className="inline-flex items-center space-x-2 bg-green-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <ShoppingBag className="h-5 w-5" />
              <span>Order Now</span>
            </Link>
            
            <button 
              onClick={() => {
                const element = document.getElementById('products');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center space-x-2 border-2 border-green-500 text-green-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-50 transition-all duration-200"
            >
              <span>View Products</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;