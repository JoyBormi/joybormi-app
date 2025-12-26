import { useIsFocused } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

/**
 * Hook to refetch queries when screen comes into focus
 * Usage: useRefetchOnFocus(refetch)
 */
export function useRefetchOnFocus(refetch: () => void): void {
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      refetch();
    }
  }, [isFocused, refetch]);
}

/**
 * Hook to get screen focus state for conditional query enabling
 * Usage: const enabled = useScreenFocusEnabled()
 */
export function useScreenFocusEnabled(): boolean {
  return useIsFocused();
}

/**
 * Hook to invalidate specific queries when screen comes into focus
 * Usage: useInvalidateOnFocus(['reservations', 'user'])
 */
export function useInvalidateOnFocus(queryKey: readonly unknown[]): void {
  const isFocused = useIsFocused();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isFocused) {
      queryClient.invalidateQueries({ queryKey });
    }
  }, [isFocused, queryClient, queryKey]);
}
