import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Leaf } from 'lucide-react';
import { supabase } from '../utils/supabase';

const AddProduct = () => {
  const [productData, setProductData] = useState({
    name: '',
    features: '',
    calories: '',
    price: '',
    description: '',
    image: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let imageUrl = productData.image;

      // If an image file is uploaded, store it in Supabase storage
      if (imageFile) {
        const fileName = `${Date.now()}_${imageFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, imageFile);

        if (uploadError) {
          throw uploadError;
        }

        // Get the public URL of the uploaded image
        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);

        imageUrl = urlData.publicUrl;
      }

      // Insert product data into Supabase
      const { error: insertError } = await supabase.from('products').insert([
        {
          name: productData.name,
          features: productData.features,
          calories: productData.calories,
          price: parseFloat(productData.price),
          image: imageUrl,
          description: productData.description,
        },
      ]);

      if (insertError) {
        throw insertError;
      }

      setSuccess('পণ্য সফলভাবে যোগ করা হয়েছে!');
      setProductData({
        name: '',
        features: '',
        calories: '',
        price: '',
        description: '',
        image: '',
      });
      setImageFile(null);
    } catch (err) {
      setError('পণ্য যোগ করতে ত্রুটি হয়েছে: ' + err.message);
    } finally {
      setLoading(false);
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
          নতুন পণ্য যোগ করুন
        </h1>

        {error && (
          <div className="mb-6 text-red-600 text-center">{error}</div>
        )}
        {success && (
          <div className="mb-6 text-green-600 text-center">{success}</div>
        )}

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
              পণ্যের নাম
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={productData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="features">
              বৈশিষ্ট্য
            </label>
            <input
              type="text"
              id="features"
              name="features"
              value={productData.features}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="calories">
              ক্যালোরি
            </label>
            <input
              type="text"
              id="calories"
              name="calories"
              value={productData.calories}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="price">
              দাম (টাকা)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={productData.price}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="description">
              বিবরণ
            </label>
            <textarea
              id="description"
              name="description"
              value={productData.description}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee-500"
              rows="4"
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="image">
              ছবির লিংক
            </label>
            <input
              type="url"
              id="image"
              name="image"
              value={productData.image}
              onChange={handleInputChange}
              placeholder="ইমেজ URL প্রদান করুন (ঐচ্ছিক)"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="imageFile">
              ছবি আপলোড করুন
            </label>
            <input
              type="file"
              id="imageFile"
              name="imageFile"
              accept="image/*"
              onChange={handleImageFileChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-coffee-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-coffee-600 transition-colors disabled:bg-coffee-400"
          >
            {loading ? 'যোগ করা হচ্ছে...' : 'পণ্য যোগ করুন'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;