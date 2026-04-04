import {Text, TouchableOpacity, View,  RefreshControl, ScrollView} from "react-native";
import {useAuth} from "@/src/Context/authContext";
import {SafeAreaView} from "react-native-safe-area-context";
import {StatusBar} from "expo-status-bar";
import {Image} from "expo-image";
import Entypo from '@expo/vector-icons/Entypo';
import {router} from "expo-router";
import {useEffect, useState, useCallback} from "react";
import {combineCourses, fetchData, Course} from "@/src/API/Random_APi";
import {LegendList} from "@legendapp/list";
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { CourseCard } from "@/components/CourseCard";
import { SkeletonCard } from "@/components/SkeletonCard";

const CATEGORIES = ["All", "Development", "Design", "Business", "Marketing", "Music", "Photography"];

export default function Index() {
    const {user} = useAuth()


    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("All");

    
    const load = async (isRefreshing = false) => {
        if (isRefreshing) setRefreshing(true);
        else setLoading(true);
        
        try {

            const [{ users, products }] = await Promise.all([
                fetchData(),
                new Promise(resolve => setTimeout(resolve, 800))
            ]);
            const combined = combineCourses(products, users);
            setCourses(combined);
        } catch {
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const userAvatar = user?.avatar?.url || "https://static0.cbrimages.com/wordpress/wp-content/uploads/2025/03/10-weirdest-details-about-luffy-in-one-piece.jpg?w=1200&h=675&fit=crop";

    const ListHeader = useCallback(() => (
        <View>
            <View className="px-[24px]">
                
                <Animated.View entering={FadeIn.delay(100)} className={"flex-row justify-between w-full items-center pt-4"}>
                    <View className={"flex-row gap-4 items-center"}>
                        <Image
                            style={{width: 48, height: 48, borderRadius: 24}}
                            source={{uri: userAvatar}}
                        />
                        <View>
                            <Text className={"text-[20px] text-white font-bold tracking-widest"}>
                                L U M I N A
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => router.push("/Search")} className="bg-neutral-900 p-3 rounded-full">
                        <Entypo name="magnifying-glass" size={24} color="#6366F1" />
                    </TouchableOpacity>
                </Animated.View>

                
                <Animated.View entering={FadeInDown.delay(200)} className={"pt-[28px]"}>
                    <Text className={"text-neutral-400 text-[18px] font-medium"}>Welcome Back,</Text>
                    <Text className={"text-white text-[32px] font-bold"}>
                        {user?.username?.toUpperCase() || "LEARNER"}
                    </Text>
                </Animated.View>

                
                <Animated.View entering={FadeInDown.delay(300)} className="mt-8">
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ gap: 12 }}
                    >
                        {CATEGORIES.map((cat) => (
                            <TouchableOpacity 
                                key={cat}
                                onPress={() => setSelectedCategory(cat)}
                                className={`px-5 py-2.5 rounded-full border ${selectedCategory === cat ? 'bg-indigo-600 border-indigo-600' : 'bg-neutral-900 border-neutral-800'}`}
                            >
                                <Text className={`font-semibold ${selectedCategory === cat ? 'text-white' : 'text-neutral-400'}`}>
                                    {cat}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </Animated.View>

                
                <View className="mt-10 mb-6 flex-row justify-between items-end">
                    <Text className="text-white text-2xl font-bold">Featured Courses</Text>
                    <TouchableOpacity>
                        <Text className="text-indigo-400 font-semibold">See All</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    ), [userAvatar, user?.username, selectedCategory]);

    return (
        <SafeAreaView className={"flex-1 bg-black"}>
            <StatusBar style={"light"}/>
            
            {(loading || refreshing) ? (
                <ScrollView contentContainerStyle={{ paddingTop: 20 }}>
                    <ListHeader />
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </ScrollView>
            ) : (
                <LegendList
                    data={courses}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item, index }) => <CourseCard item={item} index={index} />}
                    ListHeaderComponent={ListHeader}
                    contentContainerStyle={{ paddingBottom: 60 }}
                    estimatedItemSize={360}
                    onRefresh={() => load(true)}
                    refreshing={refreshing}
                    alwaysBounceVertical={true}
                    refreshControl={
                        <RefreshControl 
                            refreshing={refreshing} 
                            onRefresh={() => load(true)} 
                            tintColor="white"
                            colors={["white"]}
                        />
                    }
                />
            )}
        </SafeAreaView>
    );
}



