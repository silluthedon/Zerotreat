import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { supabase } from '../utils/supabase';

interface Product {
  id: string;
  name: string;
  features: string;
  calories: string;
  price: number;
  image: string;
  description: string;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, name, features, calories, price, image, description')
          .order('name', { ascending: true });

        if (error) {
          throw error;
        }

        setProducts(data || []);
      } catch (error: any) {
        setError('পণ্য লোড করতে ত্রুটি হয়েছে।');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-600 py-20">লোড হচ্ছে...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600 py-20">{error}</p>;
  }

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
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
        >
          <div className="relative overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-4 right-4 bg-coffee-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {product.calories}
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {product.name}
            </h3>
            <p className="text-coffee-500 font-semibold mb-2">
              {product.features}
            </p>
            <p className="text-gray-600 mb-2">
              দাম: ৳{product.price}
            </p>
            <p className="text-gray-600 mb-4">
              {product.description}
            </p>

            <Link
              to="/order"
              state={{ productId: product.id, productName: product.name, productPrice: product.price }}
              className="inline-flex items-center space-x-2 w-full bg-coffee-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-coffee-600 transition-colors duration-200 justify-center"
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