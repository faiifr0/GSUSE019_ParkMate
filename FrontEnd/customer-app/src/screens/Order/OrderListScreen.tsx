import React, { useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSelector, useDispatch } from "react-redux";
import { RootStackParamList } from "../../navigation/types";
import colors from "../../constants/colors";
import { useOrders } from "../../hooks/useOrders";
import { RootState, AppDispatch } from "../../redux/store";
import { fetchBranches } from "../../redux/branchSlice";
import { fetchTickets } from "../../redux/ticketSlice";

type Props = NativeStackScreenProps<RootStackParamList, "OrderList">;

export default function OrderListScreen({ navigation }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, fetchOrdersByUser, loading } = useOrders();
  const user = useSelector((state: RootState) => state.user.userInfo);
  const branches = useSelector((state: RootState) => state.branch.branches);
  const tickets = useSelector((state: RootState) => state.ticket.tickets);

  // Load branches và tickets khi mount
  useEffect(() => {
    dispatch(fetchBranches());
    dispatch(fetchTickets());
  }, [dispatch]);

  // Load đơn hàng user
  useEffect(() => {
  if (user?.id) {
    console.log("[OrderListScreen] fetching orders for user:", user.id);
    fetchOrdersByUser(user.id);
  }
}, [user]);


  // Helper map ticketTypeId -> branch
  const getBranchName = (ticketTypeId: number | undefined) => {
    if (!ticketTypeId) return "Chưa có thông tin";
    const ticket = tickets.find(t => t.id === ticketTypeId);
    if (!ticket) return "Chưa có thông tin";
    const branch = branches.find(b => b.id === ticket.parkBranchId);
    return branch?.name || "Chưa có thông tin";
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 8, color: colors.textSecondary }}>Đang tải đơn hàng...</Text>
      </View>
    );
  }

  if (!orders.length) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
        <Text style={{ color: colors.textSecondary }}>Chưa có đơn hàng nào</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.orderId.toString()}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => {
          const totalPrice = item.details.reduce((sum, d) => sum + d.finalPrice, 0);
          const orderDate = item.details[0]?.ticketDate || "";
          const branchName = getBranchName(item.details[0]?.ticketTypeId);

          return (
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 12,
                padding: 16,
                marginBottom: 12,
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 16, color: colors.textPrimary }}>
                Order #{item.orderId} - {item.status}
              </Text>
              <Text style={{ marginTop: 4, color: colors.textSecondary }}>Ngày: {orderDate}</Text>
              <Text style={{ marginTop: 2, color: colors.textSecondary }}>Chi nhánh: {branchName}</Text>
              <Text style={{ marginTop: 2, color: colors.textSecondary }}>Tổng: {totalPrice.toLocaleString()} VND</Text>

              <TouchableOpacity
                style={{
                  marginTop: 12,
                  backgroundColor: colors.primary,
                  paddingVertical: 10,
                  borderRadius: 8,
                  alignItems: "center",
                }}
                onPress={() => navigation.navigate("OrderDetail", { orderId: item.orderId })}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>Chi tiết</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
}
