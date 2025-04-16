'use client';

import { useEffect, useState } from 'react';
import React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button, Input, Switch } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import { Form } from 'antd/lib';
import clsx from 'clsx';
import { AnyObject } from '../../_utilsTypes';
import objectToQueryString from '../../utils/objectToQueryString';
import { useMakeParamsUrl } from '../../utils/useMakeParamsUrl';
import usePrevious from '../../utils/usePrevious';
import { useSearchParamsToObject } from '../../utils/useSearchParamsToObject';
import { QuickFilter } from '../QuickFilter';

export const PageFilterInlineSearch = ({
  title,
  children,
  className,
  quickFilterData,
  searchBar = true,
  inlineFilter,
  layout,
  formDataMapper,
}: {
  title: React.ReactNode;
  layout?: 'inline' | 'vertical';
  className?: string;
  children?: React.ReactNode;
  inlineFilter?: () => React.ReactNode;
  quickFilterData?: DefaultOptionType[];
  searchBar?: boolean;
  formDataMapper?: (v: AnyObject) => AnyObject;
}) => {
  const { resetPage } = useMakeParamsUrl();
  const [formRef] = Form.useForm();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramsObject = useSearchParamsToObject();
  const prevSearchParams = usePrevious(searchParams.toString());
  const [filter, setFilter] = useState(true);
  const [toggleFilter, setToggleFilter] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (Object.keys(paramsObject).length > 2) {
      setToggleFilter(true);
    }
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    formRef.resetFields();
    formRef.setFieldsValue(paramsObject);
  }, [paramsObject]);

  useEffect(() => {
    if (!filter) {
      resetPage();
    } else {
      const builedPath =
        '?' + (prevSearchParams ?? objectToQueryString(paramsObject));
      router.replace(pathname + builedPath);
    }
  }, [filter]);

  if (mounted)
    return (
      <Form
        form={formRef}
        layout={layout}
        onReset={() => resetPage()}
        onFinish={(formData) => {
          const createdQueryString = objectToQueryString(
            formDataMapper ? formDataMapper(formData) : formData,
          );
          return router.push(
            pathname +
              '?page=1&' +
              `page_size=${paramsObject.page_size}&` +
              createdQueryString,
          );
        }}
        autoComplete="off"
        initialValues={paramsObject}
        className={clsx(
          'w-full font-sans',
          clsx(className, {
            'flex flex-col': !!children,
          }),
        )}
      >
        <div className="flex w-full items-center px-4">
          {title && (
            <h2
              className={clsx([
                'whitespace-nowrap text-lg font-[600] leading-[22px] text-gray-900 ltr:mr-6 ltr:pr-6 rtl:ml-6 rtl:pl-6',
                {
                  'ltr:border-r rtl:border-l':
                    !!quickFilterData?.length || inlineFilter || searchBar,
                },
              ])}
            >
              {title}
            </h2>
          )}
          {!!quickFilterData?.length && (
            <QuickFilter data={quickFilterData} border={!!children} />
          )}
          {inlineFilter && inlineFilter()}
          {!children && searchBar && (
            <>
              <Form.Item
                name="search"
                colon={false}
                label={<div className="font-[500]">جستجو</div>}
              >
                <Input size="small" />
              </Form.Item>
              <Form.Item id="submit">
                <Button size="small" htmlType="submit" type="default">
                  جستجو
                </Button>
              </Form.Item>
            </>
          )}

          {!!children && (
            <>
              <Button
                size="small"
                onClick={() => setToggleFilter(!toggleFilter)}
                type={toggleFilter ? 'primary' : 'default'}
                className="mr-4"
              >
                Advanced Filter
              </Button>
              <Form.Item
                name="switch"
                valuePropName="checked"
                className="m-0 flex items-center"
              >
                <Switch
                  defaultChecked={true}
                  onChange={(value) => {
                    if (value === false) {
                      setFilter(value);
                      return value;
                    }
                    setFilter(value);
                  }}
                />
                <span className="pl-2">Filter On</span>
              </Form.Item>
            </>
          )}
        </div>
        {toggleFilter && (
          <div className="flex flex-row flex-wrap gap-4 px-6 py-2">
            {children}
          </div>
        )}
      </Form>
    );
};
