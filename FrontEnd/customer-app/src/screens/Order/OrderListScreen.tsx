// src/screens/Order/OrderListScreen.tsx
import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Dimensions,
  ScrollView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSelector, useDispatch } from "react-redux";
import { RootStackParamList } from "../../navigation/types";
import colors from "../../constants/colors";
import { useOrders } from "../../hooks/useOrders";
import { RootState, AppDispatch } from "../../redux/store";
import { fetchBranches } from "../../redux/branchSlice";
import { fetchTickets } from "../../redux/ticketSlice";
import moment from "moment";

type Props = NativeStackScreenProps<RootStackParamList, "OrderList">;

export default function OrderListScreen({ navigation }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, fetchOrdersByUser, loading } = useOrders();
  const user = useSelector((state: RootState) => state.user.userInfo);
  const branches = useSelector((state: RootState) => state.branch.branches);
  const tickets = useSelector((state: RootState) => state.ticket.tickets);

  const isWeb = Platform.OS === "web";
  const containerWidth = isWeb ? "70%" : "100%";

  // Load branches và tickets khi mount
  useEffect(() => {
    dispatch(fetchBranches());
    dispatch(fetchTickets());
  }, [dispatch]);

  // Load đơn hàng user
  useEffect(() => {
    if (user?.id) {
      fetchOrdersByUser(user.id);
    }
  }, [user]);

  const getBranchName = (ticketTypeId: number | undefined) => {
    if (!ticketTypeId) return "Chưa có thông tin";
    const ticket = tickets.find((t) => t.id === ticketTypeId);
    if (!ticket) return "Chưa có thông tin";
    const branch = branches.find((b) => b.id === ticket.parkBranchId);
    return branch?.name || "Chưa có thông tin";
  };

  const getOrderStatus = (order: any) => {
    if (order.status === "REFUND") return "Đã hoàn tiền";

    const now = moment();
    const orderDateStr = order.details[0]?.ticketDate;
    if (!orderDateStr) return "Chưa sử dụng";

    const orderDate = moment(orderDateStr, "YYYY-MM-DD");
    const threeHoursLater = orderDate.clone().hour(3).minute(0).second(0);

    if (now.isBefore(threeHoursLater, "day")) return "Chưa sử dụng";
    if (now.isSame(orderDate, "day") && now.isBefore(threeHoursLater)) return "Chưa sử dụng";
    return "Đã hết hạn";
  };

  const sortedOrders = [...orders].sort((a, b) => {
    const statusA = getOrderStatus(a);
    const statusB = getOrderStatus(b);
    const dateA = a.details[0]?.ticketDate
      ? moment(a.details[0].ticketDate, "YYYY-MM-DD")
      : moment();
    const dateB = b.details[0]?.ticketDate
      ? moment(b.details[0].ticketDate, "YYYY-MM-DD")
      : moment();

    if (statusA === "Chưa sử dụng" && statusB !== "Chưa sử dụng") return -1;
    if (statusA !== "Chưa sử dụng" && statusB === "Chưa sử dụng") return 1;
    return dateA.isBefore(dateB) ? -1 : 1;
  });

  if (loading) {
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
        <Text style={{ marginTop: 8, color: colors.textSecondary }}>Đang tải đơn hàng...</Text>
      </View>
    );
  }

  if (!orders.length) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <Text style={{ color: colors.textSecondary }}>Chưa có đơn hàng nào</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        alignItems: "center",
        paddingVertical: 16,
      }}
    >
      <FlatList
        data={sortedOrders}
        keyExtractor={(item) => item.orderId.toString()}
        style={{ width: containerWidth }}
        scrollEnabled={false} // FlatList không scroll riêng, scroll trên ScrollView
        renderItem={({ item }) => {
          const totalPrice =
            item.finalAmount || item.details.reduce((sum: number, d: any) => sum + d.finalPrice, 0);
          const orderDateStr = item.details[0]?.ticketDate || "";
          const branchName = getBranchName(item.details[0]?.ticketTypeId);
          const status = getOrderStatus(item);

          let statusColor = "green";
          if (status === "Đã hết hạn") statusColor = "red";
          if (status === "Đã hoàn tiền") statusColor = "#007bff";

          return (
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 12,
                padding: 20,
                marginBottom: 16,
                width: "100%",
                maxWidth: 600,
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 20, marginBottom: 8, color: colors.primary }}>
                {branchName}
              </Text>

              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ fontSize: 16, color: colors.textPrimary }}>Đơn #{item.orderId}</Text>
                <Text style={{ fontSize: 16, color: statusColor, fontWeight: "bold" }}>{status}</Text>
              </View>

              <Text style={{ marginTop: 4, color: colors.textSecondary }}>
                Ngày: {orderDateStr ? moment(orderDateStr).format("DD/MM/YYYY") : "Chưa xác định"}
              </Text>

              <Text style={{ marginTop: 2, color: colors.textSecondary }}>
                Tổng: {totalPrice.toLocaleString()} VND
              </Text>

              <TouchableOpacity
                style={{
                  marginTop: 12,
                  backgroundColor: colors.primary,
                  paddingVertical: 12,
                  borderRadius: 8,
                  alignItems: "center",
                  width: "100%",
                }}
                onPress={() => navigation.navigate("OrderDetail", { orderId: item.orderId })}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>Chi tiết</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </ScrollView>
  );
}
