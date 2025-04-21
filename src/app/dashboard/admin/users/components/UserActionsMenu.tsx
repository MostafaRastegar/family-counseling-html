import React from 'react';
import { DeleteOutlined, EditOutlined, LockOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, Modal } from 'antd';
import { User } from '../types/user.types';

interface UserActionsMenuProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  onResetPassword: (id: number) => void;
}

export const UserActionsMenu: React.FC<UserActionsMenuProps> = ({
  user,
  onEdit,
  onDelete,
  onResetPassword,
}) => {
  const handleDelete = () => {
    Modal.confirm({
      title: 'آیا از حذف این کاربر مطمئن هستید؟',
      content: 'با حذف کاربر، تمامی اطلاعات مربوط به آن نیز حذف خواهد شد.',
      okText: 'بله',
      cancelText: 'خیر',
      onOk: () => onDelete(user.id),
    });
  };

  const handleResetPassword = () => {
    Modal.confirm({
      title: 'بازنشانی رمز عبور',
      content: 'آیا مایل به بازنشانی رمز عبور این کاربر هستید؟',
      okText: 'بله',
      cancelText: 'خیر',
      onOk: () => onResetPassword(user.id),
    });
  };

  const actionMenu = (
    <Menu>
      <Menu.Item
        key="edit"
        icon={<EditOutlined />}
        onClick={() => onEdit(user)}
      >
        ویرایش
      </Menu.Item>
      <Menu.Item
        key="reset-password"
        icon={<LockOutlined />}
        onClick={handleResetPassword}
      >
        بازنشانی رمز عبور
      </Menu.Item>
      <Menu.Item
        key="delete"
        icon={<DeleteOutlined />}
        danger
        onClick={handleDelete}
      >
        حذف کاربر
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={actionMenu} trigger={['click']}>
      <Button>عملیات</Button>
    </Dropdown>
  );
};
