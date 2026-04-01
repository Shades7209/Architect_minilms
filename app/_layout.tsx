import { Stack } from "expo-router";
import "./global.css";
import {AuthProvider} from "@/src/Context/authContext";
import {BookmarkProvider} from "@/src/Context/bookmarkContext";


export default function RootLayout() {
  return (
      <AuthProvider>
          <BookmarkProvider>
             <Stack screenOptions={{ headerShown: false }} />
          </BookmarkProvider>
      </AuthProvider>
  );
}

