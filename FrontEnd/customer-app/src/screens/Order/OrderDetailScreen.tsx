import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSelector, useDispatch } from "react-redux";
import QRCode from "react-native-qrcode-svg";

import { RootStackParamList } from "../../navigation/types";
import colors from "../../constants/colors";
import { useOrders } from "../../hooks/useOrders";
import { RootState, AppDispatch } from "../../redux/store";
import { fetchBranches } from "../../redux/branchSlice";
import { fetchTickets } from "../../redux/ticketSlice";
import orderService from "../../services/orderService";

type Props = NativeStackScreenProps<RootStackParamList, "OrderDetail">;

export default function OrderDetailScreen({ route }: Props) {
  const { orderId } = route.params;
  const { currentOrder, fetchOrderById, loading } = useOrders();
  const dispatch = useDispatch<AppDispatch>();

  const branches = useSelector((state: RootState) => state.branch.branches);
  const tickets = useSelector((state: RootState) => state.ticket.tickets);

  const [refundLoading, setRefundLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchBranches());
    dispatch(fetchTickets());
    fetchOrderById(orderId);
  }, [orderId]);

  const getBranchByTicketType = (ticketTypeId: number | undefined) => {
    if (!ticketTypeId) return undefined;
    const ticket = tickets.find((t) => t.id === ticketTypeId);
    if (!ticket) return undefined;
    return branches.find((b) => b.id === ticket.parkBranchId);
  };

  const handleRefund = () => {
    Alert.alert(
      "Xác nhận hoàn tiền",
      "Bạn có chắc chắn muốn hoàn tiền cho đơn hàng này?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xác nhận",
          onPress: async () => {
            if (!currentOrder) return;
            setRefundLoading(true);
            try {
              await orderService.refund(currentOrder.orderId, {
                reason: "Khách yêu cầu hoàn tiền",
              });
              Alert.alert("Hoàn tiền thành công");
              fetchOrderById(orderId);
            } catch (error: any) {
              Alert.alert("Hoàn tiền thất bại", error.message);
            } finally {
              setRefundLoading(false);
            }
          },
        },
      ]
    );
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

  const firstTicket = currentOrder.details[0];
  const branch = getBranchByTicketType(firstTicket?.ticketTypeId);
  const totalOriginal = currentOrder.details.reduce(
    (sum, d) => sum + d.price * d.quantity,
    0
  );
  const totalAmount = currentOrder.finalAmount;
  const totalDiscount = totalOriginal - totalAmount;

  // Hiển thị trạng thái thân thiện
  const displayStatus =
    currentOrder.status === "REFUNDED" ? "Đã hoàn" : currentOrder.status;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 16 }}
    >
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 16 }}>
        Chi tiết đơn hàng
      </Text>

      {/* Thông tin chi nhánh */}
      {branch && (
        <View
          style={{
            backgroundColor: colors.surface,
            padding: 12,
            borderRadius: 10,
            marginBottom: 16,
          }}
        >
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

      {/* Trạng thái & thanh toán */}
      <View
        style={{
          backgroundColor: colors.surface,
          padding: 12,
          borderRadius: 10,
          marginBottom: 16,
        }}
      >
        <Text style={{ fontSize: 16, marginBottom: 6 }}>Trạng thái: {displayStatus}</Text>
        <Text style={{ fontSize: 16, marginBottom: 6 }}>
          Tổng giá gốc: {totalOriginal.toLocaleString()} VND
        </Text>
        <Text style={{ fontSize: 16, marginBottom: 6 }}>
          Giảm giá: {totalDiscount.toLocaleString()} VND
        </Text>
        <Text style={{ fontSize: 16, fontWeight: "600", color: colors.primary }}>
          Tổng thanh toán: {totalAmount.toLocaleString()} VND
        </Text>
      </View>

      {/* Nút hoàn tiền */}
      {!["REFUNDED"].includes(currentOrder.status) && (
        <TouchableOpacity
          onPress={handleRefund}
          disabled={refundLoading}
          style={{
            backgroundColor: colors.primary,
            padding: 14,
            borderRadius: 10,
            marginBottom: 16,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
            {refundLoading ? "Đang xử lý..." : "Hoàn tiền"}
          </Text>
        </TouchableOpacity>
      )}

      {/* Danh sách vé */}
      <FlatList
        data={currentOrder.details}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => {
          const pass = currentOrder.passes?.[index];
          return (
            <View
              style={{
                backgroundColor: colors.surface,
                padding: 12,
                borderRadius: 10,
                marginBottom: 12,
              }}
            >
              <Text
                style={{ fontWeight: "bold", fontSize: 16, color: colors.textPrimary }}
              >
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
              <Text
                style={{ color: colors.primary, fontWeight: "600", marginTop: 4 }}
              >
                Thành tiền: {item.finalPrice.toLocaleString()} VND
              </Text>

              {pass && (
                <View
                  style={{
                    marginTop: 12,
                    alignItems: "center",
                    backgroundColor: "#f7f7f7",
                    padding: 8,
                    borderRadius: 8,
                  }}
                >
                  <QRCode value={pass.link} size={120} />
                  <Text style={{ marginTop: 6, color: colors.textSecondary }}>
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
    </ScrollView>
  );
}
