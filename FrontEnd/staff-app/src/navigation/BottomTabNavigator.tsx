import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AttendanceScreen from '../screens/Attendance';
import CustomerInfoScreen from '../screens/CustomerInfo';
import WorkScheduleScreen from '../screens/WorkSchedule';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';

type TabParamList = {
  Attendance: undefined;
  CustomerInfo: undefined;
  WorkSchedule: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export default function BottomTabNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({
          route,
        }: {
          route: RouteProp<TabParamList, keyof TabParamList>;
        }): BottomTabNavigationOptions => ({
          headerShown: false,
          tabBarIcon: ({
            color,
            size,
          }: {
            color: string;
            size: number;
            focused: boolean;
          }) => {
            let iconName: keyof typeof Ionicons.glyphMap = 'home';
            if (route.name === 'Attendance') iconName = 'qr-code';
            else if (route.name === 'CustomerInfo') iconName = 'person';
            else if (route.name === 'WorkSchedule') iconName = 'calendar';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Attendance" component={AttendanceScreen} options={{ title: 'Chấm công' }} />
        <Tab.Screen name="CustomerInfo" component={CustomerInfoScreen} options={{ title: 'Khách hàng' }} />
        <Tab.Screen name="WorkSchedule" component={WorkScheduleScreen} options={{ title: 'Ca làm' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
