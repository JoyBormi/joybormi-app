import React from 'react';

import Icons from '@/components/icons';
import { ProfileQuickActions } from '@/views/profile/components';

interface BrandQuickActionsProps {
  onAddService: () => void;
  onAddWorker: () => void;
  onManageHours: () => void;
  onSetupWorkerProfile: () => void;
}

/**
 * Brand Quick Actions Component
 * Displays action cards for common brand management tasks
 */
export const BrandQuickActions: React.FC<BrandQuickActionsProps> = ({
  onAddService,
  onAddWorker,
  onManageHours,
  onSetupWorkerProfile,
}) => {
  return (
    <ProfileQuickActions
      actions={[
        {
          id: 'add-service',
          title: 'Add New Service',
          description: 'Create a new service offering',
          onPress: onAddService,
          icon: Icons.Plus,
          iconClassName: 'text-primary',
          iconContainerClassName: 'bg-primary/10',
        },
        {
          id: 'add-worker',
          title: 'Invite Team Member',
          description: 'Add a new worker to your team',
          onPress: onAddWorker,
          icon: Icons.UserPlus,
          iconClassName: 'text-success',
          iconContainerClassName: 'bg-success/10',
        },
        {
          id: 'manage-hours',
          title: 'Manage Hours',
          description: 'Set your business hours',
          onPress: onManageHours,
          icon: Icons.Calendar,
          iconClassName: 'text-warning',
          iconContainerClassName: 'bg-warning/10',
        },
        {
          id: 'setup-worker-profile',
          title: 'Set up worker profile',
          description: 'Switch to your worker profile setup',
          onPress: onSetupWorkerProfile,
          icon: Icons.Users,
          iconClassName: 'text-primary',
          iconContainerClassName: 'bg-primary/10',
        },
      ]}
    />
  );
};
