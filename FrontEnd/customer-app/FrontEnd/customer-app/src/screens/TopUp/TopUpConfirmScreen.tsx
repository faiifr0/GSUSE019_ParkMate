import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Linking, Platform } from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/types";
import { WebView } from "react-native-webview";
import colors from "../../constants/colors";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type TopUpRoute = RouteProp<RootStackParamList, "TopUp">;
type TopUpNavigation = NativeStackNavigationProp<RootStackParamList, "TopUp">;

export default function TopUpConfirmScreen() {
  // Tạo URL trả về và hủy bỏ  
  const route = useRoute<TopUpRoute>();
  const navigation = useNavigation<TopUpNavigation>();
  const { walletId, amount, checkoutUrl, orderCode } = route.params;

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Xác nhận thanh toán</Text>

      {/* Card hiển thị thông tin */}
      <View style={styles.card}>
        <Text style={styles.label}>Ví ID: {walletId}</Text>
        <Text style={styles.amount}>{amount} coin</Text>
        <Text style={styles.note}>Hệ thống sẽ tự động cập nhật số dư sau khi bạn hoàn tất thanh toán.</Text>
      </View>

      {/* WebView thanh toán */}
      {Platform.OS !== 'web' && (
      <View style={styles.webviewWrapper}>
        <WebView source={{ uri: checkoutUrl }} style={styles.webview} />
      </View>
      )}
      
      {/* Link thanh toán */}
      <View style={{ marginBottom: 12 }}>
        {Platform.OS === 'web' && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => Linking.openURL(checkoutUrl)}
        >
          <Text style={styles.buttonText}>Mở tab mới để tiến hành thanh toán</Text>
        </TouchableOpacity>
        )}
      </View>

      {Platform.OS !== "web" && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("WalletTopupSuccessScreen")}
        >
          <Text style={styles.buttonText}>Hoàn tất nạp tiền</Text>
        </TouchableOpacity>
      )}

      {/* Nút trở về ví */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Quay lại ví</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 16,
    textAlign: "center",
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  amount: {
    fontSize: 26,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 8,
  },
  note: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  webviewWrapper: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
  },
  webview: {
    flex: 1,
  },
  button: {
    backgroundColor: colors.secondary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
