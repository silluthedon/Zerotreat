import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

const Hero = () => {
  // Array of background images (replace with your actual image URLs)
  const images = [
    'https://img.freepik.com/free-photo/chocolate-cake-with-cream-nuts-chocolate-spread_140725-10904.jpg?semt=ais_hybrid&w=740', // Cake
    'https://img.freepik.com/free-photo/ai-generated-cake-picture_23-2150649466.jpg?semt=ais_items_boosted&w=740', // Pastry
    'https://img.freepik.com/premium-photo/variation-different-unhealthy-snacks-crackers-sweet-salted-popcorn-tortillas-nuts-straws-bretsels_136595-3545.jpg?semt=ais_hybrid&w=740', // Snacks
  ];

  // Preload images to prevent flickering
  useEffect(() => {
    images.forEach((image) => {
      const img = new Image();
      img.src = image;
    });
  }, [images]);

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-coffee-50 to-white pt-16 overflow-hidden">
      {/* Background Slideshow */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="flex h-full animate-slide"
          style={{
            width: `${images.length * 100}%`,
          }}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="h-full flex-1 bg-cover bg-center opacity-30" // Reduced opacity to 30% for better text clarity
              style={{
                backgroundImage: `url(${image})`,
                width: `${100 / images.length}%`,
              }}
            />
          ))}
        </div>
        {/* Subtle pattern overlay with reduced opacity */}
        <div
          className="absolute inset-0 bg-coffee-900 opacity-10 z-10" // Added a semi-transparent dark overlay
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%238B6F47' fill-opacity='0.1'%3E%3Cpath d='m0 40l40-40h-40z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-20">
        <div className="max-w-4xl mx-auto bg-white bg-opacity-70 rounded-xl p-8 shadow-lg"> {/* Added semi-transparent white background */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight drop-shadow-md">
            নিশ্চিন্তে উপভোগ করুন প্রিয় <span className="text-coffee-500">কেক, স্ন্যাক্স পেস্ট্রি</span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-coffee-500 mb-8 drop-shadow-md">
            হেলদি, কিন্তু দারুণ টেস্টি
          </h2>
          
          <p className="text-lg md:text-xl text-gray-700 mb-10 leading-relaxed max-w-3xl mx-auto drop-shadow-md">
            ডায়াবেটিস, ওজন বৃদ্ধি কিংবা হৃদরোগের ভয়ে আর নয় প্রিয় খাবার থেকে দূরে থাকা। 
            এবার থেকে খাওয়ার আনন্দ হবে এখন একদম <span className="font-semibold text-coffee-500">guilt-free!</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/order" 
              className="inline-flex items-center space-x-2 bg-coffee-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-coffee-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <ShoppingBag className="h-5 w-5" />
              <span>Order Now</span>
            </Link>
            
            <button 
              onClick={() => {
                const element = document.getElementById('products');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center space-x-2 border-2 border-coffee-500 text-coffee-500 px-8 py-4 rounded-full text-lg font-semibold hover:bg-coffee-100 transition-all duration-200"
            >
              <span>View Products</span>
            </button>
          </div>
        </div>
      </div>

      {/* CSS for sliding animation */}
      <style>
        {`
          @keyframes slide {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-${100 / images.length * (images.length - 1)}%);
            }
          }
          .animate-slide {
            animation: slide ${images.length * 15}s linear infinite; /* Increased duration to 15s per image */
          }
        `}
      </style>
    </section>
  );
};

export default Hero;