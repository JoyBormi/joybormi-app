import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, Switch, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
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

const blankDraft: ExperienceDraft = {
  company: '',
  title: '',
  startDate: '',
  endDate: '',
  isCurrent: false,
};

const formatRange = (exp: IExperience) => {
  const start = exp.startDate?.slice(0, 7) ?? '';
  const end = exp.isCurrent ? 'Present' : (exp.endDate?.slice(0, 7) ?? '');
  return `${start}${end ? ` — ${end}` : ''}`;
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

/* ─── Reusable form fields ─── */
interface ExperienceFormProps {
  draft: ExperienceDraft;
  onChange: (updater: (prev: ExperienceDraft) => ExperienceDraft) => void;
}

const ExperienceFormFields: React.FC<ExperienceFormProps> = ({
  draft,
  onChange,
}) => (
  <View className="gap-3">
    <Input
      placeholder="Job title"
      value={draft.title}
      onChangeText={(v) => onChange((p) => ({ ...p, title: v }))}
    />
    <Input
      placeholder="Company"
      value={draft.company}
      onChangeText={(v) => onChange((p) => ({ ...p, company: v }))}
    />
    <View className="flex-row gap-3">
      <View className="flex-1">
        <Input
          placeholder="Start (YYYY-MM-DD)"
          value={draft.startDate}
          onChangeText={(v) => onChange((p) => ({ ...p, startDate: v }))}
        />
      </View>
      <View className="flex-1">
        <Input
          placeholder="End (YYYY-MM-DD)"
          value={draft.endDate}
          editable={!draft.isCurrent}
          onChangeText={(v) => onChange((p) => ({ ...p, endDate: v }))}
        />
      </View>
    </View>
    <Pressable
      onPress={() =>
        onChange((p) => ({
          ...p,
          isCurrent: !p.isCurrent,
          endDate: !p.isCurrent ? '' : p.endDate,
        }))
      }
      className="flex-row items-center justify-between rounded-xl border border-border/50 bg-background/60 px-4 py-3"
    >
      <View className="flex-1 mr-3">
        <Text className="text-sm text-foreground">I currently work here</Text>
      </View>
      <Switch
        value={draft.isCurrent}
        onValueChange={(v) =>
          onChange((p) => ({
            ...p,
            isCurrent: v,
            endDate: v ? '' : p.endDate,
          }))
        }
      />
    </Pressable>
  </View>
);

/* ─── Main screen ─── */
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
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingDraft, setEditingDraft] = useState<ExperienceDraft>(blankDraft);

  const experiences = useMemo(() => data ?? [], [data]);

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
    setShowForm(false);
    toast.success({ title: 'Experience added' });
  };

  const handleEditStart = (exp: IExperience) => {
    setEditingId(exp.id);
    setEditingDraft({
      company: exp.company ?? '',
      title: exp.title ?? '',
      startDate: exp.startDate?.slice(0, 10) ?? '',
      endDate: exp.endDate?.slice(0, 10) ?? '',
      isCurrent: exp.isCurrent,
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
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
      >
        <View className="px-5 pt-2">
          <Header
            title="Experience"
            subtitle="Manage your professional history."
            variant="row"
            animate={false}
          />
        </View>

        {/* ── Add new ── */}
        <View className="px-5 pt-4 pb-2">
          {showForm ? (
            <View className="rounded-2xl border border-primary/20 bg-primary/5 p-5 gap-4">
              <View className="flex-row items-center gap-2">
                <View className="bg-primary/10 rounded-full p-2">
                  <Icons.Plus size={16} className="text-primary" />
                </View>
                <Text className="font-subtitle text-foreground">
                  New Experience
                </Text>
              </View>

              <ExperienceFormFields draft={draft} onChange={setDraft} />

              <View className="flex-row gap-2 mt-1">
                <Button
                  size="lg"
                  className="flex-1"
                  onPress={handleCreate}
                  loading={isCreating}
                >
                  <Text>Save</Text>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1"
                  onPress={() => {
                    setShowForm(false);
                    setDraft(blankDraft);
                  }}
                >
                  <Text>Cancel</Text>
                </Button>
              </View>
            </View>
          ) : (
            <Button
              size="lg"
              variant="outline"
              className="flex-row gap-2"
              onPress={() => setShowForm(true)}
            >
              <Icons.Plus size={18} className="text-primary" />
              <Text className="text-primary font-subtitle">Add Experience</Text>
            </Button>
          )}
        </View>

        {/* ── List ── */}
        <View className="px-5 pt-4 pb-6">
          {experiences.length === 0 ? (
            <View className="rounded-2xl border border-border/50 bg-card/50 p-6 items-center gap-3">
              <View className="bg-muted/50 rounded-full p-4">
                <Icons.Briefcase size={28} className="text-muted-foreground" />
              </View>
              <Text className="text-sm text-muted-foreground text-center">
                No experience yet. Add your first role to build trust with
                clients.
              </Text>
            </View>
          ) : (
            <View className="gap-3">
              <Text className="font-subtitle text-muted-foreground text-xs uppercase tracking-wider">
                {experiences.length}{' '}
                {experiences.length === 1 ? 'Role' : 'Roles'}
              </Text>

              {experiences.map((exp) => {
                const isEditing = editingId === exp.id;

                if (isEditing) {
                  return (
                    <View
                      key={exp.id}
                      className="rounded-2xl border border-primary/20 bg-primary/5 p-5 gap-4"
                    >
                      <ExperienceFormFields
                        draft={editingDraft}
                        onChange={setEditingDraft}
                      />
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
                  );
                }

                return (
                  <View
                    key={exp.id}
                    className="rounded-2xl border border-border/60 bg-card/70 p-4"
                  >
                    <View className="flex-row gap-3">
                      <View className="bg-muted/40 rounded-xl p-2.5 self-start mt-0.5">
                        <Icons.Briefcase
                          size={18}
                          className="text-muted-foreground"
                        />
                      </View>
                      <View className="flex-1 gap-0.5">
                        <Text className="font-subtitle text-foreground">
                          {exp.title}
                        </Text>
                        <Text className="text-sm text-muted-foreground">
                          {exp.company}
                        </Text>
                        <View className="flex-row items-center gap-1.5 mt-1">
                          <Icons.Calendar
                            size={12}
                            className="text-muted-foreground"
                          />
                          <Text className="text-xs text-muted-foreground">
                            {formatRange(exp)}
                          </Text>
                          {exp.isCurrent && (
                            <View className="bg-primary/10 rounded-full px-2 py-0.5 ml-1">
                              <Text className="text-[10px] font-subtitle text-primary">
                                Current
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>

                    <View className="flex-row gap-2 mt-3 pl-11">
                      <Pressable
                        onPress={() => handleEditStart(exp)}
                        className="flex-row items-center gap-1 px-3 py-1.5 rounded-lg bg-muted/40"
                      >
                        <Icons.Pencil
                          size={13}
                          className="text-muted-foreground"
                        />
                        <Text className="text-xs font-subtitle text-muted-foreground">
                          Edit
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={() => deleteExperience(exp.id)}
                        disabled={isDeleting}
                        className="flex-row items-center gap-1 px-3 py-1.5 rounded-lg bg-destructive/10"
                      >
                        <Icons.Trash2 size={13} className="text-destructive" />
                        <Text className="text-xs font-subtitle text-destructive">
                          Remove
                        </Text>
                      </Pressable>
                    </View>
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
