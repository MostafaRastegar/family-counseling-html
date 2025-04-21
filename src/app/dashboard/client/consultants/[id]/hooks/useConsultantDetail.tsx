import { useEffect, useState } from 'react';
import { consultants } from '@/mocks/consultants';
import { reviews } from '@/mocks/reviews';
import { Consultant, Review, TimeSlot } from '../types/consultant.types';

export const useConsultantDetail = (consultantId: number) => {
  const [consultant, setConsultant] = useState<Consultant | null>(null);
  const [consultantReviews, setConsultantReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConsultantDetails = () => {
      try {
        // Simulating API call
        const foundConsultant = consultants.find((c) => c.id === consultantId);

        const filteredReviews = reviews.filter(
          (review) => review.consultantId === consultantId,
        );

        if (foundConsultant) {
          setConsultant(foundConsultant);
          setConsultantReviews(filteredReviews);
        }
      } catch (error) {
        console.error('Error fetching consultant details', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultantDetails();
  }, [consultantId]);

  return {
    consultant,
    consultantReviews,
    loading,
  };
};
