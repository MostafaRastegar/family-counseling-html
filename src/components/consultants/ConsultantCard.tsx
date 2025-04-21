'use client';

import { useRouter } from 'next/navigation';
import { CalendarOutlined, UserOutlined } from '@ant-design/icons';
import GenericCard from '../common/GenericCard';

const ConsultantCard = ({ consultant }) => {
  const router = useRouter();
  return (
    <GenericCard
      className={`consultant-card`}
      title={consultant?.name}
      avatar={{
        src: consultant?.image,
        icon: !consultant?.image && <UserOutlined />,
      }}
      tags={consultant?.specialties}
      description={consultant.bio}
      actions={[
        {
          key: 'view-profile',
          text: 'مشاهده پروفایل',
          type: 'primary',
          onClick: () =>
            router.push(`/dashboard/client/consultants/${consultant.id}`),
        },
        {
          key: 'reserve',
          text: 'رزرو جلسه',
          icon: <CalendarOutlined />,
          onClick: () =>
            router.push(
              `/dashboard/client/consultants/${consultant.id}?booking=true`,
            ),
        },
      ]}
    />
  );
};

export default ConsultantCard;
