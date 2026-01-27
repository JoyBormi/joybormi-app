import { useMemo } from 'react';

import { useGetSchedule } from '@/hooks/schedule';
import { useGetServices } from '@/hooks/service';

import { useGetBrand } from './use-get-brand';
import { useGetBrandPhotos } from './use-get-brand-photos';
import { useGetBrandTeam } from './use-get-brand-team';

export const useBrandProfile = ({ userId }: { userId?: string }) => {
  const brandQuery = useGetBrand({ userId });
  const brandId = brandQuery.data?.id;

  const servicesQuery = useGetServices({ brandId });
  const teamQuery = useGetBrandTeam({ brandId });
  const photosQuery = useGetBrandPhotos({ brandId });
  const scheduleQuery = useGetSchedule({ brandId });

  const isLoading = useMemo(
    () =>
      brandQuery.isLoading ||
      servicesQuery.isLoading ||
      teamQuery.isLoading ||
      photosQuery.isLoading ||
      scheduleQuery.isLoading,
    [
      brandQuery.isLoading,
      servicesQuery.isLoading,
      teamQuery.isLoading,
      photosQuery.isLoading,
      scheduleQuery.isLoading,
    ],
  );

  return {
    brandQuery,
    servicesQuery,
    teamQuery,
    photosQuery,
    scheduleQuery,
    brandId,
    isLoading,
  };
};
