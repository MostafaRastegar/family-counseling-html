'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Col, Input, Row } from 'antd';
import ConsultantSearchFilter, {
  ConsultantFilterValues,
  defaultFilterValues,
} from '@/app/consultants/_components/ConsultantSearchFilter';
import ConsultantsList from '@/app/consultants/_components/ConsultantsList';
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

  // Handle navigation to consultant profile
  const handleViewProfile = (consultantId: string) => {
    router.push(`/consultants/${consultantId}`);
  };

  // Handle booking appointment
  const handleBookAppointment = (consultantId: string) => {
    router.push(`/consultants/${consultantId}/book`);
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
            consultants={consultants}
            loading={loading}
            onViewProfile={handleViewProfile}
            onBookAppointment={handleBookAppointment}
            filters={filters}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: consultants.length,
              onChange: handlePageChange,
            }}
          />
        </Col>
      </Row>
    </div>
  );
}
