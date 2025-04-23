import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  DownOutlined,
  FilterOutlined,
  PlusOutlined,
  SearchOutlined,
  SortAscendingOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Dropdown,
  Empty,
  Input,
  Row,
  Select,
  Space,
  Tabs,
  Typography,
} from 'antd';
import type { MenuProps, TabsProps } from 'antd';
import type { Session, SessionStatus } from '@/types/session';
import SessionCard from '../ui/card/SessionCard';
import EmptyState from '../ui/states/EmptyState';
import ErrorState from '../ui/states/ErrorState';
import LoadingState from '../ui/states/LoadingState';

const { Text, Title } = Typography;
const { Search } = Input;
const { Option } = Select;

export interface SessionsListProps {
  sessions?: Session[];
  loading?: boolean;
  error?: string;
  userRole?: 'admin' | 'consultant' | 'client';
  onViewDetails?: (sessionId: string) => void;
  onUpdateStatus?: (sessionId: string, status: SessionStatus) => void;
  onAddSession?: () => void;
  showFilters?: boolean;
  showAddButton?: boolean;
  title?: string;
  emptyText?: string;
}

const SessionsList: React.FC<SessionsListProps> = ({
  sessions = [],
  loading = false,
  error,
  userRole = 'client',
  onViewDetails,
  onUpdateStatus,
  onAddSession,
  showFilters = true,
  showAddButton = true,
  title = 'جلسات مشاوره',
  emptyText = 'هیچ جلسه‌ای یافت نشد',
}) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [filteredSessions, setFilteredSessions] = useState<Session[]>(sessions);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>('newest');

  // Update filtered sessions when sessions change or filters change
  useEffect(() => {
    let result = [...sessions];

    // Filter by tab
    if (activeTab !== 'all') {
      result = result.filter((session) => {
        switch (activeTab) {
          case 'upcoming':
            return ['pending', 'confirmed'].includes(session.status);
          case 'completed':
            return session.status === 'completed';
          case 'cancelled':
            return session.status === 'cancelled';
          default:
            return true;
        }
      });
    }

    // Filter by status if selected
    if (filterStatus) {
      result = result.filter((session) => session.status === filterStatus);
    }

    // Filter by search query
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      result = result.filter((session) => {
        // Search in participant name
        const consultantName = session.consultant.user.fullName.toLowerCase();
        const clientName = session.client.user.fullName.toLowerCase();
        const searchTarget =
          userRole === 'consultant' ? clientName : consultantName;

        // Also search in notes if available
        const notes = session.notes?.toLowerCase() || '';

        return (
          searchTarget.includes(lowerCaseQuery) ||
          notes.includes(lowerCaseQuery)
        );
      });
    }

    // Sort sessions
    result = sortSessions(result, sortOption);

    setFilteredSessions(result);
  }, [sessions, activeTab, filterStatus, searchQuery, sortOption, userRole]);

  // Handle tab change
  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  // Handle search
  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  // Handle status filter change
  const handleStatusFilterChange = (value: string | null) => {
    setFilterStatus(value);
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortOption(value);
  };

  // Sort sessions based on option
  const sortSessions = (sessionsToSort: Session[], option: string) => {
    return [...sessionsToSort].sort((a, b) => {
      switch (option) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });
  };

  // Handle view details
  const handleViewDetails = (sessionId: string) => {
    if (onViewDetails) {
      onViewDetails(sessionId);
    } else {
      router.push(`/dashboard/sessions/${sessionId}`);
    }
  };

  // Handle update status
  const handleUpdateStatus = (sessionId: string, status: SessionStatus) => {
    if (onUpdateStatus) {
      onUpdateStatus(sessionId, status);
    }
  };

  // Define tabs
  const tabItems: TabsProps['items'] = [
    {
      key: 'all',
      label: 'همه جلسات',
      children: null,
    },
    {
      key: 'upcoming',
      label: 'جلسات آینده',
      children: null,
    },
    {
      key: 'completed',
      label: 'جلسات انجام شده',
      children: null,
    },
    {
      key: 'cancelled',
      label: 'جلسات لغو شده',
      children: null,
    },
  ];

  // Sort options for dropdown
  const sortOptions: MenuProps['items'] = [
    {
      key: 'newest',
      label: 'جدیدترین',
    },
    {
      key: 'oldest',
      label: 'قدیمی‌ترین',
    },
  ];

  // Render content based on state
  const renderContent = () => {
    if (error) {
      return (
        <ErrorState
          title="خطا در بارگذاری جلسات"
          subTitle={error}
          onRetry={() => window.location.reload()}
        />
      );
    }

    if (loading) {
      return <LoadingState />;
    }

    if (filteredSessions.length === 0) {
      return (
        <EmptyState
          title="جلسه‌ای یافت نشد"
          description={emptyText}
          actionText={showAddButton ? 'رزرو جلسه جدید' : undefined}
          onAction={onAddSession}
        />
      );
    }

    return (
      <Row gutter={[16, 16]}>
        {filteredSessions.map((session) => (
          <Col xs={24} md={12} lg={8} key={session.id}>
            <SessionCard
              session={session}
              userRole={userRole}
              onViewDetails={handleViewDetails}
              onUpdateStatus={handleUpdateStatus}
            />
          </Col>
        ))}
      </Row>
    );
  };

  return (
    <div className="sessions-list">
      <Card
        title={
          <div className="flex flex-col justify-between sm:flex-row sm:items-center">
            <Title level={5} className="m-0">
              {title}
            </Title>
            {showAddButton && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={onAddSession}
                className="mt-2 sm:mt-0"
              >
                رزرو جلسه جدید
              </Button>
            )}
          </div>
        }
        className="mb-6"
      >
        {showFilters && (
          <div className="mb-4">
            <Tabs
              activeKey={activeTab}
              items={tabItems}
              onChange={handleTabChange}
              className="sessions-tabs"
            />

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
              <div className="mb-2 w-full md:mb-0 md:w-auto">
                <Search
                  placeholder="جستجو..."
                  allowClear
                  onSearch={handleSearch}
                  style={{ width: '100%', maxWidth: '300px' }}
                />
              </div>

              <Space wrap>
                <Select
                  placeholder="فیلتر وضعیت"
                  allowClear
                  style={{ width: 150 }}
                  onChange={handleStatusFilterChange}
                  value={filterStatus}
                >
                  <Option value="pending">در انتظار تایید</Option>
                  <Option value="confirmed">تایید شده</Option>
                  <Option value="completed">انجام شده</Option>
                  <Option value="cancelled">لغو شده</Option>
                </Select>

                <Select
                  placeholder="مرتب‌سازی"
                  style={{ width: 150 }}
                  value={sortOption}
                  onChange={handleSortChange}
                >
                  <Option value="newest">جدیدترین</Option>
                  <Option value="oldest">قدیمی‌ترین</Option>
                </Select>
              </Space>
            </div>
          </div>
        )}

        <div className="sessions-content">{renderContent()}</div>
      </Card>
    </div>
  );
};

export default SessionsList;
