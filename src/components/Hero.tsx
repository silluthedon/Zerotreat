import React, { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';

const Hero = () => {
  // Array of background images
  const images = [
    'https://img.freepik.com/free-photo/chocolate-cake-with-cream-nuts-chocolate-spread_140725-10904.jpg?semt=ais_hybrid&w=740', // Cake
    'https://img.freepik.com/free-photo/ai-generated-cake-picture_23-2150649466.jpg?semt=ais_items_boosted&w=740', // Pastry
    'https://img.freepik.com/premium-photo/variation-different-unhealthy-snacks-crackers-sweet-salted-popcorn-tortillas-nuts-straws-bretsels_136595-3545.jpg?semt=ais_hybrid&w=740', // Snacks
  ];

  // State to track current image index
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Preload images and cycle through images every 4 seconds
  useEffect(() => {
    // Preload images to prevent flickering
    images.forEach((image) => {
      const img = new Image();
      img.src = image;
    });

    // Set interval to change image every 4 seconds
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, [images]);

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-coffee-50 to-white pt-16 overflow-hidden">
      {/* Background Slideshow with Fade Effect */}
      <div className="absolute inset-0 overflow-hidden">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${image})`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-20">
        <div className="max-w-4xl mx-auto bg-white bg-opacity-90 rounded-xl p-8 shadow-lg">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight drop-shadow-md">
            নিশ্চিন্তে উপভোগ করুন প্রিয় <span className="text-coffee-500">Healthy কেক, স্ন্যাকস, পেস্ট্রি</span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-coffee-500 mb-8 drop-shadow-md">
            দারুণ Tasty!
          </h2>
          
          <p className="text-lg md:text-xl text-gray-700 mb-10 leading-relaxed max-w-3xl mx-auto drop-shadow-md">
            ক্ষতিকর চিনি, ট্রান্সফ্যাট ও প্রিজার্ভেটিভমুক্ত। তাই, ডায়াবেটিস, ওজন বৃদ্ধি কিংবা হৃদরোগ নিয়ে আর নেই ভয় 
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => {
                const element = document.getElementById('products');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center space-x-2 bg-coffee-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-coffee-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <ShoppingBag className="h-5 w-5" />
              <span>Order Now</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;