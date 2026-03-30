import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Leaf, LogOut, Save } from 'lucide-react';
import { supabase } from '../utils/supabase';
import toast, { Toaster } from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  price: number;
}

const AdminPrice: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [priceUpdates, setPriceUpdates] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const checkSessionAndFetch = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
          navigate('/login');
          return;
        }

        const { data, error } = await supabase
          .from('products')
          .select('id, name, price');
        if (error) {
          throw error;
        }
        setProducts(data || []);
      } catch (error: any) {
        setError('Error loading products.');
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    checkSessionAndFetch();
  }, [navigate]);

  const handlePriceChange = (id: string, value: string) => {
    setPriceUpdates((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSavePrices = async () => {
    try {
      let hasInvalid = false;
      const updates: { id: string; price: number }[] = [];

      for (const [id, value] of Object.entries(priceUpdates)) {
        if (value.trim() === '') {
          hasInvalid = true;
          continue; // Skip empty inputs
        }
        const price = parseInt(value);
        if (isNaN(price) || price <= 0) {
          hasInvalid = true;
          continue; // Skip invalid prices
        }
        updates.push({ id, price });
      }

      if (hasInvalid) {
        setError('Some prices are invalid or empty. Only valid prices will be updated.');
      } else {
        setError(null);
      }

      for (const { id, price } of updates) {
        const { error } = await supabase
          .from('products')
          .update({ price })
          .eq('id', id);
        if (error) {
          throw error;
        }
      }

      setProducts((prev) =>
        prev.map((product) => {
          const updatedPrice = updates.find((u) => u.id === product.id);
          return updatedPrice
            ? { ...product, price: updatedPrice.price }
            : product;
        })
      );
      setPriceUpdates({});
      if (!hasInvalid) {
        toast.success('Prices updated successfully!', {
          position: 'top-right',
          duration: 3000,
        });
      }
    } catch (error: any) {
      setError('Error updating prices.');
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
      setError('Error during logout. Try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-600">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-coffee-50">
      <Toaster />
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

      {/* Price Update Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Update Product Prices
        </h1>

        {error && (
          <div className="mb-6 text-red-600 text-center">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-coffee-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Current Price
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  New Price
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => {
                const inputValue =
                  priceUpdates[product.id] !== undefined
                    ? priceUpdates[product.id]
                    : product.price.toString();
                const isInvalid =
                  priceUpdates[product.id] !== undefined &&
                  (priceUpdates[product.id].trim() === '' ||
                    parseInt(priceUpdates[product.id]) <= 0);

                return (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ৳{product.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <input
                        type="number"
                        value={inputValue}
                        onChange={(e) => handlePriceChange(product.id, e.target.value)}
                        min="1"
                        className={`w-24 px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee-500 ${
                          isInvalid ? 'border-red-500' : ''
                        }`}
                        placeholder="Enter new price"
                      />
                      {isInvalid && (
                        <p className="text-red-500 text-xs mt-1">
                          Price must be a positive number
                        </p>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSavePrices}
              className="bg-coffee-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-coffee-600 transition-colors flex items-center space-x-2"
            >
              <Save className="h-5 w-5" />
              <span>Save Prices</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPrice;