import { Redirect } from 'expo-router';

import { routes } from '@/constants/routes';
import { useOnboarding } from '@/stores/use-onboarding';

const Middleware = () => {
  const { visited, canVisitAgain } = useOnboarding();

  if (visited && !canVisitAgain) return <Redirect href={routes.tabs.home} />;

  return <Redirect href={routes.website.home} />;
};

export default Middleware;
