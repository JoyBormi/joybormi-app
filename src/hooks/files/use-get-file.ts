import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/tanstack-query';
import { getFileMetadata } from '@/services/files';

import type { IFile } from '@/types/file.type';

export const useGetFile = ({ id }: { id?: string }) =>
  useQuery<IFile>({
    queryKey: [...queryKeys.files.detail, { id }],
    queryFn: () => getFileMetadata(id!),
    enabled: Boolean(id),
  });
