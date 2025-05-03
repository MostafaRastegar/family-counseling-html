import React, { useEffect, useState } from 'react';
import { StarOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Input,
  Pagination,
  Progress,
  Rate,
  Row,
  Select,
  Space,
  Statistic,
  Typography,
} from 'antd';
import type { TabsProps } from 'antd';
import type { Review } from '@/components/sessions/review';
import ReviewCard from '../ui/card/ReviewCard';
import EmptyState from '../ui/states/EmptyState';
import ErrorState from '../ui/states/ErrorState';
import LoadingState from '../ui/states/LoadingState';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

interface ReviewsListProps {
  reviews?: Review[];
  loading?: boolean;
  error?: string;
  userRole?: 'admin' | 'consultant' | 'client';
  showConsultantInfo?: boolean;
  showClientInfo?: boolean;
  onFilterChange?: (filters: any) => void;
  title?: string;
  emptyText?: string;
  showStats?: boolean;
  showFilters?: boolean;
}

const ReviewsList: React.FC<ReviewsListProps> = ({
  reviews = [],
  loading = false,
  error,
  userRole = 'client',
  showConsultantInfo = false,
  showClientInfo = true,
  onFilterChange,
  title = 'نظرات',
  emptyText = 'هیچ نظری یافت نشد',
  showStats = true,
  showFilters = true,
}) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [filteredReviews, setFilteredReviews] = useState<Review[]>(reviews);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState<string>('newest');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Update filtered reviews when reviews change or filters change
  useEffect(() => {
    let result = [...reviews];

    // Filter by rating
    if (ratingFilter !== null) {
      result = result.filter((review) => review.rating === ratingFilter);
    }

    // Filter by search query
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      result = result.filter((review) => {
        const commentMatches = review.comment
          .toLowerCase()
          .includes(lowerCaseQuery);
        const consultantNameMatches = review.consultant.user.fullName
          .toLowerCase()
          .includes(lowerCaseQuery);
        const clientNameMatches = review.client.user.fullName
          .toLowerCase()
          .includes(lowerCaseQuery);

        return commentMatches || consultantNameMatches || clientNameMatches;
      });
    }

    // Sort reviews
    result = sortReviews(result, sortOption);

    setFilteredReviews(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [reviews, ratingFilter, searchQuery, sortOption]);

  // Handle tab change
  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  // Handle search
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (onFilterChange) {
      onFilterChange({ searchQuery: value, ratingFilter, sortOption });
    }
  };

  // Handle rating filter change
  const handleRatingFilterChange = (value: number | null) => {
    setRatingFilter(value);
    if (onFilterChange) {
      onFilterChange({ searchQuery, ratingFilter: value, sortOption });
    }
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortOption(value);
    if (onFilterChange) {
      onFilterChange({ searchQuery, ratingFilter, sortOption: value });
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Sort reviews based on option
  const sortReviews = (reviewsToSort: Review[], option: string) => {
    return [...reviewsToSort].sort((a, b) => {
      switch (option) {
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
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });
  };

  // Calculate average rating
  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  // Calculate rating distribution
  const calculateRatingDistribution = () => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    reviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating as keyof typeof distribution]++;
      }
    });

    return distribution;
  };

  // Define tabs
  const tabItems: TabsProps['items'] = [
    {
      key: 'all',
      label: 'همه نظرات',
      children: null,
    },
    ...[5, 4, 3, 2, 1].map((rating) => ({
      key: `rating-${rating}`,
      label: (
        <span>
          {rating} <StarOutlined />
        </span>
      ),
      children: null,
    })),
  ];

  // Render reviews stats
  const renderStats = () => {
    if (!showStats || reviews.length === 0) return null;

    const averageRating = calculateAverageRating();
    const ratingDistribution = calculateRatingDistribution();
    const totalReviews = reviews.length;

    return (
      <Card className="mb-4">
        <Row gutter={24}>
          <Col
            xs={24}
            md={8}
            className="flex flex-col items-center justify-center border-b border-r-0 pb-4 md:border-b-0 md:border-l md:pb-0"
          >
            <Statistic
              title="میانگین امتیاز"
              value={averageRating.toFixed(1)}
              precision={1}
              suffix={<span className="text-sm">از 5</span>}
              prefix={<StarOutlined className="text-yellow-400" />}
            />
            <Rate
              disabled
              defaultValue={Math.round(averageRating * 2) / 2}
              allowHalf
            />
            <Text className="mt-2">از مجموع {totalReviews} نظر</Text>
          </Col>

          <Col xs={24} md={16}>
            <div className="pt-4 md:pt-0">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count =
                  ratingDistribution[rating as keyof typeof ratingDistribution];
                const percentage =
                  totalReviews > 0
                    ? Math.round((count / totalReviews) * 100)
                    : 0;

                return (
                  <div key={rating} className="mb-2 flex items-center">
                    <div className="ml-2 w-16 text-right">
                      <Button
                        type={ratingFilter === rating ? 'primary' : 'text'}
                        size="small"
                        onClick={() =>
                          handleRatingFilterChange(
                            ratingFilter === rating ? null : rating,
                          )
                        }
                      >
                        {rating} <StarOutlined />
                      </Button>
                    </div>
                    <Progress
                      percent={percentage}
                      strokeColor="#fadb14"
                      showInfo={false}
                      className="flex-1"
                    />
                    <div className="mr-2 w-16">
                      <Text type="secondary">{count} نظر</Text>
                    </div>
                  </div>
                );
              })}
            </div>
          </Col>
        </Row>
      </Card>
    );
  };

  // Render filters
  const renderFilters = () => {
    if (!showFilters) return null;

    return (
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="mb-2 w-full md:mb-0 md:w-auto">
          <Search
            placeholder="جستجو در نظرات..."
            allowClear
            onSearch={handleSearch}
            style={{ width: '100%', maxWidth: '300px' }}
          />
        </div>

        <Space wrap>
          <Select
            placeholder="فیلتر بر اساس امتیاز"
            allowClear
            style={{ width: 180 }}
            onChange={handleRatingFilterChange}
            value={ratingFilter}
          >
            <Option value={5}>5 ستاره</Option>
            <Option value={4}>4 ستاره</Option>
            <Option value={3}>3 ستاره</Option>
            <Option value={2}>2 ستاره</Option>
            <Option value={1}>1 ستاره</Option>
          </Select>

          <Select
            placeholder="مرتب‌سازی"
            style={{ width: 150 }}
            value={sortOption}
            onChange={handleSortChange}
          >
            <Option value="newest">جدیدترین</Option>
            <Option value="oldest">قدیمی‌ترین</Option>
            <Option value="highest">بیشترین امتیاز</Option>
            <Option value="lowest">کمترین امتیاز</Option>
          </Select>
        </Space>
      </div>
    );
  };

  // Render content based on state
  const renderContent = () => {
    if (error) {
      return (
        <ErrorState
          title="خطا در بارگذاری نظرات"
          subTitle={error}
          onRetry={() => window.location.reload()}
        />
      );
    }

    if (loading) {
      return <LoadingState />;
    }

    if (filteredReviews.length === 0) {
      return <EmptyState title="نظری یافت نشد" description={emptyText} />;
    }

    // Pagination logic
    const paginatedReviews = filteredReviews.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize,
    );

    return (
      <>
        <Row gutter={[16, 16]}>
          {paginatedReviews.map((review) => (
            <Col xs={24} md={12} lg={8} key={review.id}>
              <ReviewCard review={review} showConsultant={showConsultantInfo} />
            </Col>
          ))}
        </Row>

        {filteredReviews.length > pageSize && (
          <div className="mt-6 flex justify-center">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredReviews.length}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        )}
      </>
    );
  };

  return (
    <div className="reviews-list">
      <Card
        title={
          <div className="flex flex-col justify-between sm:flex-row sm:items-center">
            <Title level={5} className="m-0">
              {title}
            </Title>
          </div>
        }
        className="mb-6"
      >
        {/* Rating Statistics */}
        {renderStats()}

        {/* Filters */}
        {renderFilters()}

        {/* Reviews Content */}
        <div className="reviews-content">{renderContent()}</div>
      </Card>
    </div>
  );
};

export default ReviewsList;
