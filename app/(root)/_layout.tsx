import {Redirect, router, Slot, useRootNavigationState} from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {Text,ActivityIndicator} from "react-native";
import { useEffect } from "react";
import {useAuth} from "@/src/Context/authContext";

export default function Layout() {
    const { loading, user } = useAuth();
    console.log(user)
    if (loading) return <ActivityIndicator />;
    if(!user){
        return <Redirect href="/sign-in"/>
    }
    return <Slot/>
}
