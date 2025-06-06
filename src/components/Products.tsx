import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

const Products = () => {
  const products = [
    {
      name: "চকলেট প্রোটিন ব্রাউনি",
      features: "সুগার ফ্রি, ১২ গ্রাম প্রোটিন",
      calories: "180 kcal",
      image: "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400",
      description: "রিচ চকলেট ফ্লেভার সহ হাই প্রোটিন ব্রাউনি"
    },
    {
      name: "লেমন কেটো কাপকেক",
      features: "গ্লুটেন ফ্রি, হালকা টেক্সচার",
      calories: "140 kcal",
      image: "https://images.pexels.com/photos/1028714/pexels-photo-1028714.jpeg?auto=compress&cs=tinysrgb&w=400",
      description: "সতেজ লেমন ফ্লেভার সহ কেটো-ফ্রেন্ডলি কাপকেক"
    },
    {
      name: "পিনাট বাটার বলস",
      features: "হাই ফাইবার, এনার্জি বুস্টার",
      calories: "90 kcal",
      image: "https://img.freepik.com/free-photo/baking-snack-dessert-food-white_1203-5944.jpg?semt=ais_hybrid&w=740",
      description: "প্রাকৃতিক পিনাট বাটার দিয়ে তৈরি এনার্জি বল"
    },
    {
      name: "কোকো স্মার্ট কুকিজ",
      features: "লো কার্ব, হেলদি টিফিন",
      calories: "110 kcal",
      image: "https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=400",
      description: "ক্রিস্পি টেক্সচার সহ স্বাস্থ্যকর কোকো কুকিজ"
    }
  ];

  return (
    <section id="products" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            আমাদের পণ্যসমূহ
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            স্বাস্থ্যকর এবং সুস্বাদু স্ন্যাক্স যা আপনার স্বাদ এবং স্বাস্থ্য দুটোই সন্তুষ্ট করবে
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="relative overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {product.calories}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h3>
                <p className="text-green-600 font-semibold mb-2">
                  {product.features}
                </p>
                <p className="text-gray-600 mb-4">
                  {product.description}
                </p>
                
                <Link 
                  to="/order" 
                  className="inline-flex items-center space-x-2 w-full bg-green-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-200 justify-center"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Order Now</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;