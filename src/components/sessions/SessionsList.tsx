'use client';

import { useState } from 'react';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import DataTable from '@/components/common/DataTable';
import SessionCard from '@/components/sessions/SessionCard';

const SessionsDataTable = ({
  sessions = [],
  loading = false,
  userType = 'client', // 'client', 'consultant', 'admin'
  onViewDetails,
  onSendMessage,
  onCancel,
  onStatusChange,
}) => {
  const [filteredSessions, setFilteredSessions] = useState(sessions);

  // تعریف فیلترها
  const filterOptions = [
    {
      key: 'search',
      type: 'text',
      label:
        userType === 'client'
          ? 'جستجو در نام مشاوران'
          : userType === 'consultant'
            ? 'جستجو در نام مراجعان'
            : 'جستجو در نام مشاوران یا مراجعان',
      placeholder: 'نام را وارد کنید',
    },
    {
      key: 'dateRange',
      type: 'dateRange',
      label: 'بازه زمانی',
    },
    {
      key: 'status',
      type: 'select',
      label: 'وضعیت جلسه',
      options: [
        { value: 'pending', label: 'در انتظار تأیید' },
        { value: 'confirmed', label: 'تأیید شده' },
        { value: 'completed', label: 'برگزار شده' },
        { value: 'cancelled', label: 'لغو شده' },
      ],
    },
  ];

  // تعریف گزینه‌های مرتب‌سازی
  const sortOptions = [
    {
      key: 'date_asc',
      label: 'تاریخ (صعودی)',
    },
    {
      key: 'date_desc',
      label: 'تاریخ (نزولی)',
    },
  ];

  // تعریف ستون‌ها
  const columns = [
    {
      title: userType === 'client' ? 'مشاور' : 'مراجع',
      dataIndex: userType === 'client' ? 'consultantName' : 'clientName',
      key: 'name',
      render: (text, record) => (
        <SessionCard
          session={record}
          type={userType}
          onViewDetails={onViewDetails}
        />
      ),
    },
  ];

  // تعریف اکشن‌ها
  const rowActions = [
    {
      key: 'view',
      label: 'جزئیات',
      icon: <EyeOutlined />,
      onClick: onViewDetails,
    },
    {
      key: 'message',
      label: 'ارسال پیام',
      icon: <MessageOutlined />,
      onClick: onSendMessage,
      hide: !(
        userType === 'consultant' &&
        ['confirmed', 'pending'].includes(sessions.status) &&
        onSendMessage
      ),
    },
    {
      key: 'cancel',
      label: 'لغو جلسه',
      icon: <CloseCircleOutlined />,
      onClick: onCancel,
      danger: true,
      hide:
        userType !== 'client' ||
        ['completed', 'cancelled'].includes(sessions.status),
    },
    {
      key: 'status',
      label: (session) =>
        session.status === 'confirmed' ? 'تکمیل جلسه' : 'تغییر وضعیت',
      icon: <CheckCircleOutlined />,
      onClick: onStatusChange,
      hide:
        userType !== 'consultant' ||
        ['cancelled', 'completed'].includes(sessions.status),
    },
  ];

  // هندل فیلتر
  const handleFilter = (filters) => {
    let result = [...sessions];

    // فیلتر جستجو
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter((session) =>
        (userType === 'client' ? session.consultantName : session.clientName)
          .toLowerCase()
          .includes(searchLower),
      );
    }

    // فیلتر بازه زمانی
    if (filters.dateRange && filters.dateRange[0] && filters.dateRange[1]) {
      result = result.filter((session) => {
        const sessionDate = dayjs(session.date);
        return (
          sessionDate.isAfter(filters.dateRange[0]) &&
          sessionDate.isBefore(filters.dateRange[1])
        );
      });
    }

    // فیلتر وضعیت
    if (filters.status) {
      result = result.filter((session) => session.status === filters.status);
    }

    setFilteredSessions(result);
    return result;
  };

  // هندل مرتب‌سازی
  const handleSort = (sort) => {
    const sortedSessions = [...filteredSessions].sort((a, b) => {
      const dateA = dayjs(`${a.date} ${a.time}`);
      const dateB = dayjs(`${b.date} ${b.time}`);

      return sort.key === 'date_asc' ? dateA.diff(dateB) : dateB.diff(dateA);
    });

    setFilteredSessions(sortedSessions);
    return sortedSessions;
  };

  return (
    <DataTable
      dataSource={filteredSessions}
      columns={columns}
      rowKey="id"
      loading={loading}
      filterOptions={filterOptions}
      sortOptions={sortOptions}
      rowActions={rowActions}
      onFilter={handleFilter}
      onSort={handleSort}
      showSearch
      showFilters
      pagination={{
        pageSize: 5,
        showTotal: (total, range) => `${range[0]}-${range[1]} از ${total} جلسه`,
      }}
    />
  );
};

export default SessionsDataTable;
