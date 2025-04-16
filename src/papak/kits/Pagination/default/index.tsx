'use client';

import React, { useRef } from 'react';
import { Pagination } from 'antd';
import { useParamsChange } from '../useParamsChange';

interface PaginationCPProps {
  total: number;
  pathUrl: string;
  showQuickJumper?: boolean;
  showTotal?: (total: number, range: [number, number]) => React.ReactNode;
}

const PaginationCP = ({
  total,
  showQuickJumper,
  pathUrl,
  showTotal,
}: PaginationCPProps) => {
  const pagiantionRef = useRef();

  const { onChangeHandler, pageParams, sizeParams } = useParamsChange(pathUrl);

  return (
    <div
      ref={pagiantionRef as unknown as React.RefObject<HTMLDivElement>}
      className="flex flex-col justify-center"
    >
      <Pagination
        current={!!pageParams ? parseInt(pageParams, 10) : 1}
        align="end"
        total={total}
        showTotal={showTotal}
        onChange={onChangeHandler}
        pageSize={parseInt(sizeParams, 10)}
        showQuickJumper={showQuickJumper}
        pageSizeOptions={['10', '30', '50', '100']}
        showSizeChanger
        showPrevNextJumpers
      />
    </div>
  );
};

export default PaginationCP;