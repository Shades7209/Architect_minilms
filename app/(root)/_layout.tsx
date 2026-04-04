import {Redirect, Stack} from "expo-router";

import {ActivityIndicator} from "react-native";

import {useAuth} from "@/src/Context/authContext";

export default function Layout() {
    const { loading, user } = useAuth();

    if (loading) return <ActivityIndicator />;
    if(!user){
        return <Redirect href="/sign-in"/>
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="webview/index" options={{ presentation: 'modal' }} />
            <Stack.Screen name="CoursePage/[id]" />
        </Stack>
    );
}
