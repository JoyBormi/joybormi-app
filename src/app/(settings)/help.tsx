import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Icons from '@/components/icons';
import { Header } from '@/components/shared/header';
import { Input, Text, Textarea } from '@/components/ui';
import { useUserStore } from '@/stores';

export default function HelpScreen() {
  const insets = useSafeAreaInsets();
  const { isLoggedIn, user } = useUserStore();

  const inquiries = useMemo(
    () => [
      {
        id: 'inq-1',
        subject: 'Payout delay for August',
        status: 'Open',
        updatedAt: '2h ago',
        messages: [
          {
            id: 'msg-1',
            sender: 'Support',
            body: 'Hi! We are checking the payout status now.',
            time: '09:12 AM',
          },
          {
            id: 'msg-2',
            sender: user?.username ?? 'You',
            body: 'Thanks! Please keep me posted.',
            time: '09:20 AM',
          },
        ],
      },
      {
        id: 'inq-2',
        subject: 'Issue with promo code',
        status: 'Resolved',
        updatedAt: 'Yesterday',
        messages: [
          {
            id: 'msg-3',
            sender: 'Support',
            body: 'We have reactivated the code for you.',
            time: '04:45 PM',
          },
        ],
      },
    ],
    [user?.username],
  );

  const [activeInquiryId, setActiveInquiryId] = useState(
    inquiries[0]?.id ?? '',
  );
  const activeInquiry = inquiries.find(
    (inquiry) => inquiry.id === activeInquiryId,
  );

  return (
    <View style={{ paddingTop: insets.top, flex: 1 }}>
      <Header
        title="Help & Support"
        subtitle="We are here to help with bookings, payouts, and account issues."
        animate={false}
        variant="row"
        className="px-2 pb-2"
      />
      <ScrollView
        className="main-area"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
      >
        <View className="gap-6 mt-5">
          <View className="gap-3">
            <Text className="text-sm text-muted-foreground font-subtitle uppercase tracking-wider">
              Quick help
            </Text>
            <View className="flex-row flex-wrap gap-3">
              {[
                { label: 'Booking issues', icon: Icons.Calendar },
                { label: 'Payment help', icon: Icons.CreditCard },
                { label: 'Account access', icon: Icons.Lock },
              ].map((item) => (
                <View
                  key={item.label}
                  className="flex-1 min-w-[45%] rounded-2xl border border-border/50 bg-card/60 p-4"
                >
                  <item.icon className="text-primary" size={18} />
                  <Text className="mt-2 font-subtitle text-foreground">
                    {item.label}
                  </Text>
                  <Text className="text-xs text-muted-foreground mt-1">
                    View tips and FAQs
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View className="gap-3">
            <Text className="text-sm text-muted-foreground font-subtitle uppercase tracking-wider">
              Contact support
            </Text>
            <View className="gap-4 rounded-2xl border border-border/50 bg-card/60 p-4">
              {!isLoggedIn && (
                <View className="gap-2">
                  <Text className="text-xs text-muted-foreground">Email</Text>
                  <Input
                    value=""
                    placeholder="Enter your email address"
                    autoCapitalize="none"
                  />
                </View>
              )}
              <View className="gap-2">
                <Text className="text-xs text-muted-foreground">Title</Text>
                <Input value="" placeholder="Give your request a title" />
              </View>
              <View className="gap-2">
                <Text className="text-xs text-muted-foreground">
                  Description
                </Text>
                <Textarea
                  value=""
                  placeholder="Describe the issue and add any relevant details."
                />
              </View>
              <View className="gap-2">
                <Text className="text-xs text-muted-foreground">
                  Attach files
                </Text>
                <Pressable className="rounded-2xl border-2 border-dashed border-border/70 bg-muted/30 p-4 items-center gap-2">
                  <Icons.Upload size={20} className="text-muted-foreground" />
                  <Text className="text-sm text-muted-foreground">
                    Drag or upload screenshots
                  </Text>
                </Pressable>
              </View>
              <Pressable className="rounded-full bg-primary/15 px-4 py-2 self-start">
                <Text className="text-primary font-subtitle">
                  Submit inquiry
                </Text>
              </Pressable>
            </View>
          </View>

          {isLoggedIn && (
            <View className="gap-4">
              <Text className="text-sm text-muted-foreground font-subtitle uppercase tracking-wider">
                Your inquiries
              </Text>
              <View className="gap-3">
                {inquiries.map((inquiry) => (
                  <Pressable
                    key={inquiry.id}
                    onPress={() => setActiveInquiryId(inquiry.id)}
                    className="rounded-2xl border border-border/50 bg-card/60 p-4"
                  >
                    <View className="flex-row items-start justify-between">
                      <View className="flex-1 pr-2">
                        <Text className="font-subtitle text-foreground">
                          {inquiry.subject}
                        </Text>
                        <Text className="text-xs text-muted-foreground mt-1">
                          Updated {inquiry.updatedAt}
                        </Text>
                      </View>
                      <View
                        className={
                          inquiry.status === 'Open'
                            ? 'rounded-full bg-amber-500/15 px-3 py-1'
                            : 'rounded-full bg-success/15 px-3 py-1'
                        }
                      >
                        <Text
                          className={
                            inquiry.status === 'Open'
                              ? 'text-xs text-amber-500 font-subtitle'
                              : 'text-xs text-success font-subtitle'
                          }
                        >
                          {inquiry.status}
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                ))}
              </View>

              {activeInquiry && (
                <View className="rounded-2xl border border-border/50 bg-muted/30 p-4 gap-3">
                  <View className="flex-row items-center justify-between">
                    <Text className="font-subtitle text-foreground">
                      {activeInquiry.subject}
                    </Text>
                    <Text className="text-xs text-muted-foreground">
                      {activeInquiry.updatedAt}
                    </Text>
                  </View>
                  <View className="gap-3">
                    {activeInquiry.messages.map((message) => (
                      <View
                        key={message.id}
                        className={
                          message.sender === 'Support'
                            ? 'self-start max-w-[80%] rounded-2xl bg-white/80 p-3'
                            : 'self-end max-w-[80%] rounded-2xl bg-primary/15 p-3'
                        }
                      >
                        <Text className="text-xs text-muted-foreground mb-1">
                          {message.sender}
                        </Text>
                        <Text className="text-sm text-foreground">
                          {message.body}
                        </Text>
                        <Text className="text-[10px] text-muted-foreground mt-1">
                          {message.time}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
