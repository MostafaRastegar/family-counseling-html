'use client';

import StatusBadge from '@/components/common/StatusBadge';

const SessionStatusBadge = ({ status }: { status: string }) => {
  return (
    <StatusBadge
      status={
        status === 'pending'
          ? 'pending'
          : status === 'confirmed'
            ? 'confirmed'
            : status === 'completed'
              ? 'completed'
              : 'cancelled'
      }
      type="tag"
    />
  );
};

export default SessionStatusBadge;
