import CustomBottomSheet from '@/components/shared/bottom-sheet';
import { Feedback } from '@/lib/haptics';
import Icons from '@/lib/icons';
import { cn } from '@/lib/utils';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { forwardRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UserType } from './types';

interface UserTypeSheetProps {
  currentType: UserType;
  onSelect: (type: UserType) => void;
  onClose: () => void;
}

const USER_TYPES: {
  type: UserType;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}[] = [
  {
    type: 'user',
    title: 'User',
    description: 'Book services and manage appointments',
    icon: Icons.User,
    color: 'text-blue-500',
  },
  {
    type: 'creator',
    title: 'Creator',
    description: 'Manage your brand and services',
    icon: Icons.Briefcase,
    color: 'text-purple-500',
  },
  {
    type: 'worker',
    title: 'Worker',
    description: 'Provide services and manage bookings',
    icon: Icons.Users,
    color: 'text-green-500',
  },
];

export const UserTypeSheet = forwardRef<BottomSheetModal, UserTypeSheetProps>(
  ({ currentType, onSelect, onClose }, ref) => {
    const insets = useSafeAreaInsets();
    const [selectedType, setSelectedType] = useState<UserType>(currentType);

    const handleSelect = (type: UserType) => {
      Feedback.light();
      setSelectedType(type);
    };

    const handleConfirm = () => {
      Feedback.success();
      onSelect(selectedType);
      onClose();
    };

    return (
      <CustomBottomSheet
        ref={ref}
        index={0}
        detached
        enablePanDownToClose
        enableDismissOnClose
        bottomInset={insets.bottom}
        style={{
          paddingHorizontal: 12,
        }}
        bottomSheetViewConfig={{
          className: 'rounded-b-3xl',
        }}
      >
        <View className="gap-5 pb-6">
          <View>
            <Text className="text-2xl text-foreground font-heading tracking-tight">
              Switch User Type
            </Text>
            <Text className="text-sm text-muted-foreground font-body mt-2">
              Choose how you want to use the app
            </Text>
          </View>

          <View className="gap-3">
            {USER_TYPES.map((userType) => {
              const Icon = userType.icon;
              const isSelected = selectedType === userType.type;

              return (
                <TouchableOpacity
                  key={userType.type}
                  activeOpacity={0.7}
                  onPress={() => handleSelect(userType.type)}
                  className={cn(
                    'flex-row items-center gap-4 p-4 rounded-2xl border-2 transition-all',
                    isSelected
                      ? 'bg-primary/10 border-primary'
                      : 'bg-card/30 border-border/20',
                  )}
                >
                  <View
                    className={cn(
                      'w-12 h-12 rounded-xl items-center justify-center',
                      isSelected ? 'bg-primary/20' : 'bg-muted/30',
                    )}
                  >
                    <Icon
                      className={cn(
                        'w-6 h-6',
                        isSelected ? 'text-primary' : userType.color,
                      )}
                    />
                  </View>

                  <View className="flex-1">
                    <Text className="text-base text-foreground font-subtitle">
                      {userType.title}
                    </Text>
                    <Text className="text-sm text-muted-foreground font-body mt-0.5">
                      {userType.description}
                    </Text>
                  </View>

                  {isSelected && (
                    <Icons.CheckCircle className="text-primary w-6 h-6" />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            className="bg-primary h-14 rounded-2xl items-center justify-center mt-2"
            onPress={handleConfirm}
          >
            <Text className="text-primary-foreground font-subtitle text-base">
              Confirm Switch
            </Text>
          </TouchableOpacity>
        </View>
      </CustomBottomSheet>
    );
  },
);

UserTypeSheet.displayName = 'UserTypeSheet';
