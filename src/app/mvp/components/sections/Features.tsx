// Features.tsx
import React from 'react';
import { Award, Heart, Users } from 'lucide-react';
import Button from '../ui/Button';
import ImagePlaceholder from '../ui/ImagePlaceholder';
import Typography from '../ui/Typography';

interface Feature {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  cta?: {
    text: string;
  };
}

interface FeaturesProps {
  features?: Feature[];
  mainImage?: boolean;
}

const Features: React.FC<FeaturesProps> = ({
  features = [
    {
      id: 'matching',
      icon: <Users size={40} className="text-primary-blue" />,
      title: 'Free matching service',
      description:
        'The connection and therapeutic alliance to ones therapist is the most important factor for a successful outcomes Complicated is the first matching service that balances data and human intelligence to help you find the right match based on your individual background and needs.',
      badge: 'NEW!',
      cta: {
        text: 'Find your match',
      },
    },
    {
      id: 'affordable',
      icon: <Heart size={40} className="text-primary-green" />,
      title: 'Affordable Therapy',
      description:
        'Our mission is to make therapy accessible to everyone by offering flexible pricing options, so you can find professional support that fits your budget. Whether online or in-person, receive the care you need for depression, anxiety, trauma, stress, and more — available in more than 60 languages.',
      cta: {
        text: 'Browse all therapists',
      },
    },
    {
      id: 'built',
      icon: <Award size={40} className="text-primary-brown" />,
      title: 'Built by therapists',
      description:
        "It's Complicated is built and owned by therapists. Since starting in Dublin in 2019 we have grown organically into an international platform with local therapist communities in cities such as Berlin, Amsterdam, Copenhagen, Lisbon, London, and New York.",
      cta: {
        text: 'More about us',
      },
    },
  ],
  mainImage = true,
}) => {
  return (
    <section className="bg-secondary-lightGray py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main illustration */}
        {mainImage && (
          <div className="mx-auto mb-16 max-w-lg">
            <ImagePlaceholder
              width={600}
              height={400}
              alt="People connecting illustration"
              className="w-full"
              rounded="lg"
            />
          </div>
        )}

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.id} className="text-center">
              {/* Icon */}
              <div className="mb-6 flex justify-center">{feature.icon}</div>

              {/* Title with Badge */}
              <div className="mb-4">
                <Typography variant="h3" className="mb-2">
                  {feature.title}
                  {feature.badge && (
                    <span className="bg-primary-blue ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white">
                      {feature.badge}
                    </span>
                  )}
                </Typography>
              </div>

              {/* Description */}
              <Typography variant="body" color="secondary" className="mb-6">
                {feature.description}
              </Typography>

              {/* CTA */}
              {feature.cta && (
                <Button variant="outline" size="md">
                  {feature.cta.text}
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
