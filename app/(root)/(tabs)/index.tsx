import {Text, TouchableOpacity, View} from "react-native";
import {useAuth} from "@/src/Context/authContext";

export default function Index() {
    const {logout} = useAuth()
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TouchableOpacity onPress={logout}>
          <Text className="rounded-[50px]">Edit ap/index.tsx to edit this screen.</Text>
      </TouchableOpacity>
    </View>
  );
}
