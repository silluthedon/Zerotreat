import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Order from './pages/Order';
import Login from './pages/Login';
import Admin from './pages/Admin';
import AdminPrice from './pages/AdminPrice';
import UpdateDeliveryDay from './pages/UpdateDeliveryDay';
import AddProduct from './pages/AddProduct';
import UpdateProductStatus from './pages/UpdateProductStatus';

// Component to conditionally render Header
const Layout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = ['/admin', '/AdminPrice', '/UpdateDeliveryDay', '/AddProduct', '/UpdateProductStatus'].includes(location.pathname);

  return (
    <>
      {!isAdminRoute && <Header />}
      {children}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/order"
          element={
            <Layout>
              <Order />
            </Layout>
          }
        />
        <Route
          path="/login"
          element={
            <Layout>
              <Login />
            </Layout>
          }
        />
        <Route path="/admin" element={<Admin />} />
        <Route path="/AdminPrice" element={<AdminPrice />} />
        <Route path="/UpdateDeliveryDay" element={<UpdateDeliveryDay />} />
        <Route path="/AddProduct" element={<AddProduct />} />
        <Route path="/UpdateProductStatus" element={<UpdateProductStatus />} />
      </Routes>
    </Router>
  );
};

export default App;