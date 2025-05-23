import { type JSX, useMemo } from 'react';
import { TableProps } from 'antd';
import { ExpandableConfig } from 'antd/es/table/interface';
import { DispatchSetStateAction } from 'papak/_utilsTypes';
import Pagination from 'papak/kits/Pagination';
import { TableComponents } from './_partials/TableComponents';

interface ContentEditableTableProps<T extends Object> {
  data: T[];
  className?: string;
  count?: number;
  isPending: boolean;
  onSelectNone: boolean;
  rowKey?: string;
  paginationPath: string;
  columns: TableProps<T>['columns'];
  setSelectedRowsState?: DispatchSetStateAction<T[]>;
  selectedRowsState?: T[];
  expandable?: ExpandableConfig<T> | undefined;
  selectionType?: 'checkbox' | 'radio';
  showTotal?: (range: any, total: any) => string;
  showTotalCount?: boolean;
  showQuickJumper?: boolean;
  isDefault?: boolean;
  hideSelectAll?: boolean;
  scroll?: object;
  actions: {
    icon?: JSX.Element;
    label: React.ReactNode;
    key: string;
    disabled?: boolean;
    onClick?: () => void;
  }[];
}

export const ContentEditableTable = function <T extends Object>({
  data = [],
  count = 0,
  isPending = false,
  columns,
  selectedRowsState,
  setSelectedRowsState,
  rowKey = '',
  actions,
  showQuickJumper,
  scroll = { x: 1200 },
  onSelectNone,
  paginationPath = '',
  expandable,
  selectionType = 'checkbox',
  showTotal,
  hideSelectAll = true,
  className,
}: ContentEditableTableProps<T>) {
  const memoizedActions = useMemo(() => actions, [actions]);

  return (
    <TableComponents
      className={className}
      pagination={() => (
        <Pagination
          pathUrl={paginationPath}
          total={count || 0}
          showTotal={showTotal}
          showQuickJumper={showQuickJumper}
        />
      )}
      onSelectNone={onSelectNone}
      rowKey={rowKey}
      expandable={expandable}
      selectionType={selectionType}
      data={data}
      scroll={count > 0 ? scroll : { x: 'auto' }}
      isPending={isPending}
      hideSelectAll={hideSelectAll}
      columns={columns}
      setSelectedRowsState={setSelectedRowsState}
      selectedRowsState={selectedRowsState}
      actions={memoizedActions}
    />
  );
};
