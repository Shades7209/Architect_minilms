import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";

function TabsLayoutAndroid() {
    return (
        <Tabs screenOptions={{headerShown: false, tabBarActiveTintColor: '#007AFF'}}>
            <Tabs.Screen 
                name="index" 
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={size} color={color} />
                    ),
                }} 
            />
            <Tabs.Screen 
                name="settings" 
                options={{
                    title: "Settings",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="settings" size={size} color={color} />
                    ),
                }} 
            />
        </Tabs>
    );
}

function TabsLayoutIOS() {
    return (
        <NativeTabs>
            <NativeTabs.Trigger
                name="index"
                options={{ 
                    title: "Learn",
                    icon: { sf: "graduationcap" },
                    selectedIconColor:"#6366F1",
                    selectedIcon:{sf:"graduationcap.fill"},
                }} />
            <NativeTabs.Trigger
                name="Search"
                options={{ 
                    title: "Search",
                    icon: { sf: "magnifyingglass" },
                    selectedIconColor:"#6366F1"
                }}
            />
            <NativeTabs.Trigger
            name="BookMark"
            options={{
                title: "Saved",
                icon:{sf:"bookmark"},
                selectedIcon:{sf:"bookmark.fill"},
                selectedIconColor:"#6366F1"
            }}
            />
            <NativeTabs.Trigger
            name="Profile"
            options={{
                title: "Profile",
                icon:{sf:"person"},
                selectedIcon:{sf:"person.fill"},
                selectedIconColor:"#6366F1"
            }}
            />
        </NativeTabs>
    );
}

export default function Layout() {
    if (Platform.OS === "ios") {
        return <TabsLayoutIOS />;
    }

    return <TabsLayoutAndroid />;
}