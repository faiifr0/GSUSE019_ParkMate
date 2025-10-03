import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { View, Text, Platform, ActivityIndicator } from "react-native";
import { RootStackParamList } from "../../navigation/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import topupService from "../../services/topupService";

type WalletTopupSuccessProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

export default function WalletTopupSuccessScreen({ navigation }: WalletTopupSuccessProps) {
  const [orderCode, setOrderCode] = useState("");
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    (async () => {
      let code = "";
      if (Platform.OS === "web") {
        code = localStorage.getItem("orderCode") || "None";
      } else {
        code = await AsyncStorage.getItem("orderCode") || "None";
      }

      setOrderCode(code);
      console.log("Retrieved orderCode:", code);
    })();
  }, [])

  useEffect(() => {    
    if (orderCode && orderCode != "None") {
      console.log("Nạp tiền thành công, orderCode:", orderCode);
    }
  }, [orderCode]);
  
  // run some success logic here, e.g., refresh wallet balance
  useEffect(() => {
    if (!orderCode || orderCode === "None") {
      console.log("Không tìm thấy orderCode, bỏ qua xử lý nạp tiền.");      
      return;
    }

    (async () => {
      try {
        const res = await topupService.settleOrderCode(parseInt(orderCode));
        console.log("Settle orderCode result:", res);
        // Xoá orderCode đã dùng
        if (Platform.OS === "web") localStorage.removeItem("orderCode");
        else await AsyncStorage.removeItem("orderCode");        
        setTimeout(() => {
          navigation.navigate("Profile");
        }, 5000);
      } catch (error) {
        console.error("Lỗi khi xử lý nạp tiền:", error);
      }
    })();
  }, [orderCode]);

  useEffect(() => {
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
      <Text style={{ fontSize: 24, color: "green", fontWeight: "bold", marginBottom: 16 }}>
        Nạp tiền thành công!
      </Text>
      <Text style={{ fontSize: 18, marginBottom: 16 }}>
        Đang chuyển về trang cá nhân trong {countdown} giây...
      </Text>
      <ActivityIndicator size="large" color="green" />
    </View>
  );
}