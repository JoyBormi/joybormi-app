import { useQuery } from '@tanstack/react-query';

import { getFileMetadata } from '@/hooks/files/file.service';
import { queryKeys } from '@/lib/tanstack-query';

import type { IFile } from '@/types/file.type';

export const useGetFile = ({ id }: { id?: string }) =>
  useQuery<IFile>({
    queryKey: [...queryKeys.files.detail, { id }],
    queryFn: () => getFileMetadata(id!),
    enabled: Boolean(id),
  });
