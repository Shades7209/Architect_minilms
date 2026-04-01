import { View, Text, TouchableOpacity } from 'react-native'
import React, { useCallback } from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useBookmarks } from "@/src/Context/bookmarkContext";
import { LegendList } from "@legendapp/list";
import { CourseCard } from "@/components/CourseCard";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";

const BookMark = () => {
    const { bookmarks } = useBookmarks();

    const ListHeader = useCallback(() => (
        <View className="px-[24px] pt-4 mb-6">
            <View className="flex-row justify-between items-center">
                <Text className="text-white text-3xl font-bold">Saved Courses</Text>
                <View className="bg-indigo-600/20 px-3 py-1 rounded-full border border-indigo-600/30">
                    <Text className="text-indigo-400 font-bold">{bookmarks.length}</Text>
                </View>
            </View>
            <Text className="text-neutral-500 mt-2">Your collection of learning materials</Text>
        </View>
    ), [bookmarks.length]);

    const EmptyState = () => (
        <Animated.View 
            entering={FadeIn.delay(200)} 
            className="flex-1 justify-center items-center px-10 pt-20"
        >
            <View className="bg-neutral-900 p-8 rounded-full mb-6">
                <Ionicons name="bookmark-outline" size={60} color="#374151" />
            </View>
            <Text className="text-white text-2xl font-bold text-center">No Saved Courses</Text>
            <Text className="text-neutral-500 text-center mt-3 leading-6">
                Courses you bookmark will appear here for quick access later.
            </Text>
            <TouchableOpacity 
                onPress={() => router.push("/")}
                className="mt-10 bg-indigo-600 px-8 py-4 rounded-2xl"
            >
                <Text className="text-white font-bold text-lg">Browse Courses</Text>
            </TouchableOpacity>
        </Animated.View>
    );

    return (
        <SafeAreaView className="flex-1 bg-black">
            <StatusBar style="light" />
            
            {bookmarks.length === 0 ? (
                <View className="flex-1">
                    <ListHeader />
                    <EmptyState />
                </View>
            ) : (
                <LegendList
                    data={bookmarks}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item, index }) => <CourseCard item={item} index={index} />}
                    ListHeaderComponent={ListHeader}
                    contentContainerStyle={{ paddingBottom: 60 }}
                    estimatedItemSize={360}
                />
            )}
        </SafeAreaView>
    )
}

export default BookMark

