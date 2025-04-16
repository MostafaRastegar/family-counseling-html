import { ReactNode, useMemo } from 'react';
import React, { type JSX } from 'react';
import { Layout, Menu, Table, TableProps } from 'antd';
import { AnyObject } from 'antd/es/_util/type';
import { ExpandableConfig } from 'antd/es/table/interface';
import { DispatchSetStateAction } from 'papak/_utilsTypes';
import HandleNoData from 'papak/kits/HandleNoData';
import { _rowSelectionHandler, useTableAction } from './useTableAction';

const { Header, Content, Sider } = Layout;

interface ContentEditableTableProps<T extends Object> {
  className?: string;
  data: T[];
  count?: number;
  isPending: boolean;
  noEvenBg?: boolean;
  hideSelectAll?: boolean;
  onSelectNone?: boolean;
  rowKey?: string;
  columns: TableProps<T>['columns'];
  setSelectedRowsState?: DispatchSetStateAction<T[]>;
  handleRecordSelectionDisable?: (record: T) => boolean;
  selectedRowsState?: T[];
  expandable?: ExpandableConfig<T> | undefined;
  selectionType?: 'checkbox' | 'radio';
  showTotal?: (range: any, total: any) => string;
  showTotalCount?: boolean;
  showQuickJumper?: boolean;
  scroll: object;
  exprimentalAvoidCellRendering?: boolean;
  pagination: (v: AnyObject) => React.ReactNode;
  actions: {
    icon?: JSX.Element;
    label: React.ReactNode;
    key: string;
    disabled?: boolean;
    onClick?: () => void;
  }[];
}

export const TableComponents = function <T extends Object>({
  data = [],
  count = 0,
  isPending = false,
  hideSelectAll = false,
  columns,
  selectedRowsState,
  setSelectedRowsState,
  rowKey = '',
  scroll,
  className = '',
  actions,
  expandable,
  selectionType = 'checkbox',
  pagination: Pagination,
  handleRecordSelectionDisable,
  exprimentalAvoidCellRendering,
  noEvenBg,
}: ContentEditableTableProps<T>) {
  const {
    sortedColumns,
    collapsed,
    selectedRowKeys,
    setCollapsed,
    setSelectedRowKeys,
  } = useTableAction({
    selectedRowsState,
    columns,
  });

  // Memoize the row selection handler
  const rowSelection = useMemo(() => {
    return !!selectedRowsState
      ? {
          hideSelectAll,
          type: selectionType,
          ..._rowSelectionHandler<T>(
            selectedRowKeys,
            //@ts-ignore
            setSelectedRowsState,
            setSelectedRowKeys,
            handleRecordSelectionDisable,
          ),
        }
      : undefined;
  }, [
    selectedRowsState,
    selectedRowKeys,
    setSelectedRowsState,
    setSelectedRowKeys,
    selectionType,
  ]);

  return (
    <Layout className={className}>
      <Layout dir="rtl">
        {!!actions && !!actions.length && (
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            className="table-sidebar border-l border-gray-300"
            theme="light"
            width={221}
          >
            <div className="demo-logo-vertical" />
            <Menu
              items={actions}
              className="table-sidebar-menu sticky top-[70px] border-r-0 [&_.ant-menu-item-icon]:min-w-6 [&_.ant-menu-item]:flex [&_.ant-menu-item]:items-center [&_.ant-menu-title-content]:w-full"
            />
          </Sider>
        )}
        <Layout dir="ltr">
          <Content className="py-4 pr-4">
            <HandleNoData dataLength={count} isPending={isPending}>
              {columns && (
                <Table
                  columns={sortedColumns()}
                  rowKey={rowKey}
                  dataSource={data}
                  scroll={scroll}
                  rowSelection={rowSelection}
                  expandable={expandable}
                  pagination={false}
                  components={
                    exprimentalAvoidCellRendering
                      ? {
                          body: {
                            cell: ({ children }: { children: ReactNode }) => (
                              <td>{children}</td>
                            ),
                          },
                        }
                      : undefined
                  }
                  className={`mb-4 [&_th]:border-b-2 ${
                    !noEvenBg
                      ? '[&_thead+tbody>tr:nth-child(even)>td.ant-table-cell-fix-left]:bg-gray-100 [&_thead+tbody>tr:nth-child(even)]:bg-gray-100'
                      : ''
                  }`}
                />
              )}
              <Pagination />
            </HandleNoData>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
