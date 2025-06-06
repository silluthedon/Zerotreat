import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Features from '../components/Features';
import TargetAudience from '../components/TargetAudience';
import Products from '../components/Products';
import OrderDelivery from '../components/OrderDelivery';
import WhyZeroTreat from '../components/WhyZeroTreat';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <TargetAudience />
      <Products />
      <OrderDelivery />
      <WhyZeroTreat />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Home;