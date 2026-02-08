import React from 'react';
import { Pressable, View } from 'react-native';

import Icons from '@/components/icons';
import { Text } from '@/components/ui';

import type { IWorker } from '@/types/worker.type';

interface AboutSectionDisplayProps {
  worker?: IWorker;
  onEdit?: () => void;
  canEdit?: boolean;
}

export const AboutSectionDisplay: React.FC<AboutSectionDisplayProps> = ({
  worker,
  onEdit,
  canEdit = true,
}) => {
  return (
    <View className="px-6 mb-8">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <Text className="font-title text-lg text-foreground">About</Text>

        {canEdit && onEdit && (
          <Pressable onPress={onEdit}>
            <Icons.Pencil size={18} className="text-primary" />
          </Pressable>
        )}
      </View>

      {/* Content Card */}
      <View className="bg-card/50 backdrop-blur-xl rounded-2xl p-5 border border-border/50">
        {/* Job Title */}
        {worker?.jobTitle && (
          <Text className="font-subtitle text-foreground mb-3">
            {worker.jobTitle}
          </Text>
        )}

        {/* Bio */}
        <Text className="font-body text-muted-foreground leading-6 mb-5">
          {worker?.bio ||
            'Tell clients about your experience, style, and background.'}
        </Text>

        {/* Contact Info */}
        {(worker?.phone || worker?.email || worker?.instagram) && (
          <View className="mb-5 gap-3">
            {worker.phone && (
              <View className="flex-row items-center gap-2">
                <Icons.Phone size={16} className="text-muted-foreground" />
                <Text className="font-caption text-foreground">
                  {worker.phone}
                </Text>
              </View>
            )}

            {worker.email && (
              <View className="flex-row items-center gap-2">
                <Icons.Mail size={16} className="text-muted-foreground" />
                <Text className="font-caption text-foreground">
                  {worker.email}
                </Text>
              </View>
            )}

            {worker.instagram && (
              <View className="flex-row items-center gap-2">
                <Icons.Instagram size={16} className="text-muted-foreground" />
                <Text className="font-caption text-foreground">
                  @{worker.instagram.replace('@', '')}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Languages */}
        {worker?.languages?.length ? (
          <View>
            <Text className="font-caption text-muted-foreground mb-2">
              Languages
            </Text>

            <View className="flex-row flex-wrap gap-2">
              {worker.languages.map((language) => (
                <View
                  key={language}
                  className="bg-primary/10 px-4 py-2 rounded"
                >
                  <Text className="font-caption text-primary">{language}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <Text className="font-caption text-muted-foreground">
            Add languages to help clients connect with you.
          </Text>
        )}
      </View>
    </View>
  );
};
