import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/Home/HomeScreen';
import TicketListScreen from '../screens/Ticket/TicketListScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import QRCodeScannerScreen from '../screens/QRCode/QRCodeScannerScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#FF6B00', // màu cam nổi bật khi chọn
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          height: 65,
          paddingBottom: 8,
          paddingTop: 6,
          position: 'absolute',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 4,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Tickets') iconName = 'ticket';
          else if (route.name === 'QRCodeScanner') iconName = 'qr-code';
          else if (route.name === 'Profile') iconName = 'person';

          return <Ionicons name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Trang chủ' }} />
      <Tab.Screen name="Tickets" component={TicketListScreen} options={{ title: 'Vé' }} />
      <Tab.Screen name="QRCodeScanner" component={QRCodeScannerScreen} options={{ title: 'Quét QR' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Tài khoản' }} />
    </Tab.Navigator>
  );
}
