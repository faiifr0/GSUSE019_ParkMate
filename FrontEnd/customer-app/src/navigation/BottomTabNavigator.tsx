import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/Home/HomeScreen';
import TicketListScreen from '../screens/Ticket/TicketListScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import QRCodeScannerScreen from '../screens/QRCode/QRCodeScannerScreen'; // màn hình mới

function PromoScreen() { return <View style={{ flex: 1, backgroundColor: '#fff' }} /> }

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: true,
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: '#000',
                tabBarInactiveTintColor: '#555',
                tabBarHideOnKeyboard: true,
            }}
            safeAreaInsets={{ bottom: 0 }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Trang chủ',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="home-outline" size={22} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Tickets"
                component={TicketListScreen}
                options={{
                    tabBarLabel: 'Vé',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="list-outline" size={22} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="ScanQR"
                component={QRCodeScannerScreen}
                options={{
                    tabBarLabel: '',
                    tabBarIcon: () => (
                        <TouchableOpacity style={styles.qrButton}>
                            <Ionicons name="qr-code" size={28} color="#fff" />
                        </TouchableOpacity>
                    ),
                }}
            />
            <Tab.Screen
                name="Promo"
                component={PromoScreen}
                options={{
                    tabBarLabel: 'Khuyến mãi',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="pricetags-outline" size={22} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarLabel: 'Tài khoản',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="person-outline" size={22} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 65,
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 4,
        borderTopWidth: 0,
        paddingBottom: Platform.OS === 'android' ? 0 : 5,
    },
    qrButton: {
        width: 65,
        height: 65,
        backgroundColor: '#007bff',
        borderRadius: 32.5,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Platform.OS === 'android' ? 0 : 5,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 6,
    },
});
