import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Leaf, LogIn } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-green-500" />
            <span className="text-2xl font-bold text-green-600">ZeroTreat</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-green-600 transition-colors">
              Home
            </Link>
            <button 
              onClick={() => scrollToSection('products')}
              className="text-gray-700 hover:text-green-600 transition-colors"
            >
              Products
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-gray-700 hover:text-green-600 transition-colors"
            >
              About
            </button>
            <Link 
              to="/order" 
              className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors font-medium"
            >
              Order Now
            </Link>
            <Link 
              to="/login" 
              className="text-gray-700 hover:text-green-600 transition-colors flex items-center space-x-1"
            >
              <LogIn className="h-5 w-5" />
              <span>Admin Login</span>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-gray-700 hover:text-green-600 transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                to="/" 
                className="block px-3 py-2 text-gray-700 hover:text-green-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <button 
                onClick={() => scrollToSection('products')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-green-600 transition-colors"
              >
                Products
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-green-600 transition-colors"
              >
                About
              </button>
              <Link 
                to="/order" 
                className="block mx-3 mt-4 bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors font-medium text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Order Now
              </Link>
              <Link 
                to="/login" 
                className="block px-3 py-2 text-gray-700 hover:text-green-600 transition-colors flex items-center space-x-1"
                onClick={() => setIsMenuOpen(false)}
              >
                <LogIn className="h-5 w-5" />
                <span>Admin Login</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;