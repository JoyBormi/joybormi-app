import { router } from 'expo-router';
import { MotiView } from 'moti';
import { Dimensions, Image, Pressable, ScrollView, View } from 'react-native';

import Icons from '@/components/icons';
import { Text } from '@/components/ui';
import { cn } from '@/lib/utils';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;
const CARD_GAP = 16;

const offers = [
  {
    id: '1',
    title: 'Haircut  jkhdfajkl kljasdhkl hasdklh',
    subtitle:
      'Limited time offer asijkfajks bfhkajsh fkasdhfk sdahfkladhsfjkldsa fadsjfh asklfh adsfkjhadsf jhadsjklf hasdjkfh sakdljhf jklasdhfjk asdjlkf ashdjkl dsafhalkjsfhajksdfhjkds hjkfkasdhfklasfl',
    discount: '50% off',
    dates: 'Feb 14 - Mar 24',
    image:
      'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop',
  },
  {
    id: '2',
    title: 'Makeup',
    subtitle: 'Event special',
    discount: '30% off',
    dates: 'Apr 01 - Apr 20',
    image:
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: '2312',
    title: 'Makeup',
    subtitle: 'Event special',
    discount: '30% off',
    dates: 'Apr 01 - Apr 20',
    image:
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: '23121',
    title: 'Makeup',
    subtitle: 'Event special',
    discount: '30% off',
    dates: 'Apr 01 - Apr 20',
    image:
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: '221313123',
    title: 'Makeup',
    subtitle: 'Event special',
    discount: '30% off',
    dates: 'Apr 01 - Apr 20',
    image:
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80',
  },
  // more offers...
];

export function PromoOffers({ className }: { className?: string }) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 500 }}
      className={cn('mt-12', className)}
    >
      <View className="flex-row items-center justify-between px-6 mb-4">
        <Text className="font-title text-lg text-foreground">
          Offers & Promotions
        </Text>
        <Text className="font-body text-muted-foreground">
          {offers.length} available
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + CARD_GAP}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {offers.map((item, index) => (
          <MotiView
            key={item.id}
            from={{ opacity: 0, translateX: 50 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{
              type: 'timing',
              duration: 500,
              delay: index * 100,
            }}
            style={{
              width: CARD_WIDTH,
              marginRight: CARD_GAP,
            }}
          >
            <Pressable
              onPress={() => router.push(`/(dynamic-brand)/brand/${item.id}`)}
              className="bg-popover rounded-xl border border-border overflow-hidden p-2.5 w-full h-[320px] justify-between"
            >
              <Image
                source={{ uri: item.image }}
                className="w-full h-44 rounded-lg"
                resizeMode="cover"
              />

              <View className="gap-y-1 mt-4 mb-2">
                <Text className="font-title text-base text-foreground line-clamp-1">
                  {item.title}
                </Text>
                <Text className="font-caption text-muted-foreground line-clamp-2">
                  {item.subtitle}
                </Text>
              </View>

              <View className="flex-row  items-center justify-between flex">
                <Text className="text-3xl font-bold text-primary">
                  {item.discount}
                </Text>

                <View className="gap-x-2 flex-row items-center">
                  <Text className="text-xs text-muted-foreground">
                    {item.dates}
                  </Text>
                  <Pressable className=" bg-secondary p-2 rounded-full">
                    <Icons.ChevronRight
                      size={16}
                      className="text-secondary-foreground"
                    />
                  </Pressable>
                </View>
              </View>
            </Pressable>
          </MotiView>
        ))}
      </ScrollView>
    </MotiView>
  );
}
