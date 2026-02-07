import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Switch, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

const blankDraft: ExperienceDraft = {
  company: '',
  title: '',
  startDate: '',
  endDate: '',
  isCurrent: false,
};

const formatRange = (experience: IExperience) => {
  const start = experience.startDate?.slice(0, 10) ?? '';
  const end = experience.isCurrent
    ? 'Present'
    : (experience.endDate?.slice(0, 10) ?? '');
  return `${start}${end ? ` • ${end}` : ''}`;
};

const validateDraft = (draft: ExperienceDraft) => {
  if (!draft.company.trim()) return 'Company is required.';
  if (!draft.title.trim()) return 'Title is required.';
  if (!draft.startDate.trim()) return 'Start date is required.';
  if (!draft.isCurrent && !draft.endDate?.trim()) {
    return 'End date is required unless current.';
  }
  return null;
};

const ExperienceHistoryScreen = () => {
  const insets = useSafeAreaInsets();
  const { data, isLoading } = useGetExperiences();
  const { mutateAsync: createExperience, isPending: isCreating } =
    useCreateExperience();
  const { mutateAsync: updateExperience, isPending: isUpdating } =
    useUpdateExperience();
  const { mutateAsync: deleteExperience, isPending: isDeleting } =
    useDeleteExperience();

  const [draft, setDraft] = useState<ExperienceDraft>(blankDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingDraft, setEditingDraft] = useState<ExperienceDraft>(blankDraft);

  const experiences = useMemo(() => data ?? [], [data]);

  if (isLoading) return <Loading />;

  if (!experiences) {
    return (
      <NotFoundScreen
        title="Experiences"
        message="Unable to load experience history."
        actionLabel="Go Back"
        onAction={() => router.back()}
      />
    );
  }

  const handleCreate = async () => {
    const error = validateDraft(draft);
    if (error) {
      toast.error({ title: error });
      return;
    }

    await createExperience({
      company: draft.company.trim(),
      title: draft.title.trim(),
      startDate: draft.startDate.trim(),
      endDate: draft.isCurrent ? undefined : draft.endDate?.trim(),
      isCurrent: draft.isCurrent,
    });
    setDraft(blankDraft);
    toast.success({ title: 'Experience added' });
  };

  const handleEditStart = (experience: IExperience) => {
    setEditingId(experience.id);
    setEditingDraft({
      company: experience.company ?? '',
      title: experience.title ?? '',
      startDate: experience.startDate?.slice(0, 10) ?? '',
      endDate: experience.endDate?.slice(0, 10) ?? '',
      isCurrent: experience.isCurrent,
    });
  };

  const handleEditSave = async () => {
    if (!editingId) return;
    const error = validateDraft(editingDraft);
    if (error) {
      toast.error({ title: error });
      return;
    }

    const payload: UpdateExperiencePayload = {
      company: editingDraft.company.trim(),
      title: editingDraft.title.trim(),
      startDate: editingDraft.startDate.trim(),
      isCurrent: editingDraft.isCurrent,
      endDate: editingDraft.isCurrent ? null : editingDraft.endDate?.trim(),
    };

    await updateExperience({ id: editingId, payload });
    setEditingId(null);
    toast.success({ title: 'Experience updated' });
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 40,
        }}
      >
        <View className="px-5 pt-2">
          <Header
            title="Experience"
            subtitle="Add your professional experience history."
            variant="row"
            animate={false}
          />
        </View>

        <View className="px-5 pt-4 pb-6">
          <View className="rounded-2xl border border-border/60 bg-card/70 p-4">
            <Text className="font-subtitle text-foreground">
              Add Experience
            </Text>
            <Text className="mt-1 text-xs text-muted-foreground">
              Dates should be in YYYY-MM-DD format.
            </Text>

            <View className="mt-4 gap-3">
              <Input
                placeholder="Company"
                value={draft.company}
                onChangeText={(value) =>
                  setDraft((prev) => ({ ...prev, company: value }))
                }
              />
              <Input
                placeholder="Title"
                value={draft.title}
                onChangeText={(value) =>
                  setDraft((prev) => ({ ...prev, title: value }))
                }
              />
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <Input
                    placeholder="Start (YYYY-MM-DD)"
                    value={draft.startDate}
                    onChangeText={(value) =>
                      setDraft((prev) => ({ ...prev, startDate: value }))
                    }
                  />
                </View>
                <View className="flex-1">
                  <Input
                    placeholder="End (YYYY-MM-DD)"
                    value={draft.endDate}
                    editable={!draft.isCurrent}
                    onChangeText={(value) =>
                      setDraft((prev) => ({ ...prev, endDate: value }))
                    }
                  />
                </View>
              </View>
              <View className="flex-row items-center justify-between rounded-xl border border-border/50 bg-background/70 px-3 py-3">
                <View>
                  <Text className="text-sm text-foreground">Current role</Text>
                  <Text className="text-xs text-muted-foreground">
                    Toggle if you currently work here.
                  </Text>
                </View>
                <Switch
                  value={draft.isCurrent}
                  onValueChange={(value) =>
                    setDraft((prev) => ({
                      ...prev,
                      isCurrent: value,
                      endDate: value ? '' : prev.endDate,
                    }))
                  }
                />
              </View>
              <Button size="lg" onPress={handleCreate} loading={isCreating}>
                <Text>Add Experience</Text>
              </Button>
            </View>
          </View>
        </View>

        <View className="px-5 pb-6">
          <Text className="font-title text-foreground mb-3">
            Experience history
          </Text>
          {experiences.length === 0 ? (
            <View className="rounded-2xl border border-border/50 bg-card/50 p-4">
              <Text className="text-sm text-muted-foreground">
                No experience yet. Add your first role above.
              </Text>
            </View>
          ) : (
            <View className="gap-3">
              {experiences.map((experience) => {
                const isEditing = editingId === experience.id;
                return (
                  <View
                    key={experience.id}
                    className="rounded-2xl border border-border/60 bg-card/70 p-4"
                  >
                    {isEditing ? (
                      <View className="gap-3">
                        <Input
                          placeholder="Company"
                          value={editingDraft.company}
                          onChangeText={(value) =>
                            setEditingDraft((prev) => ({
                              ...prev,
                              company: value,
                            }))
                          }
                        />
                        <Input
                          placeholder="Title"
                          value={editingDraft.title}
                          onChangeText={(value) =>
                            setEditingDraft((prev) => ({
                              ...prev,
                              title: value,
                            }))
                          }
                        />
                        <View className="flex-row gap-3">
                          <View className="flex-1">
                            <Input
                              placeholder="Start (YYYY-MM-DD)"
                              value={editingDraft.startDate}
                              onChangeText={(value) =>
                                setEditingDraft((prev) => ({
                                  ...prev,
                                  startDate: value,
                                }))
                              }
                            />
                          </View>
                          <View className="flex-1">
                            <Input
                              placeholder="End (YYYY-MM-DD)"
                              value={editingDraft.endDate}
                              editable={!editingDraft.isCurrent}
                              onChangeText={(value) =>
                                setEditingDraft((prev) => ({
                                  ...prev,
                                  endDate: value,
                                }))
                              }
                            />
                          </View>
                        </View>
                        <View className="flex-row items-center justify-between rounded-xl border border-border/50 bg-background/70 px-3 py-3">
                          <View>
                            <Text className="text-sm text-foreground">
                              Current role
                            </Text>
                            <Text className="text-xs text-muted-foreground">
                              Toggle if you currently work here.
                            </Text>
                          </View>
                          <Switch
                            value={editingDraft.isCurrent}
                            onValueChange={(value) =>
                              setEditingDraft((prev) => ({
                                ...prev,
                                isCurrent: value,
                                endDate: value ? '' : prev.endDate,
                              }))
                            }
                          />
                        </View>
                        <View className="flex-row gap-2">
                          <Button
                            size="lg"
                            className="flex-1"
                            onPress={handleEditSave}
                            loading={isUpdating}
                          >
                            <Text>Save</Text>
                          </Button>
                          <Button
                            size="lg"
                            variant="outline"
                            className="flex-1"
                            onPress={() => setEditingId(null)}
                          >
                            <Text>Cancel</Text>
                          </Button>
                        </View>
                      </View>
                    ) : (
                      <View className="gap-2">
                        <View>
                          <Text className="font-subtitle text-foreground">
                            {experience.title}
                          </Text>
                          <Text className="text-sm text-muted-foreground">
                            {experience.company}
                          </Text>
                        </View>
                        <Text className="text-xs text-muted-foreground">
                          {formatRange(experience)}
                        </Text>
                        <View className="flex-row gap-2 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onPress={() => handleEditStart(experience)}
                          >
                            <Text>Edit</Text>
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="flex-1"
                            onPress={() => deleteExperience(experience.id)}
                            disabled={isDeleting}
                          >
                            <Text>Delete</Text>
                          </Button>
                        </View>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default ExperienceHistoryScreen;
