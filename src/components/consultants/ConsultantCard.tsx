'use client';

import { useRouter } from 'next/navigation';
import { CalendarOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons';
import { Rate } from 'antd';
import GenericCard, {
  GenericCardAction,
} from '@/components/common/GenericCard';
import StatusBadge from '@/components/common/StatusBadge';

const ConsultantCard = ({ consultant }) => {
  const router = useRouter();

  const cardActions: GenericCardAction[] = [
    {
      key: 'view-profile',
      label: 'مشاهده پروفایل',
      type: 'default',
      onClick: () =>
        router.push(`/dashboard/client/consultants/${consultant.id}`),
      icon: <EyeOutlined />,
    },
    {
      key: 'reserve',
      label: 'رزرو جلسه',
      type: 'primary',
      icon: <CalendarOutlined />,
      onClick: () =>
        router.push(
          `/dashboard/client/consultants/${consultant.id}?booking=true`,
        ),
    },
  ];

  return (
    <GenericCard
      item={consultant}
      title={consultant.name}
      subtitle={consultant.specialties.join(', ')}
      status={
        consultant.isVerified ? (
          <StatusBadge status="verified" type="tag" />
        ) : undefined
      }
      imageUrl={consultant.image}
      description={consultant.bio}
      tags={consultant.specialties}
      secondaryContent={
        <div className="flex items-center">
          <Rate disabled defaultValue={consultant.rating} className="ml-2" />
          <span>({consultant.reviewCount} نظر)</span>
        </div>
      }
      footer={
        <div className="text-sm text-gray-500">
          <UserOutlined className="ml-1" />
          متخصص در: {consultant.specialties.join(', ')}
        </div>
      }
      actions={cardActions}
      hoverable={true}
    />
  );
};

export default ConsultantCard;
