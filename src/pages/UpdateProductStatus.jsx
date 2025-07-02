import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Leaf, Edit, X } from 'lucide-react';
import { supabase } from '../utils/supabase';

const UpdateProductStatus = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
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
          .select('id, name, price, calories, description, image, status')
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

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setSelectedFile(null);
    setError(null);
    setSuccess(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct((prev) => prev ? { ...prev, [name]: value } : prev);
    // Clear selected file if URL is changed
    if (name === 'image') {
      setSelectedFile(null);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Clear the image URL when a file is selected
      setEditingProduct((prev) => prev ? { ...prev, image: '' } : prev);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      let imageUrl = editingProduct.image;

      // If a file is selected, upload it to Supabase Storage
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${editingProduct.id}_${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, selectedFile, {
            cacheControl: '3600',
            upsert: true,
          });

        if (uploadError) {
          throw new Error('ছবি আপলোড করতে ত্রুটি: ' + uploadError.message);
        }

        // Get the public URL of the uploaded file
        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);

        imageUrl = publicUrlData.publicUrl;
      }

      // Update product in Supabase
      const { error } = await supabase
        .from('products')
        .update({
          name: editingProduct.name,
          price: editingProduct.price,
          calories: editingProduct.calories,
          description: editingProduct.description,
          image: imageUrl,
          status: editingProduct.status,
        })
        .eq('id', editingProduct.id);

      if (error) {
        throw error;
      }

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === editingProduct.id ? { ...editingProduct, image: imageUrl } : product
        )
      );
      setSuccess('পণ্যের তথ্য সফলভাবে আপডেট করা হয়েছে!');
      setEditingProduct(null);
      setSelectedFile(null);
    } catch (err) {
      setError('পণ্য আপডেট করতে ত্রুটি: ' + err.message);
    }
  };

  const closeEditForm = () => {
    setEditingProduct(null);
    setSelectedFile(null);
    setError(null);
    setSuccess(null);
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
          পণ্যের তথ্য আপডেট
        </h1>

        {error && (
          <div className="mb-6 text-red-600 text-center bg-red-100 p-4 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 text-green-600 text-center bg-green-100 p-4 rounded-lg">
            {success}
          </div>
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
                    মূল্য
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                    ক্যালরি
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                    স্ট্যাটাস
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                    অ্যাকশন
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ৳{product.price}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.calories}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 rounded-lg ${
                          product.status === 'out_of_stock'
                            ? 'bg-red-100 text-red-800'
                            : product.status === 'buy_one_get_one'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-coffee-100 text-coffee-500'
                        }`}
                      >
                        {product.status === 'out_of_stock'
                          ? 'আউট অফ স্টক'
                          : product.status === 'buy_one_get_one'
                          ? 'বাই ওয়ান গেট ওয়ান'
                          : 'উপলব্ধ'}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleEditClick(product)}
                        className="text-coffee-500 hover:text-coffee-600 transition-colors"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {editingProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-lg p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">পণ্য এডিট করুন</h2>
                <button onClick={closeEditForm} className="text-gray-600 hover:text-gray-900">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    পণ্যের নাম *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editingProduct.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 bg-coffee-50"
                    placeholder="পণ্যের নাম লিখুন"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    মূল্য (টাকা) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={editingProduct.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 bg-coffee-50"
                    placeholder="মূল্য লিখুন"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    ক্যালরি *
                  </label>
                  <input
                    type="text"
                    name="calories"
                    value={editingProduct.calories}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 bg-coffee-50"
                    placeholder="ক্যালরি লিখুন (যেমন, 200 kcal)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    ডেসক্রিপশন *
                  </label>
                  <textarea
                    name="description"
                    value={editingProduct.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 bg-coffee-50"
                    placeholder="পণ্যের ডেসক্রিপশন লিখুন"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    ছবির URL
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={editingProduct.image}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 bg-coffee-50"
                    placeholder="ছবির URL লিখুন (অথবা ফাইল আপলোড করুন)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    ছবি আপলোড করুন (JPG, PNG)
                  </label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={handleFileChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-coffee-50"
                  />
                </div>
                {selectedFile && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      ছবির প্রিভিউ
                    </label>
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    স্ট্যাটাস *
                  </label>
                  <select
                    name="status"
                    value={editingProduct.status || 'available'}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 bg-coffee-50"
                  >
                    <option value="available">উপলব্ধ</option>
                    <option value="out_of_stock">আউট অফ স্টক</option>
                    <option value="buy_one_get_one">বাই ওয়ান গেট ওয়ান</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={closeEditForm}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-coffee-500 text-white rounded-lg hover:bg-coffee-600 transition-colors"
                  >
                    আপডেট করুন
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateProductStatus;