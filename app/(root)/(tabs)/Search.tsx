import { View, Text, TextInput, TouchableOpacity, Keyboard, ScrollView } from 'react-native';
import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { fetchData, combineCourses, Course } from '@/src/API/Random_APi';
import { CourseCard } from '@/components/CourseCard';
import { SkeletonCard } from '@/components/SkeletonCard';
import { LegendList } from '@legendapp/list';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import { storage } from '@/src/Storage/mmkv';

const RECENT_SEARCHES_KEY = 'recent_searches';
const MAX_RECENT = 6;

const Search = () => {
    const [query, setQuery] = useState('');
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const inputRef = useRef<TextInput>(null);

    
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [{ users, products }] = await Promise.all([
                    fetchData(),
                    new Promise(resolve => setTimeout(resolve, 600)),
                ]);
                const combined = combineCourses(products, users);
                setCourses(combined);
            } catch {
            } finally {
                setLoading(false);
            }
        };

        
        const saved = storage.getString(RECENT_SEARCHES_KEY);
        if (saved) {
            try {
                setRecentSearches(JSON.parse(saved));
            } catch {}
        }

        loadData();

        
        setTimeout(() => inputRef.current?.focus(), 400);
    }, []);

    
    const saveRecentSearch = useCallback((term: string) => {
        const trimmed = term.trim();
        if (!trimmed) return;
        setRecentSearches(prev => {
            const filtered = prev.filter(s => s.toLowerCase() !== trimmed.toLowerCase());
            const updated = [trimmed, ...filtered].slice(0, MAX_RECENT);
            storage.set(RECENT_SEARCHES_KEY, JSON.stringify(updated));
            return updated;
        });
    }, []);

    const clearRecentSearches = useCallback(() => {
        setRecentSearches([]);
        storage.set(RECENT_SEARCHES_KEY, JSON.stringify([]));
    }, []);

    
    const filteredCourses = useMemo(() => {
        const trimmed = query.trim().toLowerCase();
        if (!trimmed) return [];
        return courses.filter(course =>
            course.title.toLowerCase().includes(trimmed) ||
            course.description.toLowerCase().includes(trimmed) ||
            course.instructor.name.toLowerCase().includes(trimmed)
        );
    }, [query, courses]);

    const handleSubmit = useCallback(() => {
        if (query.trim()) {
            saveRecentSearch(query);
            Keyboard.dismiss();
        }
    }, [query, saveRecentSearch]);

    const handleRecentTap = useCallback((term: string) => {
        setQuery(term);
        saveRecentSearch(term);
        Keyboard.dismiss();
    }, [saveRecentSearch]);

    const clearQuery = useCallback(() => {
        setQuery('');
        inputRef.current?.focus();
    }, []);

    const showResults = query.trim().length > 0;
    const noResults = showResults && filteredCourses.length === 0 && !loading;

   
    const ResultsHeader = useCallback(() => (
        <View className="px-[24px] pt-2 pb-2">
            {showResults && !loading && (
                <View className="mb-2">
                    <Text className="text-neutral-500 text-sm">
                        {filteredCourses.length} {filteredCourses.length === 1 ? 'result' : 'results'} for{' '}
                        <Text className="text-indigo-400 font-semibold">"{query.trim()}"</Text>
                    </Text>
                </View>
            )}
        </View>
    ), [showResults, filteredCourses.length, loading, query]);

    return (
        <SafeAreaView className="flex-1 bg-black">
            <StatusBar style="light" />

            
            <View className="px-[24px] pt-4 pb-2">
                <Animated.View
                    entering={FadeInDown.delay(100).springify()}
                    className="flex-row items-center bg-neutral-900 rounded-2xl border border-neutral-800 px-4 py-1"
                >
                    <Entypo name="magnifying-glass" size={22} color="#6366F1" />
                    <TextInput
                        ref={inputRef}
                        value={query}
                        onChangeText={setQuery}
                        onSubmitEditing={handleSubmit}
                        placeholder="Search courses, topics, instructors..."
                        placeholderTextColor="#525252"
                        returnKeyType="search"
                        autoCapitalize="none"
                        autoCorrect={false}
                        className="flex-1 text-white text-[16px] ml-3 py-3.5"
                        selectionColor="#6366F1"
                    />
                    {query.length > 0 && (
                        <TouchableOpacity onPress={clearQuery} className="p-1">
                            <Ionicons name="close-circle" size={20} color="#525252" />
                        </TouchableOpacity>
                    )}
                </Animated.View>
            </View>

            
            {loading ? (
                <ScrollView>
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </ScrollView>
            ) : showResults ? (
                noResults ? (
                    <ScrollView keyboardDismissMode="on-drag">
                        <Animated.View
                            entering={FadeIn.delay(200)}
                            className="items-center justify-center px-10 pt-16"
                        >
                            <View className="bg-neutral-900 p-7 rounded-full mb-6 border border-neutral-800">
                                <Ionicons name="search-outline" size={50} color="#374151" />
                            </View>
                            <Text className="text-white text-xl font-bold text-center">No Courses Found</Text>
                            <Text className="text-neutral-500 text-center mt-3 leading-6">
                                We couldn't find any courses matching{'\n'}
                                <Text className="text-indigo-400 font-semibold">"{query.trim()}"</Text>.
                                {'\n'}Try a different keyword.
                            </Text>
                        </Animated.View>
                    </ScrollView>
                ) : (
                    <LegendList
                        data={filteredCourses}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item, index }) => <CourseCard item={item} index={index} />}
                        ListHeaderComponent={ResultsHeader}
                        contentContainerStyle={{ paddingBottom: 60 }}
                        estimatedItemSize={360}
                        keyboardDismissMode="on-drag"
                    />
                )
            ) : (
                <ScrollView keyboardDismissMode="on-drag" className="flex-1">
                   
                    <Animated.View entering={FadeIn.delay(200)}>
                        <View className="items-center pt-10 pb-4">
                            <View className="bg-neutral-900/50 p-6 rounded-full mb-5 border border-neutral-800/50">
                                <Entypo name="magnifying-glass" size={40} color="#4338CA" />
                            </View>
                            <Text className="text-neutral-500 text-center text-base px-10 leading-6">
                                Search by course name, topic,{'\n'}or instructor
                            </Text>
                        </View>

                       
                        {recentSearches.length > 0 && (
                            <View className="px-[24px] mt-4">
                                <View className="flex-row justify-between items-center mb-4">
                                    <Text className="text-white text-lg font-bold">Recent Searches</Text>
                                    <TouchableOpacity onPress={clearRecentSearches}>
                                        <Text className="text-indigo-400 text-sm font-semibold">Clear All</Text>
                                    </TouchableOpacity>
                                </View>
                                <View className="flex-row flex-wrap gap-3">
                                    {recentSearches.map((term, index) => (
                                        <Animated.View key={term} entering={FadeInDown.delay(80 * index)}>
                                            <TouchableOpacity
                                                onPress={() => handleRecentTap(term)}
                                                className="flex-row items-center bg-neutral-900 border border-neutral-800 px-4 py-2.5 rounded-xl gap-2"
                                            >
                                                <Ionicons name="time-outline" size={14} color="#737373" />
                                                <Text className="text-neutral-300 text-sm">{term}</Text>
                                            </TouchableOpacity>
                                        </Animated.View>
                                    ))}
                                </View>
                            </View>
                        )}

                        
                        <View className="px-[24px] mt-6">
                            <Text className="text-white text-lg font-bold mb-4">Popular Topics</Text>
                            <View className="flex-row flex-wrap gap-3">
                                {['React Native', 'JavaScript', 'Design', 'Python', 'Marketing', 'Photography'].map((topic, index) => (
                                    <Animated.View key={topic} entering={FadeInDown.delay(80 * index)}>
                                        <TouchableOpacity
                                            onPress={() => handleRecentTap(topic)}
                                            className="bg-indigo-600/10 border border-indigo-600/20 px-4 py-2.5 rounded-xl"
                                        >
                                            <Text className="text-indigo-400 text-sm font-medium">{topic}</Text>
                                        </TouchableOpacity>
                                    </Animated.View>
                                ))}
                            </View>
                        </View>
                    </Animated.View>
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

export default Search;
