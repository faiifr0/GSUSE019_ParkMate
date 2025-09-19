import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import ticketService, { Ticket } from '../../services/ticketService';
import colors from '../../constants/colors';

const userId = 1; // Giả lập user hiện tại

export default function TicketListScreen() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({}); 

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await ticketService.getTickets();
        setTickets(data);

        // Khởi tạo số lượng mặc định = 1
        const initQty: { [key: number]: number } = {};
        data.forEach(t => (initQty[t.id] = 1));
        setQuantities(initQty);
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể tải danh sách vé.');
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const handleChangeQuantity = (ticketId: number, delta: number) => {
    setQuantities(prev => {
      const newQty = (prev[ticketId] || 1) + delta;
      return { ...prev, [ticketId]: newQty < 1 ? 1 : newQty };
    });
  };

  const handleBuyTicket = async (ticket: Ticket) => {
    const quantity = quantities[ticket.id] || 1;
    const confirm = await new Promise<boolean>((resolve) => {
      Alert.alert(
        'Mua vé',
        `Bạn có muốn mua ${quantity} vé "${ticket.name}" với tổng ${ticket.price * quantity} VND không?`,
        [
          { text: 'Hủy', onPress: () => resolve(false), style: 'cancel' },
          { text: 'Xác nhận', onPress: () => resolve(true) },
        ]
      );
    });

    if (!confirm) return;

    try {
      const res = await ticketService.createUserTicket(userId, ticket.id, quantity);
      Alert.alert('Thành công', `Bạn đã mua ${res.quantity} vé "${ticket.name}"`);
    } catch (error) {
      Alert.alert('Thất bại', 'Mua vé không thành công.');
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.textPrimary, marginTop: 8 }}>Đang tải vé...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: colors.background }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16, color: colors.textPrimary }}>Danh sách vé</Text>
      <FlatList
        data={tickets}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 16,
              borderRadius: 12,
              backgroundColor: colors.surface,
              marginBottom: 12,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.textPrimary }}>{item.name}</Text>
            <Text style={{ marginTop: 4, color: colors.textSecondary }}>Giá: {item.price} VND</Text>
            <Text style={{ marginTop: 4, color: colors.textSecondary }}>{item.description}</Text>

            {/* Chọn số lượng */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
              <TouchableOpacity
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  backgroundColor: colors.border,
                  borderRadius: 6,
                }}
                onPress={() => handleChangeQuantity(item.id, -1)}
              >
                <Text>-</Text>
              </TouchableOpacity>
              <Text style={{ marginHorizontal: 12, fontSize: 16 }}>{quantities[item.id] || 1}</Text>
              <TouchableOpacity
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  backgroundColor: colors.border,
                  borderRadius: 6,
                }}
                onPress={() => handleChangeQuantity(item.id, 1)}
              >
                <Text>+</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={{
                marginTop: 12,
                backgroundColor: colors.primary,
                paddingVertical: 10,
                borderRadius: 8,
                alignItems: 'center',
              }}
              onPress={() => handleBuyTicket(item)}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Mua vé</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20, color: colors.textSecondary }}>
            Không có vé nào
          </Text>
        }
      />
    </View>
  );
}
