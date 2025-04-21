import React from 'react';
import { Card, Empty } from 'antd';
import ReviewsList from '@/components/reviews/ReviewsList';
import { Review } from '../types/consultant.types';

interface ConsultantReviewsProps {
  reviews: Review[];
}

export const ConsultantReviews: React.FC<ConsultantReviewsProps> = ({
  reviews,
}) => {
  return (
    <Card title={`نظرات (${reviews.length})`}>
      {reviews.length > 0 ? (
        <ReviewsList reviews={reviews} />
      ) : (
        <Empty description="هنوز نظری برای این مشاور ثبت نشده است" />
      )}
    </Card>
  );
};
