import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Leaf } from 'lucide-react';
import { supabase } from '../utils/supabase';

const UpdateProductStatus = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
          navigate('/login');
          return;
        }

        const { data, error } = await supabase
          .from('products')
          .select('id, name, status')
          .order('name', { ascending: true });

        if (error) {
          throw error;
        }

        setProducts(data || []);
      } catch (err) {
        setError('পণ্য লোড করতে ত্রুটি হয়েছে: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [navigate]);

  const handleStatusUpdate = async (productId, newStatus) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ status: newStatus })
        .eq('id', productId);

      if (error) {
        throw error;
      }

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId ? { ...product, status: newStatus } : product
        )
      );
      setSuccess('পণ্যের স্ট্যাটাস সফলভাবে আপডেট করা হয়েছে!');
    } catch (err) {
      setError('স্ট্যাটাস আপডেট করতে ত্রুটি: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-coffee-50">
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/admin" className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-coffee-500" />
              <p className="text-2xl font-bold text-coffee-500">ZeroTreat</p>
            </Link>
            <Link
              to="/admin"
              className="text-gray-900 hover:text-coffee-500 transition-colors font-medium flex items-center space-x-1"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>অ্যাডমিন প্যানেলে ফিরে যান</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          পণ্যের স্ট্যাটাস আপডেট
        </h1>

        {error && (
          <div className="mb-6 text-red-600 text-center">{error}</div>
        )}
        {success && (
          <div className="mb-6 text-green-600 text-center">{success}</div>
        )}

        {loading ? (
          <p className="text-center text-gray-600">লোডিং...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-600">কোনো পণ্য পাওয়া যায়নি।</p>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-coffee-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                    পণ্যের নাম
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                    স্ট্যাটাস
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                      <select
                        value={product.status || 'available'}
                        onChange={(e) => handleStatusUpdate(product.id, e.target.value)}
                        className={`px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee-500 ${
                          product.status === 'out_of_stock'
                            ? 'bg-red-100 text-red-800'
                            : product.status === 'buy_one_get_one'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-coffee-100 text-coffee-500'
                        }`}
                      >
                        <option value="available" className="bg-coffee-100 text-coffee-500">
                          উপলব্ধ
                        </option>
                        <option value="out_of_stock" className="bg-red-100 text-red-800">
                          আউট অফ স্টক
                        </option>
                        <option value="buy_one_get_one" className="bg-green-100 text-green-800">
                          বাই ওয়ান গেট ওয়ান
                        </option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateProductStatus;