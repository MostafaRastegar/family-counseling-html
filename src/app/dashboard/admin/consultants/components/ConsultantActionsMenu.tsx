import React from 'react';
import Link from 'next/link';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Menu, Modal } from 'antd';
import { Consultant } from '../types/consultant.types';

interface ConsultantActionsMenuProps {
  consultant: Consultant;
  onVerify: (id: number, verified: boolean) => void;
  onDelete: (id: number) => void;
}

export const ConsultantActionsMenu: React.FC<ConsultantActionsMenuProps> = ({
  consultant,
  onVerify,
  onDelete,
}) => {
  const handleDelete = () => {
    Modal.confirm({
      title: 'آیا از حذف این مشاور مطمئن هستید؟',
      content: 'با حذف مشاور، تمامی اطلاعات مربوط به آن نیز حذف خواهد شد.',
      okText: 'بله',
      cancelText: 'خیر',
      onOk: () => onDelete(consultant.id),
    });
  };

  const actionMenu = (
    <Menu>
      <Menu.Item key="edit" icon={<EditOutlined />}>
        <Link href={`/dashboard/admin/consultants/edit/${consultant.id}`}>
          ویرایش
        </Link>
      </Menu.Item>
      {consultant.isVerified ? (
        <Menu.Item
          key="reject"
          icon={<CloseCircleOutlined />}
          onClick={() => onVerify(consultant.id, false)}
        >
          لغو تأیید
        </Menu.Item>
      ) : (
        <Menu.Item
          key="verify"
          icon={<CheckCircleOutlined />}
          onClick={() => onVerify(consultant.id, true)}
        >
          تأیید مشاور
        </Menu.Item>
      )}
      <Menu.Item
        key="delete"
        icon={<DeleteOutlined />}
        danger
        onClick={handleDelete}
      >
        حذف مشاور
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={actionMenu} trigger={['click']}>
      <Button>عملیات</Button>
    </Dropdown>
  );
};
