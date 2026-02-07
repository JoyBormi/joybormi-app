import React, { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';

import Icons from '@/components/icons';
import { Text } from '@/components/ui';
import { AnimatedProgress } from '@/components/ui/progress';

type MissingAction = { label: string; onPress: () => void };

export type MissingItem = {
  id: string;
  title: string;
  description: string;
  icon: typeof Icons.User;
  action?: MissingAction;
  secondaryAction?: MissingAction;
};

type MissingStep = { label: string; complete: boolean };

type ProfileMissingProps = {
  canEdit: boolean;
  steps: MissingStep[];
  items: MissingItem[];
  title?: string;
  summaryText?: string;
  filterIds?: string[];
  variant?: 'full' | 'inline';
  expandAll?: boolean;
};

export const ProfileMissing: React.FC<ProfileMissingProps> = ({
  canEdit,
  steps,
  items,
  title = 'Profile setup',
  summaryText,
  filterIds,
  variant = 'full',
  expandAll = false,
}) => {
  const [expanded, setExpanded] = useState(expandAll);

  const profileCompletion = useMemo(() => {
    const completedCount = steps.filter((step) => step.complete).length;
    return {
      completedCount,
      total: steps.length,
    };
  }, [steps]);

  const filteredItems = useMemo(() => {
    if (!filterIds || filterIds.length === 0) return items;
    return items.filter((item) => filterIds.includes(item.id));
  }, [filterIds, items]);

  if (!canEdit || filteredItems.length === 0) return null;

  const cards = (
    <View className="gap-3">
      {filteredItems.map((item) => (
        <View
          key={item.id}
          className="bg-card/70 rounded-2xl border border-border/50 p-4"
        >
          <View className="flex-row items-start gap-3">
            <View className="h-10 w-10 rounded-xl bg-primary/10 items-center justify-center">
              <item.icon size={18} className="text-primary" />
            </View>
            <View className="flex-1">
              <Text className="font-subtitle text-foreground">
                {item.title}
              </Text>
              <Text className="font-caption text-muted-foreground mt-1">
                {item.description}
              </Text>
              {(item.action || item.secondaryAction) && (
                <View className="flex-row flex-wrap gap-2 mt-3">
                  {item.action && (
                    <Pressable
                      onPress={item.action.onPress}
                      className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30"
                    >
                      <Text className="text-primary font-caption">
                        {item.action.label}
                      </Text>
                    </Pressable>
                  )}
                  {item.secondaryAction && (
                    <Pressable
                      onPress={item.secondaryAction.onPress}
                      className="px-4 py-1.5 rounded-full bg-muted/40 border border-border/60"
                    >
                      <Text className="text-muted-foreground font-caption">
                        {item.secondaryAction.label}
                      </Text>
                    </Pressable>
                  )}
                </View>
              )}
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  if (variant === 'inline') {
    return <View className="px-6 mb-6">{cards}</View>;
  }

  return (
    <View className="px-6 mb-8">
      <View className="flex-row items-center justify-between">
        <Text className="font-title text-lg text-foreground">{title}</Text>
        <Pressable
          onPress={() => setExpanded(!expanded)}
          className="flex-row items-center gap-1"
          aria-expanded={expanded}
          data-expanded={expanded}
        >
          {expanded ? (
            <Icons.ChevronUp
              size={18}
              className="text-muted-foreground stroke-1.5"
            />
          ) : (
            <Icons.ChevronDown
              size={18}
              className="text-muted-foreground stroke-1.5"
            />
          )}
          <Text className="font-caption text-muted-foreground">
            {profileCompletion.completedCount}/{profileCompletion.total}
          </Text>
        </Pressable>
      </View>
      <View className="mt-3 h-3 rounded-full bg-muted/80 overflow-hidden">
        <AnimatedProgress
          currentStep={profileCompletion.completedCount}
          totalSteps={profileCompletion.total}
        />
      </View>
      {summaryText && (
        <Text className="font-caption text-muted-foreground mt-2">
          {summaryText}
        </Text>
      )}
      {expanded && (
        <View className="mt-5 gap-3">
          <View className="flex-row items-center justify-between">
            <Text className="font-subtitle text-foreground">
              Missing pieces
            </Text>
            <Text className="font-caption text-muted-foreground">
              {filteredItems.length} left
            </Text>
          </View>
          {cards}
        </View>
      )}
    </View>
  );
};
