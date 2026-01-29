import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/tanstack-query';
import { getFilesByCategory } from '@/services/files';

import type { IFile } from '@/types/file.type';

export const useGetFilesByCategory = ({ category }: { category?: string }) =>
  useQuery<IFile[]>({
    queryKey: [...queryKeys.files.category, { category }],
    queryFn: () => getFilesByCategory(category!),
    enabled: Boolean(category),
  });
