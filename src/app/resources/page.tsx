'use client';

import { useEffect, useState } from 'react';
import {
  CalendarOutlined,
  ReadOutlined,
  SoundOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Card, Col, Empty, Row, Typography } from 'antd';
import FilterBar from '@/components/common/FilterBar';

const { Title, Paragraph } = Typography;

// داده‌های نمونه برای منابع
const mockResources = [
  {
    id: 1,
    title: 'راهنمای کامل تربیت فرزندان در عصر دیجیتال',
    excerpt:
      'در این مقاله به چالش‌های والدین در تربیت فرزندان در عصر فناوری و راهکارهای مناسب پرداخته می‌شود.',
    author: 'دکتر علی محمدی',
    date: '1404/02/10',
    categories: ['تربیت فرزند', 'فناوری'],
    tags: ['فرزندپروری', 'فضای مجازی', 'کودکان'],
    type: 'article',
    isFeatured: true,
  },
  // سایر منابع...
];

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);

  useEffect(() => {
    // شبیه‌سازی دریافت داده‌ها
    setTimeout(() => {
      setResources(mockResources);
      setFilteredResources(mockResources);
    }, 1000);
  }, []);

  // تعریف فیلترها
  const filterOptions = [
    {
      key: 'search',
      type: 'text',
      label: 'جستجو در منابع',
      placeholder: 'جستجو در عنوان، توضیحات یا برچسب‌ها',
    },
    {
      key: 'category',
      type: 'select',
      label: 'دسته‌بندی',
      options: [
        { value: 'تربیت فرزند', label: 'تربیت فرزند' },
        { value: 'روابط خانوادگی', label: 'روابط خانوادگی' },
        { value: 'سلامت روان', label: 'سلامت روان' },
      ],
    },
    {
      key: 'type',
      type: 'select',
      label: 'نوع محتوا',
      options: [
        { value: 'article', label: 'مقاله', icon: <ReadOutlined /> },
        { value: 'video', label: 'ویدیو', icon: <VideoCameraOutlined /> },
        { value: 'podcast', label: 'پادکست', icon: <SoundOutlined /> },
      ],
    },
    {
      key: 'featured',
      type: 'checkbox',
      label: 'محتوای ویژه',
      options: [{ value: 'featured', label: 'فقط محتوای برگزیده' }],
    },
  ];

  // تعریف گزینه‌های مرتب‌سازی
  const sortOptions = [
    {
      key: 'date_desc',
      label: 'جدیدترین',
      icon: <CalendarOutlined />,
    },
    {
      key: 'date_asc',
      label: 'قدیمی‌ترین',
      icon: <CalendarOutlined className="rotate-180" />,
    },
  ];

  // هندل فیلتر و جستجو
  const handleFilter = (filters) => {
    let result = [...resources];

    // فیلتر جستجو
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (resource) =>
          resource.title.toLowerCase().includes(searchLower) ||
          resource.excerpt.toLowerCase().includes(searchLower) ||
          resource.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
      );
    }

    // فیلتر دسته‌بندی
    if (filters.category) {
      result = result.filter((resource) =>
        resource.categories.includes(filters.category),
      );
    }

    // فیلتر نوع محتوا
    if (filters.type) {
      result = result.filter((resource) => resource.type === filters.type);
    }

    // فیلتر محتوای ویژه
    if (filters.featured && filters.featured.includes('featured')) {
      result = result.filter((resource) => resource.isFeatured);
    }

    setFilteredResources(result);
  };

  // هندل مرتب‌سازی
  const handleSort = (sort) => {
    const sortedResources = [...filteredResources].sort((a, b) => {
      const dateA = new Date(a.date.split('/').reverse().join('-'));
      const dateB = new Date(b.date.split('/').reverse().join('-'));

      return sort.key === 'date_desc' ? dateB - dateA : dateA - dateB;
    });

    setFilteredResources(sortedResources);
  };

  // رندر کارت منابع
  const renderResourceCard = (resource) => {
    const typeIcons = {
      article: <ReadOutlined />,
      video: <VideoCameraOutlined />,
      podcast: <SoundOutlined />,
    };

    return (
      <Card
        hoverable
        cover={
          <div
            className="h-48 bg-gray-200 bg-cover bg-center"
            style={{
              backgroundImage: `url(${resource.imageUrl || '/placeholder.jpg'})`,
            }}
          >
            <div className="p-2">
              <div className="flex justify-between">
                <div>
                  {typeIcons[resource.type]}
                  <span className="mr-2">
                    {resource.type === 'article'
                      ? 'مقاله'
                      : resource.type === 'video'
                        ? 'ویدیو'
                        : 'پادکست'}
                  </span>
                </div>
                {resource.isFeatured && (
                  <div className="bg-yellow-400 rounded px-2 py-1 text-white">
                    ویژه
                  </div>
                )}
              </div>
            </div>
          </div>
        }
      >
        <Card.Meta title={resource.title} description={resource.excerpt} />
        <div className="mt-4">
          {resource.tags.slice(0, 3).map((tag, index) => (
            <div
              key={index}
              className="mb-1 ml-1 inline-block rounded bg-gray-100 px-2 py-1"
            >
              {tag}
            </div>
          ))}
        </div>
      </Card>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Title level={2}>منابع و مقالات آموزشی</Title>
      <Paragraph className="mb-8 text-gray-500">
        در این بخش می‌توانید از مقالات، ویدیوها و پادکست‌های آموزشی استفاده
        کنید.
      </Paragraph>

      <FilterBar
        title="فیلتر منابع"
        filterOptions={filterOptions}
        sortOptions={sortOptions}
        onFilter={handleFilter}
        onSort={handleSort}
        showSearch
        showFilters
        showSort
      />

      {filteredResources.length > 0 ? (
        <Row gutter={[16, 16]} className="mt-4">
          {filteredResources.map((resource) => (
            <Col xs={24} sm={12} md={8} key={resource.id}>
              {renderResourceCard(resource)}
            </Col>
          ))}
        </Row>
      ) : (
        <Empty description="هیچ منبعی یافت نشد" className="mt-8" />
      )}
    </div>
  );
}
