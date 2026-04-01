import { Stack } from "expo-router";
import "./global.css";
import {AuthProvider} from "@/src/Context/authContext";


export default function RootLayout() {
  return (
      <AuthProvider>
          <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
  );
}
