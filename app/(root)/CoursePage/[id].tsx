import { View, Text, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import React, { useMemo, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Animated, { FadeInDown, FadeIn, useSharedValue } from 'react-native-reanimated';
import { useBookmarks } from '@/src/Context/bookmarkContext';
import { LinearGradient } from 'expo-linear-gradient';
import { LegendList } from '@legendapp/list';

const CoursePage = () => {
    const params = useLocalSearchParams();
    const { toggleBookmark, isBookmarked } = useBookmarks();
    
    // Parse params
    const id = Number(params.id);
    const title = params.title as string;
    const description = params.description as string;
    const image = params.image as string;
    const rating = Number(params.rating);
    const price = params.price as string;
    const duration = params.duration as string;
    const instructorName = params.instructorName as string;
    const instructorAvatar = params.instructorAvatar as string;
    const instructorEmail = params.instructorEmail as string;

    const bookmarked = isBookmarked(id);

    const scrollY = useSharedValue(0);
    const [isEnrolling, setIsEnrolling] = useState(false);

    const handleEnroll = () => {
        setIsEnrolling(true);
        setTimeout(() => {
            setIsEnrolling(false);
            router.push({
                pathname: "/webview",
                params: {
                    id: id.toString(),
                    title: title,
                    instructorName: instructorName
                }
            });
        }, 600);
    };

    const courseItem = useMemo(() => ({
        id, title, description, image, rating, price, duration,
        instructor: { name: instructorName, avatar: instructorAvatar, email: instructorEmail }
    }), [id, title, description, image, rating, price, duration, instructorName, instructorAvatar, instructorEmail]);

    const renderContent = () => (
        <View>
            {/* Hero Header */}
            <View style={{ width: '100%', height: 400 }}>
                <Image 
                    source={{ uri: image }} 
                    style={{ width: '100%', height: '100%' }} 
                    contentFit="cover"
                />
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)', 'black']}
                    style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 150 }}
                />
                
                {/* Navigation Buttons */}
                <SafeAreaView edges={['top']} style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                    <View className="flex-row justify-between px-6 py-4">
                        <TouchableOpacity 
                            onPress={() => router.back()}
                            className="bg-black/50 p-2.5 rounded-full border border-white/10 backdrop-blur-md"
                        >
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => toggleBookmark(courseItem as any)}
                            className="bg-black/50 p-2.5 rounded-full border border-white/10 backdrop-blur-md"
                        >
                            <Ionicons 
                                name={bookmarked ? "bookmark" : "bookmark-outline"} 
                                size={24} 
                                color={bookmarked ? "#6366F1" : "white"} 
                                />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </View>

            {/* Course Content */}
            <View className="px-6 -mt-8">
                <Animated.View entering={FadeInDown.delay(100).duration(500)}>
                    <View className="bg-indigo-600/10 self-start px-3 py-1 rounded-lg border border-indigo-500/20 mb-4">
                        <Text className="text-indigo-400 text-xs font-bold tracking-widest uppercase">Development</Text>
                    </View>
                    
                    <Text className="text-white text-3xl font-bold leading-tight mb-4">
                        {title}
                    </Text>

                    {/* Stats Row */}
                    <View className="flex-row items-center gap-6 mb-8">
                        <View className="flex-row items-center gap-2">
                            <FontAwesome name="star" size={16} color="#FBBF24" />
                            <Text className="text-white font-bold">{rating?.toFixed(1) || "4.5"}</Text>
                            <Text className="text-neutral-500 text-sm">(2.5k reviews)</Text>
                        </View>
                        <View className="flex-row items-center gap-2">
                            <Ionicons name="time-outline" size={18} color="#6366F1" />
                            <Text className="text-white font-semibold">{duration}</Text>
                        </View>
                    </View>

                    {/* Price & Description */}
                    <View className="flex-row items-center justify-between mb-8">
                        <View>
                            <Text className="text-neutral-500 text-sm mb-1 uppercase tracking-widest">Course Price</Text>
                            <Text className="text-indigo-400 text-3xl font-bold">${price}</Text>
                        </View>
                        <View className="items-end">
                            <Text className="text-neutral-500 text-sm mb-1 uppercase tracking-widest">Enrolled</Text>
                            <Text className="text-white text-xl font-bold">12,450</Text>
                        </View>
                    </View>

                    <Text className="text-white text-lg font-bold mb-3">About this course</Text>
                    <Text className="text-neutral-400 text-base leading-7 mb-8">
                        {description}
                    </Text>

                    {/* Instructor Card */}
                    <Text className="text-white text-lg font-bold mb-4">Your Instructor</Text>
                    <View className="bg-neutral-900/50 p-4 rounded-3xl border border-neutral-800 flex-row items-center gap-4 mb-10">
                        <Image 
                            source={{ uri: instructorAvatar }} 
                            style={{ width: 64, height: 64, borderRadius: 32 }} 
                        />
                        <View className="flex-1">
                            <Text className="text-white text-lg font-bold">{instructorName}</Text>
                            <Text className="text-neutral-500 text-sm mb-1">Senior Software Engineer</Text>
                            <View className="flex-row items-center gap-1">
                                <Ionicons name="mail-outline" size={12} color="#6366F1" />
                                <Text className="text-indigo-400/80 text-xs">{instructorEmail}</Text>
                            </View>
                        </View>
                        <TouchableOpacity className="bg-neutral-800 p-3 rounded-2xl">
                            <Ionicons name="chatbox-outline" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>
        </View>
    );

    return (
        <View className="flex-1 bg-black">
            <LegendList
                data={[courseItem]}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderContent}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
                estimatedItemSize={800}
                onScroll={(e) => {
                    scrollY.value = e.nativeEvent.contentOffset.y;
                }}
            />

            {/* Sticky Bottom Action */}
            <SafeAreaView edges={['bottom']} className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-white/5">
                <View className="px-6 py-4">
                    <TouchableOpacity 
                        onPress={handleEnroll}
                        disabled={isEnrolling}
                        className="bg-indigo-600 h-16 rounded-2xl items-center justify-center shadow-xl shadow-indigo-600/20"
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={['#6366F1', '#4F46E5']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={{ position: 'absolute', inset: 0, borderRadius: 16 }}
                        />
                        <View className="flex-row items-center gap-3">
                            {isEnrolling ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <>
                                    <Text className="text-white text-xl font-bold">Enroll in Course</Text>
                                    <Ionicons name="arrow-forward" size={24} color="white" />
                                </>
                            )}
                        </View>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
};

export default CoursePage;