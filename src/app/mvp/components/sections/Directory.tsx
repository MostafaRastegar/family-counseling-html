// Directory.tsx
import React from 'react';
import { Clock, MapPin, MessageCircle, Star, Video } from 'lucide-react';
import Card from '../ui/Card';
import ImagePlaceholder from '../ui/ImagePlaceholder';
import Typography from '../ui/Typography';

interface Therapist {
  id: string;
  name: string;
  profession: string;
  specialties: string[];
  location: string;
  price: string;
  availability: string;
  rating?: number;
  services: string[];
  languages?: string[];
}

interface DirectoryProps {
  title?: string;
  subtitle?: string;
  therapists?: Therapist[];
}

const Directory: React.FC<DirectoryProps> = ({
  title = 'The Directory',
  subtitle = 'Find a therapist, psychologist, counsellor or coach based on your preferences.',
  therapists = [
    {
      id: '1',
      name: 'Denise Gallo',
      profession: 'Social Worker',
      specialties: [
        'Anxiety',
        'Attachment',
        'Borderline personality disorder',
        'Burnout',
        'Career',
        'Trauma',
        'Therapy for Expats',
      ],
      location: 'Kununurra',
      price: '€ 70',
      availability: 'USUALLY RESPONDS WITHIN 12 HOURS',
      services: ['Online and Text'],
    },
    {
      id: '2',
      name: 'Tamara',
      profession: 'Somatic Counsellor & Therapist, Integrative Body - Mind ...',
      specialties: [
        'Couples therapy',
        'Relationships',
        'Somatic Experiencing',
        'Stress',
        'Trauma',
        'Anxiety',
        'EMDR',
      ],
      location: 'Berlin',
      price: '€ 95',
      availability: 'USUALLY RESPONDS WITHIN 12 HOURS',
      services: ['In-person and Online'],
    },
    {
      id: '3',
      name: 'Mascha Lehr-Bozovic',
      profession: 'Clinical Psychologist',
      specialties: [
        'Attachment',
        'Relationships',
        'Anxiety',
        'Depression',
        'Academic or educational problems',
        'Midlife Transitions',
        'Therapy for Expats',
      ],
      location: 'Berlin',
      price: '€ 80',
      availability: 'USUALLY RESPONDS WITHIN 24 HOURS',
      services: ['In-person and Online'],
    },
    {
      id: '4',
      name: 'Laura Nickel',
      profession: 'Psychological Psychotherapist',
      specialties: [
        'Depression',
        'Illness anxiety disorder (IAD) or hypochondria',
        'Stress',
        'ADHD: Attention deficit hyperactivity disorder',
        'Social anxiety',
        'Somatic...',
      ],
      location: 'Lisbon',
      price: '€ 120',
      availability: 'USUALLY RESPONDS AFTER 24 HOURS',
      services: ['Online only'],
    },
  ],
}) => {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Typography variant="h2" className="mb-4 text-center">
          {title}
        </Typography>

        <Typography
          variant="bodyLarge"
          color="secondary"
          className="mx-auto mb-12 max-w-3xl text-center"
        >
          {subtitle}
        </Typography>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {therapists.map((therapist) => (
            <Card
              key={therapist.id}
              variant="bordered"
              className="overflow-hidden"
            >
              <div className="p-6">
                <div className="flex gap-6">
                  <div className="shrink-0">
                    <ImagePlaceholder
                      width={120}
                      height={120}
                      alt={therapist.name}
                      rounded="lg"
                    />
                  </div>

                  <div className="min-w-0 grow">
                    <Typography variant="h3" className="mb-1">
                      {therapist.name}
                    </Typography>

                    <Typography
                      variant="body"
                      color="secondary"
                      className="mb-3"
                    >
                      {therapist.profession}
                    </Typography>

                    <div className="mb-4 flex flex-wrap gap-2">
                      {therapist.specialties
                        .slice(0, 4)
                        .map((specialty, index) => (
                          <span
                            key={index}
                            className="bg-primary-green text-text-secondary rounded-full bg-opacity-10 px-2 py-1 text-sm"
                          >
                            {specialty}
                          </span>
                        ))}
                      {therapist.specialties.length > 4 && (
                        <span className="bg-primary-green text-text-secondary rounded-full bg-opacity-10 px-2 py-1 text-sm">
                          +{therapist.specialties.length - 4} more
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="text-text-secondary flex items-center gap-2">
                        <Typography variant="h4" className="text-text-primary">
                          {therapist.price}
                        </Typography>
                      </div>

                      <div className="text-text-secondary flex items-center gap-2">
                        <MapPin size={16} />
                        <Typography variant="body">
                          {therapist.location}
                        </Typography>
                      </div>

                      <div className="text-text-secondary flex items-center gap-2">
                        {therapist.services.includes('Video') && (
                          <Video size={16} />
                        )}
                        {therapist.services.includes('MessageCircle') && (
                          <MessageCircle size={16} />
                        )}
                        <Typography variant="body">
                          {therapist.services.join(' and ')}
                        </Typography>
                      </div>
                    </div>
                  </div>
                </div>

                {therapist.availability && (
                  <div className="border-neutral-gray-200 mt-4 border-t pt-4">
                    <div className="text-text-muted flex items-center gap-2">
                      <Clock size={16} />
                      <Typography variant="caption" className="uppercase">
                        {therapist.availability}
                      </Typography>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Directory;
