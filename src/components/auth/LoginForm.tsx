import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LockOutlined,
  MailOutlined,
  UserOutlined,
  WechatOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Button,
  Checkbox,
  Divider,
  Form,
  Input,
  Typography,
} from 'antd';
import { UsersPresentation } from '@/modules/users/Users.presentation';

const { Title, Text } = Typography;

interface LoginFormProps {
  onSuccess?: () => void;
  redirectUrl?: string;
}

interface LoginFormValues {
  email: string;
  password: string;
  remember: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  redirectUrl = '/dashboard',
}) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const { useUserLogin } = UsersPresentation();
  const { mutate: login, isPending, error, isError } = useUserLogin();

  const [useMock, setUseMock] = useState<boolean>(false);

  const handleSubmit = (values: LoginFormValues) => {
    const { email, password, remember } = values;

    // اگر محیط تست/مک باشد، از لاگین شبیه‌سازی شده استفاده می‌کنیم
    if (useMock) {
      // @ts-ignore - اینجا از متد لاگین مک استفاده می‌کنیم که در سرویس تعریف شده
      login({
        user: {
          email,
          password,
        },
      });
    } else {
      // استفاده از لاگین اصلی
      login({
        user: {
          email,
          password,
        },
      });
    }
  };

  // برای حالت نمایشی، می‌توانید از این متد استفاده کنید
  const handleMockLogin = () => {
    setUseMock(true);
    form.setFieldsValue({
      email: 'consultant1@example.com',
      password: 'password123',
      remember: true,
    });

    setTimeout(() => {
      form.submit();
    }, 100);
  };

  return (
    <div className="login-form-container">
      <Title level={3} className="mb-6 text-center">
        ورود به حساب کاربری
      </Title>

      {isError && (
        <Alert
          message="خطا در ورود"
          description={
            error instanceof Error
              ? error.message
              : 'نام کاربری یا رمز عبور اشتباه است.'
          }
          type="error"
          showIcon
          className="mb-4"
        />
      )}

      <Form
        form={form}
        name="login"
        layout="vertical"
        initialValues={{ remember: true }}
        onFinish={handleSubmit}
        requiredMark={false}
      >
        <Form.Item
          name="email"
          label="ایمیل"
          rules={[
            { required: true, message: 'لطفا ایمیل خود را وارد کنید' },
            { type: 'email', message: 'لطفا یک ایمیل معتبر وارد کنید' },
          ]}
        >
          <Input
            prefix={<MailOutlined className="text-gray-400" />}
            placeholder="ایمیل خود را وارد کنید"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="رمز عبور"
          rules={[
            { required: true, message: 'لطفا رمز عبور خود را وارد کنید' },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="رمز عبور خود را وارد کنید"
            size="large"
          />
        </Form.Item>

        <div className="mb-4 flex items-center justify-between">
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>مرا به خاطر بسپار</Checkbox>
          </Form.Item>
          <Link href="/auth/forgot-password" className="text-primary-500">
            <Text className="hover:text-primary-600">فراموشی رمز عبور</Text>
          </Link>
        </div>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={isPending}
          >
            ورود
          </Button>
        </Form.Item>

        <div className="mb-4 text-center">
          <Text>
            حساب کاربری ندارید؟{' '}
            <Link href="/auth/register" className="text-primary-500">
              <Text className="hover:text-primary-600">ثبت‌نام کنید</Text>
            </Link>
          </Text>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <>
            <Divider>
              <Text type="secondary">حالت نمایشی</Text>
            </Divider>
            <Button
              icon={<UserOutlined />}
              onClick={handleMockLogin}
              block
              className="mb-2"
            >
              ورود نمایشی
            </Button>
          </>
        )}
      </Form>
    </div>
  );
};

export default LoginForm;
