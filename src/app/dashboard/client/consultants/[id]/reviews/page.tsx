'use client';

import React, { useEffect, useState } from 'react';
import ReviewsList from '@/components/sessions/ReviewsList';
import DashboardBreadcrumb from '@/components/ui/DashboardBreadcrumb';
import PageHeader from '@/components/ui/PageHeader';
import { authData } from '@/mocks/auth';
import { consultants } from '@/mocks/consultants';
import { reviews } from '@/mocks/reviews';

export default function ConsultantReviewsPage() {
  const [loading, setLoading] = useState(true);
  const [consultantReviews, setConsultantReviews] = useState<any[]>([]);

  // Get current user
  const currentUser = authData.currentUser;

  // Fetch reviews data
  useEffect(() => {
    // Simulate API call with a delay
    const timer = setTimeout(() => {
      // Find consultant ID for current user
      const consultantId = consultants.find(
        (c) => c.userId === currentUser?.id,
      )?.id;

      if (consultantId) {
        // Filter reviews for current consultant
        const filteredReviews = reviews.filter(
          (r) => r.consultantId === consultantId,
        );
        setConsultantReviews(filteredReviews);
      }

      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentUser?.id]);

  // Handle filter change
  const handleFilterChange = (filters: any) => {
    console.log('Filter changed:', filters);
    // In a real implementation, this would trigger a new API request with filters
  };

  return (
    <div className="consultant-reviews-page">
      <DashboardBreadcrumb />

      <PageHeader
        title="نظرات دریافتی"
        subtitle="مشاهده نظرات و امتیازهای دریافتی از مراجعان"
      />

      <ReviewsList
        reviews={consultantReviews}
        loading={loading}
        userRole="consultant"
        showConsultantInfo={false}
        showClientInfo={true}
        onFilterChange={handleFilterChange}
        title="نظرات دریافتی از مراجعان"
        emptyText="هنوز هیچ نظری برای شما ثبت نشده است"
        showStats={true}
      />
    </div>
  );
}
