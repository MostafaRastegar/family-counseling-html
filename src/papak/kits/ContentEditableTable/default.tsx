import React, { type JSX } from 'react';
import { TableProps } from 'antd';
import { ExpandableConfig } from 'antd/es/table/interface';
import { DispatchSetStateAction } from 'papak/_utilsTypes';
import Pagination from 'papak/kits/Pagination/default';
import { TableComponents } from './_partials/TableComponents';

interface ContentEditableTableProps<T extends Object> {
  data: T[];
  count?: number;
  isPending: boolean;
  scroll?: object;
  rowKey?: string;
  hideSelectAll?: boolean;
  handleRecordSelectionDisable?: (record: T) => boolean;
  paginationPath: string;
  columns: TableProps<T>['columns'];
  setSelectedRowsState?: DispatchSetStateAction<T[]>;
  selectedRowsState?: T[];
  expandable?: ExpandableConfig<T> | undefined;
  noEvenBg?: boolean;
  selectionType?: 'checkbox' | 'radio';
  notSortable?: boolean;
  noPagination?: boolean;
  showTotal?: (total: number, range: [number, number]) => React.ReactNode;
  showTotalCount?: boolean;
  showQuickJumper?: boolean;
  exprimentalAvoidCellRendering?: boolean;
  actions: {
    icon?: JSX.Element;
    label: string;
    key: string;
    disabled?: boolean;
    onClick(): void;
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
  hideSelectAll = true,
  showQuickJumper,
  paginationPath = '',
  expandable,
  showTotalCount,
  selectionType = 'checkbox',
  showTotal,
  notSortable,
  noPagination,
  handleRecordSelectionDisable,
  noEvenBg,
  scroll = { x: 1200 },
  exprimentalAvoidCellRendering,
}: ContentEditableTableProps<T>) {
  return (
    <TableComponents
      pagination={() =>
        !noPagination ? (
          <Pagination
            pathUrl={paginationPath}
            total={count || 0}
            showTotal={showTotal}
            showQuickJumper={showQuickJumper}
          />
        ) : (
          <></>
        )
      }
      rowKey={rowKey}
      noEvenBg={noEvenBg}
      expandable={expandable}
      selectionType={selectionType}
      data={data}
      isPending={isPending}
      hideSelectAll={hideSelectAll}
      exprimentalAvoidCellRendering={exprimentalAvoidCellRendering}
      handleRecordSelectionDisable={handleRecordSelectionDisable}
      columns={
        notSortable ? columns?.map((c) => ({ ...c, notSortable })) : columns
      }
      setSelectedRowsState={setSelectedRowsState}
      selectedRowsState={selectedRowsState}
      actions={actions}
      showTotalCount={showTotalCount}
      scroll={count > 0 ? scroll : { x: 'auto' }}
    />
  );
};
