import { Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import { Course } from "@/src/API/Random_APi";
import { useBookmarks } from "@/src/Context/bookmarkContext";

interface CourseCardProps {
    item: Course;
    index: number;
}
export const CourseCard = ({ item, index }: CourseCardProps) => {
    const { toggleBookmark, isBookmarked } = useBookmarks();
    const bookmarked = isBookmarked(item.id);

    return (
        <Animated.View 
            entering={FadeInDown.delay(100 * (index % 5))} 
            layout={Layout.springify()}
            className="px-[24px] mb-6"
        >
            <TouchableOpacity 
                className="bg-neutral-900 rounded-3xl overflow-hidden border border-neutral-800 shadow-sm"
                activeOpacity={0.8}
                
            >
                <Image 
                    source={{ uri: item.image }} 
                    style={{ width: '100%', height: 200 }} 
                    contentFit="cover"
                />
                
                <View className="absolute top-4 right-4 bg-black/60 px-3 py-1.5 rounded-xl border border-white/10 backdrop-blur-md">
                    <Text className="text-white text-xs font-bold">{item.duration}</Text>
                </View>

                <TouchableOpacity 
                    onPress={() => toggleBookmark(item)}
                    className="absolute top-4 left-4 bg-black/40 p-2.5 rounded-full border border-white/10 backdrop-blur-md"
                >
                    <Ionicons 
                        name={bookmarked ? "bookmark" : "bookmark-outline"} 
                        size={20} 
                        color={bookmarked ? "#6366F1" : "white"} 
                    />
                </TouchableOpacity>

                <View className="p-5">
                    <View className="flex-row justify-between items-start mb-2">
                        <Text className="text-white text-lg font-bold flex-1 mr-2" numberOfLines={1}>
                            {item.title}
                        </Text>
                        <View className="flex-row items-center bg-indigo-500/10 px-2 py-0.5 rounded-lg border border-indigo-500/20">
                            <FontAwesome name="star" size={12} color="#FBBF24" />
                            <Text className="text-yellow-400 text-xs font-bold ml-1">{item.rating?.toFixed(1) || "4.5"}</Text>
                        </View>
                    </View>

                    <Text className="text-neutral-400 text-sm mb-4 leading-5" numberOfLines={2}>
                        {item.description}
                    </Text>
                    
                    <View className="flex-row items-center justify-between border-t border-neutral-800 pt-4">
                        <View className="flex-row items-center gap-3">
                            <Image 
                                source={{ uri: item.instructor.avatar }} 
                                style={{ width: 36, height: 36, borderRadius: 18 }} 
                            />
                            <View>
                                <Text className="text-white text-sm font-semibold">
                                    {item.instructor.name}
                                </Text>
                                <Text className="text-neutral-500 text-[10px]">Senior Instructor</Text>
                            </View>
                        </View>
                        <View className="items-end">
                            <Text className="text-indigo-400 text-lg font-bold">${item.price || "Free"}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

