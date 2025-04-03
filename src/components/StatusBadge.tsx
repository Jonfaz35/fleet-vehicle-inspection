
import React from 'react';
import { cn } from '@/lib/utils';

type StatusBadgeProps = {
  status: 'good' | 'needs-attention' | 'critical' | 'pass' | 'fail' | 'warning';
  className?: string;
};

const statusMap = {
  'good': { text: 'Good', className: 'status-good' },
  'needs-attention': { text: 'Needs Attention', className: 'status-needs-attention' },
  'critical': { text: 'Critical', className: 'status-critical' },
  'pass': { text: 'Pass', className: 'status-good' },
  'fail': { text: 'Fail', className: 'status-critical' },
  'warning': { text: 'Warning', className: 'status-needs-attention' },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const { text, className: statusClass } = statusMap[status];
  
  return (
    <span className={cn('status-badge', statusClass, className)}>
      {text}
    </span>
  );
};

export default StatusBadge;
