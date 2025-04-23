import React from 'react';
import { Layout } from 'antd';
import AppFooter from '../ui/Footer';
import AppHeader from '../ui/Header';

const { Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Layout className="bg-gray-50 rtl min-h-screen" dir="rtl">
      <AppHeader />
      <Content className="mx-auto w-full max-w-7xl p-4 sm:p-6">
        {children}
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default MainLayout;
