'use client';

import React, { ReactNode, useState, useEffect } from 'react';
import { Calendar, Badge, Button, Card, Select, Row, Col, Typography, Space, List, Empty, Spin, Tooltip } from 'antd';
import { 
  LeftOutlined, 
  RightOutlined, 
  PlusOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  ClockCircleOutlined,
  SettingOutlined
} from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/fa';
import type { CellRenderInfo } from 'rc-picker/lib/interface';

const { Text, Title } = Typography;
const { Option } = Select;

export interface TimeSlot {
  id: string | number;
  date: string; // YYYY-MM-DD format
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  status: 'available' | 'booked' | 'unavailable' | 'pending';
  title?: string;
  description?: string;
  bookedBy?: string;
  color?: string;
  [key: string]: any; // Allow additional properties
}

export interface CalendarViewProps {
  timeSlots?: TimeSlot[];
  onSelectTimeSlot?: (timeSlot: TimeSlot) => void;
  onAddTimeSlot?: (date: string) => void;
  onDeleteTimeSlot?: (timeSlot: TimeSlot) => void;
  onEditTimeSlot?: (timeSlot: TimeSlot) => void;
  onChangeMonth?: (date: Dayjs) => void;
  loading?: boolean;
  selectedDate?: Dayjs;
  defaultSelectedDate?: Dayjs;
  className?: string;
  mode?: 'month' | 'year' | 'decade';
  editable?: boolean;
  viewOnly?: boolean;
  selectedTimeSlot?: TimeSlot | null;
  timeSlotsGroupByDate?: Record<string, TimeSlot[]>;
  refreshData?: () => void;
  title?: string | ReactNode;
  subtitle?: string | ReactNode;
  dateFormat?: string;
  timeFormat?: string;
  monthFormat?: string;
  showTimeSlotsPanel?: boolean;
  timeSlotsTitle?: string | ReactNode;
  timeSlotsEmpty?: string | ReactNode;
  onClickDate?: (date: Dayjs) => void;
  headerExtra?: ReactNode;
  disabledDates?: (date: Dayjs) => boolean;
  dateCellRender?: (date: Dayjs) => ReactNode;
  workingDays?: number[]; // 0-6, 0 is Sunday
  highlightToday?: boolean;
  headerControls?: ReactNode;
  timeSlotsActions?: {
    view?: boolean;
    edit?: boolean;
    delete?: boolean;
    add?: boolean;
  };
  locale?: string;
  cardBodyStyle?: React.CSSProperties;
  timeSlotsPanel?: {
    width?: number | string;
    bodyStyle?: React.CSSProperties;
    title?: string | ReactNode;
  };
  renderTimeSlot?: (timeSlot: TimeSlot, actions: { onSelect: () => void, onEdit: () => void, onDelete: () => void }) => ReactNode;
}

/**
 * CalendarView - A reusable calendar component with time slots management
 * 
 * This component provides a calendar interface for selecting dates and viewing
 * available time slots, with support for booking, editing, and deleting slots.
 */
const CalendarView: React.FC<CalendarViewProps> = ({
  timeSlots = [],
  onSelectTimeSlot,
  onAddTimeSlot,
  onDeleteTimeSlot,
  onEditTimeSlot,
  onChangeMonth,
  loading = false,
  selectedDate = dayjs(),
  defaultSelectedDate = dayjs(),
  className = '',
  mode = 'month',
  editable = false,
  viewOnly = false,
  selectedTimeSlot = null,
  timeSlotsGroupByDate,
  refreshData,
  title,
  subtitle,
  dateFormat = 'YYYY-MM-DD',
  timeFormat = 'HH:mm',
  monthFormat = 'YYYY MMMM',
  showTimeSlotsPanel = true,
  timeSlotsTitle = 'زمان‌های در دسترس',
  timeSlotsEmpty = 'هیچ زمانی برای این روز تنظیم نشده است',
  onClickDate,
  headerExtra,
  disabledDates,
  dateCellRender,
  workingDays,
  highlightToday = true,
  headerControls,
  timeSlotsActions = {
    view: true,
    edit: true,
    delete: true,
    add: true
  },
  locale = 'fa',
  cardBodyStyle,
  timeSlotsPanel = {},
  renderTimeSlot,
}) => {
  // Local state
  const [currentSelectedDate, setCurrentSelectedDate] = useState<Dayjs>(selectedDate || defaultSelectedDate);
  const [currentVisibleDate, setCurrentVisibleDate] = useState<Dayjs>(selectedDate || defaultSelectedDate);

  // Update state when props change
  useEffect(() => {
    if (selectedDate) {
      setCurrentSelectedDate(selectedDate);
    }
  }, [selectedDate]);

  // Set calendar locale
  useEffect(() => {
    if (locale) {
      dayjs.locale(locale);
    }
  }, [locale]);

  // Group time slots by date if not already grouped
  const getGroupedTimeSlots = (): Record<string, TimeSlot[]> => {
    if (timeSlotsGroupByDate) {
      return timeSlotsGroupByDate;
    }

    const grouped: Record<string, TimeSlot[]> = {};
    timeSlots.forEach(slot => {
      if (!grouped[slot.date]) {
        grouped[slot.date] = [];
      }
      grouped[slot.date].push(slot);
    });

    return grouped;
  };

  // Get time slots for a specific date
  const getTimeSlotsForDate = (date: Dayjs): TimeSlot[] => {
    const dateStr = date.format(dateFormat);
    const groupedSlots = getGroupedTimeSlots();
    return groupedSlots[dateStr] || [];
  };

  // Get time slots for the currently selected date
  const getSelectedDateTimeSlots = (): TimeSlot[] => {
    return getTimeSlotsForDate(currentSelectedDate);
  };

  // Handlers
  const handleDateSelect = (date: Dayjs) => {
    setCurrentSelectedDate(date);
    if (onClickDate) {
      onClickDate(date);
    }
  };

  const handleMonthChange = (date: Dayjs) => {
    setCurrentVisibleDate(date);
    if (onChangeMonth) {
      onChangeMonth(date);
    }
  };

  const handleAddTimeSlot = () => {
    if (onAddTimeSlot) {
      onAddTimeSlot(currentSelectedDate.format(dateFormat));
    }
  };

  const handleSelectTimeSlot = (timeSlot: TimeSlot) => {
    if (onSelectTimeSlot) {
      onSelectTimeSlot(timeSlot);
    }
  };

  const handleEditTimeSlot = (timeSlot: TimeSlot) => {
    if (onEditTimeSlot) {
      onEditTimeSlot(timeSlot);
    }
  };

  const handleDeleteTimeSlot = (timeSlot: TimeSlot) => {
    if (onDeleteTimeSlot) {
      onDeleteTimeSlot(timeSlot);
    }
  };

  // Custom cell renderer to show time slots on calendar
  const customCellRender = (current: Dayjs, info: CellRenderInfo<Dayjs>) => {
    if (info.type !== 'date') return null;
    if (dateCellRender) {
      return dateCellRender(current);
    }
    
    // Check if date is disabled
    const isDisabled = disabledDates ? disabledDates(current) : false;
    
    // Check if it's a working day
    const dayOfWeek = current.day();
    const isWorkingDay = !workingDays || workingDays.includes(dayOfWeek);

    // Get time slots for this date
    const currentTimeSlots = getTimeSlotsForDate(current);
    
    // Count slots by status
    const availableCount = currentTimeSlots.filter(slot => slot.status === 'available').length;
    const bookedCount = currentTimeSlots.filter(slot => slot.status === 'booked').length;
    const pendingCount = currentTimeSlots.filter(slot => slot.status === 'pending').length;
    
    // Style for today
    const isToday = current.isSame(dayjs(), 'day');
    const todayStyle = highlightToday && isToday ? { border: '1px solid #1890ff' } : {};
    
    // Style for non-working days
    const nonWorkingDayStyle = !isWorkingDay ? { backgroundColor: '#f5f5f5', color: '#999' } : {};
    
    // Style for disabled dates
    const disabledStyle = isDisabled ? { backgroundColor: '#f0f0f0', color: '#d9d9d9', cursor: 'not-allowed' } : {};
    
    return (
      <div 
        className="calendar-date-cell"
        style={{
          ...todayStyle,
          ...nonWorkingDayStyle,
          ...disabledStyle,
        }}
      >
        <div className="date-cell-content">
          {currentTimeSlots.length > 0 && (
            <div className="time-slots-badges">
              {availableCount > 0 && (
                <Badge status="success" text={`${availableCount} در دسترس`} />
              )}
              {bookedCount > 0 && (
                <Badge status="error" text={`${bookedCount} رزرو شده`} />
              )}
              {pendingCount > 0 && (
                <Badge status="warning" text={`${pendingCount} در انتظار`} />
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Sort time slots for display
  const sortTimeSlots = (slots: TimeSlot[]): TimeSlot[] => {
    return [...slots].sort((a, b) => {
      const aTime = dayjs(`${a.date} ${a.startTime}`);
      const bTime = dayjs(`${b.date} ${b.startTime}`);
      return aTime.diff(bTime);
    });
  };

  // Render status badge for time slot
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge status="success" text="در دسترس" />;
      case 'booked':
        return <Badge status="error" text="رزرو شده" />;
      case 'pending':
        return <Badge status="warning" text="در انتظار" />;
      case 'unavailable':
        return <Badge status="default" text="غیرفعال" />;
      default:
        return <Badge status="default" text={status} />;
    }
  };

  // Render time slot item
  const renderTimeSlotItem = (timeSlot: TimeSlot) => {
    if (renderTimeSlot) {
      return renderTimeSlot(
        timeSlot, 
        {
          onSelect: () => handleSelectTimeSlot(timeSlot),
          onEdit: () => handleEditTimeSlot(timeSlot),
          onDelete: () => handleDeleteTimeSlot(timeSlot)
        }
      );
    }

    return (
      <List.Item
        className={`time-slot-item ${timeSlot.status} ${selectedTimeSlot?.id === timeSlot.id ? 'selected' : ''}`}
        actions={[
          timeSlotsActions.view && (
            <Button 
              type="link" 
              size="small" 
              onClick={() => handleSelectTimeSlot(timeSlot)}
              disabled={viewOnly || timeSlot.status === 'unavailable'}
            >
              انتخاب
            </Button>
          ),
          editable && timeSlotsActions.edit && (
            <Button
              type="link"
              size="small"
              onClick={() => handleEditTimeSlot(timeSlot)}
              icon={<SettingOutlined />}
            />
          ),
          editable && timeSlotsActions.delete && (
            <Button
              type="link"
              size="small"
              danger
              onClick={() => handleDeleteTimeSlot(timeSlot)}
              icon={<CloseCircleOutlined />}
            />
          )
        ].filter(Boolean) as ReactNode[]}
      >
        <List.Item.Meta
          title={
            <Space>
              <ClockCircleOutlined />
              <span>
                {`${timeSlot.startTime} - ${timeSlot.endTime}`}
              </span>
              {selectedTimeSlot?.id === timeSlot.id && (
                <CheckCircleOutlined style={{ color: '#52c41a' }} />
              )}
            </Space>
          }
          description={
            <div>
              {renderStatusBadge(timeSlot.status)}
              {timeSlot.description && (
                <div className="time-slot-description text-sm text-gray-500 mt-1">
                  {timeSlot.description}
                </div>
              )}
            </div>
          }
        />
      </List.Item>
    );
  };

  // Main rendering
  return (
    <div className={`calendar-view ${className}`}>
      <Row gutter={16}>
        {/* Calendar */}
        <Col xs={24} md={showTimeSlotsPanel ? 16 : 24}>
          <Card 
            title={
              <div>
                {title && (
                  typeof title === 'string' ? 
                    <Title level={5}>{title}</Title> : 
                    title
                )}
                {subtitle && (
                  typeof subtitle === 'string' ? 
                    <Text type="secondary">{subtitle}</Text> : 
                    subtitle
                )}
              </div>
            }
            extra={headerExtra}
            loading={loading}
            bodyStyle={cardBodyStyle}
          >
            <Calendar
              value={currentSelectedDate}
              onSelect={handleDateSelect}
              onPanelChange={handleMonthChange}
              mode={mode}
              cellRender={customCellRender}
              headerRender={({ value, type, onChange, onTypeChange }) => (
                <div className="calendar-header flex items-center justify-between">
                  <div className="calendar-header-left">
                    <Button 
                      icon={<LeftOutlined />} 
                      onClick={() => {
                        const newDate = value.clone().subtract(1, 'month');
                        onChange(newDate);
                        handleMonthChange(newDate);
                      }}
                    />
                    <Button
                      className="mx-2" 
                      onClick={() => {
                        const today = dayjs();
                        onChange(today);
                        handleDateSelect(today);
                        handleMonthChange(today);
                      }}
                    >
                      امروز
                    </Button>
                    <Button 
                      icon={<RightOutlined />} 
                      onClick={() => {
                        const newDate = value.clone().add(1, 'month');
                        onChange(newDate);
                        handleMonthChange(newDate);
                      }}
                    />
                  </div>
                  
                  <div className="calendar-header-title mx-4">
                    <span className="text-lg">{value.format(monthFormat)}</span>
                  </div>
                  
                  <div className="calendar-header-right">
                    {headerControls}
                  </div>
                </div>
              )}
            />
          </Card>
        </Col>
        
        {/* Time slots panel */}
        {showTimeSlotsPanel && (
          <Col xs={24} md={8}>
            <Card
              title={timeSlotsPanel.title || timeSlotsTitle}
              extra={
                editable && timeSlotsActions.add && (
                  <Tooltip title="افزودن زمان جدید">
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={handleAddTimeSlot}
                    />
                  </Tooltip>
                )
              }
              loading={loading}
              style={{ width: timeSlotsPanel.width }}
              bodyStyle={timeSlotsPanel.bodyStyle}
            >
              <div className="selected-date mb-4">
                <Text strong>
                  {currentSelectedDate.format('dddd, YYYY/MM/DD')}
                </Text>
              </div>
              
              {loading ? (
                <div className="time-slots-loading py-10 text-center">
                  <Spin />
                  <div className="mt-2">در حال بارگذاری...</div>
                </div>
              ) : (
                <>
                  {getSelectedDateTimeSlots().length === 0 ? (
                    <Empty
                      description={timeSlotsEmpty}
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  ) : (
                    <List
                      dataSource={sortTimeSlots(getSelectedDateTimeSlots())}
                      renderItem={renderTimeSlotItem}
                      className="time-slots-list"
                    />
                  )}
                </>
              )}
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default CalendarView;