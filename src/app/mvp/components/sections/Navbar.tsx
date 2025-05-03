'use client';

// Navbar.tsx
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Button from '../ui/Button';
import Typography from '../ui/Typography';

interface NavLink {
  label: string;
  href: string;
}

interface NavbarProps {
  logo?: string;
  navLinks?: NavLink[];
  ctaText?: string;
}

const Navbar: React.FC<NavbarProps> = ({
  logo = "It's Complicated",
  navLinks = [
    { label: 'The Blog', href: '#blog' },
    { label: 'The Directory', href: '#directory' },
    { label: 'About Us', href: '#about' },
  ],
  ctaText = 'Find a Therapist',
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="border-neutral-gray-200 border-b bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Typography
              variant="h3"
              color="primary"
              className="text-primary-brown"
            >
              {logo}
            </Typography>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-text-secondary hover:text-text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
            <Button variant="primary" size="md">
              {ctaText}
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="text-text-secondary hover:text-text-primary focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="border-neutral-gray-200 border-t md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-text-secondary hover:text-text-primary block px-3 py-2 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="px-3 py-2">
              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => {
                  setIsMenuOpen(false);
                }}
              >
                {ctaText}
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
