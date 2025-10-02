// src/screens/Wallet/WalletScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Alert, TextInput } from "react-native";
import { walletService } from "../../services/walletService";
import { Wallet } from "../../types/Wallet";
import { Transaction } from "../../types/Transaction"; // Update the path as needed
import colors from "../../constants/colors";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../../hooks/useAuth";

type WalletScreenProp = NativeStackNavigationProp<RootStackParamList, "Wallet">;

export default function WalletScreen() {
  const navigation = useNavigation<WalletScreenProp>();
  const { wallet } = useAuth(); // lấy wallet từ hook useAuth
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [topUpAmount, setTopUpAmount] = useState<string>("");

  useEffect(() => {
    if (wallet) fetchWalletData(wallet);
  }, [wallet]);

  const fetchWalletData = async (w: Wallet) => {
    try {
      setLoading(true);
      const t = await walletService.getTransactions(w.id);
      setTransactions(t);
    } catch (err) {
      console.error(err);
      Alert.alert("Lỗi", "Không thể tải giao dịch");
    } finally {
      setLoading(false);
    }
  };

  const handleTopUp = async () => {
    const amount = parseInt(topUpAmount);
    if (!amount || amount <= 0) {
      Alert.alert("Lỗi", "Nhập số tiền hợp lệ");
      return;
    }
    try {
      if (!wallet) throw new Error("Wallet not loaded");

      const { checkoutUrl } = await walletService.topUp(wallet.id, amount, "myapp://success", "myapp://cancel");

      navigation.navigate("TopUp", { walletId: wallet.id, amount, checkoutUrl });

      setTopUpAmount("");
      fetchWalletData(wallet);
    } catch (err) {
      console.error(err);
      Alert.alert("Lỗi", "Không thể nạp tiền");
    }
  };

  if (loading || !wallet) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: colors.background }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", color: colors.textPrimary }}>Ví của bạn</Text>
      <Text style={{ fontSize: 18, marginTop: 12, color: colors.textSecondary }}>
        Số dư hiện tại: {wallet.balance} coin
      </Text>

      <View style={{ flexDirection: "row", marginTop: 16, alignItems: "center" }}>
        <TextInput
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: colors.border,
            padding: 8,
            borderRadius: 8,
            marginRight: 8,
            color: colors.textPrimary,
          }}
          placeholder="Nhập số tiền"
          keyboardType="numeric"
          value={topUpAmount}
          onChangeText={setTopUpAmount}
        />
        <TouchableOpacity
          style={{
            backgroundColor: colors.primary,
            paddingVertical: 10,
            paddingHorizontal: 16,
            borderRadius: 8,
          }}
          onPress={handleTopUp}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Nạp tiền</Text>
        </TouchableOpacity>
      </View>

      <Text style={{ fontSize: 18, marginTop: 24, fontWeight: "bold", color: colors.textPrimary }}>
        Lịch sử giao dịch
      </Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        style={{ marginTop: 12 }}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 12,
              borderRadius: 8,
              backgroundColor: colors.surface,
              marginBottom: 8,
            }}
          >
            <Text style={{ color: colors.textPrimary }}>
              {item.type} {item.amount} coin
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
              {new Date(item.createdAt).toLocaleString()}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
