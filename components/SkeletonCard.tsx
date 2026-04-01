import { View } from "react-native";

export const SkeletonCard = () => (
    <View className="px-[24px] mb-6">
        <View className="bg-neutral-900 rounded-3xl overflow-hidden border border-neutral-800">
            <View style={{ width: '100%', height: 200 }} className="bg-neutral-800 animate-pulse" />
            <View className="p-5">
                <View className="h-6 w-3/4 bg-neutral-800 rounded mb-2" />
                <View className="h-4 w-full bg-neutral-800 rounded mb-1" />
                <View className="h-4 w-5/6 bg-neutral-800 rounded mb-4" />
                <View className="flex-row items-center justify-between border-t border-neutral-800 pt-4">
                    <View className="flex-row items-center gap-3">
                        <View className="w-8 h-8 rounded-full bg-neutral-800" />
                        <View className="h-4 w-24 bg-neutral-800 rounded" />
                    </View>
                    <View className="h-6 w-16 bg-neutral-800 rounded-full" />
                </View>
            </View>
        </View>
    </View>
);
