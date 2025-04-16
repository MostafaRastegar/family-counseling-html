'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MenuOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Drawer, Menu, Space } from 'antd';

const Header = () => {
  const [visible, setVisible] = useState(false);
  const isLoggedIn = false; // استاتیک، بعداً به وضعیت لاگین واقعی متصل می‌شود

  const menuItems = [
    { key: 'home', label: <Link href="/">صفحه اصلی</Link> },
    {
      key: 'consultants',
      label: <Link href="/dashboard/client/consultants">مشاوران</Link>,
    },
    { key: 'about', label: <Link href="/about">درباره ما</Link> },
    { key: 'contact', label: <Link href="/contact">تماس با ما</Link> },
  ];

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-primary text-2xl font-bold">
              سامانه مشاوره خانواده
            </Link>
          </div>

          {/* منوی دسکتاپ */}
          <div className="hidden items-center space-x-4 md:flex">
            <Menu mode="horizontal" items={menuItems} className="border-0" />

            <Space className="mr-4">
              {isLoggedIn ? (
                <Link href="/dashboard">
                  <Avatar icon={<UserOutlined />} />
                </Link>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button type="default">ورود</Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button type="primary">ثبت نام</Button>
                  </Link>
                </>
              )}
            </Space>
          </div>

          {/* دکمه موبایل */}
          <div className="md:hidden">
            <Button icon={<MenuOutlined />} onClick={() => setVisible(true)} />
          </div>
        </div>
      </div>

      {/* منوی موبایل */}
      <Drawer
        title="منو"
        placement="right"
        onClose={() => setVisible(false)}
        open={visible}
        width={250}
      >
        <Menu mode="vertical" items={menuItems} style={{ border: 'none' }} />
        <div className="mt-4 flex flex-col space-y-2">
          {isLoggedIn ? (
            <Link href="/dashboard">
              <Button block type="default">
                داشبورد
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/auth/login">
                <Button block type="default">
                  ورود
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button block type="primary">
                  ثبت نام
                </Button>
              </Link>
            </>
          )}
        </div>
      </Drawer>
    </header>
  );
};

export default Header;
