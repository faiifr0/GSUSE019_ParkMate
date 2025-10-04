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

type Props = NativeStackScreenProps<RootStackParamList, "OrderConfirm">;

export default function OrderConfirmScreen({ route, navigation }: Props) {
  const { cart, branchId } = route.params;
  const { createOrder, loading } = useOrders();
  const user = useSelector((state: RootState) => state.user.userInfo);

  // Voucher
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [selectedVoucher, setSelectedVoucher] = useState<string>("");

  // Ngày đặt
  const now = new Date();
  const [date, setDate] = useState(new Date(now.getTime() + 4 * 60 * 60 * 1000)); // default +4h
  const [showPicker, setShowPicker] = useState(false);
  const [dateInput, setDateInput] = useState("");

  const MIN_DATE = new Date(now.getTime() + 3 * 60 * 60 * 1000);
  const MAX_DATE = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const formatDate = (d: Date) =>
    `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;

  const validateDate = (d: Date) => {
    if (d < MIN_DATE) {
      Alert.alert("Ngày không hợp lệ", "Phải mua trước 3 giờ cùng ngày.");
      return false;
    }
    if (d > MAX_DATE) {
      Alert.alert("Ngày không hợp lệ", "Không được mua trước quá 7 ngày.");
      return false;
    }
    return true;
  };

  const parseDateString = (input: string): Date | null => {
    input = input.trim();
    if (!input) return null;

    // YYYYMMDD
    if (/^\d{8}$/.test(input)) {
      const year = parseInt(input.slice(0, 4), 10);
      const month = parseInt(input.slice(4, 6), 10) - 1;
      const day = parseInt(input.slice(6, 8), 10);
      return new Date(year, month, day, 12);
    }

    // DD/MM/YYYY hoặc DD-MM-YYYY
    const match = input.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
    if (match) {
      const day = parseInt(match[1], 10);
      const month = parseInt(match[2], 10) - 1;
      const year = parseInt(match[3], 10);
      return new Date(year, month, day, 12);
    }

    return null;
  };

  const handleConfirm = async () => {
    if (!cart.length) {
      Alert.alert("Lỗi", "Giỏ hàng đang trống");
      return;
    }

    const totalTickets = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (totalTickets > 10) {
      Alert.alert("Lỗi", "Bạn chỉ có thể đặt tối đa 10 vé");
      return;
    }

    let selectedDate = date;

    if (dateInput) {
      const parsed = parseDateString(dateInput);
      if (!parsed) {
        Alert.alert("Lỗi ngày", "Ngày nhập không hợp lệ");
        return;
      }
      selectedDate = parsed;
    }

    if (!validateDate(selectedDate)) return;

    const customerAge = user?.dob
      ? new Date().getFullYear() - new Date(user.dob).getFullYear()
      : 25;

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

      const order = await createOrder(payload);

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

  const onChangeDate = (_event: any, selected?: Date) => {
    setShowPicker(Platform.OS === "ios");
    if (selected && validateDate(selected)) {
      setDate(selected);
      setDateInput(formatDate(selected));
    }
  };

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

  // Tổng tiền & giảm giá
  const total = cart.reduce(
    (sum, item) => sum + item.ticket.basePrice * item.quantity,
    0
  );
  const discount = selectedVoucher
    ? total * (vouchers.find((v) => v.code === selectedVoucher)?.percent ?? 0)
    : 0;
  const finalTotal = total - discount;

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: colors.background }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 16 }}>
        Xác nhận đơn hàng
      </Text>

      {/* Chọn ngày */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ marginBottom: 6, fontWeight: "bold" }}>Ngày sử dụng</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 8,
            paddingHorizontal: 10,
            backgroundColor: "#fff",
          }}
        >
          <TextInput
            style={{ flex: 1, fontSize: 16, paddingVertical: 10 }}
            placeholder="Chọn hoặc nhập ngày (dd-mm-yyyy)"
            value={dateInput || formatDate(date)}
            onChangeText={setDateInput}
            onEndEditing={() => {
              if (dateInput) {
                const parsed = parseDateString(dateInput);
                if (!parsed || !validateDate(parsed)) {
                  setDateInput(""); // reset nếu nhập sai
                  return;
                }
                setDate(parsed);
                setDateInput(formatDate(parsed));
              }
            }}
          />
          <TouchableOpacity onPress={() => setShowPicker(true)}>
            <Text style={{ fontSize: 22, marginLeft: 8 }}>📅</Text>
          </TouchableOpacity>
        </View>
        {showPicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            minimumDate={MIN_DATE}
            maximumDate={MAX_DATE}
            onChange={onChangeDate}
          />
        )}
      </View>

      {/* Giỏ hàng + voucher + tổng */}
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
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontWeight: "bold", marginBottom: 8 }}>Chọn voucher (tùy chọn):</Text>
            <FlatList
              data={vouchers.filter((v) => voucherService.isValidNow(v))}
              keyExtractor={(item) => item.code}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() =>
                    setSelectedVoucher((prev) => (prev === item.code ? "" : item.code))
                  }
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    marginRight: 8,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: selectedVoucher === item.code ? colors.primary : "#ddd",
                    backgroundColor: selectedVoucher === item.code ? "#E0F0FF" : "#fff",
                  }}
                >
                  <Text style={{ fontWeight: "600" }}>
                    {item.code} - {item.percent * 100}%
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        }
        ListFooterComponent={
          <View style={{ marginTop: 16 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
              <Text style={{ fontSize: 16 }}>Tổng tiền:</Text>
              <Text style={{ fontSize: 16, color: "#333" }}>{total.toLocaleString()} VND</Text>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
              <Text style={{ fontSize: 16 }}>Khuyến mãi:</Text>
              <Text style={{ fontSize: 16, color: colors.primary }}>
                -{discount.toLocaleString()} VND
              </Text>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>Tổng thanh toán:</Text>
              <Text style={{ fontSize: 18, fontWeight: "bold", color: colors.primary }}>
                {finalTotal.toLocaleString()} VND
              </Text>
            </View>

            <Text style={{ fontSize: 12, color: "#888", marginBottom: 10 }}>
              Bạn có thể không chọn voucher nếu muốn.
            </Text>

            <TouchableOpacity
              style={{
                marginTop: 10,
                backgroundColor: colors.primary,
                padding: 14,
                borderRadius: 12,
                alignItems: "center",
              }}
              onPress={handleConfirm}
              disabled={loading}
            >
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
                {loading ? "Đang xử lý..." : "Xác nhận đặt vé"}
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}
