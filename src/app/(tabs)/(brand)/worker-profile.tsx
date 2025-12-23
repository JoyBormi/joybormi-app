import WorkerProfileView from '@/views/worker-profile/worker-profile-view';
import React from 'react';

/**
 * Worker Profile Page
 * Route: /(tabs)/(brand)/worker-profile
 *
 * Page component that renders the WorkerProfileView
 * - SSR/data fetching would go here in production
 * - Currently uses mock data from the view component
 */
const WorkerProfileScreen: React.FC = () => {
  return <WorkerProfileView />;
};

export default WorkerProfileScreen;
