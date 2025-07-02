import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Leaf, LogOut, Calendar } from 'lucide-react';
import { supabase } from '../utils/supabase';

const Admin = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [searchPhone, setSearchPhone] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalOrders, setTotalOrders] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
          navigate('/login');
          return;
        }

        // Fetch total count of orders
        const { count, error: countError } = await supabase
          .from('orders')
          .select('id', { count: 'exact', head: true });

        if (countError) {
          throw countError;
        }

        setTotalOrders(count || 0);

        // Fetch orders for the current page
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage - 1;

        const { data, error } = await supabase
          .from('orders')
          .select('id, name, phone, address, product_name, quantity, total_price, created_at, order_status, delivery_status, payment_status')
          .order(sortField, { ascending: sortOrder === 'asc' })
          .range(start, end);

        if (error) {
          throw error;
        }

        setOrders(data || []);
        setFilteredOrders(data || []);
      } catch (error) {
        setError('অর্ডার লোড করতে ত্রুটি হয়েছে।');
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate, sortField, sortOrder, currentPage, itemsPerPage]);

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
    } catch (error) {
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

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1); // Reset to first page on sort
  };

  const handleStatusUpdate = async (orderId, field, value) => {
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
    } catch (error) {
      setError(`স্ট্যাটাস আপডেট করতে ত্রুটি: ${error.message}`);
    }
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getStatusClass = (status, type) => {
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

  // Calculate total pages
  const totalPages = Math.ceil(totalOrders / itemsPerPage);

  // Generate page numbers for display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-coffee-50">
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
              <Link
                to="/AddProduct"
                className="bg-coffee-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-coffee-600 transition-colors flex items-center space-x-2"
              >
                <span>নতুন পণ্য যোগ</span>
              </Link>
              <Link
                to="/UpdateProductStatus"
                className="bg-coffee-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-coffee-600 transition-colors flex items-center space-x-2"
              >
                <span>পণ্যের স্ট্যাটাস আপডেট</span>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          অর্ডার তালিকা
        </h1>

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
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee-500"
            >
              <option value="5">৫ টি অর্ডার</option>
              <option value="10">১০ টি অর্ডার</option>
              <option value="20">২০ টি অর্ডার</option>
              <option value="50">৫০ টি অর্ডার</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-6 text-red-600 text-center">{error}</div>
        )}

        {loading ? (
          <p className="text-center text-gray-600">লোডিং...</p>
        ) : filteredOrders.length === 0 ? (
          <p className="text-center text-gray-600">কোনো অর্ডার পাওয়া যায়নি।</p>
        ) : (
          <>
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

            {/* Pagination Controls */}
            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-gray-600">
                মোট অর্ডার: {totalOrders} | পেজ {currentPage} এর মধ্যে {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-coffee-500 text-white rounded-lg hover:bg-coffee-600 disabled:bg-gray-300"
                >
                  আগের পেজ
                </button>
                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === page
                        ? 'bg-coffee-500 text-white'
                        : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-coffee-500 text-white rounded-lg hover:bg-coffee-600 disabled:bg-gray-300"
                >
                  পরের পেজ
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Admin;