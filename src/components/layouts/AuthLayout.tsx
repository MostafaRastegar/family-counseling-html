import React, { ReactNode } from 'react';
import Link from 'next/link';
import { Card, Layout } from 'antd';

const { Content } = Layout;

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  return (
    <Layout className="bg-gray-50 rtl min-h-screen" dir="rtl">
      <Content className="flex items-center justify-center p-4 sm:p-6">
        <Card className="w-full max-w-md shadow-md">
          {!!title && !!subtitle && (
            <div className="mb-6 text-center">
              {!!title && <h2 className="text-xl font-bold">{title}</h2>}
              {!!subtitle && <p className="mt-2 text-gray-500">{subtitle}</p>}
            </div>
          )}
          {children}
        </Card>
      </Content>
    </Layout>
  );
};

export default AuthLayout;
