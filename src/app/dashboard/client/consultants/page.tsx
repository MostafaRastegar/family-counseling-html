'use client';

import { useState } from 'react';
import { StarOutlined } from '@ant-design/icons';
import { Col, Empty, Row, Typography } from 'antd';
import FilterBar from '@/components/common/FilterBar';
import ConsultantCard from '@/components/consultants/ConsultantCard';
import { consultants } from '@/mocks/consultants';

const { Title, Paragraph } = Typography;

export default function ConsultantsList() {
  const [filteredConsultants, setFilteredConsultants] = useState(consultants);

  // تعریف فیلترها
  const filterOptions = [
    {
      key: 'search',
      type: 'text',
      label: 'جستجو',
      placeholder: 'جستجوی نام مشاور یا تخصص',
    },
    {
      key: 'specialties',
      type: 'select',
      label: 'تخصص‌ها',
      mode: 'multiple',
      options: [
        { value: 'مشاوره خانواده', label: 'مشاوره خانواده' },
        { value: 'روابط زناشویی', label: 'روابط زناشویی' },
        { value: 'فرزندپروری', label: 'فرزندپروری' },
        { value: 'مشاوره تحصیلی', label: 'مشاوره تحصیلی' },
        { value: 'مشاوره قبل از ازدواج', label: 'مشاوره قبل از ازدواج' },
      ],
    },
    {
      key: 'rating',
      type: 'select',
      label: 'امتیاز',
      options: [
        { value: '4', label: '4 ستاره و بالاتر' },
        { value: '3', label: '3 ستاره و بالاتر' },
      ],
    },
  ];

  // تعریف گزینه‌های مرتب‌سازی
  const sortOptions = [
    {
      key: 'rating_desc',
      label: 'بالاترین امتیاز',
      icon: <StarOutlined />,
    },
    {
      key: 'rating_asc',
      label: 'پایین‌ترین امتیاز',
      icon: <StarOutlined className="rotate-180" />,
    },
  ];

  // هندل فیلتر و جستجو
  const handleFilter = (filters) => {
    let result = [...consultants];

    // فیلتر جستجو
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (consultant) =>
          consultant.name.toLowerCase().includes(searchLower) ||
          consultant.specialties.some((specialty) =>
            specialty.toLowerCase().includes(searchLower),
          ),
      );
    }

    // فیلتر تخصص‌ها
    if (filters.specialties && filters.specialties.length > 0) {
      result = result.filter((consultant) =>
        consultant.specialties.some((specialty) =>
          filters.specialties.includes(specialty),
        ),
      );
    }

    // فیلتر امتیاز
    if (filters.rating) {
      result = result.filter(
        (consultant) => consultant.rating >= parseFloat(filters.rating),
      );
    }

    setFilteredConsultants(result);
  };

  // هندل مرتب‌سازی
  const handleSort = (sort) => {
    const sortedConsultants = [...filteredConsultants].sort((a, b) => {
      return sort.key === 'rating_desc'
        ? b.rating - a.rating
        : a.rating - b.rating;
    });

    setFilteredConsultants(sortedConsultants);
  };

  return (
    <div className="container mx-auto">
      <Title level={2}>یافتن مشاور</Title>
      <Paragraph className="mb-8 text-gray-500">
        از بین مشاوران متخصص ما، فردی که متناسب با نیازهای شماست را انتخاب کنید.
      </Paragraph>

      <FilterBar
        title="لیست مشاوران"
        filterOptions={filterOptions}
        sortOptions={sortOptions}
        onFilter={handleFilter}
        onSort={handleSort}
        showSearch
        showFilters
        showSort
      />

      {filteredConsultants.length > 0 ? (
        <Row gutter={[16, 16]} className="mt-4">
          {filteredConsultants.map((consultant) => (
            <Col xs={24} md={12} lg={8} key={consultant.id}>
              <ConsultantCard consultant={consultant} />
            </Col>
          ))}
        </Row>
      ) : (
        <Empty
          description="هیچ مشاوری با معیارهای جستجوی شما یافت نشد."
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className="my-16"
        />
      )}
    </div>
  );
}
