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
  const hasContacts = worker?.phone || worker?.email || worker?.instagram;

  return (
    <View className="px-2 mb-8">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4 px-2">
        <Text className="font-title text-foreground">About</Text>

        {canEdit && onEdit && (
          <Pressable onPress={onEdit} className="flex-row items-center gap-1">
            <Text className="font-body text-primary">Edit</Text>
            <Icons.ChevronRight size={16} className="text-primary" />
          </Pressable>
        )}
      </View>

      {/* Grouped Card */}
      <View className="bg-card rounded-lg overflow-hidden">
        <View className="px-5 py-5">
          {/* Job Title */}
          {worker?.jobTitle ? (
            <Text className="font-title text-foreground mb-3">
              {worker.jobTitle}
            </Text>
          ) : null}

          {/* Bio */}
          <Text className="font-body text-muted-foreground">
            {worker?.bio ||
              'Tell clients about your experience, style, and background.'}
          </Text>
        </View>

        {hasContacts && <View className="h-px bg-border ml-5" />}

        {/* Contact Info */}
        {hasContacts ? (
          <View className="px-5 py-4 gap-3">
            {worker.phone && (
              <View className="flex-row items-center gap-2">
                <Icons.Phone size={16} className="text-muted-foreground" />
                <Text className="font-body text-foreground">
                  {worker.phone}
                </Text>
              </View>
            )}

            {worker.email && (
              <View className="flex-row items-center gap-2">
                <Icons.Mail size={16} className="text-muted-foreground" />
                <Text className="font-body text-foreground">
                  {worker.email}
                </Text>
              </View>
            )}

            {worker.instagram && (
              <View className="flex-row items-center gap-2">
                <Icons.Instagram size={16} className="text-muted-foreground" />
                <Text className="font-body text-foreground">
                  @{worker.instagram.replace('@', '')}
                </Text>
              </View>
            )}
          </View>
        ) : null}

        {worker?.languages?.length ? (
          <>
            <View className="h-px bg-border ml-5" />

            <View className="px-5 py-4">
              <Text className="font-caption text-muted-foreground mb-3">
                Languages
              </Text>

              <View className="flex-row flex-wrap gap-2">
                {worker.languages.map((language) => (
                  <View
                    key={language}
                    className="bg-primary/10 px-3 py-1.5 rounded-full"
                  >
                    <Text className="font-caption text-primary">
                      {language}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </>
        ) : (
          <>
            <View className="h-px bg-border ml-5" />
            <View className="px-5 py-4">
              <Text className="font-caption text-muted-foreground">
                Add languages to help clients connect with you.
              </Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
};
