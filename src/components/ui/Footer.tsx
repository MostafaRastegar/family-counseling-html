import React from 'react';
import Link from 'next/link';
import { Layout } from 'antd';

const { Footer } = Layout;

const AppFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Footer className="bg-gray-100 p-6 text-center">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 grid grid-cols-1 gap-6 text-right md:grid-cols-3">
          <div>
            <h4 className="mb-4 text-lg font-bold">سامانه مشاوره خانواده</h4>
            <p className="text-gray-600">
              پلتفرم آنلاین ارتباط مراجعان با مشاوران خانواده جهت دریافت مشاوره
              تخصصی
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-lg font-bold">لینک‌های مفید</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="hover:text-primary-500 text-gray-600"
                >
                  درباره ما
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-primary-500 text-gray-600"
                >
                  تماس با ما
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-primary-500 text-gray-600"
                >
                  سوالات متداول
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-primary-500 text-gray-600"
                >
                  حریم خصوصی
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-lg font-bold">تماس با ما</h4>
            <p className="text-gray-600">تهران، خیابان ولیعصر، پلاک 1234</p>
            <p className="text-gray-600">info@example.com</p>
            <p className="text-gray-600">021-12345678</p>
          </div>
        </div>
        <div className="border-t border-gray-300 pt-6 text-gray-500">
          <p>تمامی حقوق محفوظ است &copy; {currentYear} سامانه مشاوره خانواده</p>
        </div>
      </div>
    </Footer>
  );
};

export default AppFooter;
