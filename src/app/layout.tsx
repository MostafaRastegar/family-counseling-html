import type { Metadata } from 'next';
// import { Inter } from 'next/font/google';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import QueryClientProvider from 'papak/utils/QueryClientProvider';
import '../../globals.css';

export const metadata: Metadata = {
  title: 'سامانه مشاوره خانواده',
  description: 'پلتفرم آنلاین ارتباط مراجعان با مشاوران خانواده',
};
// const inter = Inter({ subsets: ['latin'] });

interface RootLayoutProps {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}
export default function RootLayout({
  children,
  params: { locale },
}: Readonly<RootLayoutProps>) {
  return (
    <html dir="rtl">
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      {/* <body className={inter.className}> */}
      <body className="flex min-h-screen flex-col">
        <AntdRegistry>
          <QueryClientProvider>{children}</QueryClientProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
