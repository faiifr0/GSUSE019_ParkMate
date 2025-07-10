import React from 'react';// @ts-ignore
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Home/HomeScreen';
import TicketListScreen from '../screens/Ticket/TicketListScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
    return (
        <Tab.Navigator>
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{ tabBarIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name="home" color={color} size={size} /> }}
            />
            <Tab.Screen
                name="Tickets"
                component={TicketListScreen}
                options={{ tabBarIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name="ticket" color={color} size={size} /> }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ tabBarIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name="person" color={color} size={size} /> }}
            />
        </Tab.Navigator>
    );
}
