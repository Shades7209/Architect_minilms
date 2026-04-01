import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";

function TabsLayoutAndroid() {
    return (
        <Tabs 
            screenOptions={{
                headerShown: false, 
                tabBarActiveTintColor: '#6366F1',
                tabBarInactiveTintColor: '#94A3B8',
                tabBarStyle: {
                    position: 'absolute',
                    width: '80%',
                    marginLeft:"10%",
                    bottom: 20,
                    height: 65,
                    backgroundColor: '#0F172A',
                    borderRadius: 30,
                    borderTopWidth: 0,
                    paddingTop: 10,
                    paddingBottom: 10,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.5,
                    shadowRadius: 20,
                },
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: 'bold',
                    marginTop: -5,
                    marginBottom: 5,
                },
            }}
        >
            <Tabs.Screen 
                name="index" 
                options={{
                    title: "Learn",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons name={focused ? "school" : "school-outline"} size={22} color={color} />
                    ),
                }} 
            />
            <Tabs.Screen 
                name="Search" 
                options={{
                    title: "Search",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons name={focused ? "search" : "search-outline"} size={22} color={color} />
                    ),
                }} 
            />
            <Tabs.Screen 
                name="BookMark" 
                options={{
                    title: "Saved",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons name={focused ? "bookmark" : "bookmark-outline"} size={22} color={color} />
                    ),
                }} 
            />
            <Tabs.Screen 
                name="Profile" 
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons name={focused ? "person" : "person-outline"} size={22} color={color} />
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