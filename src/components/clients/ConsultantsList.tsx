import React from 'react';
import { Empty, Pagination, Spin, Typography } from 'antd';
import ConsultantCard from '../ui/card/ConsultantCard';
import EmptyState from '../ui/states/EmptyState';
import ErrorState from '../ui/states/ErrorState';
import { ConsultantFilterValues } from './ConsultantSearchFilter';

const { Title } = Typography;

interface ConsultantsListProps {
  consultants: Array<{
    id: string;
    specialties: string[];
    bio: string;
    rating: number;
    reviewCount: number;
    isVerified: boolean;
    user: {
      fullName: string;
      profileImage?: string;
    };
  }>;
  loading?: boolean;
  error?: string;
  onViewProfile?: (consultantId: string) => void;
  onBookAppointment?: (consultantId: string) => void;
  filters?: ConsultantFilterValues;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
}

const ConsultantsList: React.FC<ConsultantsListProps> = ({
  consultants,
  loading = false,
  error,
  onViewProfile,
  onBookAppointment,
  filters,
  pagination,
}) => {
  // If there's an error, show error state
  if (error) {
    return (
      <ErrorState
        title="خطا در بارگذاری لیست مشاوران"
        subTitle={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  // If loading with no data yet, show loading
  if (loading && consultants.length === 0) {
    return (
      <div className="flex h-60 w-full items-center justify-center">
        <Spin size="large" tip="در حال بارگذاری مشاوران..." />
      </div>
    );
  }

  // If no consultants found after applying filters
  if (consultants.length === 0 && !loading) {
    return (
      <EmptyState
        title="مشاوری یافت نشد"
        description={
          filters &&
          Object.values(filters).some((v) =>
            Array.isArray(v) ? v.length > 0 : v,
          )
            ? 'هیچ مشاوری با فیلترهای انتخاب شده یافت نشد. لطفاً فیلترهای خود را تغییر دهید.'
            : 'در حال حاضر مشاوری در سیستم ثبت نشده است.'
        }
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        actionText={
          filters &&
          Object.values(filters).some((v) =>
            Array.isArray(v) ? v.length > 0 : v,
          )
            ? 'پاک کردن فیلترها'
            : undefined
        }
        onAction={
          filters &&
          Object.values(filters).some((v) =>
            Array.isArray(v) ? v.length > 0 : v,
          )
            ? () => window.location.reload()
            : undefined
        }
      />
    );
  }

  return (
    <div className="consultants-list">
      {/* Results header with count */}
      {!loading && pagination && (
        <div className="mb-4 flex flex-col justify-between sm:flex-row sm:items-center">
          <Title level={5} className="m-0">
            {pagination.total} مشاور یافت شد
          </Title>
        </div>
      )}

      {/* Grid of consultant cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {consultants.map((consultant) => (
          <ConsultantCard
            key={consultant.id}
            consultant={consultant}
            loading={loading}
            onViewProfile={() => onViewProfile && onViewProfile(consultant.id)}
            onBookAppointment={() =>
              onBookAppointment && onBookAppointment(consultant.id)
            }
          />
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.total > 0 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={pagination.onChange}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  );
};

export default ConsultantsList;
