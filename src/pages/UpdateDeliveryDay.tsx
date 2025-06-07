import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import { supabase } from '../utils/supabase';

const UpdateDeliveryDate: React.FC = () => {
  const [deliveryDays, setDeliveryDays] = useState<string[]>(['রবিবার']);
  const [deliveryCharge, setDeliveryCharge] = useState<number>(50);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
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
  }, []);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-gray-100">
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-extrabold text-amber-500">ZeroTreat</h1>
            <Link
              to="/admin"
              className="flex items-center space-x-2 text-gray-600 hover:text-amber-500 transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">অ্যাডমিন প্যানেলে ফিরে যান</span>
            </Link>
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
            <div className="mb-6 text-green-600 bg-green-100 p-4 rounded-xl shadow-md">
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
                      className="h-4 w-4 text-amber-500 focus:ring-amber-500 border-gray-300 rounded"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors bg-gray-100"
                  placeholder="ডেলিভারি চার্জ লিখুন"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-4 rounded-lg text-lg font-semibold hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
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