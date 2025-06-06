import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Leaf, LogOut, Save } from 'lucide-react';
import { supabase } from '../utils/supabase';
import toast, { Toaster } from 'react-hot-toast';

const UpdateDeliveryDay: React.FC = () => {
  const [deliveryDays, setDeliveryDays] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const navigate = useNavigate();

  const allDays = [
    'রবিবার', // Sunday
    'সোমবার', // Monday
    'মঙ্গলবার', // Tuesday
    'বুধবার', // Wednesday
    'বৃহস্পতিবার', // Thursday
    'শুক্রবার', // Friday
    'শনিবার', // Saturday
  ];

  useEffect(() => {
    const checkSessionAndFetch = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
          navigate('/login');
          return;
        }

        const { data, error } = await supabase
          .from('delivery_days')
          .select('days')
          .single();
        if (error) {
          throw error;
        }
        setDeliveryDays(data?.days || ['রবিবার']);
      } catch (error: any) {
        setError('ডেলিভারি দিন লোড করতে ত্রুটি হয়েছে।');
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    checkSessionAndFetch();
  }, [navigate]);

  const handleDayToggle = (day: string) => {
    setDeliveryDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSaveDays = async () => {
    if (deliveryDays.length === 0) {
      setError('অন্তত একটি ডেলিভারি দিন নির্বাচন করুন।');
      return;
    }

    try {
      const { error } = await supabase
        .from('delivery_days')
        .update({ days: deliveryDays, updated_at: new Date().toISOString() })
        .eq('id', (await supabase.from('delivery_days').select('id').single()).data?.id);
      if (error) {
        throw error;
      }
      setError(null);
      toast.success('ডেলিভারি দিন সফলভাবে আপডেট করা হয়েছে!', {
        position: 'top-right',
        duration: 3000,
      });
    } catch (error: any) {
      setError('ডেলিভারি দিন আপডেট করতে ত্রুটি হয়েছে।');
      console.error(error.message);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      navigate('/login');
    } catch (error: any) {
      setError('লগআউট করতে ত্রুটি হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-600">লোডিং...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster />
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-green-600" />
              <p className="text-2xl font-bold text-green-700">ZeroTreat</p>
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                to="/admin"
                className="text-gray-900 hover:text-green-600 transition-colors font-medium flex items-center space-x-1"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>অ্যাডমিনে ফিরে যান</span>
              </Link>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="bg-red-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-700 transition-colors disabled:bg-red-400 flex items-center space-x-2"
              >
                <LogOut className="h-5 w-5" />
                <span>{isLoggingOut ? 'লগআউট হচ্ছে...' : 'লগআউট'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Days Update Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          ডেলিভারি দিন আপডেট করুন
        </h1>

        {error && (
          <div className="mb-6 text-red-600 text-center">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {allDays.map((day) => (
              <label key={day} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={deliveryDays.includes(day)}
                  onChange={() => handleDayToggle(day)}
                  className="h-5 w-5 text-green-600 focus:ring-green-600"
                />
                <span className="text-gray-900">{day}</span>
              </label>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSaveDays}
              className="bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Save className="h-5 w-5" />
              <span>ডেলিভারি দিন সংরক্ষণ করুন</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateDeliveryDay;