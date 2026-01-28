import React, { useMemo } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Icons from '@/components/icons';
import { Header } from '@/components/shared/header';
import { Text } from '@/components/ui';

export default function PaymentScreen() {
  const insets = useSafeAreaInsets();

  const paymentMethods = useMemo(
    () => [
      {
        id: 'visa',
        brand: 'Visa',
        last4: '4242',
        expiry: '12/27',
        primary: true,
      },
      {
        id: 'mastercard',
        brand: 'Mastercard',
        last4: '8891',
        expiry: '08/26',
        primary: false,
      },
    ],
    [],
  );

  const transactions = useMemo(
    () => [
      {
        id: 'txn-1',
        title: 'Skin glow facial',
        date: 'Aug 12, 2024',
        amount: '$120',
        status: 'Completed',
      },
      {
        id: 'txn-2',
        title: 'Hair styling consultation',
        date: 'Aug 03, 2024',
        amount: '$65',
        status: 'Pending',
      },
      {
        id: 'txn-3',
        title: 'Manicure essentials',
        date: 'Jul 28, 2024',
        amount: '$40',
        status: 'Completed',
      },
    ],
    [],
  );

  return (
    <View className="main-area" style={{ paddingTop: insets.top }}>
      <Header
        title="Payments"
        subtitle="Manage your payment methods and billing activity."
        animate={false}
        className="px-2"
        variant="row"
      />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
      >
        <View className="gap-6 px-5">
          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-muted-foreground font-subtitle uppercase tracking-wider">
                Payment methods
              </Text>
              <Pressable className="flex-row items-center gap-1">
                <Icons.Plus size={16} className="text-primary" />
                <Text className="text-sm text-primary font-subtitle">
                  Add new
                </Text>
              </Pressable>
            </View>
            <View className="gap-3">
              {paymentMethods.map((method) => (
                <View
                  key={method.id}
                  className="rounded-2xl border border-border/50 bg-card/70 p-4"
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3">
                      <View className="h-10 w-10 rounded-xl bg-primary/10 items-center justify-center">
                        <Icons.CreditCard size={18} className="text-primary" />
                      </View>
                      <View>
                        <Text className="font-subtitle text-foreground">
                          {method.brand} •••• {method.last4}
                        </Text>
                        <Text className="text-xs text-muted-foreground mt-1">
                          Expires {method.expiry}
                        </Text>
                      </View>
                    </View>
                    {method.primary && (
                      <View className="rounded-full bg-success/15 px-3 py-1">
                        <Text className="text-xs text-success font-subtitle">
                          Primary
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View className="gap-3">
            <Text className="text-sm text-muted-foreground font-subtitle uppercase tracking-wider">
              Billing history
            </Text>
            <View className="gap-3">
              {transactions.map((txn) => (
                <View
                  key={txn.id}
                  className="rounded-2xl border border-border/40 bg-card/50 px-4 py-3"
                >
                  <View className="flex-row items-start justify-between">
                    <View className="flex-1 pr-2">
                      <Text className="font-subtitle text-foreground">
                        {txn.title}
                      </Text>
                      <Text className="text-xs text-muted-foreground mt-1">
                        {txn.date}
                      </Text>
                    </View>
                    <View className="items-end">
                      <Text className="font-subtitle text-foreground">
                        {txn.amount}
                      </Text>
                      <Text
                        className={
                          txn.status === 'Completed'
                            ? 'text-xs text-success'
                            : 'text-xs text-amber-500'
                        }
                      >
                        {txn.status}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View className="rounded-2xl border border-border/50 bg-muted/30 p-4">
            <Text className="font-subtitle text-foreground">
              Payout schedule
            </Text>
            <Text className="text-sm text-muted-foreground mt-2">
              Weekly payouts to your primary card every Monday.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
