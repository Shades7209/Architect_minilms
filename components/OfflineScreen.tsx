import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    withRepeat, 
    withTiming, 
    withSequence,
    interpolate,
    Extrapolate
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';

const OfflineScreen = () => {
    const pulse = useSharedValue(1);

    useEffect(() => {
        pulse.value = withRepeat(
            withSequence(
                withTiming(1.2, { duration: 1000 }),
                withTiming(1, { duration: 1000 })
            ),
            -1,
            true
        );
    }, []);

    const animatedIconStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: pulse.value }],
            opacity: interpolate(pulse.value, [1, 1.2], [0.6, 1], Extrapolate.CLAMP)
        };
    });

    const animatedCircleStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: pulse.value * 1.5 }],
            opacity: interpolate(pulse.value, [1, 1.2], [0.2, 0], Extrapolate.CLAMP)
        };
    });

    return (
        <View className="flex-1 bg-white dark:bg-zinc-950 items-center justify-center p-6">
            <View className="items-center justify-center relative">
                <Animated.View 
                    style={[{ position: 'absolute', width: 120, height: 120, borderRadius: 60, backgroundColor: '#3b82f6' }, animatedCircleStyle]} 
                />
                <Animated.View style={[{ alignItems: 'center', justifyContent: 'center' }, animatedIconStyle]}>
                    <View className="bg-blue-500 p-8 rounded-full shadow-lg shadow-blue-500/50">
                        <Feather name="wifi-off" size={48} color="white" />
                    </View>
                </Animated.View>
            </View>
            
            <View className="mt-12 items-center">
                <Text className="text-2xl font-bold text-zinc-900 dark:text-white text-center">
                    No Internet Connection
                </Text>
                <Text className="mt-3 text-zinc-500 dark:text-zinc-400 text-center max-w-[280px] leading-6">
                    Please check your network settings and try again. The app will automatically restore once you're back online.
                </Text>
            </View>
            
            <View className="absolute bottom-12 flex-row items-center bg-zinc-100 dark:bg-zinc-900 px-4 py-2 rounded-full">
                <View className="h-2 w-2 rounded-full bg-red-500 mr-2" />
                <Text className="text-zinc-600 dark:text-zinc-400 text-sm font-medium">Currently Offline</Text>
            </View>
        </View>
    );
};

export default OfflineScreen;
