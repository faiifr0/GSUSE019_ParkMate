import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";
import colors from "../../constants/colors";
import { useOrders } from "../../hooks/useOrders";
import { CreateOrderPayload } from "../../types/Order";

type Props = NativeStackScreenProps<RootStackParamList, "OrderConfirm">;

export default function OrderConfirmScreen({ route, navigation }: Props) {
  const { cart, branchId } = route.params;
  const { createOrder, loading } = useOrders();

  const [voucher, setVoucher] = useState("");
  const total = cart.reduce(
    (sum: number, item: any) => sum + item.ticket.basePrice * item.quantity,
    0
  );

  const handleConfirm = async () => {
    try {
      const payload: CreateOrderPayload = {
        branchId,
        details: cart.map((c: any) => ({
          ticketTypeId: c.ticket.id,
          quantity: c.quantity,
        })),
        ticketDate: new Date().toISOString(),
        customerName: "Khách lẻ",
        customerAge: 25,
        customerPhone: "0900000000",
        customerEmail: "test@example.com",
        voucher,
      };

      const order = await createOrder(payload);
      navigation.navigate("OrderDetail", { orderId: order.id });
    } catch (err) {
      console.log("Error creating order", err);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: colors.background }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 16 }}>
        Xác nhận đơn hàng
      </Text>

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
        ListFooterComponent={
          <>
            <TextInput
              placeholder="Nhập mã giảm giá"
              value={voucher}
              onChangeText={setVoucher}
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 8,
                padding: 10,
                marginTop: 16,
                backgroundColor: "#fff",
              }}
            />
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
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
                {loading ? "Đang xử lý..." : "Xác nhận đặt vé"}
              </Text>
            </TouchableOpacity>
          </>
        }
      />
    </View>
  );
}
