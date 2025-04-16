import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Select } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import clsx from 'clsx';
import objectToQueryString from '../../utils/objectToQueryString';
import { useSearchParamsToObject } from '../../utils/useSearchParamsToObject';

export const QuickFilter = ({
  data,
  border = false,
}: {
  data: DefaultOptionType[];
  border: boolean;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParamsToObject();

  const handleOnchange = (value: string) => {
    return router.push(
      `${pathname}?${objectToQueryString({ ...searchParams, page: '1', ordering: value })}`,
    );
  };
  return (
    <div
      className={clsx(
        'mr-6 flex h-[22px] min-w-[200px] items-center gap-1 pr-6',
        { 'border-r': border },
      )}
    >
      <span className="text-[13px] font-[500]">Quick Filter</span>
      <Select
        onChange={handleOnchange}
        size="small"
        options={data}
        defaultValue={searchParams?.ordering}
        placeholder="none"
        allowClear
        className="flex-auto"
      />
    </div>
  );
};
