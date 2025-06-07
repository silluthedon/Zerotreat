import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { supabase } from '../utils/supabase';

const OrderDelivery: React.FC = () => {
  const [deliveryDays, setDeliveryDays] = useState<string[]>(['রবিবার']);
  const [deliveryCharge, setDeliveryCharge] = useState<number>(50);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDeliveryInfo = async () => {
      try {
        const { data, error } = await supabase
          .from('delivery_info')
          .select('days, charge')
          .single();
        if (error) {
          throw error;
        }
        setDeliveryDays(data?.days || ['রবিবার']);
        setDeliveryCharge(data?.charge || 50);
      } catch (error: any) {
        console.error('ডেলিভারি তথ্য লোড করতে ত্রুটি:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveryInfo();
  }, []);

  return (
    <section className="py-20 bg-coffee-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            অর্ডার ও ডেলিভারি তথ্য
          </h2>
          <p className="text-lg text-gray-600">
            সহজ অর্ডারিং প্রসেস এবং নির্ভরযোগ্য ডেলিভারি সেবা
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-coffee-100 rounded-full mb-4">
              <MapPin className="h-8 w-8 text-coffee-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">অর্ডার নিন</h3>
            <p className="text-gray-600">www.zerotreat.com/order</p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-coffee-100 rounded-full mb-4">
              <Calendar className="h-8 w-8 text-coffee-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">ডেলিভারি</h3>
            <p className="text-gray-600">
              {loading ? 'লোডিং...' : `প্রতি ${deliveryDays.join(', ')} (ঢাকার মধ্যে)`}
            </p>
            <p className="text-gray-600 mt-2">
              {loading ? 'লোডিং...' : `ডেলিভারি চার্জ: ৳${deliveryCharge}`}
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-coffee-100 rounded-full mb-4">
              <Clock className="h-8 w-8 text-coffee-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">স্লট সীমিত</h3>
            <p className="text-gray-600">অর্ডার করুন আগেভাগেই!</p>
          </div>
        </div>

        <div className="text-center">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              এখনই অর্ডার করুন
            </h3>
            <p className="text-gray-600 mb-6">
              সীমিত স্লট পাওয়া যাচ্ছে। আপনার পছন্দের স্বাস্থ্যকর স্ন্যাক্স অর্ডার করতে দেরি করবেন না!
            </p>
            <Link
              to="/order"
              className="inline-flex items-center space-x-2 bg-coffee-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-coffee-600 transition-all duration-200"
            >
              <span>এখনই অর্ডার করুন</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderDelivery;