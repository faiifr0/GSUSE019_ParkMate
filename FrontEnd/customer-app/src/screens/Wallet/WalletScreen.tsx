// src/screens/Wallet/WalletScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Alert, TextInput, Platform } from "react-native";
import { Transaction } from "../../types/Transaction"; // Update the path as needed
import colors from "../../constants/colors";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { transactionService } from "../../services/transactionService";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { useWallet } from "../../hooks/useWallet";
import { getWalletId } from "../../api/axiosClient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import topupService from "../../services/topupService";

type WalletScreenProp = NativeStackNavigationProp<RootStackParamList, "Wallet">;

export default function WalletScreen() {
  const user = useSelector((state: RootState) => state.user.userInfo);
  const navigation = useNavigation<WalletScreenProp>();
  //const { wallet } = useAuth(); // lấy wallet từ hook useAuth
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [topUpAmount, setTopUpAmount] = useState<string>("");
  const [walletId, setWalletId] = useState<number>(0);
  const { balance: walletBalance } = useWallet();

  // useEffect(() => {
  //   if (wallet) fetchWalletData(wallet);
  // }, [wallet]);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const t = await transactionService.getOfUser();
      setTransactions(t);
      const walletId = await getWalletId();      
      setWalletId(walletId!);
      console.log("Fetched transactions:", t);
      console.log("Fetched walletId:", walletId);
    } catch (err) {
      console.error(err);
      Alert.alert("Lỗi", "Không thể tải giao dịch");
    } finally {
      setLoading(false);
    }
  };

  const handleTopUp = async () => {
    console.log("Button pressed");
    const amount = parseInt(topUpAmount);
    console.log("Amount:", amount);

    if (!amount || amount < 2000) {      
      Alert.alert("Lỗi", "Nhập số tiền không hợp lệ (ít nhất là 2000 coin)");
      return;
    }

    try {    
      console.log("Initiating top-up for walletId:", walletId, "amount:", amount);

      const returnUrl = Platform.OS === "web"
      ? "http://localhost:8081/wallet/success" // ### still local here
      : "parkmate://wallet/success";

      const { checkoutUrl, paymentLinkId, orderCode } = await topupService.topUp(walletId, amount, returnUrl, "parkmate://wallet/cancel");

      console.log("Top-up initiated, checkoutUrl:", checkoutUrl, "orderCode:", orderCode);

      // set orderCode vào localStorage hoặc AsyncStorage để dùng khi xử lý deep link
      if (Platform.OS === "web") localStorage.setItem("orderCode", orderCode.toString());
      else AsyncStorage.setItem("orderCode", orderCode.toString());
      
      fetchWalletData();

      navigation.navigate("TopUp", { walletId: walletId, amount: parseInt(topUpAmount), checkoutUrl: checkoutUrl, orderCode: orderCode });
    } catch (err) {
      console.error(err);
      Alert.alert("Lỗi", "Không thể nạp tiền");
    }
  };

  // if (loading || !wallet) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <ActivityIndicator size="large" color={colors.primary} />
  //     </View>
  //   );
  // }

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: colors.background }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", color: colors.textPrimary }}>Ví của bạn</Text>
      <Text style={{ fontSize: 18, marginTop: 12, color: colors.textSecondary }}>
        Số dư hiện tại: {walletBalance} coin
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
        data={[...transactions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())}
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
              {item.amount} coin / Nội dung: {item.type} 
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
