import React from "react";
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";

export default function FontProvider({ children }: { children: React.ReactNode }) {
  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("../assets/Poppins/Poppins-Regular.ttf"),
    "Poppins-Medium": require("../assets/Poppins/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("../assets/Poppins/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("../assets/Poppins/Poppins-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return <AppLoading />; 
  }

  return <>{children}</>;
}
