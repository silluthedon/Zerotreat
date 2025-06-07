import React from 'react';
import { Leaf, Phone, Mail, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Leaf className="h-8 w-8 text-green-500" />
              <span className="text-2xl font-bold text-white">ZeroTreat</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              স্বাস্থ্যকর জীবনযাত্রার জন্য তৈরি সুস্বাদু স্ন্যাক্স। জিরো সুগার, জিরো ট্রান্স ফ্যাট, 
              জিরো প্রিজার্ভেটিভ - শুধু খাঁটি স্বাদ এবং পুষ্টি।
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">যোগাযোগ</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-green-500" />
                <span className="text-gray-300">০১XXXXXXXXX</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-green-500" />
                <span className="text-gray-300">hello@zerotreat.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-green-500" />
                <span className="text-gray-300">ঢাকা, বাংলাদেশ</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">দ্রুত লিংক</h3>
            <div className="space-y-2">
              <a href="/" className="block text-gray-300 hover:text-green-500 transition-colors">
                হোম
              </a>
              <a href="#products" className="block text-gray-300 hover:text-green-500 transition-colors">
                পণ্যসমূহ
              </a>
              <a href="#about" className="block text-gray-300 hover:text-green-500 transition-colors">
                আমাদের সম্পর্কে
              </a>
              <a href="/order" className="block text-gray-300 hover:text-green-500 transition-colors">
                অর্ডার করুন
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-400 text-sm">
                © 2025 ZeroTreat. All rights reserved. |$|
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;