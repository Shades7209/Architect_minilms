import { Stack } from "expo-router";
import "./global.css";
import {AuthProvider} from "@/src/Context/authContext";
import {BookmarkProvider} from "@/src/Context/bookmarkContext";
import { useNetworkState } from "expo-network";
import OfflineScreen from "@/components/OfflineScreen";
import { useEffect } from "react";
import { reset24hNotifications } from "@/src/Services/notification24h";
import { AppState } from "react-native";
export default function RootLayout() {
  const network = useNetworkState();

  useEffect(() => {
    reset24hNotifications()

    const sub = AppState.addEventListener('change',(state)=>{
      if(state === 'active'){
        reset24hNotifications()
      }
    });

    return () => sub.remove()


  }, [])

  if (network.isConnected === false) {
    return <OfflineScreen />;
  }

  return (
      <AuthProvider>
          <BookmarkProvider>
             <Stack screenOptions={{ headerShown: false }} />
          </BookmarkProvider>
      </AuthProvider>
  );
}

