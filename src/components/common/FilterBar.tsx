'use client';

import { ReactNode, useState } from 'react';
import {
  ClearOutlined,
  FilterOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Input,
  Row,
  Select,
  Space,
} from 'antd';

const { RangePicker } = DatePicker;
const { Option } = Select;

export type FilterType = 'search' | 'select' | 'date' | 'dateRange' | 'custom';

export interface FilterOption {
  value: string;
  label: string | ReactNode;
}

export interface FilterItem {
  key: string;
  type: FilterType;
  label?: string;
  placeholder?: string;
  options?: FilterOption[];
  allowClear?: boolean;
  showExpand?: boolean;
  customRender?: (props: {
    value: any;
    onChange: (value: any) => void;
  }) => ReactNode;
  colSpan?: number; // For responsive layout, default is 1/3 of the row
}

export interface FilterBarProps {
  filters: FilterItem[];
  onFilterChange: (filters: Record<string, any>) => void;
  initialValues?: Record<string, any>;
  showDivider?: boolean;
  className?: string;
  cardProps?: {
    title?: ReactNode;
    extra?: ReactNode;
  };
  expandable?: boolean;
  searchPlaceholder?: string;
}

/**
 * FilterBar - A reusable component for filtering data
 *
 * Provides a configurable interface for various types of filters including:
 * - Text search
 * - Dropdown selects
 * - Date pickers
 * - Date range pickers
 * - Custom filter components
 */
const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  initialValues = {},
  showDivider = true,
  className = '',
  cardProps,
  expandable = true,
  searchPlaceholder = 'جستجو...',
}) => {
  // Internal state for filter values
  const [filterValues, setFilterValues] =
    useState<Record<string, any>>(initialValues);

  // State for expandable filters
  const [expanded, setExpanded] = useState(false);

  // Handle filter value change
  const handleFilterChange = (key: string, value: any) => {
    const newValues = { ...filterValues, [key]: value };
    setFilterValues(newValues);
    onFilterChange(newValues);
  };

  // Clear all filters
  const handleClearFilters = () => {
    const emptyValues = Object.keys(filterValues).reduce(
      (acc, key) => {
        acc[key] = undefined;
        return acc;
      },
      {} as Record<string, any>,
    );

    setFilterValues(emptyValues);
    onFilterChange(emptyValues);
  };

  // Determine which filters to show based on expanded state
  const visibleFilters =
    expandable && !expanded
      ? filters.filter((filter) => !filter.showExpand)
      : filters;

  // Render appropriate filter component based on type
  const renderFilterComponent = (filter: FilterItem) => {
    const {
      key,
      type,
      placeholder,
      options,
      allowClear = true,
      customRender,
    } = filter;
    const value = filterValues[key];

    switch (type) {
      case 'search':
        return (
          <Input
            placeholder={placeholder || searchPlaceholder}
            prefix={<SearchOutlined />}
            value={value}
            onChange={(e) => handleFilterChange(key, e.target.value)}
            allowClear={allowClear}
          />
        );

      case 'select':
        return (
          <Select
            placeholder={placeholder}
            style={{ width: '100%' }}
            value={value}
            onChange={(val) => handleFilterChange(key, val)}
            allowClear={allowClear}
          >
            {options?.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        );

      case 'date':
        return (
          <DatePicker
            placeholder={placeholder}
            style={{ width: '100%' }}
            value={value}
            onChange={(date) => handleFilterChange(key, date)}
            allowClear={allowClear}
          />
        );

      case 'dateRange':
        return (
          <RangePicker
            placeholder={placeholder ? [placeholder, placeholder] : undefined}
            style={{ width: '100%' }}
            value={value}
            onChange={(dates) => handleFilterChange(key, dates)}
            allowClear={allowClear}
          />
        );

      case 'custom':
        return customRender?.({
          value,
          onChange: (newValue) => handleFilterChange(key, newValue),
        });

      default:
        return null;
    }
  };

  return (
    <Card
      className={`filter-bar ${className}`}
      title={cardProps?.title}
      extra={cardProps?.extra}
    >
      <Row gutter={[16, 16]}>
        {visibleFilters.map((filter) => (
          <Col
            key={filter.key}
            xs={24}
            sm={filter.colSpan ? 24 / filter.colSpan : 12}
            md={filter.colSpan ? 24 / filter.colSpan : 8}
          >
            {filter.label && (
              <div className="mb-1 font-medium">{filter.label}</div>
            )}
            {renderFilterComponent(filter)}
          </Col>
        ))}

        <Col xs={24} className="mt-2 flex justify-between">
          <Space>
            {expandable && filters.some((f) => f.showExpand) && (
              <Button
                type="link"
                onClick={() => setExpanded(!expanded)}
                icon={<FilterOutlined />}
              >
                {expanded ? 'پنهان کردن فیلترهای پیشرفته' : 'فیلترهای پیشرفته'}
              </Button>
            )}
          </Space>

          <Button
            icon={<ClearOutlined />}
            onClick={handleClearFilters}
            disabled={Object.values(filterValues).every(
              (v) => v === undefined || v === '',
            )}
          >
            پاکسازی فیلترها
          </Button>
        </Col>
      </Row>

      {showDivider && <Divider />}
    </Card>
  );
};

export default FilterBar;
