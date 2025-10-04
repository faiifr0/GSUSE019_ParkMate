import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";
import ticketTypeService from "../../services/ticketService";
import colors from "../../constants/colors";
import { Ticket } from "../../types/Ticket";
import { useNavigation } from "@react-navigation/native";

type Props = NativeStackScreenProps<RootStackParamList, "TicketList">;

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2; // 2 cột, padding 16

export default function TicketListScreen({ route }: Props) {
  const { branchId } = route.params;
  const navigation = useNavigation<any>();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<{ ticket: Ticket; quantity: number }[]>([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await ticketTypeService.getByBranchId(branchId);
        setTickets(data);
      } catch (error) {
        console.log("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [branchId]);

  const addToCart = (ticket: Ticket) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.ticket.id === ticket.id);
      if (existing) {
        return prev.map((c) =>
          c.ticket.id === ticket.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { ticket, quantity: 1 }];
    });
  };

  const total = cart.reduce(
    (sum, item) => sum + item.ticket.basePrice * item.quantity,
    0
  );

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
        <Text style={{ marginTop: 8, color: colors.textSecondary }}>
          Đang tải vé...
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: colors.background }}>
      <Text
        style={{
          fontSize: 22,
          fontWeight: "bold",
          marginBottom: 16,
          color: colors.textPrimary,
          textAlign: "center",
        }}
      >
        🎟 Chọn vé
      </Text>

      <FlatList
        data={tickets}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: 16,
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              width: CARD_WIDTH,
              backgroundColor: colors.surface,
              borderRadius: 16,
              padding: 16,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
            activeOpacity={0.8}
            onPress={() => addToCart(item)}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: colors.textPrimary,
                textAlign: "center",
              }}
              numberOfLines={2}
            >
              {item.name}
            </Text>

            <Text
              style={{
                marginTop: 8,
                fontSize: 16,
                color: colors.primary,
                fontWeight: "600",
              }}
            >
              {item.basePrice.toLocaleString()} VND
            </Text>

            {item.description ? (
              <Text
                style={{
                  marginTop: 6,
                  fontSize: 13,
                  color: colors.textSecondary,
                  textAlign: "center",
                }}
                numberOfLines={3}
              >
                {item.description}
              </Text>
            ) : null}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text
            style={{
              textAlign: "center",
              marginTop: 20,
              color: colors.textSecondary,
            }}
          >
            Hiện chưa có vé cho chi nhánh này
          </Text>
        }
      />

      {cart.length > 0 && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: colors.surface,
            padding: 16,
            borderTopWidth: 1,
            borderColor: "#ddd",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "600", color: colors.textPrimary }}>
            {cart.length} vé - {total.toLocaleString()} VND
          </Text>
          <TouchableOpacity
  style={{
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  }}
  onPress={() =>
    navigation.getParent()?.navigate("OrderConfirm", { cart, branchId })
  }
>
  <Text style={{ color: "#fff", fontWeight: "bold" }}>Tiếp tục</Text>
</TouchableOpacity>
        </View>
      )}
    </View>
  );
}
