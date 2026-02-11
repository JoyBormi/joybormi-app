import dayjs from 'dayjs';
import { router } from 'expo-router';
import React, { Fragment } from 'react';
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
  const start = exp.startDate ? dayjs(exp.startDate).format('MM/YYYY') : '';

  const end = exp.isCurrent
    ? 'Present'
    : exp.endDate
      ? dayjs(exp.endDate).format('MM/YYYY')
      : '';

  return end ? `${start} — ${end}` : start;
};

export const ExperiencePreview: React.FC<ExperiencePreviewProps> = ({
  experiences,
  canEdit = false,
}) => {
  const list = experiences ?? [];

  return (
    <Fragment>
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4 px-4">
        <Text className="font-title text-foreground">Experience</Text>

        {canEdit && (
          <Pressable
            onPress={() => router.push(routes.worker.experience_history)}
            className="flex-row items-center gap-1"
          >
            <Text className="font-body text-primary">
              {list.length > 0 ? 'Edit' : 'Add'}
            </Text>
            <Icons.ChevronRight size={16} className="text-primary" />
          </Pressable>
        )}
      </View>

      <View className="px-2">
        {list.length === 0 ? (
          <View className="bg-card rounded-lg p-6 items-center gap-3">
            <View className="bg-muted/40 rounded-full p-4">
              <Icons.Briefcase size={24} className="text-muted-foreground" />
            </View>

            <Text className="font-body text-muted-foreground text-center">
              Add your work history to build trust with clients.
            </Text>

            {canEdit && (
              <Button
                size="sm"
                variant="secondary"
                onPress={() => router.push(routes.worker.experience_history)}
              >
                <Text>Add Experience</Text>
              </Button>
            )}
          </View>
        ) : (
          <View className="bg-card rounded-lg overflow-hidden">
            {list.slice(0, 3).map((exp, index) => (
              <View key={exp.id}>
                <View className="px-5 py-4">
                  <Text className="font-title text-foreground">
                    {exp.title}
                  </Text>

                  <Text className="font-body text-muted-foreground mt-0.5">
                    {exp.company}
                  </Text>

                  <View className="flex-row items-center gap-2 mt-2">
                    <Icons.Calendar
                      size={14}
                      className="text-muted-foreground"
                    />
                    <Text className="font-caption text-muted-foreground">
                      {formatRange(exp)}
                    </Text>

                    {exp.isCurrent && (
                      <View className="ml-1 px-2 py-0.5 rounded-full bg-primary/10">
                        <Text className="font-base text-primary">Current</Text>
                      </View>
                    )}
                  </View>
                </View>

                {index !== Math.min(list.length, 3) - 1 && (
                  <View className="h-px bg-border ml-5" />
                )}
              </View>
            ))}

            {list.length > 3 && (
              <Pressable
                onPress={() => router.push(routes.worker.experience_history)}
                className="px-5 py-3 flex-row items-center justify-center gap-1"
              >
                <Text className="font-body text-primary">
                  View all {list.length} experiences
                </Text>
                <Icons.ChevronRight size={14} className="text-primary" />
              </Pressable>
            )}
          </View>
        )}
      </View>
    </Fragment>
  );
};
