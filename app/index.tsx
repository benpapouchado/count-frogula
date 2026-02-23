import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Index() {
  const router = useRouter();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
    <Pressable onPress={() => router.push('/Login/login')}>
        <Text style={{ fontSize: 20, color: 'white' }}>Go to Login Screen</Text>
      </Pressable>
    </View>
  );
}
