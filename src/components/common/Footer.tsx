'use client';

import Link from 'next/link';
import { Col, Divider, Layout, Row, Space, Typography } from 'antd';

const { Footer: AntFooter } = Layout;
const { Title, Text } = Typography;

const Footer = () => {
  return (
    <AntFooter className="bg-gray-100 p-8">
      <div className="container mx-auto">
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} md={8}>
            <Title level={4}>سامانه مشاوره خانواده</Title>
            <Text className="text-gray-600">
              ارائه خدمات مشاوره خانواده آنلاین با بهترین مشاوران
            </Text>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Title level={4}>لینک‌های مهم</Title>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="hover:text-primary text-gray-600"
                >
                  درباره ما
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-primary text-gray-600"
                >
                  تماس با ما
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-primary text-gray-600"
                >
                  حریم خصوصی
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-primary text-gray-600"
                >
                  قوانین و مقررات
                </Link>
              </li>
            </ul>
          </Col>

          <Col xs={24} md={8}>
            <Title level={4}>تماس با ما</Title>
            <Space direction="vertical" className="text-gray-600">
              <Text>آدرس: تهران، خیابان مثال، پلاک ۱۲۳</Text>
              <Text>تلفن: ۰۲۱-۱۲۳۴۵۶۷۸</Text>
              <Text>ایمیل: info@family-counseling.com</Text>
            </Space>
          </Col>
        </Row>

        <Divider className="my-6" />

        <Row justify="center">
          <Col>
            <Text className="text-gray-500">
              © {new Date().getFullYear()} سامانه مشاوره خانواده. تمامی حقوق
              محفوظ است.
            </Text>
          </Col>
        </Row>
      </div>
    </AntFooter>
  );
};

export default Footer;
