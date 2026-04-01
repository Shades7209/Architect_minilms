import {Redirect, router, Slot, useRootNavigationState} from "expo-router";

import {Text,ActivityIndicator} from "react-native";

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
