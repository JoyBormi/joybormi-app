import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import React, { memo, useCallback, useMemo, useState } from 'react';
import { Alert, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Icons from '@/components/icons';
import { Header } from '@/components/shared/header';
import { Loading, NotFoundScreen } from '@/components/status-screens';
import { Button, Text } from '@/components/ui';
import {
  useCreateExperience,
  useDeleteExperience,
  useGetExperiences,
  useUpdateExperience,
} from '@/hooks/worker';
import { toast } from '@/providers/toaster';
import { formatPickerDate } from '@/utils/date';
import {
  EMPTY_EXPERIENCE_FORM_VALUES,
  ExperienceForm,
  type ExperienceFormValues,
  mapExperienceToFormValues,
  toCreateExperiencePayload,
  toUpdateExperiencePayload,
} from '@/views/profile/worker/experience-history';

import type { IExperience } from '@/types/experience.type';

const formatRange = (experience: IExperience) => {
  const startLabel = experience.startDate?.slice(0, 10)
    ? formatPickerDate(experience.startDate.slice(0, 10))
    : '';
  const endLabel = experience.isCurrent
    ? 'Present'
    : experience.endDate?.slice(0, 10)
      ? formatPickerDate(experience.endDate.slice(0, 10))
      : '';

  return `${startLabel}${endLabel ? ` - ${endLabel}` : ''}`;
};

interface ExperienceCardProps {
  item: IExperience;
  onEdit: (item: IExperience) => void;
  onDelete: (item: IExperience) => void;
  isDeleting: boolean;
}

const ExperienceCard = memo(function ExperienceCard({
  item,
  onEdit,
  onDelete,
  isDeleting,
}: ExperienceCardProps) {
  return (
    <View className="rounded-2xl border border-border/60 bg-card/70 p-4">
      <View className="flex-row gap-3">
        <View className="mt-0.5 self-start rounded-xl bg-muted/40 p-2.5">
          <Icons.Briefcase size={18} className="text-muted-foreground" />
        </View>

        <View className="flex-1 gap-0.5">
          <Text className="font-subtitle text-foreground">{item.title}</Text>
          <Text className="font-subbody text-muted-foreground">
            {item.company}
          </Text>

          <View className="mt-1 flex-row items-center gap-1.5">
            <Icons.Calendar size={12} className="text-muted-foreground" />
            <Text className="font-caption text-muted-foreground">
              {formatRange(item)}
            </Text>
            {item.isCurrent ? (
              <View className="ml-1 rounded-full bg-primary/10 px-2 py-0.5">
                <Text className="font-base text-primary">Current</Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>

      <View className="mt-3 flex-row gap-2 pl-11">
        <Pressable
          onPress={() => onEdit(item)}
          className="flex-row items-center gap-1 rounded-lg bg-muted/40 px-3 py-1.5"
        >
          <Icons.Pencil size={13} className="text-muted-foreground" />
          <Text className="font-base text-muted-foreground">Edit</Text>
        </Pressable>

        <Pressable
          onPress={() => onDelete(item)}
          disabled={isDeleting}
          className="flex-row items-center gap-1 rounded-lg bg-destructive/10 px-3 py-1.5"
        >
          <Icons.Trash2 size={13} className="text-destructive" />
          <Text className="font-base text-destructive">Remove</Text>
        </Pressable>
      </View>
    </View>
  );
});

interface ExperienceRowProps {
  item: IExperience;
  editingId: string | null;
  onEditStart: (item: IExperience) => void;
  onEditSave: (id: string, values: ExperienceFormValues) => Promise<void>;
  onEditCancel: () => void;
  onDelete: (item: IExperience) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

const ExperienceRow = memo(function ExperienceRow({
  item,
  editingId,
  onEditStart,
  onEditSave,
  onEditCancel,
  onDelete,
  isUpdating,
  isDeleting,
}: ExperienceRowProps) {
  const initialValues = useMemo(() => mapExperienceToFormValues(item), [item]);

  if (editingId === item.id) {
    return (
      <ExperienceForm
        initialValues={initialValues}
        submitLabel="Save"
        onSubmit={(values) => onEditSave(item.id, values)}
        onCancel={onEditCancel}
        loading={isUpdating}
      />
    );
  }

  return (
    <ExperienceCard
      item={item}
      onEdit={onEditStart}
      onDelete={onDelete}
      isDeleting={isDeleting}
    />
  );
});

const ExperienceHistoryScreen = () => {
  const insets = useSafeAreaInsets();
  const { data, isLoading } = useGetExperiences();
  const { mutateAsync: createExperience, isPending: isCreating } =
    useCreateExperience();
  const { mutateAsync: updateExperience, isPending: isUpdating } =
    useUpdateExperience();
  const { mutateAsync: deleteExperience, isPending: isDeleting } =
    useDeleteExperience();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const experiences = data ?? [];

  const closeCreateForm = useCallback(() => {
    setIsCreateOpen(false);
  }, []);

  const closeEditForm = useCallback(() => {
    setEditingId(null);
  }, []);

  const handleCreate = useCallback(
    async (values: ExperienceFormValues) => {
      try {
        await createExperience(toCreateExperiencePayload(values));
        closeCreateForm();
        toast.success({ title: 'Experience added.' });
      } catch {
        toast.error({ title: 'Failed to add experience. Please try again.' });
      }
    },
    [closeCreateForm, createExperience],
  );

  const handleEditStart = useCallback((item: IExperience) => {
    setEditingId(item.id);
  }, []);

  const handleEditSave = useCallback(
    async (id: string, values: ExperienceFormValues) => {
      try {
        await updateExperience({
          id,
          payload: toUpdateExperiencePayload(values),
        });
        closeEditForm();
        toast.success({ title: 'Experience updated.' });
      } catch {
        toast.error({
          title: 'Failed to update experience. Please try again.',
        });
      }
    },
    [closeEditForm, updateExperience],
  );

  const handleDelete = useCallback(
    (item: IExperience) => {
      Alert.alert(
        'Remove experience',
        `Delete ${item.title} at ${item.company}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Remove',
            style: 'destructive',
            onPress: async () => {
              try {
                await deleteExperience(item.id);
                if (editingId === item.id) {
                  closeEditForm();
                }
                toast.success({ title: 'Experience removed.' });
              } catch {
                toast.error({ title: 'Failed to remove experience.' });
              }
            },
          },
        ],
      );
    },
    [closeEditForm, deleteExperience, editingId],
  );

  const renderHeader = useMemo(() => {
    return (
      <View className="gap-4 px-5 pb-4 pt-2">
        <Header
          title="Experience"
          subtitle="Keep your history clear and up to date."
          variant="row"
          animate={false}
        />

        {isCreateOpen ? (
          <ExperienceForm
            initialValues={EMPTY_EXPERIENCE_FORM_VALUES}
            submitLabel="Add"
            onSubmit={handleCreate}
            onCancel={closeCreateForm}
            loading={isCreating}
          />
        ) : (
          <Button
            size="lg"
            variant="outline"
            className="flex-row gap-2"
            onPress={() => setIsCreateOpen(true)}
          >
            <Icons.Plus size={18} className="text-primary" />
            <Text className="font-subtitle text-primary">Add Experience</Text>
          </Button>
        )}

        {experiences.length > 0 ? (
          <Text className="font-caption uppercase tracking-wider text-muted-foreground">
            {experiences.length} {experiences.length === 1 ? 'Role' : 'Roles'}
          </Text>
        ) : null}
      </View>
    );
  }, [
    closeCreateForm,
    experiences.length,
    handleCreate,
    isCreateOpen,
    isCreating,
  ]);

  const renderRow = useCallback(
    ({ item }: { item: IExperience }) => (
      <View className="px-5 pb-3">
        <ExperienceRow
          item={item}
          editingId={editingId}
          onEditStart={handleEditStart}
          onEditSave={handleEditSave}
          onEditCancel={closeEditForm}
          onDelete={handleDelete}
          isUpdating={isUpdating}
          isDeleting={isDeleting}
        />
      </View>
    ),
    [
      closeEditForm,
      editingId,
      handleDelete,
      handleEditSave,
      handleEditStart,
      isDeleting,
      isUpdating,
    ],
  );

  const renderEmpty = useCallback(
    () => (
      <View className="px-5 pb-8">
        <View className="items-center gap-3 rounded-2xl border border-border/50 bg-card/50 p-6">
          <View className="rounded-full bg-muted/50 p-4">
            <Icons.Briefcase size={28} className="text-muted-foreground" />
          </View>
          <Text className="font-subbody text-center text-muted-foreground">
            Add your first role to show clients what you do best.
          </Text>
        </View>
      </View>
    ),
    [],
  );

  if (isLoading) return <Loading />;

  if (!data) {
    return (
      <NotFoundScreen
        title="Experiences"
        message="Unable to load experience history."
        actionLabel="Go Back"
        onAction={() => router.back()}
      />
    );
  }

  return (
    <View className="flex-1 bg-background">
      <FlashList
        data={experiences}
        keyExtractor={(item) => item.id}
        renderItem={renderRow}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        contentInset={{ bottom: insets.bottom + 24 }}
        scrollIndicatorInsets={{ bottom: insets.bottom + 24 }}
      />
    </View>
  );
};

export default ExperienceHistoryScreen;
