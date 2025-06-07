import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Leaf, LogOut } from 'lucide-react';
import { supabase } from '../utils/supabase';

const UpdateDeliveryDate: React.FC = () => {
  const [deliveryDays, setDeliveryDays] = useState<string[]>(['রবিবার']);
  const [deliveryCharge, setDeliveryCharge] = useState<number>(50);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const navigate = useNavigate();

  const dayOptions = [
    'রবিবার',
    'সোমবার',
    'মঙ্গলবার',
    'বুধবার',
    'বৃহস্পতিবার',
    'শুক্রবার',
    'শনিবার',
  ];

  useEffect(() => {
    const fetchDeliveryInfo = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
          navigate('/login');
          return;
        }

        const { data, error } = await supabase
          .from('delivery_info')
          .select('days, charge')
          .single();
        if (error) throw error;
        setDeliveryDays(data?.days || ['রবিবার']);
        setDeliveryCharge(data?.charge || 50);
      } catch (error: any) {
        setError('ডেলিভারি তথ্য লোড করতে ত্রুটি: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveryInfo();
  }, [navigate]);

  const handleDayChange = (day: string) => {
    setDeliveryDays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (deliveryDays.length === 0) {
      setError('অন্তত একটি ডেলিভারি দিন নির্বাচন করুন।');
      return;
    }

    if (deliveryCharge < 0) {
      setError('ডেলিভারি চার্জ নেগেটিভ হতে পারে না।');
      return;
    }

    try {
      const { error } = await supabase
        .from('delivery_info')
        .upsert({ id: 1, days: deliveryDays, charge: deliveryCharge });
      if (error) throw error;
      setSuccess('ডেলিভারি তথ্য সফলভাবে আপডেট করা হয়েছে।');
      setTimeout(() => navigate('/admin'), 2000);
    } catch (error: any) {
      setError('ডেলিভারি তথ্য আপডেট করতে ত্রুটি: ' + error.message);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login');
    } catch (error: any) {
      setError('লগআউট করতে ত্রুটি হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-coffee-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-coffee-500 mx-auto mb-4"></div>
          <p className="text-gray-600">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

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
              <Link
                to="/admin"
                className="text-gray-900 hover:text-coffee-500 transition-colors font-medium flex items-center space-x-1"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Admin</span>
              </Link>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="bg-coffee-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-coffee-700 transition-colors disabled:bg-coffee-400 flex items-center space-x-2"
              >
                <LogOut className="h-5 w-5" />
                <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            ডেলিভারি তথ্য আপডেট করুন
          </h2>

          {error && (
            <div className="mb-6 text-red-600 bg-red-100 p-4 rounded-xl shadow-md">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 text-coffee-500 bg-coffee-100 p-4 rounded-xl shadow-md">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ডেলিভারি দিন নির্বাচন করুন *
              </label>
              <div className="grid grid-cols-2 gap-4">
                {dayOptions.map((day) => (
                  <label key={day} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={deliveryDays.includes(day)}
                      onChange={() => handleDayChange(day)}
                      className="h-4 w-4 text-coffee-500 focus:ring-coffee-500 border-gray-300 rounded"
                    />
                    <span className="text-gray-700">{day}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ডেলিভারি চার্জ (টাকা) *
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={deliveryCharge}
                  onChange={(e) => setDeliveryCharge(parseInt(e.target.value) || 0)}
                  min="0"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 transition-colors bg-coffee-50"
                  placeholder="ডেলিভারি চার্জ লিখুন"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-coffee-500 text-white py-4 rounded-lg text-lg font-semibold hover:bg-coffee-600 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span className="flex items-center justify-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>ডেলিভারি তথ্য আপডেট করুন</span>
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateDeliveryDate;