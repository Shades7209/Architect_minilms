import { Stack } from "expo-router";
import "./global.css";
import {AuthProvider} from "@/src/Context/authContext";
import {BookmarkProvider} from "@/src/Context/bookmarkContext";
import { useNetworkState } from "expo-network";
import OfflineScreen from "@/components/OfflineScreen";

export default function RootLayout() {
  const network = useNetworkState();

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

