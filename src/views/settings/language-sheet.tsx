import CustomBottomSheet from '@/components/shared/bottom-sheet';
import { Feedback } from '@/lib/haptics';
import Icons from '@/lib/icons';
import { storage } from '@/lib/mmkv';
import { cn } from '@/lib/utils';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { forwardRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type LanguageCode = 'en' | 'uz' | 'ru';

interface LanguageSheetProps {
  onClose: () => void;
}

const LANGUAGE_OPTIONS: {
  code: LanguageCode;
  title: string;
  nativeName: string;
}[] = [
  {
    code: 'en',
    title: 'English',
    nativeName: 'English',
  },
  {
    code: 'uz',
    title: 'Uzbek',
    nativeName: 'O`zbekcha',
  },
  {
    code: 'ru',
    title: 'Russian',
    nativeName: 'Русский',
  },
];

export const LanguageSheet = forwardRef<BottomSheetModal, LanguageSheetProps>(
  ({ onClose }, ref) => {
    const insets = useSafeAreaInsets();
    const { i18n, t } = useTranslation();
    const currentLanguage = i18n.language;

    const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>(
      currentLanguage as LanguageCode,
    );

    const changeLanguage = async (lang: string) => {
      storage.setItem('language', lang);
      i18n.changeLanguage(lang);
    };

    useEffect(() => {
      const loadLanguage = async () => {
        const savedLanguage = storage.getItem('language');
        if (savedLanguage) {
          i18n.changeLanguage((savedLanguage as string) ?? 'en');
        }
      };
      loadLanguage();
    }, [i18n]);

    const handleSelect = (language: LanguageCode) => {
      Feedback.light();
      setSelectedLanguage(language);
      changeLanguage(language);
      setTimeout(() => {
        onClose();
      }, 300);
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
              Language
            </Text>
            <Text className="text-sm text-muted-foreground font-body mt-2">
              Choose your preferred language
            </Text>
          </View>

          <View className="gap-3">
            {LANGUAGE_OPTIONS.map((language) => {
              const isSelected = selectedLanguage === language.code;

              return (
                <TouchableOpacity
                  key={language.code}
                  activeOpacity={0.7}
                  onPress={() => handleSelect(language.code)}
                  className={cn(
                    'flex-row items-center justify-between p-4 rounded-2xl border-2 transition-all',
                    isSelected
                      ? 'bg-primary/10 border-primary'
                      : 'bg-card/30 border-border/20',
                  )}
                >
                  <View className="flex-1">
                    <Text className="text-base text-foreground font-subtitle">
                      {language.title}
                    </Text>
                    <Text className="text-sm text-muted-foreground font-body mt-0.5">
                      {language.nativeName}
                    </Text>
                  </View>

                  {isSelected && (
                    <Icons.CheckCircle className="text-primary w-6 h-6" />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </CustomBottomSheet>
    );
  },
);

LanguageSheet.displayName = 'LanguageSheet';
