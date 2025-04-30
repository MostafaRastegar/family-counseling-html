import Link from 'next/link';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Alert, Button, Checkbox, Form, Input, Typography } from 'antd';
import { UsersPresentation } from '@/modules/users/Users.presentation';

const { Text } = Typography;

const LoginForm = () => {
  const [form] = Form.useForm();
  const { useUserLogin } = UsersPresentation();
  const { isPending, error, isError } = useUserLogin();

  const handleSubmit = () => {};

  return (
    <div className="login-form-container">
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
      </Form>
    </div>
  );
};

export default LoginForm;
