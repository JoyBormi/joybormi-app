import { useQuery } from '@tanstack/react-query';

import { getFilesByCategory } from '@/hooks/files/file.service';
import { queryKeys } from '@/lib/tanstack-query';

import type { IFile } from '@/types/file.type';

export const useGetFilesByCategory = ({
  ownerId,
  category,
}: {
  ownerId?: string;
  category?: string;
}) =>
  useQuery<IFile[]>({
    queryKey: [...queryKeys.files.category, { ownerId, category }],
    queryFn: () => getFilesByCategory({ ownerId: ownerId!, category }),
    enabled: Boolean(ownerId),
  });
