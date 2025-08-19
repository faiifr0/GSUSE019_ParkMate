import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import axios from "axios";
import styles from "../../styles/TopUpScreenStyles"; // Assuming you have a styles file for this screen

export default function TopUpScreen({ navigation }: any) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTopUp = async () => {
    if (!amount || Number(amount) <= 0) {
      Alert.alert("Lỗi", "Vui lòng nhập số tiền hợp lệ!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://test-payment.momo.vn/v2/create_payment",
        {
          partnerCode: "YOUR_PARTNER_CODE", // Thay bằng mã từ MoMo
          orderId: `ORDER_${Date.now()}`,
          amount: Number(amount) * 1000, // Chuyển sang VND
          requestId: `REQ_${Date.now()}`,
          description: "Nạp tiền vào ví",
          callbackUrl: "https://your-backend.com/api/callback", // Cần backend
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer YOUR_ACCESS_TOKEN`, // Từ MoMo
          },
        }
      );

      const { payUrl } = response.data;
      if (payUrl) {
        // Mở URL trong trình duyệt hoặc quét QR
        Alert.alert("Thành công", "Vui lòng thanh toán qua MoMo!", [
          { text: "OK", onPress: () => navigation.navigate("Profile") },
        ]);
        // Gọi API /api/transactions sau khi thanh toán thành công (cần callback)
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể kết nối với MoMo!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nạp Tiền Vào Ví</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập số tiền (VND)"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <TouchableOpacity style={styles.button} onPress={handleTopUp} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Đang xử lý..." : "Thanh toán với MoMo"}</Text>
      </TouchableOpacity>
    </View>
  );
}