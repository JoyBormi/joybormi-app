import { router } from 'expo-router';
import React from 'react';
import { Pressable, View } from 'react-native';

import Icons from '@/components/icons';
import { Button, Text } from '@/components/ui';
import { routes } from '@/constants/routes';

import type { IExperience } from '@/types/experience.type';

interface ExperiencePreviewProps {
  experiences?: IExperience[];
  canEdit?: boolean;
}

const formatRange = (exp: IExperience) => {
  const start = exp.startDate?.slice(0, 7) ?? '';
  const end = exp.isCurrent ? 'Present' : (exp.endDate?.slice(0, 7) ?? '');
  return `${start}${end ? ` — ${end}` : ''}`;
};

export const ExperiencePreview: React.FC<ExperiencePreviewProps> = ({
  experiences,
  canEdit = false,
}) => {
  const list = experiences ?? [];

  return (
    <View className="px-6">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="font-title text-lg text-foreground">Experience</Text>
        {canEdit && (
          <Pressable
            onPress={() => router.push(routes.worker.experience_history)}
            className="flex-row items-center gap-1"
          >
            <Text className="font-subtitle text-sm text-primary">
              {list.length > 0 ? 'Manage' : 'Add'}
            </Text>
            <Icons.ChevronRight size={16} className="text-primary" />
          </Pressable>
        )}
      </View>

      {list.length === 0 ? (
        <View className="rounded-2xl border border-border/60 bg-card/60 p-5 items-center gap-3">
          <View className="bg-muted/50 rounded-full p-3">
            <Icons.Briefcase size={24} className="text-muted-foreground" />
          </View>
          <Text className="text-sm text-muted-foreground text-center">
            Add your work history to build trust with clients.
          </Text>
          {canEdit && (
            <Button
              size="sm"
              variant="outline"
              onPress={() => router.push(routes.worker.experience_history)}
            >
              <Text>Add Experience</Text>
            </Button>
          )}
        </View>
      ) : (
        <View className="gap-3">
          {list.slice(0, 3).map((exp) => (
            <View
              key={exp.id}
              className="rounded-2xl border border-border/60 bg-card/60 p-4 gap-1"
            >
              <Text className="font-subtitle text-foreground">{exp.title}</Text>
              <Text className="text-sm text-muted-foreground">
                {exp.company}
              </Text>
              <View className="flex-row items-center gap-1.5 mt-1">
                <Icons.Calendar size={12} className="text-muted-foreground" />
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
          ))}
          {list.length > 3 && (
            <Pressable
              onPress={() => router.push(routes.worker.experience_history)}
              className="flex-row items-center justify-center gap-1 py-2"
            >
              <Text className="text-sm font-subtitle text-primary">
                View all {list.length} experiences
              </Text>
              <Icons.ChevronRight size={14} className="text-primary" />
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
};
