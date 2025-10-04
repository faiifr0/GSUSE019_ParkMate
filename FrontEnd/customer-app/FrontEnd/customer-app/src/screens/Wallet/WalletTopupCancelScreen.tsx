import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { View, Text, Platform } from "react-native";
import { RootStackParamList } from "../../navigation/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator } from "react-native-paper";

type WalletTopupCancelProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

export default function WalletTopupCancelScreen({ navigation }: WalletTopupCancelProps) {
  const [countdown, setCountdown] = React.useState(5);

  useEffect(() => {
    if (Platform.OS === "web") localStorage.getItem("orderCode");
    else AsyncStorage.getItem("orderCode");

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, color: "green", fontWeight: "bold" }}>
        Nạp tiền đã bị hủy!
      </Text>
      <Text style={{ fontSize: 18, marginBottom: 16 }}>
          Đang chuyển về trang cá nhân trong {countdown} giây...
        </Text>
      <ActivityIndicator size="large" color="green" />
    </View>
  );
}