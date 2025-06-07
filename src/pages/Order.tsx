import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Leaf, Plus, X, ShoppingBag } from 'lucide-react';
import { supabase } from '../utils/supabase';

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
}

interface OrderItem {
  productId: string;
  quantity: number;
}

interface FormData {
  name: string;
  phone: string;
  address: string;
  products: OrderItem[];
}

const Order: React.FC = () => {
  const location = useLocation();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    address: '',
    products: location.state?.productId ? [{ productId: location.state.productId, quantity: 1 }] : [],
  });
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [deliveryDays, setDeliveryDays] = useState<string[]>(['রবিবার']);
  const [deliveryCharge, setDeliveryCharge] = useState<number>(50);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, deliveryResponse] = await Promise.all([
          supabase.from('products').select('id, name, price, image'),
          supabase.from('delivery_info').select('days, charge').single(),
        ]);

        if (productsResponse.error) throw productsResponse.error;
        if (deliveryResponse.error) throw deliveryResponse.error;

        setProducts(productsResponse.data || []);
        setDeliveryDays(deliveryResponse.data?.days || ['রবিবার']);
        setDeliveryCharge(deliveryResponse.data?.charge || 50);
      } catch (error: any) {
        setError('তথ্য লোড করতে ত্রুটি হয়েছে।');
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    index?: number
  ) => {
    const { name, value } = e.target;
    if (name === 'product' || name === 'quantity') {
      setFormData((prev) => {
        const newProducts = [...prev.products];
        if (index !== undefined) {
          newProducts[index] = {
            ...newProducts[index],
            [name === 'product' ? 'productId' : name]: name === 'quantity' ? parseInt(value) || 1 : value,
          };
        }
        return { ...prev, products: newProducts };
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addProduct = () => {
    setFormData((prev) => ({
      ...prev,
      products: [...prev.products, { productId: '', quantity: 1 }],
    }));
  };

  const removeProduct = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setError('নাম, ফোন নম্বর, এবং ঠিকানা পূরণ করুন।');
      return;
    }

    if (formData.products.length === 0 || formData.products.some((p) => !p.productId)) {
      setError('অনুগ্রহ করে অন্তত একটি পণ্য নির্বাচন করুন।');
      return;
    }

    const orderData = formData.products.map((item) => {
      const selectedProduct = products.find((p) => p.id === item.productId);
      return {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        product_id: item.productId,
        product_name: selectedProduct?.name || '',
        quantity: item.quantity,
        total_price: (selectedProduct?.price || 0) * item.quantity + deliveryCharge,
        delivery_charge: deliveryCharge,
      };
    });

    try {
      const { error } = await supabase.from('orders').insert(orderData);
      if (error) throw error;
      console.log('Order submitted:', orderData);
      setIsSubmitted(true);
    } catch (error: any) {
      console.error('Error saving order:', error.message);
      setError('অর্ডার সংরক্ষণে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    }
  };

  const getSuggestedProducts = () => {
    const selectedIds = formData.products.map((p) => p.productId);
    const availableProducts = products.filter((p) => !selectedIds.includes(p.id));
    return availableProducts.sort(() => 0.5 - Math.random()).slice(0, 3);
  };

  const addSuggestedProduct = (productId: string) => {
    setFormData((prev) => ({
      ...prev,
      products: [...prev.products, { productId, quantity: 1 }],
    }));
  };

  const selectedProducts = formData.products
    .map((item) => ({
      ...products.find((p) => p.id === item.productId),
      quantity: item.quantity,
    }))
    .filter((p) => p.id) as Array<Product & { quantity: number }>;

  const subtotal = selectedProducts.reduce(
    (sum, p) => sum + (p.price * p.quantity || 0),
    0
  );
  const totalPrice = subtotal + deliveryCharge;

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-10 text-center transform transition-all duration-300 animate-pulse">
          <div className="mb-8">
            <CheckCircle className="h-20 w-20 text-amber-500 mx-auto mb-4 animate-bounce" />
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
              অর্ডার সফল হয়েছে!
            </h2>
            <p className="text-gray-600 text-lg">
              আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।
            </p>
          </div>

          <div className="bg-amber-50 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-gray-900 text-xl mb-4">অর্ডার বিবরণ</h3>
            <p className="text-sm text-gray-600 mb-2">নাম: {formData.name}</p>
            <p className="text-sm text-gray-600 mb-2">ফোন: {formData.phone}</p>
            {selectedProducts.map((product, index) => (
              <div key={index} className="text-sm text-gray-600 mb-2">
                <p>পণ্য: {product.name}</p>
                <p>পরিমাণ: {product.quantity}</p>
                <p>মূল্য: ৳{product.price * product.quantity}</p>
              </div>
            ))}
            <p className="text-sm text-gray-600 mb-2">ডেলিভারি চার্জ: ৳{deliveryCharge}</p>
            <p className="text-base font-semibold text-amber-500 mt-4">মোট: ৳{totalPrice}</p>
          </div>

          <Link
            to="/"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-3 rounded-full font-semibold hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>হোমে ফিরে যান</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-gray-100">
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <Leaf className="h-10 w-10 text-amber-500 animate-pulse" />
              <span className="text-3xl font-extrabold text-amber-500">ZeroTreat</span>
            </Link>
            <Link
              to="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-amber-500 transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">হোমে ফিরে যান</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            আপনার ZeroTreat অর্ডার করুন
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            সুস্বাদু এবং স্বাস্থ্যকর স্ন্যাক্স অর্ডার করুন! প্রতি {deliveryDays.join(', ')} ঢাকায় ডেলিভারি।
          </p>
        </div>

        {error && (
          <div className="mb-8 text-red-600 text-center bg-red-100 p-4 rounded-xl shadow-md">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-white rounded-2xl shadow-xl p-8">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors bg-gray-100 placeholder-gray-400"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors bg-gray-100 placeholder-gray-400"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors bg-gray-100 placeholder-gray-400"
                  placeholder="আপনার সম্পূর্ণ ঠিকানা লিখুন"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  পণ্য নির্বাচন করুন *
                </label>
                {formData.products.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 mb-4">
                    <select
                      name="product"
                      value={item.productId}
                      onChange={(e) => handleInputChange(e, index)}
                      required
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors bg-gray-100"
                    >
                      <option value="">একটি পণ্য বেছে নিন</option>
                      {products
                        .filter(
                          (p) =>
                            !formData.products.some(
                              (selected, i) => selected.productId === p.id && i !== index
                            )
                        )
                        .map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name} - ৳{product.price}
                          </option>
                        ))}
                    </select>
                    <input
                      type="number"
                      name="quantity"
                      value={item.quantity}
                      onChange={(e) => handleInputChange(e, index)}
                      min="1"
                      max="10"
                      className="w-24 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors bg-gray-100"
                    />
                    {formData.products.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeProduct(index)}
                        className="text-amber-500 hover:text-amber-600 transition-colors"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addProduct}
                  className="inline-flex items-center space-x-2 text-amber-500 hover:text-amber-600 font-semibold transition-colors mt-2"
                >
                  <Plus className="h-5 w-5" />
                  <span>আরেকটি পণ্য যোগ করুন</span>
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-4 rounded-lg text-lg font-semibold hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 !z-50 !block"
              >
                <span className="flex items-center justify-center space-x-2">
                  <ShoppingBag className="h-5 w-5" />
                  <span>অর্ডার সাবমিট করুন</span>
                </span>
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">অর্ডার সারসংক্ষেপ</h3>
              {selectedProducts.length > 0 ? (
                <div className="space-y-4">
                  {selectedProducts.map((product, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-700">
                        {product.name} (x{product.quantity})
                      </span>
                      <span className="font-semibold">৳{product.price * product.quantity}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">ডেলিভারি চার্জ</span>
                    <span className="font-semibold">৳{deliveryCharge}</span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>মোট</span>
                    <span className="text-amber-500">৳{totalPrice}</span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">প্রথমে একটি পণ্য নির্বাচন করুন</p>
              )}
            </div>

            <div className="bg-amber-50 rounded-2xl p-6 shadow-md">
              <h4 className="font-semibold text-gray-900 text-xl mb-4">আরও পণ্যের সুপারিশ</h4>
              {getSuggestedProducts().length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {getSuggestedProducts().map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center p-4 bg-white rounded-xl shadow-sm hover:bg-amber-100 transition-all duration-200"
                    >
                      <img
                        src={product.image || 'https://via.placeholder.com/80'}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded-lg mr-4"
                      />
                      <div className="flex-1">
                        <p className="text-gray-700 font-semibold">{product.name}</p>
                        <p className="text-sm text-gray-600">৳{product.price}</p>
                      </div>
                      <button
                        onClick={() => addSuggestedProduct(product.id)}
                        className="inline-flex items-center space-x-2 bg-amber-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-600 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <Plus className="h-4 w-4" />
                        <span>যোগ করেন</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">আর কোনো পণ্য উপলব্ধ নেই।</p>
              )}
            </div>

            <div className="bg-amber-50 rounded-2xl p-6 shadow-md">
              <h4 className="font-semibold text-gray-900 text-xl mb-3">ডেলিভারি তথ্য</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-amber-500 rounded-full mr-2"></span>
                  ডেলিভারি: প্রতি {deliveryDays.join(', ')}
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-amber-500 rounded-full mr-2"></span>
                  এলাকা: ঢাকার মধ্যে
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-amber-500 rounded-full mr-2"></span>
                  ডেলিভারি চার্জ: ৳{deliveryCharge}
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-amber-500 rounded-full mr-2"></span>
                  পেমেন্ট: ক্যাশ অন ডেলিভারি
                </li>
              </ul>
            </div>

            <div className="bg-amber-50 rounded-2xl p-6 shadow-md">
              <h4 className="font-semibold text-gray-900 text-xl mb-3">যোগাযোগ</h4>
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