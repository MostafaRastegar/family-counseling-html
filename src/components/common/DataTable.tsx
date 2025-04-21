'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import {
  DownloadOutlined,
  FilterOutlined,
  ReloadOutlined,
  SearchOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Input,
  Row,
  Space,
  Table,
  Tooltip,
  Typography,
} from 'antd';
import { ColumnsType, TablePaginationConfig, TableProps } from 'antd/es/table';

const { Title, Text } = Typography;

export interface DataTableColumn<T> {
  title: string | ReactNode;
  dataIndex: string;
  key?: string;
  render?: (value: any, record: T, index: number) => ReactNode;
  sorter?: boolean | ((a: T, b: T) => number);
  sortOrder?: 'ascend' | 'descend' | null;
  filters?: { text: string; value: string }[];
  onFilter?: (value: string, record: T) => boolean;
  filterDropdown?: ReactNode;
  width?: number | string;
  fixed?: 'left' | 'right';
  ellipsis?: boolean;
  align?: 'left' | 'center' | 'right';
  className?: string;
  hidden?: boolean;
}

export interface DataTableAction<T> {
  key: string;
  label: string;
  icon?: ReactNode;
  onClick: (record: T) => void;
  disabled?: (record: T) => boolean;
  hidden?: (record: T) => boolean;
  danger?: boolean;
  tooltip?: string;
  confirmText?: string;
  type?: 'link' | 'text' | 'default' | 'primary' | 'dashed';
}

export interface DataTableProps<T extends object> {
  data: T[];
  columns: DataTableColumn<T>[];
  actions?: DataTableAction<T>[];
  loading?: boolean;
  title?: string | ReactNode;
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  pagination?: TablePaginationConfig | false;
  rowKey?: string | ((record: T) => string);
  card?: boolean;
  cardExtra?: ReactNode;
  showReload?: boolean;
  onReload?: () => void;
  showSettings?: boolean;
  onSettingsClick?: () => void;
  emptyText?: string;
  showHeader?: boolean;
  size?: 'small' | 'middle' | 'large';
  className?: string;
  scroll?: { x?: number | string; y?: number | string };
  exportable?: boolean;
  onExport?: () => void;
  exportDisabled?: boolean;
  exportText?: string;
  footer?: ReactNode | ((data: T[]) => ReactNode);
  summary?: (data: readonly T[]) => ReactNode;
  rowSelection?: TableProps<T>['rowSelection'];
}

/**
 * DataTable - A reusable data table component
 *
 * This component provides a configurable interface for displaying tabular data
 * with support for searching, pagination, sorting, and row actions.
 */
function DataTable<T extends object>({
  data,
  columns,
  actions,
  loading = false,
  title,
  searchable = false,
  searchPlaceholder = 'جستجو...',
  onSearch,
  pagination = {
    pageSize: 10,
    showSizeChanger: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} از ${total} مورد`,
  },
  rowKey = 'id',
  card = true,
  cardExtra,
  showReload = false,
  onReload,
  showSettings = false,
  onSettingsClick,
  emptyText = 'داده‌ای یافت نشد',
  showHeader = true,
  size = 'middle',
  className = '',
  scroll,
  exportable = false,
  onExport,
  exportDisabled = false,
  exportText = 'خروجی',
  footer,
  summary,
  rowSelection,
}: DataTableProps<T>) {
  // Internal search state
  const [searchText, setSearchText] = useState('');
  // Filter visible columns
  const visibleColumns = columns.filter((col) => !col.hidden);

  // Handle search
  const handleSearch = (value: string) => {
    setSearchText(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  // Add actions column if actions are provided
  const tableColumns: ColumnsType<T> = [...visibleColumns];

  if (actions && actions.length > 0) {
    tableColumns.push({
      title: 'عملیات',
      key: 'actions',
      fixed: 'right',
      width: actions.length > 2 ? 150 : 120,
      render: (_, record) => (
        <Space>
          {actions.map((action) => {
            // Check if action should be hidden for this record
            if (action.hidden && action.hidden(record)) {
              return null;
            }

            const isDisabled = action.disabled && action.disabled(record);
            const actionButton = (
              <Button
                key={action.key}
                type={action.type || 'link'}
                onClick={() => action.onClick(record)}
                icon={action.icon}
                disabled={isDisabled}
                danger={action.danger}
                size="small"
              >
                {action.label}
              </Button>
            );

            return action.tooltip ? (
              <Tooltip key={action.key} title={action.tooltip}>
                {actionButton}
              </Tooltip>
            ) : (
              actionButton
            );
          })}
        </Space>
      ),
    });
  }

  // Table top controls component
  const TableControls = () => (
    <Row justify="space-between" align="middle" className="mb-4">
      <Col>
        {searchable && (
          <Input
            placeholder={searchPlaceholder}
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 250 }}
            allowClear
          />
        )}
      </Col>
      <Col>
        <Space>
          {exportable && (
            <Button
              icon={<DownloadOutlined />}
              onClick={onExport}
              disabled={exportDisabled}
            >
              {exportText}
            </Button>
          )}
          {showReload && (
            <Button
              icon={<ReloadOutlined />}
              onClick={onReload}
              disabled={loading}
            />
          )}
          {showSettings && (
            <Button icon={<SettingOutlined />} onClick={onSettingsClick} />
          )}
          {cardExtra}
        </Space>
      </Col>
    </Row>
  );

  // Table component
  const tableComponent = (
    <>
      {(searchable ||
        showReload ||
        showSettings ||
        exportable ||
        cardExtra) && <TableControls />}
      <Table<T>
        rowKey={rowKey}
        dataSource={data}
        columns={tableColumns}
        loading={loading}
        pagination={pagination}
        size={size}
        className={className}
        scroll={scroll}
        locale={{ emptyText }}
        showHeader={showHeader}
        footer={footer ? () => footer : undefined}
        summary={summary}
        rowSelection={rowSelection}
      />
    </>
  );

  // Either wrap in a card or return the table component directly
  return card ? (
    <Card title={title} className="data-table-card" bordered>
      {tableComponent}
    </Card>
  ) : (
    <div className="data-table-container">
      {title &&
        (typeof title === 'string' ? (
          <Title level={4} className="mb-4">
            {title}
          </Title>
        ) : (
          <div className="mb-4">{title}</div>
        ))}
      {tableComponent}
    </div>
  );
}

export default DataTable;
