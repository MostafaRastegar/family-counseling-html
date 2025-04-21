import React from 'react';
import { Form, Input, Modal, Select } from 'antd';
import { User } from '../types/user.types';

const { Option } = Select;

interface UserEditModalProps {
  visible: boolean;
  user: User | null;
  onCancel: () => void;
  onSubmit: (userData: any) => void;
}

export const UserEditModal: React.FC<UserEditModalProps> = ({
  visible,
  user,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (user) {
      form.setFieldsValue(user);
    } else {
      form.resetFields();
    }
  }, [user, visible]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onSubmit(values);
        onCancel();
      })
      .catch((errorInfo) => {
        console.log('Validate Failed:', errorInfo);
      });
  };

  return (
    <Modal
      title={user ? 'ویرایش کاربر' : 'افزودن کاربر'}
      visible={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="fullName"
          label="نام و نام خانوادگی"
          rules={[{ required: true, message: 'لطفاً نام را وارد کنید' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="ایمیل"
          rules={[
            { required: true, message: 'لطفاً ایمیل را وارد کنید' },
            { type: 'email', message: 'ایمیل معتبر نیست' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="phoneNumber"
          label="شماره تماس"
          rules={[{ required: true, message: 'لطفاً شماره تماس را وارد کنید' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="role"
          label="نقش"
          rules={[{ required: true, message: 'لطفاً نقش را انتخاب کنید' }]}
        >
          <Select placeholder="انتخاب نقش">
            <Option value="admin">مدیر</Option>
            <Option value="consultant">مشاور</Option>
            <Option value="client">مراجع</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="status"
          label="وضعیت"
          rules={[{ required: true, message: 'لطفاً وضعیت را انتخاب کنید' }]}
        >
          <Select placeholder="انتخاب وضعیت">
            <Option value="active">فعال</Option>
            <Option value="inactive">غیرفعال</Option>
            <Option value="suspended">تعلیق شده</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};
