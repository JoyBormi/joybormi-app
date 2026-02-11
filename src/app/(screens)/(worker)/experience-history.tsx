import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import React, { memo, useCallback, useMemo, useState } from 'react';
import { Alert, Pressable, Switch, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Icons from '@/components/icons';
import { Header } from '@/components/shared/header';
import { Loading, NotFoundScreen } from '@/components/status-screens';
import { Button, Input, Text } from '@/components/ui';
import {
  useCreateExperience,
  useDeleteExperience,
  useGetExperiences,
  useUpdateExperience,
} from '@/hooks/worker';
import { toast } from '@/providers/toaster';

import type {
  CreateExperiencePayload,
  IExperience,
  UpdateExperiencePayload,
} from '@/types/experience.type';

type ExperienceDraft = CreateExperiencePayload;

const EMPTY_DRAFT: ExperienceDraft = {
  company: '',
  title: '',
  startDate: '',
  endDate: '',
  isCurrent: false,
};

const FORM_CARD = 'rounded-2xl border border-primary/20 bg-primary/5 p-5 gap-4';
const BASE_INPUT = 'text-sm';

const formatRange = (experience: IExperience) => {
  const start = experience.startDate?.slice(0, 7) ?? '';
  const end = experience.isCurrent
    ? 'Present'
    : (experience.endDate?.slice(0, 7) ?? '');

  return `${start}${end ? ` - ${end}` : ''}`;
};

const mapExperienceToDraft = (experience: IExperience): ExperienceDraft => ({
  company: experience.company ?? '',
  title: experience.title ?? '',
  startDate: experience.startDate?.slice(0, 10) ?? '',
  endDate: experience.endDate?.slice(0, 10) ?? '',
  isCurrent: experience.isCurrent,
});

const sanitizeDraft = (draft: ExperienceDraft): ExperienceDraft => ({
  company: draft.company.trim(),
  title: draft.title.trim(),
  startDate: draft.startDate.trim(),
  endDate: draft.isCurrent ? '' : draft.endDate?.trim(),
  isCurrent: draft.isCurrent,
});

const validateDraft = (rawDraft: ExperienceDraft) => {
  const draft = sanitizeDraft(rawDraft);
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;

  if (!draft.title) return 'Job title is required.';
  if (!draft.company) return 'Company is required.';
  if (!draft.startDate) return 'Start date is required.';
  if (!datePattern.test(draft.startDate)) {
    return 'Start date must use YYYY-MM-DD.';
  }

  if (!draft.isCurrent) {
    if (!draft.endDate) return 'End date is required unless current.';
    if (!datePattern.test(draft.endDate)) {
      return 'End date must use YYYY-MM-DD.';
    }
    if (draft.endDate < draft.startDate) {
      return 'End date cannot be earlier than start date.';
    }
  }

  return null;
};

type DraftUpdater = (
  updater: (prev: ExperienceDraft) => ExperienceDraft,
) => void;

interface ExperienceFormProps {
  draft: ExperienceDraft;
  onChange: DraftUpdater;
  submitLabel: string;
  onSubmit: () => void;
  onCancel: () => void;
  loading: boolean;
}

const ExperienceForm = memo(function ExperienceForm({
  draft,
  onChange,
  submitLabel,
  onSubmit,
  onCancel,
  loading,
}: ExperienceFormProps) {
  return (
    <View className={FORM_CARD}>
      <View className="flex-row items-center gap-2">
        <View className="rounded-full bg-primary/10 p-2">
          <Icons.Briefcase size={16} className="text-primary" />
        </View>
        <Text className="font-subtitle text-foreground">{submitLabel}</Text>
      </View>

      <View className="gap-3">
        <Input
          placeholder="Job title"
          value={draft.title}
          onChangeText={(value) =>
            onChange((prev) => ({ ...prev, title: value }))
          }
          className={BASE_INPUT}
          returnKeyType="next"
        />
        <Input
          placeholder="Company"
          value={draft.company}
          onChangeText={(value) =>
            onChange((prev) => ({ ...prev, company: value }))
          }
          className={BASE_INPUT}
          returnKeyType="next"
        />

        <View className="flex-row gap-3">
          <View className="flex-1">
            <Input
              placeholder="Start (YYYY-MM-DD)"
              value={draft.startDate}
              onChangeText={(value) =>
                onChange((prev) => ({ ...prev, startDate: value }))
              }
              keyboardType="numbers-and-punctuation"
              autoCapitalize="none"
              className={BASE_INPUT}
            />
          </View>
          <View className="flex-1">
            <Input
              placeholder="End (YYYY-MM-DD)"
              value={draft.endDate}
              editable={!draft.isCurrent}
              onChangeText={(value) =>
                onChange((prev) => ({ ...prev, endDate: value }))
              }
              keyboardType="numbers-and-punctuation"
              autoCapitalize="none"
              className={BASE_INPUT}
            />
          </View>
        </View>

        <Pressable
          onPress={() =>
            onChange((prev) => ({
              ...prev,
              isCurrent: !prev.isCurrent,
              endDate: !prev.isCurrent ? '' : prev.endDate,
            }))
          }
          className="flex-row items-center justify-between rounded-xl border border-border/50 bg-background/60 px-4 py-3"
        >
          <Text className="mr-3 flex-1 text-sm text-foreground">
            I currently work here
          </Text>
          <Switch
            value={draft.isCurrent}
            onValueChange={(value) =>
              onChange((prev) => ({
                ...prev,
                isCurrent: value,
                endDate: value ? '' : prev.endDate,
              }))
            }
          />
        </Pressable>
      </View>

      <View className="mt-1 flex-row gap-2">
        <Button
          size="lg"
          className="flex-1"
          onPress={onSubmit}
          loading={loading}
        >
          <Text>{submitLabel}</Text>
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="flex-1"
          onPress={onCancel}
        >
          <Text>Cancel</Text>
        </Button>
      </View>
    </View>
  );
});

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
          <Text className="text-sm text-muted-foreground">{item.company}</Text>

          <View className="mt-1 flex-row items-center gap-1.5">
            <Icons.Calendar size={12} className="text-muted-foreground" />
            <Text className="text-xs text-muted-foreground">
              {formatRange(item)}
            </Text>
            {item.isCurrent ? (
              <View className="ml-1 rounded-full bg-primary/10 px-2 py-0.5">
                <Text className="text-[10px] font-subtitle text-primary">
                  Current
                </Text>
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
          <Text className="text-xs font-subtitle text-muted-foreground">
            Edit
          </Text>
        </Pressable>

        <Pressable
          onPress={() => onDelete(item)}
          disabled={isDeleting}
          className="flex-row items-center gap-1 rounded-lg bg-destructive/10 px-3 py-1.5"
        >
          <Icons.Trash2 size={13} className="text-destructive" />
          <Text className="text-xs font-subtitle text-destructive">Remove</Text>
        </Pressable>
      </View>
    </View>
  );
});

interface ExperienceRowProps {
  item: IExperience;
  editingId: string | null;
  editingDraft: ExperienceDraft;
  onEditStart: (item: IExperience) => void;
  onEditChange: DraftUpdater;
  onEditSave: () => void;
  onEditCancel: () => void;
  onDelete: (item: IExperience) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

const ExperienceRow = memo(function ExperienceRow({
  item,
  editingId,
  editingDraft,
  onEditStart,
  onEditChange,
  onEditSave,
  onEditCancel,
  onDelete,
  isUpdating,
  isDeleting,
}: ExperienceRowProps) {
  if (editingId === item.id) {
    return (
      <ExperienceForm
        draft={editingDraft}
        onChange={onEditChange}
        submitLabel="Save Changes"
        onSubmit={onEditSave}
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
  const [draft, setDraft] = useState<ExperienceDraft>(EMPTY_DRAFT);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingDraft, setEditingDraft] =
    useState<ExperienceDraft>(EMPTY_DRAFT);

  const experiences = data ?? [];

  const closeCreateForm = useCallback(() => {
    setIsCreateOpen(false);
    setDraft(EMPTY_DRAFT);
  }, []);

  const closeEditForm = useCallback(() => {
    setEditingId(null);
    setEditingDraft(EMPTY_DRAFT);
  }, []);

  const handleCreate = useCallback(async () => {
    const validationError = validateDraft(draft);
    if (validationError) {
      toast.error({ title: validationError });
      return;
    }

    const sanitized = sanitizeDraft(draft);

    try {
      await createExperience({
        company: sanitized.company,
        title: sanitized.title,
        startDate: sanitized.startDate,
        endDate: sanitized.isCurrent ? undefined : sanitized.endDate,
        isCurrent: sanitized.isCurrent,
      });

      closeCreateForm();
      toast.success({ title: 'Experience added.' });
    } catch {
      toast.error({ title: 'Failed to add experience. Please try again.' });
    }
  }, [closeCreateForm, createExperience, draft]);

  const handleEditStart = useCallback((item: IExperience) => {
    setEditingId(item.id);
    setEditingDraft(mapExperienceToDraft(item));
  }, []);

  const handleEditSave = useCallback(async () => {
    if (!editingId) return;

    const validationError = validateDraft(editingDraft);
    if (validationError) {
      toast.error({ title: validationError });
      return;
    }

    const sanitized = sanitizeDraft(editingDraft);
    const payload: UpdateExperiencePayload = {
      company: sanitized.company,
      title: sanitized.title,
      startDate: sanitized.startDate,
      isCurrent: sanitized.isCurrent,
      endDate: sanitized.isCurrent ? null : sanitized.endDate,
    };

    try {
      await updateExperience({ id: editingId, payload });
      closeEditForm();
      toast.success({ title: 'Experience updated.' });
    } catch {
      toast.error({ title: 'Failed to update experience. Please try again.' });
    }
  }, [closeEditForm, editingDraft, editingId, updateExperience]);

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
            draft={draft}
            onChange={setDraft}
            submitLabel="Add Experience"
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
          <Text className="text-xs font-subtitle uppercase tracking-wider text-muted-foreground">
            {experiences.length} {experiences.length === 1 ? 'Role' : 'Roles'}
          </Text>
        ) : null}
      </View>
    );
  }, [
    closeCreateForm,
    draft,
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
          editingDraft={editingDraft}
          onEditStart={handleEditStart}
          onEditChange={setEditingDraft}
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
      editingDraft,
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
          <Text className="text-center text-sm text-muted-foreground">
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
