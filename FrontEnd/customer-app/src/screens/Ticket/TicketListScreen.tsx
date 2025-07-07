import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import localApi from '../../api/localApi';

export default function TicketListScreen() {
    const [tickets, setTickets] = useState<any[]>([]);

    useEffect(() => {
        const fetchTickets = async () => {
            const response = await localApi.getTickets();
            setTickets(response.data);
        };

        fetchTickets();
    }, []);

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Danh sách vé</Text>
            <FlatList
                data={tickets}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={{ padding: 16, borderBottomWidth: 1 }}>
                        <Text style={{ fontSize: 16 }}>{item.name}</Text>
                        <Text>Giá: {item.price} VND</Text>
                        <Text>{item.description}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}
