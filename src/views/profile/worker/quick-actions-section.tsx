import React from 'react';

import Icons from '@/components/icons';
import { ProfileQuickActions } from '@/views/profile/components';

interface QuickActionsSectionProps {
  onAddService: () => void;
  onEditSchedule: () => void;
  onJoinBrand?: () => void;
}

/**
 * Quick Actions Section Component
 * Provides quick access to add service and manage schedule
 */
export const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({
  onAddService,
  onEditSchedule,
  onJoinBrand,
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
          id: 'manage-schedule',
          title: 'Manage Schedule',
          description: 'Set your working hours',
          onPress: onEditSchedule,
          icon: Icons.Calendar,
          iconClassName: 'text-success',
          iconContainerClassName: 'bg-success/10',
        },
        ...(onJoinBrand
          ? [
              {
                id: 'join-brand',
                title: 'Join Brand',
                description: 'Add your work experience',
                onPress: onJoinBrand,
                icon: Icons.Briefcase,
                iconClassName: 'text-warning',
                iconContainerClassName: 'bg-warning/10',
              },
            ]
          : []),
      ]}
    />
  );
};
