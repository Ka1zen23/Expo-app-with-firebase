// app/index.tsx
import AnimatedIntro from "@/components/AnimatedIntro";
import LoginSheet from "@/components/BottomLoginSheet";
import { View } from "react-native";

export default function Index() {
return (
    <View
      style={{
        flex: 1,
      }}
    >
      <AnimatedIntro />
      <LoginSheet />
    </View>
  );
}