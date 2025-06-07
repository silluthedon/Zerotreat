import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Leaf, LogOut, Calendar } from 'lucide-react';
import { supabase } from '../utils/supabase';

interface Order {
  id: string;
  name: string;
  phone: string;
  address: string;
  product_name: string;
  quantity: number;
  total_price: number;
  created_at: string;
  order_status: string;
  delivery_status: string;
  payment_status: string;
}

const Admin: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [searchPhone, setSearchPhone] = useState<string>('');
  const [sortField, setSortField] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<string>('desc');
  const [showLogoutPopup, setShowLogoutPopup] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
          navigate('/login');
          return;
        }

        const { data, error } = await supabase
          .from('orders')
          .select('id, name, phone, address, product_name, quantity, total_price, created_at, order_status, delivery_status, payment_status')
          .order(sortField, { ascending: sortOrder === 'asc' });
        if (error) {
          throw error;
        }
        setOrders(data || []);
        setFilteredOrders(data || []);
      } catch (error: any) {
        setError('অর্ডার লোড করতে ত্রুটি হয়েছে।');
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate, sortField, sortOrder]);

  useEffect(() => {
    if (searchPhone.trim() === '') {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter((order) =>
        order.phone.toLowerCase().includes(searchPhone.toLowerCase())
      );
      setFilteredOrders(filtered);
    }
  }, [searchPhone, orders]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      navigate('/');
    } catch (error: any) {
      setError('লগআউট করতে ত্রুটি হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsLoggingOut(false);
      setShowLogoutPopup(false);
    }
  };

  const handleBackToHomeClick = () => {
    setShowLogoutPopup(true);
  };

  const handleCancelLogout = () => {
    setShowLogoutPopup(false);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleStatusUpdate = async (orderId: string, field: string, value: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ [field]: value })
        .eq('id', orderId);
      if (error) {
        throw error;
      }
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, [field]: value } : order
        )
      );
      setFilteredOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, [field]: value } : order
        )
      );
    } catch (error: any) {
      setError(`স্ট্যাটাস আপডেট করতে ত্রুটি: ${error.message}`);
    }
  };

  const getStatusClass = (status: string, type: string) => {
    switch (type) {
      case 'order_status':
        return {
          pending: 'bg-yellow-100 text-yellow-800',
          confirmed: 'bg-coffee-100 text-coffee-500',
          cancelled: 'bg-red-100 text-red-800',
        }[status] || 'bg-gray-100 text-gray-800';
      case 'delivery_status':
        return {
          not_shipped: 'bg-gray-100 text-gray-800',
          shipped: 'bg-blue-100 text-blue-800',
          delivered: 'bg-coffee-100 text-coffee-500',
        }[status] || 'bg-gray-100 text-gray-800';
      case 'payment_status':
        return {
          unpaid: 'bg-orange-100 text-orange-800',
          paid: 'bg-coffee-100 text-coffee-500',
          failed: 'bg-red-100 text-red-800',
        }[status] || 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-coffee-50">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-coffee-500" />
              <p className="text-2xl font-bold text-coffee-500">ZeroTreat</p>
            </Link>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToHomeClick}
                className="text-gray-900 hover:text-coffee-500 transition-colors font-medium flex items-center space-x-1"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>হোমে ফিরে যান</span>
              </button>
              <Link
                to="/AdminPrice"
                className="bg-coffee-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-coffee-600 transition-colors flex items-center space-x-2"
              >
                <span>আপডেট প্রাইস</span>
              </Link>
              <Link
                to="/UpdateDeliveryDay"
                className="bg-coffee-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-coffee-600 transition-colors flex items-center space-x-2"
              >
                <Calendar className="h-5 w-5" />
                <span>আপডেট ডেলিভারি দিন</span>
              </Link>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="bg-coffee-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-coffee-700 transition-colors disabled:bg-coffee-400 flex items-center space-x-2"
              >
                <LogOut className="h-5 w-5" />
                <span>{isLoggingOut ? 'লগআউট হচ্ছে...' : 'লগআউট'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Popup */}
      {showLogoutPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h2 className="text-xl font-bold text-gray-900 mb-4">লগআউট নিশ্চিত করুন</h2>
            <p className="text-gray-600 mb-6">
              আপনি কি হোম পেজে ফিরে যাওয়ার আগে লগআউট করতে চান?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancelLogout}
                className="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition-colors"
              >
                বাতিল
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="px-4 py-2 bg-coffee-600 text-white rounded-lg hover:bg-coffee-700 transition-colors disabled:bg-coffee-400 flex items-center space-x-2"
              >
                <LogOut className="h-5 w-5" />
                <span>{isLoggingOut ? 'লগআউট হচ্ছে...' : 'লগআউট'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Orders List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          অর্ডার তালিকা
        </h1>

        {/* Search and Sort Controls */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <input
            type="text"
            placeholder="ফোন নম্বর দিয়ে অনুসন্ধান করুন"
            value={searchPhone}
            onChange={(e) => setSearchPhone(e.target.value)}
            className="w-full sm:w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee-500"
          />
          <div className="flex items-center space-x-2">
            <select
              value={sortField}
              onChange={(e) => handleSort(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee-500"
            >
              <option value="created_at">তারিখ</option>
              <option value="total_price">মোট মূল্য</option>
              <option value="name">নাম</option>
              <option value="phone">ফোন</option>
            </select>
            <button
              onClick={() => handleSort(sortField)}
              className="px-4 py-2 bg-coffee-500 text-white rounded-lg hover:bg-coffee-600 font-semibold"
            >
              {sortOrder === 'asc' ? 'ঊর্ধ্বক্রম' : 'নিম্নক্রম'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 text-red-600 text-center">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-center text-gray-600">লোডিং...</p>
        ) : filteredOrders.length === 0 ? (
          <p className="text-center text-gray-600">কোনো অর্ডার পাওয়া যায়নি।</p>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-coffee-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                    নাম
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                    ফোন
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                    ঠিকানা
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                    পণ্য
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                    পরিমাণ
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                    মোট
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                    তারিখ
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                    অর্ডার স্ট্যাটাস
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                    ডেলিভারি স্ট্যাটাস
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                    পেমেন্ট স্ট্যাটাস
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.name}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.phone}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">
                      {order.address}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.product_name}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.quantity}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ৳{order.total_price}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(order.created_at).toLocaleDateString('bn-BD')}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                      <select
                        value={order.order_status || 'pending'}
                        onChange={(e) =>
                          handleStatusUpdate(order.id, 'order_status', e.target.value)
                        }
                        className={`px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee-500 ${getStatusClass(
                          order.order_status || 'pending',
                          'order_status'
                        )}`}
                      >
                        <option value="pending" className="bg-yellow-100 text-yellow-800">
                          পেন্ডিং
                        </option>
                        <option value="confirmed" className="bg-coffee-100 text-coffee-500">
                          কনফার্মড
                        </option>
                        <option value="cancelled" className="bg-red-100 text-red-800">
                          বাতিল
                        </option>
                      </select>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                      <select
                        value={order.delivery_status || 'not_shipped'}
                        onChange={(e) =>
                          handleStatusUpdate(order.id, 'delivery_status', e.target.value)
                        }
                        className={`px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee-500 ${getStatusClass(
                          order.delivery_status || 'not_shipped',
                          'delivery_status'
                        )}`}
                      >
                        <option value="not_shipped" className="bg-gray-100 text-gray-800">
                          শিপড নয়
                        </option>
                        <option value="shipped" className="bg-blue-100 text-blue-800">
                          শিপড
                        </option>
                        <option value="delivered" className="bg-coffee-100 text-coffee-500">
                          ডেলিভারড
                        </option>
                      </select>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                      <select
                        value={order.payment_status || 'unpaid'}
                        onChange={(e) =>
                          handleStatusUpdate(order.id, 'payment_status', e.target.value)
                        }
                        className={`px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee-500 ${getStatusClass(
                          order.payment_status || 'unpaid',
                          'payment_status'
                        )}`}
                      >
                        <option value="unpaid" className="bg-orange-100 text-orange-800">
                          পেইড নয়
                        </option>
                        <option value="paid" className="bg-coffee-100 text-coffee-500">
                          পেইড
                        </option>
                        <option value="failed" className="bg-red-100 text-red-800">
                          ব্যর্থ
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

export default Admin;