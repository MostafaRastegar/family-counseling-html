'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Col, Input, Row } from 'antd';
import ConsultantSearchFilter, {
  ConsultantFilterValues,
  defaultFilterValues,
} from '@/components/clients/ConsultantSearchFilter';
import ConsultantsList from '@/components/clients/ConsultantsList';
import PageHeader from '@/components/ui/PageHeader';
import { consultants } from '@/mocks/consultants';

const { Search } = Input;

export default function ConsultantsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] =
    useState<ConsultantFilterValues>(defaultFilterValues);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // For pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  // Check if the screen is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Simulate loading data from server
  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [filters, searchQuery, currentPage]);

  // Handle search input changes
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: ConsultantFilterValues) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  // Filter consultants based on search query and filters
  const filteredConsultants = consultants
    .filter((consultant) => {
      // Search by name
      if (searchQuery && !consultant.user.fullName.includes(searchQuery)) {
        return false;
      }

      // Filter by specialties
      if (
        filters.specialties.length > 0 &&
        !filters.specialties.some((specialty) =>
          consultant.specialties.includes(specialty),
        )
      ) {
        return false;
      }

      // Filter by minimum rating
      if (filters.minRating > 0 && consultant.rating < filters.minRating) {
        return false;
      }

      // Filter by verified status
      if (filters.isVerified && !consultant.isVerified) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      // Sort based on selected sort option
      switch (filters.sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'reviews':
          return b.reviewCount - a.reviewCount;
        default:
          return b.rating - a.rating;
      }
    });

  // Calculate pagination
  const paginatedConsultants = filteredConsultants.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  // Handle navigation to consultant profile
  const handleViewProfile = (consultantId: string) => {
    router.push(`/dashboard/client/consultants/${consultantId}`);
  };

  // Handle booking appointment
  const handleBookAppointment = (consultantId: string) => {
    router.push(`/dashboard/client/consultants/${consultantId}/book`);
  };

  // Handle pagination change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="consultants-page">
      <PageHeader
        title="یافتن مشاور"
        subtitle="مشاور مناسب برای جلسه مشاوره خود را انتخاب کنید"
      />

      {/* Search bar */}
      <div className="mb-6">
        <Search
          placeholder="جستجوی نام مشاور..."
          allowClear
          enterButton="جستجو"
          size="large"
          onSearch={handleSearch}
        />
      </div>

      {/* Mobile filters (for small screens) */}
      {isMobile && (
        <ConsultantSearchFilter
          onFilterChange={handleFilterChange}
          filters={filters}
          loading={loading}
          mobile={true}
        />
      )}

      <Row gutter={24}>
        {/* Filters (for larger screens) */}
        {!isMobile && (
          <Col xs={24} md={8} lg={6} className="mb-6 md:mb-0">
            <ConsultantSearchFilter
              onFilterChange={handleFilterChange}
              filters={filters}
              loading={loading}
              mobile={false}
            />
          </Col>
        )}

        {/* Consultants list */}
        <Col xs={24} md={16} lg={18}>
          <ConsultantsList
            consultants={paginatedConsultants}
            loading={loading}
            onViewProfile={handleViewProfile}
            onBookAppointment={handleBookAppointment}
            filters={filters}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: filteredConsultants.length,
              onChange: handlePageChange,
            }}
          />
        </Col>
      </Row>
    </div>
  );
}
