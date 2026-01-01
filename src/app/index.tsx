import { Redirect } from 'expo-router';

import { useOnboarding } from '@/stores/use-onboarding';

const Middleware = () => {
  const { visited, canVisitAgain } = useOnboarding();

  if (visited && !canVisitAgain) return <Redirect href="/(tabs)" />;

  return <Redirect href="/(website)" />;
};

export default Middleware;
