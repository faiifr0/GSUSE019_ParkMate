import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import ticketService from '../../services/ticketService';

export default function TicketListScreen() {
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await ticketService.getTickets();
                setTickets(response.data || []);
            } catch (error: any) {
                console.error('Lỗi khi tải vé:', error);
                Alert.alert('Lỗi', 'Không thể tải danh sách vé. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Đang tải vé...</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Danh sách vé</Text>
            <FlatList
                data={tickets}
                keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={{ padding: 16, borderBottomWidth: 1 }}>
                        <Text style={{ fontSize: 16 }}>{item.name}</Text>
                        <Text>Giá: {item.price} VND</Text>
                        <Text>{item.description}</Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <Text style={{ textAlign: 'center', marginTop: 20 }}>Không có vé nào</Text>
                }
            />
        </View>
    );
}
