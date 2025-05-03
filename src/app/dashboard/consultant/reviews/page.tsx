'use client';

import React, { useState } from 'react';
import { StarOutlined } from '@ant-design/icons';
import {
  Card,
  Col,
  Empty,
  Rate,
  Row,
  Select,
  Space,
  Statistic,
  Typography,
} from 'antd';
import PageHeader from '@/components/ui/PageHeader';
import ReviewCard from '@/components/ui/card/ReviewCard';
import { authData } from '@/mocks/auth';
import { consultants } from '@/mocks/consultants';
import { reviews } from '@/mocks/reviews';

const { Text } = Typography;
const { Option } = Select;

export default function ConsultantReviewsPage() {
  // در یک برنامه واقعی، این داده‌ها از API دریافت می‌شوند
  // اما فعلاً از داده‌های نمونه استفاده می‌کنیم
  const { currentUser } = authData;

  // یافتن اطلاعات مشاور برای کاربر جاری
  const consultantData = consultants.find((c) => c.userId === currentUser?.id);

  // فیلتر کردن نظرات مربوط به این مشاور
  const consultantReviews = reviews.filter(
    (r) => r.consultantId === consultantData?.id,
  );

  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<
    'newest' | 'oldest' | 'highest' | 'lowest'
  >('newest');

  // محاسبه میانگین امتیازها
  const calculateAverageRating = () => {
    if (consultantReviews.length === 0) return 0;
    const sum = consultantReviews.reduce(
      (acc, review) => acc + review.rating,
      0,
    );
    return sum / consultantReviews.length;
  };

  // محاسبه تعداد هر امتیاز
  const calculateRatingCounts = () => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    consultantReviews.forEach((review) => {
      counts[review.rating as keyof typeof counts]++;
    });
    return counts;
  };

  const averageRating = calculateAverageRating();
  const ratingCounts = calculateRatingCounts();

  // فیلتر کردن نظرات بر اساس امتیاز
  const filteredReviews = filterRating
    ? consultantReviews.filter((review) => review.rating === filterRating)
    : consultantReviews;

  // مرتب‌سازی نظرات
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortOrder) {
      case 'newest':
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case 'oldest':
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      default:
        return 0;
    }
  });

  // تغییر فیلتر امتیاز
  const handleRatingFilterChange = (value: number | null) => {
    setFilterRating(value);
  };

  // تغییر نوع مرتب‌سازی
  const handleSortOrderChange = (value: string) => {
    setSortOrder(value as 'newest' | 'oldest' | 'highest' | 'lowest');
  };

  // گزینه‌های مرتب‌سازی
  const sortOptions = [
    { label: 'جدیدترین', value: 'newest' },
    { label: 'قدیمی‌ترین', value: 'oldest' },
    { label: 'بیشترین امتیاز', value: 'highest' },
    { label: 'کمترین امتیاز', value: 'lowest' },
  ];

  // اگر کاربر مشاور نباشد، پیام مناسب نمایش داده می‌شود
  if (currentUser?.role !== 'consultant') {
    return (
      <div className="my-20 text-center">
        <h2 className="mb-2 text-2xl font-semibold">صفحه مختص مشاوران</h2>
        <p className="text-gray-500">
          این صفحه فقط برای کاربران با نقش مشاور قابل دسترسی است.
        </p>
      </div>
    );
  }

  return (
    <div className="consultant-reviews-page">
      <PageHeader
        title="نظرات و امتیازها"
        subtitle="نظرات و امتیازهای دریافتی از مراجعان خود را مشاهده کنید"
      />

      {/* بخش خلاصه آمار */}
      <Card className="mb-6">
        <Row gutter={[24, 24]} justify="center" align="middle">
          <Col xs={24} md={8} className="text-center">
            <div>
              <Statistic
                title="میانگین امتیاز"
                value={averageRating.toFixed(1)}
                precision={1}
                prefix={<StarOutlined className="text-yellow-500 text-xl" />}
                className="mb-2"
              />
              <Rate allowHalf disabled defaultValue={averageRating} />
              <Text className="mt-2 block">
                از مجموع {consultantReviews.length} نظر
              </Text>
            </div>
          </Col>

          <Col xs={24} md={16}>
            <div className="rating-bars">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = ratingCounts[rating as keyof typeof ratingCounts];
                const percentage =
                  consultantReviews.length > 0
                    ? Math.round((count / consultantReviews.length) * 100)
                    : 0;

                return (
                  <div key={rating} className="mb-2 flex items-center">
                    <div className="ml-2 min-w-16">
                      <Text>{rating} ستاره</Text>
                    </div>
                    <div className="h-5 grow overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="bg-yellow-400 h-full rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="mr-2 min-w-16 text-right">
                      <Text>{count} نظر</Text>
                    </div>
                  </div>
                );
              })}
            </div>
          </Col>
        </Row>
      </Card>

      {/* فیلترها و مرتب‌سازی */}
      <div className="mb-6 flex flex-wrap justify-between gap-4">
        <div>
          <Space wrap>
            <Text strong>فیلتر بر اساس:</Text>
            <Select
              placeholder="همه امتیازها"
              style={{ width: 140 }}
              allowClear
              onChange={handleRatingFilterChange}
              value={filterRating}
            >
              <Option value={5}>5 ستاره</Option>
              <Option value={4}>4 ستاره</Option>
              <Option value={3}>3 ستاره</Option>
              <Option value={2}>2 ستاره</Option>
              <Option value={1}>1 ستاره</Option>
            </Select>
          </Space>
        </div>

        <div>
          <Space wrap>
            <Text strong>مرتب‌سازی:</Text>
            <Select
              defaultValue="newest"
              style={{ width: 140 }}
              onChange={handleSortOrderChange}
              value={sortOrder}
            >
              {sortOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Space>
        </div>
      </div>

      {/* لیست نظرات */}
      {sortedReviews.length > 0 ? (
        <Row gutter={[16, 16]}>
          {sortedReviews.map((review) => (
            <Col xs={24} md={12} lg={8} key={review.id}>
              <ReviewCard review={review as any} />
            </Col>
          ))}
        </Row>
      ) : (
        <Card>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              filterRating
                ? `هیچ نظری با امتیاز ${filterRating} ستاره یافت نشد`
                : 'هنوز هیچ نظری دریافت نکرده‌اید'
            }
          />
        </Card>
      )}
    </div>
  );
}
