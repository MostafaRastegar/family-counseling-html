// CompleteLandingPage.tsx
import React from 'react';
import Blog from './components/sections/Blog';
import Directory from './components/sections/Directory';
import Features from './components/sections/Features';
import Footer from './components/sections/Footer';
import Hero from './components/sections/Hero';
import Navbar from './components/sections/Navbar';

const CompleteLandingPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar logo="It's Complicated" />

      <Hero />

      <Blog />

      <Directory />

      <Features />

      <Footer />
    </div>
  );
};

export default CompleteLandingPage;
