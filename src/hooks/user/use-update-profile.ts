import { useMutation, useQueryClient } from '@tanstack/react-query';

import { agent } from '@/lib/agent/client';
import { queryKeys } from '@/lib/tanstack-query';
import { useUserStore } from '@/stores';
import { IUser } from '@/types/user.type';

/**
 * Update profile request payload
 * Only include fields that can be updated
 */
export interface UpdateProfilePayload {
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  image?: string;
  language?: string;
  country?: string;
  state?: string;
  city?: string;
  street?: string;
  postalCode?: string;
  detailedAddress?: string;
  preferredLocation?: string;
}

/**
 * Update profile API call
 */
export async function updateProfileApi(
  payload: UpdateProfilePayload,
): Promise<IUser> {
  const response = await agent.put<IUser>('/user/profile', payload);
  // agent.patch returns ApiResponse<IUser> = { message?, data: IUser }
  // So we need to unwrap .data to get the actual IUser
  return response;
}

/**
 * Update profile mutation hook
 * Handles user profile updates and cache synchronization
 *
 * @example
 * const { mutate: updateProfile, isPending } = useUpdateProfile();
 * updateProfile({
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   city: 'Tashkent'
 * });
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { setUser } = useUserStore();

  return useMutation<IUser, Error, UpdateProfilePayload>({
    mutationFn: updateProfileApi,

    onSuccess: (updatedUser) => {
      // Update user store with new data
      setUser(updatedUser);

      // Invalidate all queries to refetch with new user context
      queryClient.invalidateQueries({
        queryKey: queryKeys.auth.me,
      });
    },
  });
}
