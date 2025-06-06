import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Leaf } from 'lucide-react';
import { supabase } from '../utils/supabase';

interface FormData {
  name: string;
  phone: string;
  address: string;
  product: string;
  quantity: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
}

const Order: React.FC = () => {
  const location = useLocation();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    address: '',
    product: location.state?.productId || '',
    quantity: 1,
  });
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, name, price');
        if (error) {
          throw error;
        }
        setProducts(data || []);
      } catch (error: any) {
        setError('Error loading products.');
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (location.state?.productId) {
      setFormData((prev) => ({
        ...prev,
        product: location.state.productId,
      }));
    }
  }, [location.state]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const selectedProduct = products.find((p) => p.id === formData.product);
    if (!selectedProduct) {
      setError('অনুগ্রহ করে একটি পণ্য নির্বাচন করুন');
      return;
    }

    const orderData = {
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      product_id: formData.product,
      product_name: selectedProduct.name,
      quantity: parseInt(formData.quantity.toString()),
      total_price: selectedProduct.price * formData.quantity,
    };

    try {
      const { error } = await supabase.from('orders').insert([orderData]);

      if (error) {
        throw error;
      }

      console.log('Order submitted:', orderData);
      setIsSubmitted(true);
    } catch (error: any) {
      console.error('Error saving order:', error.message);
      setError('অর্ডার সংরক্ষণে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    }
  };

  const selectedProduct = products.find((p) => p.id === formData.product);
  const totalPrice = selectedProduct ? selectedProduct.price * formData.quantity : 0;

  if (loading) {
    return <p className="text-center text-gray-600">Loading...</p>;
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              অর্ডার সফল হয়েছে!
            </h2>
            <p className="text-gray-600">
              আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">অর্ডার বিবরণ:</h3>
            <p className="text-sm text-gray-600">নাম: {formData.name}</p>
            <p className="text-sm text-gray-600">ফোন: {formData.phone}</p>
            <p className="text-sm text-gray-600">পণ্য: {selectedProduct?.name}</p>
            <p className="text-sm text-gray-600">পরিমাণ: {formData.quantity}</p>
            <p className="text-sm font-semibold text-green-600">মোট: ৳{totalPrice}</p>
          </div>

          <Link
            to="/"
            className="inline-flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>হোমে ফিরে যান</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-green-500" />
              <span className="text-2xl font-bold text-green-600">ZeroTreat</span>
            </Link>
            <Link
              to="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>হোমে ফিরে যান</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Order Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            আপনার ZeroTreat অর্ডার করুন
          </h1>
          <p className="text-lg text-gray-600">
            এখনই আপনার স্বাস্থ্যকর স্ন্যাক্স অর্ডার করুন! প্রতি রবিবার ঢাকার মধ্যে ডেলিভারি।
          </p>
        </div>

        {error && (
          <div className="mb-6 text-red-600 text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Order Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  আপনার নাম *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="আপনার পূর্ণ নাম লিখুন"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ফোন নম্বর *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="০১XXXXXXXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ডেলিভারি ঠিকানা *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="আপনার সম্পূর্ণ ঠিকানা লিখুন"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  পণ্য নির্বাচন করুন *
                </label>
                <select
                  name="product"
                  value={formData.product}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                >
                  <option value="">একটি পণ্য বেছে নিন</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - ৳{product.price}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  পরিমাণ
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  min="1"
                  max="10"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-500 text-white py-4 rounded-lg text-lg font-semibold hover:bg-green-600 transition-colors"
              >
                অর্ডার সাবমিট করুন
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">অর্ডার সারসংক্ষেপ</h3>
              {selectedProduct ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">{selectedProduct.name}</span>
                    <span className="font-semibold">৳{selectedProduct.price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">পরিমাণ</span>
                    <span className="font-semibold">{formData.quantity}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>মোট</span>
                    <span className="text-green-600">৳{totalPrice}</span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">প্রথমে একটি পণ্য নির্বাচন করুন</p>
              )}
            </div>

            <div className="bg-green-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3">ডেলিভারি তথ্য</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• ডেলিভারি: প্রতি রবিবার</li>
                <li>• এলাকা: ঢাকার মধ্যে</li>
                <li>• ডেলিভারি চার্জ: ৫০ টাকা</li>
                <li>• পেমেন্ট: ক্যাশ অন ডেলিভারি</li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3">যোগাযোগ</h4>
              <div className="space-y-2 text-sm text-gray-700">
                <p>WhatsApp/Call: ০১XXXXXXXXX</p>
                <p>Email: hello@zerotreat.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;