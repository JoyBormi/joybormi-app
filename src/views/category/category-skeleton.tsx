import { Skeleton } from "@/components/ui";
import { View } from "react-native";

export const CategoryCardSkeleton = () => {
  return (
    <View className="mb-6 overflow-hidden rounded-xl bg-muted/30">
      <Skeleton className="h-56 w-full rounded-none" />
      <View className="p-4">
        <View className="mb-2 flex-row items-center justify-between">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-6 w-16 rounded-md" />
        </View>
        <Skeleton className="mb-3 h-4 w-56" />
        <View className="flex-row gap-2">
          <Skeleton className="h-24 w-[185px] rounded-xl" />
          <Skeleton className="h-24 w-[185px] rounded-xl" />
        </View>
      </View>
    </View>
  );
};