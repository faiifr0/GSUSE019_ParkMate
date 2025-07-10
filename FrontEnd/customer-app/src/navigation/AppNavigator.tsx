import React from 'react'; // @ts-ignore
import { NavigationContainer } from '@react-navigation/native';// @ts-ignore
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen'; // Import đúng
import BottomTabNavigator from './BottomTabNavigator'; // Tab chính

// Tạo stack
const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Login"
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="MainApp" component={BottomTabNavigator} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
