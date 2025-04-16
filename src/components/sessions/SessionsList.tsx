'use client';

import { useState } from 'react';
import {
  CalendarOutlined,
  FilterOutlined,
  SearchOutlined,
  SortAscendingOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  DatePicker,
  Divider,
  Empty,
  Input,
  List,
  Pagination,
  Select,
  Space,
  Spin,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import SessionCard from './SessionCard';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const SessionsList = ({
  sessions = [],
  loading = false,
  userType = 'client', // 'client', 'consultant', 'admin'
  onViewDetails,
  onSendMessage,
  onCancel,
  onEdit,
  onStatusChange,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('date_asc');

  // فیلتر کردن جلسات
  const getFilteredSessions = () => {
    let filtered = [...sessions];

    // فیلتر بر اساس متن جستجو
    if (searchText) {
      filtered = filtered.filter((session) => {
        const searchIn =
          userType === 'client'
            ? session.consultantName
            : userType === 'consultant'
              ? session.clientName
              : `${session.consultantName} ${session.clientName}`; // admin can search both

        return searchIn.toLowerCase().includes(searchText.toLowerCase());
      });
    }

    // فیلتر بر اساس وضعیت
    if (statusFilter) {
      filtered = filtered.filter((session) => session.status === statusFilter);
    }

    // فیلتر بر اساس بازه زمانی
    if (dateRange && dateRange[0] && dateRange[1]) {
      filtered = filtered.filter((session) => {
        const sessionDate = dayjs(session.date);
        return (
          sessionDate.isAfter(dateRange[0]) &&
          sessionDate.isBefore(dateRange[1])
        );
      });
    }

    // مرتب‌سازی
    filtered.sort((a, b) => {
      const dateA = dayjs(`${a.date} ${a.time}`);
      const dateB = dayjs(`${b.date} ${b.time}`);

      switch (sortBy) {
        case 'date_asc':
          return dateA.diff(dateB);
        case 'date_desc':
          return dateB.diff(dateA);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredSessions = getFilteredSessions();

  // محتوای صفحه فعلی
  const currentPageData = filteredSessions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  // خالی کردن فیلترها
  const clearFilters = () => {
    setSearchText('');
    setDateRange(null);
    setStatusFilter(null);
  };

  if (loading) {
    return (
      <div className="py-16 text-center">
        <Spin size="large" />
        <div className="mt-4">در حال بارگیری جلسات...</div>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <Empty
        description="هیچ جلسه‌ای یافت نشد"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  return (
    <div className="sessions-list">
      <Card className="mb-4">
        <div className="flex flex-wrap items-center justify-between">
          <div className="mb-4 w-full md:mb-0 md:w-1/2">
            <Input
              placeholder={
                userType === 'client'
                  ? 'جستجو در نام مشاوران...'
                  : userType === 'consultant'
                    ? 'جستجو در نام مراجعان...'
                    : 'جستجو در نام مشاوران یا مراجعان...'
              }
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </div>

          <div>
            <Button
              type="default"
              onClick={() => setShowFilters(!showFilters)}
              icon={<FilterOutlined />}
            >
              {showFilters ? 'پنهان کردن فیلترها' : 'فیلترها'}
            </Button>
            <Select
              placeholder="مرتب‌سازی"
              value={sortBy}
              onChange={setSortBy}
              style={{ width: 130, marginRight: 8 }}
            >
              <Option value="date_asc">تاریخ (صعودی)</Option>
              <Option value="date_desc">تاریخ (نزولی)</Option>
            </Select>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 border-t pt-4">
            <div className="flex flex-wrap gap-4">
              <div className="w-full md:w-auto">
                <Text className="mb-1 block">تاریخ:</Text>
                <RangePicker
                  value={dateRange}
                  onChange={setDateRange}
                  format="YYYY/MM/DD"
                  placeholder={['از تاریخ', 'تا تاریخ']}
                  allowClear
                />
              </div>

              <div className="w-full md:w-auto">
                <Text className="mb-1 block">وضعیت:</Text>
                <Select
                  placeholder="انتخاب وضعیت"
                  value={statusFilter}
                  onChange={setStatusFilter}
                  style={{ width: 150 }}
                  allowClear
                >
                  <Option value="pending">در انتظار تأیید</Option>
                  <Option value="confirmed">تأیید شده</Option>
                  <Option value="completed">برگزار شده</Option>
                  <Option value="cancelled">لغو شده</Option>
                </Select>
              </div>

              <div className="flex w-full items-end md:w-auto">
                <Button onClick={clearFilters}>پاکسازی فیلترها</Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {filteredSessions.length === 0 ? (
        <Empty
          description="هیچ جلسه‌ای با معیارهای جستجوی شما یافت نشد"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <>
          <List
            dataSource={currentPageData}
            renderItem={(session) => (
              <List.Item key={session.id} className="mb-4 block w-full p-0">
                <SessionCard
                  session={session}
                  type={userType}
                  onViewDetails={onViewDetails}
                  onSendMessage={onSendMessage}
                  onCancel={onCancel}
                  onEdit={onEdit}
                  onStatusChange={onStatusChange}
                />
              </List.Item>
            )}
          />

          <div className="mt-4 flex justify-center">
            <Pagination
              current={currentPage}
              total={filteredSessions.length}
              pageSize={pageSize}
              onChange={setCurrentPage}
              showSizeChanger={false}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default SessionsList;
