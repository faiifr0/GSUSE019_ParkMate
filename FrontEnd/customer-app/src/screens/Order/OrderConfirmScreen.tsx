// src/screens/Order/OrderConfirmScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";
import colors from "../../constants/colors";
import { useOrders } from "../../hooks/useOrders";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import voucherService from "../../services/voucherService";
import { Voucher } from "../../types/Voucher";

// Utils parse ngày từ string
const parseDateString = (input: string): Date | null => {
  input = input.trim();
  if (!input) return null;

  // YYYYMMDD
  if (/^\d{8}$/.test(input)) {
    const year = parseInt(input.slice(0, 4), 10);
    const month = parseInt(input.slice(4, 6), 10) - 1;
    const day = parseInt(input.slice(6, 8), 10);
    return new Date(year, month, day);
  }

  // DD/MM/YYYY hoặc DD-MM-YYYY
  const match = input.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (match) {
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1;
    const year = parseInt(match[3], 10);
    return new Date(year, month, day);
  }

  return null;
};

type Props = NativeStackScreenProps<RootStackParamList, "OrderConfirm">;

export default function OrderConfirmScreen({ route, navigation }: Props) {
  const { cart, branchId } = route.params;
  const { createOrder, loading } = useOrders();
  const user = useSelector((state: RootState) => state.user.userInfo);

  // Voucher
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [selectedVoucher, setSelectedVoucher] = useState<string>("");

  // Ngày đặt
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  });
  const [showPicker, setShowPicker] = useState(false);
  const [dateInput, setDateInput] = useState("");

  // Tính tổng và số vé
  const total = cart.reduce(
    (sum, item) => sum + item.ticket.basePrice * item.quantity,
    0
  );
  const totalTickets = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Tính tuổi khách
  const customerAge = user?.dob
    ? new Date().getFullYear() - new Date(user.dob).getFullYear()
    : 25;

  // Load voucher cho chi nhánh
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const data = await voucherService.getByBranchId(branchId);
        setVouchers(data);
      } catch (err) {
        console.log("Lỗi tải voucher:", err);
      }
    };
    fetchVouchers();
  }, [branchId]);

  const handleConfirm = async () => {
    console.log("createOrders",selectedVoucher);
    if (!cart.length) {
      Alert.alert("Lỗi", "Giỏ hàng đang trống");
      return;
    }
    if (totalTickets > 10) {
      Alert.alert("Lỗi", "Bạn chỉ có thể đặt tối đa 10 vé");
      return;
    }

    // Parse ngày nhập tay nếu có
    let selectedDate = date;
    if (dateInput) {
      const parsed = parseDateString(dateInput);
      if (!parsed) {
        Alert.alert("Lỗi ngày", "Ngày không hợp lệ");
        return;
      }
      selectedDate = parsed;
    }

    const now = new Date();
    const minTime = new Date(now.getTime() + 3 * 60 * 60 * 1000);
    const maxDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    if (selectedDate < minTime || selectedDate > maxDate) {
      Alert.alert(
        "Lỗi ngày đặt vé",
        "Chọn ngày hợp lệ: tối thiểu 3 giờ sau và tối đa 7 ngày kể từ hôm nay"
      );
      return;
    }

    try {
      const payload = {
        branchId,
        details: cart.map((c) => ({
          ticketTypeId: c.ticket.id,
          quantity: c.quantity,
        })),
        ticketDate: selectedDate.toISOString().split("T")[0],
        customerName: user?.fullName ?? "Khách lẻ",
        customerAge,
        customerPhone: user?.phoneNumber ?? "0900000000",
        customerEmail: user?.email ?? "test@example.com",
        voucherCode: selectedVoucher || undefined,
      };

      console.log("Gửi payload API:", payload);
      const order = await createOrder(payload);
      console.log("Dữ liệu trả về từ API:", order);

      if (!order) {
        Alert.alert("Lỗi", "Không thể tạo đơn hàng");
        return;
      }
      if (order.status === "FAILED") {
        Alert.alert("Lỗi", "Số dư không đủ hoặc voucher không hợp lệ");
        return;
      }

      navigation.navigate("OrderDetail", { orderId: order.orderId });
    } catch (err: any) {
      console.log("Error creating order", err);
      Alert.alert(
        "Lỗi server",
        err.response?.data?.message || "Có lỗi xảy ra khi tạo đơn hàng"
      );
    }
  };

  const onChangeDate = (_event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === "ios");
    if (selectedDate) {
      setDate(selectedDate);
      setDateInput("");
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: colors.background }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 16 }}>
        Xác nhận đơn hàng
      </Text>

      {/* Chọn ngày */}
      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        style={{
          padding: 12,
          borderWidth: 1,
          borderColor: "#ddd",
          borderRadius: 8,
          backgroundColor: "#fff",
          marginBottom: 8,
        }}
      >
        <Text>Ngày sử dụng: {date.toDateString()}</Text>
      </TouchableOpacity>

      {/* Nhập ngày bằng tay */}
      <TextInput
        placeholder="Nhập ngày (29102025 / 25/10/2025 / 26-10-2025)"
        value={dateInput}
        onChangeText={setDateInput}
        style={{
          borderWidth: 1,
          borderColor: "#ddd",
          borderRadius: 8,
          padding: 10,
          backgroundColor: "#fff",
          marginBottom: 16,
        }}
      />

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          minimumDate={new Date(Date.now() + 3 * 60 * 60 * 1000)}
          maximumDate={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)}
          onChange={onChangeDate}
        />
      )}

      {/* List giỏ hàng */}
      <FlatList
        data={cart}
        keyExtractor={(item) => item.ticket.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <Text style={{ fontSize: 16 }}>
              {item.ticket.name} x {item.quantity}
            </Text>
            <Text style={{ fontSize: 16, color: colors.primary }}>
              {(item.ticket.basePrice * item.quantity).toLocaleString()} VND
            </Text>
          </View>
        )}
        ListHeaderComponent={
          <>
            <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
              Chọn voucher:
            </Text>
            <FlatList
              data={vouchers.filter((v) => voucherService.isValidNow(v))}
              keyExtractor={(item) => item.code}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ marginBottom: 16 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => setSelectedVoucher(item.code)}
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    marginRight: 8,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor:
                      selectedVoucher === item.code ? colors.primary : "#ddd",
                    backgroundColor:
                      selectedVoucher === item.code ? "#E0F0FF" : "#fff",
                  }}
                >
                  <Text style={{ fontWeight: "600" }}>
                    {item.code} - {item.percent * 100}%
                  </Text>
                </TouchableOpacity>
              )}
            />
          </>
        }
        ListFooterComponent={
          <>
            <Text style={{ fontSize: 18, fontWeight: "600", marginTop: 16 }}>
              Tổng: {total.toLocaleString()} VND
            </Text>

            <TouchableOpacity
              style={{
                marginTop: 20,
                backgroundColor: colors.primary,
                padding: 14,
                borderRadius: 12,
                alignItems: "center",
              }}
              onPress={handleConfirm}
              disabled={loading}
            >
              <Text
                style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}
              >
                {loading ? "Đang xử lý..." : "Xác nhận đặt vé"}
              </Text>
            </TouchableOpacity>
          </>
        }
      />
    </View>
  );
}
