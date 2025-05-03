'use client';

// Hero.tsx
import React from 'react';
import Button from '../ui/Button';
import ImagePlaceholder from '../ui/ImagePlaceholder';
import Typography from '../ui/Typography';

interface Stat {
  value: string;
  label: string;
  subLabel?: string;
}

interface HeroProps {
  title?: string;
  subtitle?: string;
  stats?: Stat[];
  primaryCta?: string;
  secondaryCta?: string;
}

const Hero: React.FC<HeroProps> = ({
  title = "Life is complicated. Finding a therapist shouldn't be.",
  subtitle = 'Connect with 1,500+ vetted private therapists & coaches located in Europe and globally, available in-person and online.',
  stats = [
    { value: '9/10', label: 'FOUND THEIR THERAPIST' },
    { value: '95%', label: 'RECOMMEND US' },
    { value: '60+', label: 'LANGUAGES OFFERED' },
    { value: '65K', label: 'INDIVIDUAL MATCHES' },
  ],
  primaryCta = 'Find your match',
  secondaryCta = 'Browse all therapists',
}) => {
  return (
    <section className="bg-secondary-lightGray py-12 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Main Heading */}
          <Typography
            variant="h1"
            className="mx-auto mb-6 max-w-4xl"
            align="center"
          >
            {title}
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="bodyLarge"
            color="secondary"
            className="mx-auto mb-8 max-w-3xl"
            align="center"
          >
            {subtitle}
          </Typography>

          {/* Stats */}
          <div className="bg-primary-green mx-auto mb-12 max-w-4xl rounded-3xl bg-opacity-10 p-6 md:p-8">
            <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
              {stats.map((stat, index) => (
                <div key={index}>
                  <Typography variant="h2" className="text-primary-green mb-2">
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="caption"
                    className="uppercase tracking-wide"
                  >
                    {stat.label}
                  </Typography>
                  {stat.subLabel && (
                    <Typography variant="caption" color="secondary">
                      {stat.subLabel}
                    </Typography>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="mb-16 flex flex-col justify-center gap-4 sm:flex-row">
            <Button variant="primary" size="lg">
              {primaryCta}
            </Button>
            <Button variant="outline" size="lg">
              {secondaryCta}
            </Button>
          </div>

          {/* Illustration */}
          <div className="mx-auto max-w-lg">
            <ImagePlaceholder
              width={600}
              height={400}
              alt="Therapy illustration"
              className="w-full"
              rounded="lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
