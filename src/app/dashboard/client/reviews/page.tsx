'use client';

import React, { useEffect, useState } from 'react';
import ReviewsList from '@/components/sessions/ReviewsList';
import DashboardBreadcrumb from '@/components/ui/DashboardBreadcrumb';
import PageHeader from '@/components/ui/PageHeader';
import { authData } from '@/mocks/auth';
import { reviews } from '@/mocks/reviews';

export default function ClientReviewsPage() {
  const [loading, setLoading] = useState(true);
  const [userReviews, setUserReviews] = useState<any[]>([]);

  // Get current user
  const currentUser = authData.currentUser;

  // Fetch reviews data
  useEffect(() => {
    // Simulate API call with a delay
    const timer = setTimeout(() => {
      // Filter reviews for current client
      const filteredReviews = reviews.filter(
        (r) => r.client.user.id === currentUser?.id,
      );
      setUserReviews(filteredReviews);
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
    <div className="client-reviews-page">
      <DashboardBreadcrumb />

      <PageHeader
        title="نظرات من"
        subtitle="مشاهده نظرات ثبت شده توسط شما برای جلسات مشاوره"
      />

      <ReviewsList
        reviews={userReviews}
        loading={loading}
        userRole="client"
        showConsultantInfo={true}
        showClientInfo={false}
        onFilterChange={handleFilterChange}
        title="نظرات من"
        emptyText="شما هنوز هیچ نظری ثبت نکرده‌اید"
        showStats={false}
      />
    </div>
  );
}
