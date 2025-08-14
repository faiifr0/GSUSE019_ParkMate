import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import ticketService from '../../services/ticketService';

export default function TicketListScreen() {
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response: any = await ticketService.getTickets();
                console.log('Tickets API response:', response);
                setTickets(Array.isArray(response?.data) ? response.data : []);
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
                <Text style={{ color: '#000' }}>Đang tải vé...</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: '#000' }}>
                Danh sách vé
            </Text>
            <FlatList
                data={tickets}
                keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={{ padding: 16, borderBottomWidth: 1, borderColor: '#ccc' }}>
                        <Text style={{ fontSize: 16, color: '#000' }}>{item.name}</Text>
                        <Text style={{ color: '#000' }}>Giá: {item.price} VND</Text>
                        <Text style={{ color: '#000' }}>{item.description}</Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <Text style={{ textAlign: 'center', marginTop: 20, color: '#000' }}>
                        Không có vé nào
                    </Text>
                }
            />
        </View>
    );
}
