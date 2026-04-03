import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/src/Context/authContext';
import { useBookmarks } from '@/src/Context/bookmarkContext';
import { Image } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

interface MenuItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value?: string;
    onPress?: () => void;
    color?: string;
    showChevron?: boolean;
}

const MenuItem = ({ icon, label, value, onPress, color = '#A5B4FC', showChevron = true }: MenuItemProps) => (
    <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        className="flex-row items-center py-4 px-1"
    >
        <View className="w-10 h-10 rounded-xl items-center justify-center mr-4" style={{ backgroundColor: `${color}15` }}>
            <Ionicons name={icon} size={20} color={color} />
        </View>
        <View className="flex-1">
            <Text className="text-white text-[15px] font-semibold">{label}</Text>
            {value && <Text className="text-neutral-500 text-xs mt-0.5">{value}</Text>}
        </View>
        {showChevron && <Ionicons name="chevron-forward" size={18} color="#404040" />}
    </TouchableOpacity>
);

const Profile = () => {
    const { user, logout, updateAvatar } = useAuth();
    const { bookmarks } = useBookmarks();
    const [uploading, setUploading] = useState(false);

    const userAvatar = user?.avatar?.url || 'https://static0.cbrimages.com/wordpress/wp-content/uploads/2025/03/10-weirdest-details-about-luffy-in-one-piece.jpg?w=1200&h=675&fit=crop';
    const userName = user?.username || 'Learner';
    const userEmail = user?.email || 'email@example.com';

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Needed', 'Please allow access to your photo library to change your profile picture.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            const uri = result.assets[0].uri;
            setUploading(true);
            try {
                await updateAvatar(uri);
                Alert.alert('Success', 'Profile picture updated!');
            } catch (error: any) {
                Alert.alert('Upload Failed', error?.response?.data?.message || 'Could not update your profile picture. Please try again.');
            } finally {
                setUploading(false);
            }
        }
    };

    const handleLogout = () => {
        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Sign Out',
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                        
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-black">
            <StatusBar style="light" />
            <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                
                <View className="px-[24px] pt-4 mb-2">
                    <Text className="text-white text-3xl font-bold">Profile</Text>
                </View>

                
                <Animated.View entering={FadeInDown.delay(100).springify()} className="px-[24px] mt-4">
                    <View className="bg-neutral-900 rounded-3xl border border-neutral-800 overflow-hidden">
                        
                        <View className="h-24 bg-indigo-600/20" />
                        
                        <View className="px-6 pb-6 -mt-12 items-center">
                            <TouchableOpacity onPress={pickImage} activeOpacity={0.8} disabled={uploading}>
                                <View className="rounded-full border-4 border-black overflow-hidden">
                                    <Image
                                        source={{ uri: userAvatar }}
                                        style={{ width: 88, height: 88, borderRadius: 44 }}
                                        contentFit="cover"
                                    />
                                    {uploading && (
                                        <View className="absolute inset-0 items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)', width: 88, height: 88, borderRadius: 44 }}>
                                            <ActivityIndicator color="#6366F1" size="small" />
                                        </View>
                                    )}
                                </View>
                                <View className="absolute bottom-0 right-0 bg-indigo-600 w-8 h-8 rounded-full items-center justify-center border-2 border-black">
                                    <Ionicons name="camera" size={14} color="white" />
                                </View>
                            </TouchableOpacity>
                            <Text className="text-white text-xl font-bold mt-4">{userName}</Text>
                            <Text className="text-neutral-500 text-sm mt-1">{userEmail}</Text>

                            
                            <View className="flex-row mt-6 w-full">
                                <View className="flex-1 items-center py-3 border-r border-neutral-800">
                                    <Text className="text-indigo-400 text-xl font-bold">{bookmarks.length}</Text>
                                    <Text className="text-neutral-500 text-xs mt-1">Saved</Text>
                                </View>
                                <View className="flex-1 items-center py-3 border-r border-neutral-800">
                                    <Text className="text-indigo-400 text-xl font-bold">0</Text>
                                    <Text className="text-neutral-500 text-xs mt-1">Completed</Text>
                                </View>
                                <View className="flex-1 items-center py-3">
                                    <Text className="text-indigo-400 text-xl font-bold">0h</Text>
                                    <Text className="text-neutral-500 text-xs mt-1">Learning</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </Animated.View>

               
                <Animated.View entering={FadeInDown.delay(200)} className="px-[24px] mt-8">
                    <Text className="text-neutral-500 text-xs font-bold tracking-widest uppercase mb-3 ml-1">Account</Text>
                    <View className="bg-neutral-900 rounded-2xl border border-neutral-800 px-4">
                        <MenuItem
                            icon="person-outline"
                            label="Username"
                            value={userName}
                            showChevron={false}
                        />
                        <View className="border-b border-neutral-800" />
                        <MenuItem
                            icon="mail-outline"
                            label="Email"
                            value={userEmail}
                            showChevron={false}
                        />
                        <View className="border-b border-neutral-800" />
                        <MenuItem
                            icon="shield-checkmark-outline"
                            label="Account Status"
                            value="Active"
                            color="#34D399"
                            showChevron={false}
                        />
                    </View>
                </Animated.View>

                
                <Animated.View entering={FadeInDown.delay(300)} className="px-[24px] mt-8">
                    <Text className="text-neutral-500 text-xs font-bold tracking-widest uppercase mb-3 ml-1">Preferences</Text>
                    <View className="bg-neutral-900 rounded-2xl border border-neutral-800 px-4">
                        <MenuItem
                            icon="notifications-outline"
                            label="Notifications"
                            color="#FBBF24"
                        />
                        <View className="border-b border-neutral-800" />
                        <MenuItem
                            icon="moon-outline"
                            label="Appearance"
                            value="Dark"
                            color="#818CF8"
                        />
                        <View className="border-b border-neutral-800" />
                        <MenuItem
                            icon="language-outline"
                            label="Language"
                            value="English"
                            color="#38BDF8"
                        />
                    </View>
                </Animated.View>

                
                <Animated.View entering={FadeInDown.delay(400)} className="px-[24px] mt-8">
                    <Text className="text-neutral-500 text-xs font-bold tracking-widest uppercase mb-3 ml-1">Support</Text>
                    <View className="bg-neutral-900 rounded-2xl border border-neutral-800 px-4">
                        <MenuItem
                            icon="help-circle-outline"
                            label="Help Center"
                            color="#A78BFA"
                        />
                        <View className="border-b border-neutral-800" />
                        <MenuItem
                            icon="document-text-outline"
                            label="Terms & Privacy"
                            color="#6B7280"
                        />
                    </View>
                </Animated.View>

                
                <Animated.View entering={FadeInDown.delay(500)} className="px-[24px] mt-10">
                    <TouchableOpacity
                        onPress={handleLogout}
                        activeOpacity={0.8}
                        className="bg-red-500/10 border border-red-500/20 rounded-2xl py-4 flex-row items-center justify-center gap-3"
                    >
                        <Ionicons name="log-out-outline" size={22} color="#EF4444" />
                        <Text className="text-red-400 text-base font-bold">Sign Out</Text>
                    </TouchableOpacity>
                </Animated.View>

                
                <Animated.View entering={FadeIn.delay(600)} className="items-center mt-8">
                    <Text className="text-neutral-700 text-xs">LUMINA v1.0.0</Text>
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Profile;
