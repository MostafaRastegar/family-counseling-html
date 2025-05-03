// LandingPreview1.tsx
import React from 'react';
import Blog from '../components/sections/Blog';
import Hero from '../components/sections/Hero';
import Navbar from '../components/sections/Navbar';

const LandingPreview1 = () => {
  return (
    <div className="min-h-screen">
      <Navbar logo="It's Complicated" />

      <Hero />

      <Blog />
    </div>
  );
};

export default LandingPreview1;
