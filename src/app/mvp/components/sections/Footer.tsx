'use client';

// Footer.tsx
import React from 'react';
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from 'lucide-react';
import Button from '../ui/Button';
import Typography from '../ui/Typography';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface FooterProps {
  logo?: string;
  tagline?: string;
  sections?: FooterSection[];
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  newsletter?: {
    title?: string;
    placeholder?: string;
    buttonText?: string;
  };
}

const Footer: React.FC<FooterProps> = ({
  logo = "It's Complicated",
  tagline = "Finding therapy shouldn't be complicated",
  sections = [
    {
      title: 'Navigation',
      links: [
        { label: 'The Blog', href: '#blog' },
        { label: 'The Directory', href: '#directory' },
        { label: 'About Us', href: '#about' },
        { label: 'FAQ', href: '#faq' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Contact', href: '#contact' },
        { label: 'Help Center', href: '#help' },
        { label: 'Privacy Policy', href: '#privacy' },
        { label: 'Terms of Service', href: '#terms' },
      ],
    },
    {
      title: 'For Professionals',
      links: [
        { label: 'Join Our Network', href: '#join' },
        { label: 'Professional Resources', href: '#resources' },
        { label: 'Become a Partner', href: '#partner' },
      ],
    },
  ],
  socialLinks = {
    facebook: '#',
    twitter: '#',
    instagram: '#',
    linkedin: '#',
  },
  contactInfo = {
    email: 'hello@itscomplicated.com',
    phone: '+1 234 567 8900',
    address: 'Dublin, Ireland | Berlin, Germany | New York, USA',
  },
  newsletter = {
    title: 'Subscribe to our newsletter',
    placeholder: 'Enter your email',
    buttonText: 'Subscribe',
  },
}) => {
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter subscription');
  };

  return (
    <footer className="border-neutral-gray-200 border-t bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Logo and Tagline */}
          <div className="lg:col-span-1">
            <Typography variant="h3" className="text-primary-brown mb-2">
              {logo}
            </Typography>
            <Typography variant="body" color="secondary">
              {tagline}
            </Typography>
          </div>

          {/* Footer Sections */}
          {sections.map((section) => (
            <div key={section.title}>
              <Typography variant="h4" className="mb-4">
                {section.title}
              </Typography>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-text-secondary hover:text-text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          {newsletter && (
            <div>
              <Typography variant="h4" className="mb-4">
                {newsletter.title}
              </Typography>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <input
                  type="email"
                  placeholder={newsletter.placeholder}
                  className="border-neutral-gray-300 focus:ring-primary-blue flex-1 rounded-lg border px-3 py-2 focus:outline-none focus:ring-2"
                />
                <Button type="submit" variant="primary" size="md">
                  {newsletter.buttonText}
                </Button>
              </form>
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="border-neutral-gray-200 mt-12 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            {/* Contact Info */}
            <div className="text-text-secondary flex flex-col gap-4 text-sm sm:flex-row">
              {contactInfo?.email && (
                <div className="flex items-center gap-2">
                  <Mail size={16} />
                  <span>{contactInfo.email}</span>
                </div>
              )}
              {contactInfo?.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={16} />
                  <span>{contactInfo.phone}</span>
                </div>
              )}
              {contactInfo?.address && (
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>{contactInfo.address}</span>
                </div>
              )}
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks?.facebook && (
                <a
                  href={socialLinks.facebook}
                  className="text-text-secondary hover:text-text-primary"
                >
                  <Facebook size={20} />
                </a>
              )}
              {socialLinks?.twitter && (
                <a
                  href={socialLinks.twitter}
                  className="text-text-secondary hover:text-text-primary"
                >
                  <Twitter size={20} />
                </a>
              )}
              {socialLinks?.instagram && (
                <a
                  href={socialLinks.instagram}
                  className="text-text-secondary hover:text-text-primary"
                >
                  <Instagram size={20} />
                </a>
              )}
              {socialLinks?.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  className="text-text-secondary hover:text-text-primary"
                >
                  <Linkedin size={20} />
                </a>
              )}
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 text-center">
            <Typography variant="caption" color="secondary">
              © {new Date().getFullYear()} Its Complicated. All rights
              reserved.
            </Typography>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
