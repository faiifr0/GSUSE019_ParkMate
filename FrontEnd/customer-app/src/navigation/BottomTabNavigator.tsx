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
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Tickets') iconName = 'ticket';
          else if (route.name === 'QRCodeScanner') iconName = 'qr-code';
          else if (route.name === 'Profile') iconName = 'person';

          return <Ionicons name={iconName} size={size} color={color} />;
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
