'use client';

import { ReactNode, useEffect, useState } from 'react';
import {
  CalendarOutlined,
  DeleteOutlined,
  FilterOutlined,
  ReloadOutlined,
  SearchOutlined,
  SortAscendingOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Drawer,
  Input,
  Radio,
  Row,
  Select,
  Space,
  Tag,
  Tooltip,
  Typography,
} from 'antd';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { Group: RadioGroup } = Radio;
const { Group: CheckboxGroup } = Checkbox;

export type FilterItem = {
  key: string;
  label: string;
  type:
    | 'text'
    | 'select'
    | 'date'
    | 'dateRange'
    | 'radio'
    | 'checkbox'
    | 'custom';
  placeholder?: string;
  options?: Array<{ value: string | number; label: string }>;
  defaultValue?: any;
  render?: (value: any, onChange: (value: any) => void) => ReactNode;
};

export type SortOption = {
  key: string;
  label: string;
  defaultDirection?: 'asc' | 'desc';
  icon?: ReactNode;
};

export type FilterBarProps = {
  /**
   * Title to display in the filter bar
   */
  title?: string;
  /**
   * Filter configuration items
   */
  filters?: FilterItem[];
  /**
   * Search placeholder text
   */
  searchPlaceholder?: string;
  /**
   * Whether to show search input
   */
  showSearch?: boolean;
  /**
   * Function to handle search input changes
   */
  onSearch?: (value: string) => void;
  /**
   * Function to handle filter changes
   */
  onFilterChange?: (filters: Record<string, any>) => void;
  /**
   * Function to handle sort changes
   */
  onSortChange?: (sort: { key: string; direction: 'asc' | 'desc' }) => void;
  /**
   * Sort options configuration
   */
  sortOptions?: SortOption[];
  /**
   * Whether to show built-in sort controls
   */
  showSort?: boolean;
  /**
   * Whether to show drawer for mobile view
   */
  showDrawerOnMobile?: boolean;
  /**
   * Whether to show filter controls
   */
  showFilters?: boolean;
  /**
   * Whether the component is loading
   */
  loading?: boolean;
  /**
   * Function to handle refresh/reload
   */
  onRefresh?: () => void;
  /**
   * Whether to wrap the filter bar in a Card component
   */
  withCard?: boolean;
  /**
   * Additional class names
   */
  className?: string;
  /**
   * Display the filters inline (horizontal) instead of vertical
   */
  inline?: boolean;
  /**
   * Custom component to render to the right of the search bar
   */
  rightContent?: ReactNode;
  /**
   * Custom component to render to the left of the search bar
   */
  leftContent?: ReactNode;
  /**
   * Whether to show selected filter tags
   */
  showSelectedFilters?: boolean;
  /**
   * Custom label for the filter button
   */
  filterButtonLabel?: string;
  /**
   * Custom label for the clear filters button
   */
  clearButtonLabel?: string;
};

/**
 * A reusable filter bar component with search, filters, and sorting
 */
const FilterBar: React.FC<FilterBarProps> = ({
  title,
  filters = [],
  searchPlaceholder = 'جستجو...',
  showSearch = true,
  onSearch,
  onFilterChange,
  onSortChange,
  sortOptions = [],
  showSort = false,
  showDrawerOnMobile = true,
  showFilters = true,
  loading = false,
  onRefresh,
  withCard = true,
  className = '',
  inline = false,
  rightContent,
  leftContent,
  showSelectedFilters = true,
  filterButtonLabel = 'فیلترها',
  clearButtonLabel = 'پاک کردن فیلترها',
}) => {
  // States
  const [searchText, setSearchText] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 0,
  );

  // Set default filter values
  useEffect(() => {
    const defaultValues: Record<string, any> = {};
    filters.forEach((filter) => {
      if (filter.defaultValue !== undefined) {
        defaultValues[filter.key] = filter.defaultValue;
      }
    });
    if (Object.keys(defaultValues).length > 0) {
      setFilterValues(defaultValues);
      if (onFilterChange) {
        onFilterChange(defaultValues);
      }
    }
  }, [filters, onFilterChange]);

  // Set default sort if available
  useEffect(() => {
    if (sortOptions.length > 0) {
      const defaultSort = sortOptions.find((option) => option.defaultDirection);
      if (defaultSort) {
        setSortKey(defaultSort.key);
        setSortDirection(defaultSort.defaultDirection || 'asc');
        if (onSortChange) {
          onSortChange({
            key: defaultSort.key,
            direction: defaultSort.defaultDirection || 'asc',
          });
        }
      } else {
        setSortKey(sortOptions[0].key);
      }
    }
  }, [sortOptions, onSortChange]);

  // Handle window resize for mobile responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Handle search input changes
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  // Handle filter changes
  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filterValues };

    if (value === undefined || value === null || value === '') {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }

    setFilterValues(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  // Handle sort changes
  const handleSortChange = (key: string) => {
    // If clicking the same key, toggle direction
    if (key === sortKey) {
      const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      setSortDirection(newDirection);
      if (onSortChange) {
        onSortChange({ key, direction: newDirection });
      }
    } else {
      // If clicking a different key, set new key with default direction
      setSortKey(key);
      const defaultDirection =
        sortOptions.find((option) => option.key === key)?.defaultDirection ||
        'asc';
      setSortDirection(defaultDirection);
      if (onSortChange) {
        onSortChange({ key, direction: defaultDirection });
      }
    }
  };

  // Reset all filters
  const clearFilters = () => {
    setFilterValues({});
    setSearchText('');
    if (onSearch) {
      onSearch('');
    }
    if (onFilterChange) {
      onFilterChange({});
    }
  };

  // Toggle filters visibility
  const toggleFilters = () => {
    if (showDrawerOnMobile && windowWidth < 768) {
      setDrawerVisible(!drawerVisible);
    } else {
      setFiltersVisible(!filtersVisible);
    }
  };

  // Render filter controls
  const renderFilterControls = () => {
    return (
      <div className={`filter-controls ${inline ? 'flex flex-wrap' : ''}`}>
        {filters.map((filter, index) => (
          <div
            key={filter.key}
            className={`filter-item ${inline ? 'mb-4 mr-4' : 'mb-4'}`}
            style={inline ? { minWidth: '200px' } : {}}
          >
            <Text strong className="mb-1 block">
              {filter.label}:
            </Text>

            {/* Text input filter */}
            {filter.type === 'text' && (
              <Input
                placeholder={filter.placeholder || filter.label}
                value={filterValues[filter.key] || ''}
                onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                allowClear
              />
            )}

            {/* Select filter */}
            {filter.type === 'select' && (
              <Select
                placeholder={filter.placeholder || filter.label}
                value={filterValues[filter.key] || undefined}
                onChange={(value) => handleFilterChange(filter.key, value)}
                style={{ width: '100%' }}
                allowClear
              >
                {filter.options?.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            )}

            {/* Date filter */}
            {filter.type === 'date' && (
              <DatePicker
                placeholder={filter.placeholder || filter.label}
                value={filterValues[filter.key] || null}
                onChange={(date) => handleFilterChange(filter.key, date)}
                style={{ width: '100%' }}
              />
            )}

            {/* Date range filter */}
            {filter.type === 'dateRange' && (
              <RangePicker
                placeholder={[
                  filter.placeholder ? `از ${filter.placeholder}` : 'از تاریخ',
                  filter.placeholder ? `تا ${filter.placeholder}` : 'تا تاریخ',
                ]}
                value={filterValues[filter.key] || null}
                onChange={(dates) => handleFilterChange(filter.key, dates)}
                style={{ width: '100%' }}
              />
            )}

            {/* Radio group filter */}
            {filter.type === 'radio' && (
              <RadioGroup
                value={filterValues[filter.key] || undefined}
                onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                options={filter.options}
              />
            )}

            {/* Checkbox group filter */}
            {filter.type === 'checkbox' && (
              <CheckboxGroup
                value={filterValues[filter.key] || []}
                onChange={(values) => handleFilterChange(filter.key, values)}
                options={filter.options}
              />
            )}

            {/* Custom filter */}
            {filter.type === 'custom' &&
              filter.render &&
              filter.render(filterValues[filter.key], (value) =>
                handleFilterChange(filter.key, value),
              )}

            {!inline && index < filters.length - 1 && (
              <Divider className="my-4" />
            )}
          </div>
        ))}

        {filters.length > 0 && (
          <div
            className={`filter-actions ${inline ? 'mb-4 mr-4 self-end' : 'mt-4'}`}
          >
            <Button
              onClick={clearFilters}
              disabled={Object.keys(filterValues).length === 0}
            >
              {clearButtonLabel}
            </Button>
          </div>
        )}
      </div>
    );
  };

  // Render selected filter tags
  const renderSelectedFilters = () => {
    if (!showSelectedFilters || Object.keys(filterValues).length === 0)
      return null;

    return (
      <div className="selected-filters mb-4">
        <Space wrap>
          {Object.entries(filterValues).map(([key, value]) => {
            if (!value) return null;

            const filter = filters.find((f) => f.key === key);
            let displayValue: ReactNode = value;

            // Format display value based on filter type
            if (filter?.type === 'select' && filter.options) {
              const option = filter.options.find(
                (o) => String(o.value) === String(value),
              );
              if (option) {
                displayValue = option.label;
              }
            } else if (filter?.type === 'radio' && filter.options) {
              const option = filter.options.find(
                (o) => String(o.value) === String(value),
              );
              if (option) {
                displayValue = option.label;
              }
            } else if (
              filter?.type === 'checkbox' &&
              filter.options &&
              Array.isArray(value)
            ) {
              const selectedOptions = filter.options
                .filter((o) => value.includes(o.value))
                .map((o) => o.label);
              displayValue = selectedOptions.join(', ');
            } else if (filter?.type === 'date') {
              displayValue = value?.format('YYYY/MM/DD') || value;
            } else if (filter?.type === 'dateRange' && Array.isArray(value)) {
              displayValue = `${value[0]?.format('YYYY/MM/DD') || ''} - ${value[1]?.format('YYYY/MM/DD') || ''}`;
            }

            return (
              <Tag
                key={key}
                closable
                onClose={() => handleFilterChange(key, undefined)}
              >
                {filter?.label || key}: {displayValue}
              </Tag>
            );
          })}
        </Space>
      </div>
    );
  };

  // Main content of the filter bar
  const filterBarContent = (
    <>
      {title && (
        <Title level={4} className="mb-4">
          {title}
        </Title>
      )}

      <div className="mb-4 flex flex-wrap items-center justify-between">
        <div className="mb-2 flex grow items-center">
          {rightContent && <div className="mr-2">{rightContent}</div>}

          {showSearch && (
            <div className="grow">
              <Input
                placeholder={searchPlaceholder}
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={handleSearch}
                allowClear
              />
            </div>
          )}

          {leftContent && <div className="ml-2">{leftContent}</div>}
        </div>

        <div className="mb-2 flex items-center">
          {showFilters && filters.length > 0 && (
            <Button
              type={filtersVisible || drawerVisible ? 'primary' : 'default'}
              icon={<FilterOutlined />}
              onClick={toggleFilters}
              className="mr-2"
            >
              {filterButtonLabel}
            </Button>
          )}

          {showSort && sortOptions.length > 0 && (
            <Select
              placeholder="مرتب‌سازی"
              value={sortKey}
              onChange={handleSortChange}
              className="mr-2"
              style={{ minWidth: '150px' }}
              suffixIcon={
                <Tooltip title={sortDirection === 'asc' ? 'صعودی' : 'نزولی'}>
                  <SortAscendingOutlined
                    className={`transition-transform${sortDirection === 'desc' ? 'rotate-180' : ''}`}
                  />
                </Tooltip>
              }
            >
              {sortOptions.map((option) => (
                <Option key={option.key} value={option.key}>
                  <Space>
                    {option.icon}
                    {option.label}
                  </Space>
                </Option>
              ))}
            </Select>
          )}

          {onRefresh && (
            <Button
              icon={<ReloadOutlined />}
              onClick={onRefresh}
              loading={loading}
            />
          )}
        </div>
      </div>

      {/* Selected filters display */}
      {renderSelectedFilters()}

      {/* Filter controls for desktop */}
      {showFilters &&
        !showDrawerOnMobile &&
        filtersVisible &&
        renderFilterControls()}

      {/* Filter drawer for mobile */}
      {showFilters && showDrawerOnMobile && (
        <Drawer
          title="فیلترها"
          placement="right"
          closable={true}
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          width={320}
        >
          {renderFilterControls()}
        </Drawer>
      )}

      {/* Filter panel for desktop */}
      {showFilters &&
        showDrawerOnMobile &&
        filtersVisible &&
        windowWidth >= 768 && (
          <Card className="mb-4">{renderFilterControls()}</Card>
        )}
    </>
  );

  // Main component return, optionally wrapped in a card
  return withCard ? (
    <Card className={className}>{filterBarContent}</Card>
  ) : (
    <div className={className}>{filterBarContent}</div>
  );
};

export default FilterBar;
