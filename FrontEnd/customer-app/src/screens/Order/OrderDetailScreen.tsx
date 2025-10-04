// src/screens/Order/OrderDetailScreen.tsx
import React, { useEffect } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSelector, useDispatch } from "react-redux";
import { RootStackParamList } from "../../navigation/types";
import colors from "../../constants/colors";
import { useOrders } from "../../hooks/useOrders";
import { RootState, AppDispatch } from "../../redux/store";
import { fetchBranches } from "../../redux/branchSlice";
import { fetchTickets } from "../../redux/ticketSlice";
import QRCode from "react-native-qrcode-svg";

type Props = NativeStackScreenProps<RootStackParamList, "OrderDetail">;

export default function OrderDetailScreen({ route }: Props) {
  const { orderId } = route.params;
  const { currentOrder, fetchOrderById, loading } = useOrders();

  const dispatch = useDispatch<AppDispatch>();
  const branches = useSelector((state: RootState) => state.branch.branches);
  const tickets = useSelector((state: RootState) => state.ticket.tickets);

  useEffect(() => {
    dispatch(fetchBranches());
    dispatch(fetchTickets());
    fetchOrderById(orderId);
  }, [orderId]);

  // helper map ticketTypeId -> branch
  const getBranchByTicketType = (ticketTypeId: number | undefined) => {
    if (!ticketTypeId) return undefined;
    const ticket = tickets.find((t) => t.id === ticketTypeId);
    if (!ticket) return undefined;
    return branches.find((b) => b.id === ticket.parkBranchId);
  };

  if (loading || !currentOrder) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 8, color: colors.textSecondary }}>
          Đang tải chi tiết đơn hàng...
        </Text>
      </View>
    );
  }

  // lấy branch từ ticket đầu tiên trong order
  const firstTicket = currentOrder.details[0];
  const branch = getBranchByTicketType(firstTicket?.ticketTypeId);

  // tính tổng tiền
  const totalOriginal = currentOrder.details.reduce(
    (sum, d) => sum + d.price * d.quantity,
    0
  );
  
  const totalAmount = currentOrder.finalAmount; 
const totalDiscount = totalOriginal - totalAmount;
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 16 }}>
        Chi tiết đơn hàng của bạn
      </Text>

      {/* Thông tin chi nhánh */}
      {branch && (
        <View style={{ marginBottom: 16 }}>
          <Text
            style={{ fontSize: 16, fontWeight: "600", color: colors.textPrimary }}
          >
            Chi nhánh: {branch.name}
          </Text>
          <Text style={{ fontSize: 14, color: colors.textSecondary }}>
            Địa chỉ: {branch.address}
          </Text>
        </View>
      )}

      {/* Thông tin đơn hàng */}
      <Text style={{ fontSize: 16, marginBottom: 8 }}>
        Trạng thái: {currentOrder.status}
      </Text>
      <Text style={{ fontSize: 16, marginBottom: 8 }}>
        Tổng giá gốc: {totalOriginal.toLocaleString()} VND
      </Text>
      <Text style={{ fontSize: 16, marginBottom: 8 }}>
        Giảm giá: {totalDiscount.toLocaleString()} VND
      </Text>
      <Text style={{ fontSize: 16, marginBottom: 8, fontWeight: "600", color: colors.primary }}>
        Tổng thanh toán: {totalAmount.toLocaleString()} VND
      </Text>

      {/* Danh sách vé */}
      <FlatList
        data={currentOrder.details}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => {
          const pass = currentOrder.passes?.[index]; // mapping theo index
          return (
            <View
              style={{
                backgroundColor: colors.surface,
                padding: 12,
                borderRadius: 8,
                marginBottom: 12,
              }}
            >
              <Text style={{ fontWeight: "bold", color: colors.textPrimary }}>
                {item.ticketTypeName}
              </Text>
              <Text style={{ color: colors.textSecondary }}>
                Ngày sử dụng: {new Date(item.ticketDate).toLocaleDateString()}
              </Text>
              <Text style={{ color: colors.textSecondary }}>
                Số lượng: {item.quantity} - Giá: {item.price.toLocaleString()} VND
              </Text>
              <Text style={{ color: colors.textSecondary }}>
                Giảm giá: {item.discount.toLocaleString()} VND
              </Text>
              <Text style={{ color: colors.primary, fontWeight: "600" }}>
                Thành tiền: {item.finalPrice.toLocaleString()} VND
              </Text>

              {/* QR Code cho pass */}
              {pass && (
                <View style={{ marginTop: 12, alignItems: "center" }}>
                  <QRCode value={pass.link} size={120} />
                  <Text style={{ marginTop: 8, color: colors.textSecondary }}>
                    Mã: {pass.code}
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                    Trạng thái: {pass.status}
                  </Text>
                </View>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}
