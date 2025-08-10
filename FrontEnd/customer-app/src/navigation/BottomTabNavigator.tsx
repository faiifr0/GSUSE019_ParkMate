import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/Home/HomeScreen';
import TicketListScreen from '../screens/Ticket/TicketListScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';

function QRScreen() { return <View style={{ flex: 1, backgroundColor: '#fff' }} /> }
function PromoScreen() { return <View style={{ flex: 1, backgroundColor: '#fff' }} /> }

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false, // Ẩn label để gọn
                tabBarStyle: {
                    height: 55,
                    backgroundColor: '#fff',
                    borderTopWidth: 0.5,
                    borderTopColor: '#ddd',
                },
                tabBarActiveTintColor: '#007bff',
                tabBarInactiveTintColor: '#888',
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" size={22} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Tickets"
                component={TicketListScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="list-outline" size={22} color={color} />
                    ),
                }}
            />

            <Tab.Screen
                name="ScanQR"
                component={QRScreen}
                options={{
                    tabBarIcon: () => (
                        <TouchableOpacity style={styles.qrButton}>
                            <Ionicons name="qr-code" size={26} color="#fff" />
                        </TouchableOpacity>
                    ),
                }}
            />

            <Tab.Screen
                name="Promo"
                component={PromoScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="pricetags-outline" size={22} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person-outline" size={22} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    qrButton: {
        width: 50,
        height: 50,
        backgroundColor: '#007bff',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20, // nổi lên
        elevation: 4,
    },
});
