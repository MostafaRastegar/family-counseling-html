'use client';

import { ReactNode, useEffect, useMemo, useState } from 'react';
import {
  FilterOutlined,
  MoreOutlined,
  ReloadOutlined,
  SearchOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  DatePicker,
  Dropdown,
  Empty,
  Input,
  Menu,
  Pagination,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import type { TableProps } from 'antd';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export type DataTableAction = {
  key: string;
  label: string;
  icon?: ReactNode;
  onClick?: (record: any) => void;
  href?: string;
  type?: 'default' | 'primary' | 'link' | 'text' | 'dashed';
  danger?: boolean;
  disabled?: boolean | ((record: any) => boolean);
  render?: (record: any) => ReactNode; // Custom render function
};

export type FilterOption = {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'dateRange' | 'custom';
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  render?: () => ReactNode; // For custom filter controls
};

export type DataTableProps = {
  /**
   * Table title
   */
  title?: string | ReactNode;
  /**
   * Data source for the table
   */
  dataSource: any[];
  /**
   * Columns configuration
   */
  columns: TableProps<any>['columns'];
  /**
   * Row key to use for unique identification
   */
  rowKey?: string;
  /**
   * Actions to display for each row
   */
  rowActions?: DataTableAction[] | ((record: any) => DataTableAction[]);
  /**
   * Filter options configuration
   */
  filterOptions?: FilterOption[];
  /**
   * Search placeholder text
   */
  searchPlaceholder?: string;
  /**
   * Function to handle search
   */
  onSearch?: (value: string) => void;
  /**
   * Function to handle filter changes
   */
  onFilter?: (filters: Record<string, any>) => void;
  /**
   * Whether to show built-in search input
   */
  showSearch?: boolean;
  /**
   * Whether to show action column
   */
  showActions?: boolean;
  /**
   * Whether table is loading data
   */
  loading?: boolean;
  /**
   * Function to handle refresh action
   */
  onRefresh?: () => void;
  /**
   * Function to handle row selection
   */
  onRowSelect?: (selectedRowKeys: React.Key[], selectedRows: any[]) => void;
  /**
   * Whether to enable row selection
   */
  rowSelection?: boolean;
  /**
   * Custom component for empty state
   */
  emptyComponent?: ReactNode;
  /**
   * Custom render function for action column
   */
  renderActions?: (record: any) => ReactNode;
  /**
   * Additional props to pass to the Table component
   */
  tableProps?: TableProps<any>;
  /**
   * Whether to show built-in filters
   */
  showFilters?: boolean;
  /**
   * Custom filter component
   */
  filterComponent?: ReactNode;
  /**
   * Pagination configuration
   */
  pagination?:
    | {
        current?: number;
        pageSize?: number;
        total?: number;
        onChange?: (page: number, pageSize: number) => void;
        showSizeChanger?: boolean;
        pageSizeOptions?: string[];
      }
    | false;
  /**
   * Custom render function for the entire table
   */
  customRender?: (props: any) => ReactNode;
  /**
   * Whether to show the table in a Card component
   */
  withCard?: boolean;
};

/**
 * A reusable data table component with built-in search, filtering, and action handling
 */
const DataTable: React.FC<DataTableProps> = ({
  title,
  dataSource,
  columns,
  rowKey = 'id',
  rowActions,
  filterOptions = [],
  searchPlaceholder = 'جستجو...',
  onSearch,
  onFilter,
  showSearch = true,
  showActions = true,
  loading = false,
  onRefresh,
  onRowSelect,
  rowSelection = false,
  emptyComponent,
  renderActions,
  tableProps = {},
  showFilters = true,
  filterComponent,
  pagination = {
    pageSize: 10,
    showSizeChanger: true,
  },
  customRender,
  withCard = true,
}) => {
  // Internal states
  const [searchText, setSearchText] = useState('');
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [internalLoading, setInternalLoading] = useState(loading);

  // Update internal loading state when prop changes
  useEffect(() => {
    setInternalLoading(loading);
  }, [loading]);

  // Handle search input change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);

    if (onSearch) {
      onSearch(value);
    }
  };

  // Handle filter changes
  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filterValues, [key]: value };

    // If value is empty, remove the filter
    if (value === undefined || value === '' || value === null) {
      delete newFilters[key];
    }

    setFilterValues(newFilters);

    if (onFilter) {
      onFilter(newFilters);
    }
  };

  // Handle refresh action
  const handleRefresh = () => {
    setInternalLoading(true);

    if (onRefresh) {
      onRefresh();
    } else {
      // If no refresh handler provided, just toggle loading briefly
      setTimeout(() => setInternalLoading(false), 500);
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setFilterValues({});
    setSearchText('');

    if (onFilter) {
      onFilter({});
    }

    if (onSearch) {
      onSearch('');
    }
  };

  // Compute final columns including action column if needed
  const finalColumns = useMemo(() => {
    let cols = [...(columns || [])];

    // Add action column if actions are provided and should be shown
    if (showActions && (rowActions || renderActions)) {
      cols.push({
        title: 'عملیات',
        key: 'action',
        fixed: 'right',
        width: 150,
        render: (_, record) => {
          // Use custom render function if provided
          if (renderActions) {
            return renderActions(record);
          }

          // Otherwise use default action rendering
          const actions =
            typeof rowActions === 'function'
              ? rowActions(record)
              : rowActions || [];

          // If there are 3 or fewer actions, show them directly
          if (actions.length <= 3) {
            return (
              <Space>
                {actions.map((action) => {
                  const disabled =
                    typeof action.disabled === 'function'
                      ? action.disabled(record)
                      : action.disabled;

                  if (action.render) {
                    return action.render(record);
                  }

                  return (
                    <Tooltip key={action.key} title={action.label}>
                      <Button
                        type={action.type || 'link'}
                        icon={action.icon}
                        onClick={
                          action.onClick
                            ? () => action.onClick?.(record)
                            : undefined
                        }
                        href={action.href}
                        danger={action.danger}
                        disabled={disabled}
                        size="small"
                      >
                        {action.label}
                      </Button>
                    </Tooltip>
                  );
                })}
              </Space>
            );
          }

          // If there are more than 3 actions, use dropdown
          return (
            <Dropdown
              overlay={
                <Menu>
                  {actions.map((action) => {
                    const disabled =
                      typeof action.disabled === 'function'
                        ? action.disabled(record)
                        : action.disabled;

                    return (
                      <Menu.Item
                        key={action.key}
                        icon={action.icon}
                        disabled={disabled}
                        danger={action.danger}
                        onClick={
                          action.onClick
                            ? () => action.onClick?.(record)
                            : undefined
                        }
                      >
                        {action.label}
                      </Menu.Item>
                    );
                  })}
                </Menu>
              }
              placement="bottomRight"
            >
              <Button type="text" icon={<MoreOutlined />} />
            </Dropdown>
          );
        },
      });
    }

    return cols;
  }, [columns, showActions, rowActions, renderActions]);

  // Render filter controls based on filter options
  const renderFilters = () => {
    if (!showFilters || filterOptions.length === 0) return null;

    return (
      <div
        className={`filter-container mb-4 ${filtersVisible ? 'block' : 'hidden'}`}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filterOptions.map((filter) => (
            <div key={filter.key} className="filter-item">
              {filter.type === 'text' && (
                <div>
                  <Text className="mb-1 block">{filter.label}:</Text>
                  <Input
                    placeholder={filter.placeholder || filter.label}
                    value={filterValues[filter.key] || ''}
                    onChange={(e) =>
                      handleFilterChange(filter.key, e.target.value)
                    }
                    allowClear
                  />
                </div>
              )}

              {filter.type === 'select' && (
                <div>
                  <Text className="mb-1 block">{filter.label}:</Text>
                  <Select
                    placeholder={filter.placeholder || filter.label}
                    value={filterValues[filter.key] || undefined}
                    onChange={(value) => handleFilterChange(filter.key, value)}
                    allowClear
                    style={{ width: '100%' }}
                  >
                    {filter.options?.map((option) => (
                      <Select.Option key={option.value} value={option.value}>
                        {option.label}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
              )}

              {filter.type === 'date' && (
                <div>
                  <Text className="mb-1 block">{filter.label}:</Text>
                  <DatePicker
                    placeholder={filter.placeholder || filter.label}
                    value={filterValues[filter.key] || null}
                    onChange={(value) => handleFilterChange(filter.key, value)}
                    style={{ width: '100%' }}
                  />
                </div>
              )}

              {filter.type === 'dateRange' && (
                <div>
                  <Text className="mb-1 block">{filter.label}:</Text>
                  <RangePicker
                    placeholder={[
                      filter.placeholder
                        ? `از ${filter.placeholder}`
                        : 'از تاریخ',
                      filter.placeholder
                        ? `تا ${filter.placeholder}`
                        : 'تا تاریخ',
                    ]}
                    value={filterValues[filter.key] || null}
                    onChange={(value) => handleFilterChange(filter.key, value)}
                    style={{ width: '100%' }}
                  />
                </div>
              )}

              {filter.type === 'custom' && filter.render && filter.render()}
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-end">
          <Button onClick={resetFilters}>پاک کردن فیلترها</Button>
        </div>
      </div>
    );
  };

  // Custom empty component
  const customEmpty = emptyComponent || (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description="داده‌ای برای نمایش وجود ندارد"
    />
  );

  // Selection configuration
  const selectionConfig = rowSelection
    ? {
        onChange: onRowSelect,
      }
    : undefined;

  // Main toolbar rendering
  const renderToolbar = () => (
    <div className="mb-4 flex flex-wrap items-center justify-between">
      <div className="mb-2 flex grow items-center">
        {showSearch && (
          <Input
            placeholder={searchPlaceholder}
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={handleSearch}
            allowClear
            className="mr-2 w-full max-w-md"
          />
        )}

        {showFilters && filterOptions.length > 0 && (
          <Button
            type={filtersVisible ? 'primary' : 'default'}
            icon={<FilterOutlined />}
            onClick={() => setFiltersVisible(!filtersVisible)}
            className="mr-2"
          >
            فیلترها
          </Button>
        )}

        {filterComponent}
      </div>

      <div className="mb-2 flex">
        {Object.keys(filterValues).length > 0 && (
          <div className="mr-2 flex flex-wrap">
            {Object.entries(filterValues).map(([key, value]) => {
              if (!value) return null;

              // Find the filter option
              const filterOption = filterOptions.find((f) => f.key === key);
              let displayValue = value;

              // Format display value based on filter type
              if (filterOption?.type === 'select' && filterOption.options) {
                const option = filterOption.options.find(
                  (o) => o.value === value,
                );
                if (option) {
                  displayValue = option.label;
                }
              } else if (
                filterOption?.type === 'date' ||
                filterOption?.type === 'dateRange'
              ) {
                displayValue = Array.isArray(value)
                  ? `${value[0]?.format('YYYY/MM/DD')} تا ${value[1]?.format('YYYY/MM/DD')}`
                  : value?.format('YYYY/MM/DD');
              }

              return (
                <Tag
                  key={key}
                  closable
                  onClose={() => handleFilterChange(key, undefined)}
                  className="mb-1 mr-1"
                >
                  {filterOption?.label || key}: {displayValue}
                </Tag>
              );
            })}
          </div>
        )}

        {onRefresh && (
          <Button
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            loading={internalLoading}
          />
        )}
      </div>
    </div>
  );

  // If custom render function is provided, use it
  if (customRender) {
    return customRender({
      dataSource,
      columns: finalColumns,
      loading: internalLoading,
      rowKey,
      renderToolbar,
      renderFilters,
      searchText,
      filterValues,
      handleSearch,
      handleFilterChange,
      resetFilters,
    });
  }

  // Main table component
  const tableComponent = (
    <>
      {(title || showSearch || showFilters) && (
        <div className="mb-4">
          {title &&
            (typeof title === 'string' ? (
              <Title level={4}>{title}</Title>
            ) : (
              title
            ))}
          {renderToolbar()}
          {renderFilters()}
        </div>
      )}

      <Table
        dataSource={dataSource}
        columns={finalColumns}
        rowKey={rowKey}
        loading={internalLoading}
        rowSelection={selectionConfig}
        locale={{ emptyText: customEmpty }}
        pagination={pagination}
        {...tableProps}
      />
    </>
  );

  // Optionally wrap in a card
  return withCard ? <Card>{tableComponent}</Card> : tableComponent;
};

export default DataTable;
