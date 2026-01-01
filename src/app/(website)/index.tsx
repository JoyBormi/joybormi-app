import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Image, ScrollView, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { LanguageToggle } from '@/components/shared/language-toggle';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { Button, Text } from '@/components/ui';
import { HERO } from '@/constants/images';
import Icons, { Icon } from '@/lib/icons';
import { useOnboarding } from '@/stores/use-onboarding';
import { FAQItem, FeatureItem, PlanCard } from '@/views/website';
import { faqs, features, plans, useCases } from '@/views/website/data';

const { width } = Dimensions.get('window');

export default function WebsiteScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setVisited, setCanVisitAgain } = useOnboarding();
  const { t } = useTranslation();

  const handleGetStarted = useCallback(() => {
    setVisited();
    setCanVisitAgain(false);
    router.replace('/(tabs)');
  }, [router, setVisited, setCanVisitAgain]);

  return (
    <SafeAreaView className="safe-area">
      <ScrollView contentContainerClassName="pb-28">
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          className="px-4 border-b border-primary/40 py-5"
        >
          <MotiView
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'timing', duration: 800 }}
            className="gap-y-4"
          >
            <View className="space-x-2 flex flex-row items-center justify-between">
              <Text className="text-body text-muted-foreground">
                {t('website.settings.theme')}
              </Text>
              <ThemeToggle />
            </View>
            <View className="space-x-2 flex flex-row items-center justify-between">
              <Text className="text-body text-muted-foreground">
                {t('website.settings.language')}
              </Text>
              <LanguageToggle />
            </View>
          </MotiView>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          className="px-4 pt-12"
        >
          <Text className="text-4xl font-bold mb-4">
            {t('website.hero.title')}
          </Text>
          <Text className="text-base text-muted-foreground mb-6">
            {t('website.hero.subtitle')}
          </Text>

          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'timing', duration: 900 }}
            className="gap-4"
          >
            <Image
              source={HERO.hero_1}
              className="aspect-video w-full h-52 rounded-2xl"
              resizeMode="cover"
            />

            <MotiView
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'timing', duration: 1300 }}
              className="gap-4"
            >
              <Image
                source={HERO.hero_2}
                className="aspect-video w-[68%] h-52 rounded-2xl self-end"
                resizeMode="cover"
              />
            </MotiView>
            <MotiView
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'timing', duration: 1600 }}
              className="gap-4"
            >
              <Image
                source={HERO.hero_3}
                className="aspect-video w-[68%] h-52 rounded-2xl self-start"
                resizeMode="cover"
              />
            </MotiView>
            <MotiView
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'timing', duration: 1100 }}
              className="gap-4"
            >
              <Image
                source={HERO.hero_4}
                className="aspect-video w-[60%] h-52 rounded-2xl self-end"
                resizeMode="cover"
              />
            </MotiView>
          </MotiView>
        </Animated.View>

        <View className="px-4 py-12 bg-card">
          <Text className="text-2xl font-bold mb-6">
            {t('website.features.title')}
          </Text>
          <View className="gap-6">
            {features.map(({ id, icon }) => (
              <FeatureItem
                key={id}
                title={t(`website.features.${id}.title`)}
                description={t(`website.features.${id}.description`)}
                icon={icon as Icon}
              />
            ))}
          </View>
        </View>

        <View className="px-2 py-12">
          <View className="pl-3">
            <Text className="text-2xl font-bold mb-2">
              {t('website.pricing.title')}
            </Text>
            <Text className="text-sm text-muted-foreground mb-6">
              {t('website.pricing.subtitle')}
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={width - width * 0.2}
            decelerationRate="fast"
          >
            {plans.map((plan) => (
              <View key={plan.id} className="flex-row flex gap-x-4">
                <PlanCard
                  plan={{
                    ...plan,
                    name: t(`website.pricing.plans.${plan.id}.name`),
                    price: t(`website.pricing.plans.${plan.id}.price`),
                    features: plan.features.map((_, i) =>
                      t(`website.pricing.plans.${plan.id}.features.${i}`),
                    ),
                  }}
                />
              </View>
            ))}
          </ScrollView>
        </View>

        <View className="px-4 py-12 bg-muted/10">
          <Text className="text-2xl font-bold mb-6">
            {t('website.useCases.title')}
          </Text>
          <View className="gap-4">
            {useCases.map(({ id, icon }) => {
              const Icon = Icons[icon as Icon];
              return (
                <View
                  key={id}
                  className="p-4 bg-card rounded-2xl flex-row items-start gap-4"
                >
                  <Icon size={24} className="text-primary mt-1" />
                  <View className="flex-1">
                    <Text className="text-lg font-semibold mb-1">
                      {t(`website.useCases.${id}.title`)}
                    </Text>
                    <Text className="text-sm text-muted-foreground">
                      {t(`website.useCases.${id}.description`)}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <View className="px-4 py-12">
          <Text className="text-2xl font-bold mb-6">
            {t('website.faq.title')}
          </Text>
          {faqs.map(({ id }) => (
            <FAQItem
              key={id}
              question={t(`website.faq.questions.${id}.question`)}
              answer={t(`website.faq.questions.${id}.answer`)}
            />
          ))}
        </View>
      </ScrollView>

      <Animated.View
        entering={FadeInUp.delay(800).springify()}
        className="absolute left-4 right-4"
        style={{ bottom: insets.bottom }}
      >
        <Button className="py-4" onPress={handleGetStarted}>
          <Text className="text-primary-foreground font-semibold text-center">
            {t('website.cta.getStarted')}
          </Text>
        </Button>
      </Animated.View>
    </SafeAreaView>
  );
}
