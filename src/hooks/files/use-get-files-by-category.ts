import { useQuery } from '@tanstack/react-query';

import { getFilesByCategory } from '@/hooks/files/file.service';
import { queryKeys } from '@/lib/tanstack-query';

import type { IFile } from '@/types/file.type';

export const useGetFilesByCategory = ({ category }: { category?: string }) =>
  useQuery<IFile[]>({
    queryKey: [...queryKeys.files.category, { category }],
    queryFn: () => getFilesByCategory(category!),
    enabled: Boolean(category),
  });
