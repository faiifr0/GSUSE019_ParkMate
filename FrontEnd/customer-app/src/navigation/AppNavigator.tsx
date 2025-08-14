import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import BottomTabNavigator from './BottomTabNavigator';

const Stack = createNativeStackNavigator();

function AppNavigatorInner() {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <StatusBar backgroundColor="#000" barStyle="light-content" />
            <NavigationContainer theme={LightTheme}>
                <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Register" component={RegisterScreen} />
                    <Stack.Screen name="MainApp" component={BottomTabNavigator} />
                </Stack.Navigator>
            </NavigationContainer>
        </View>
    );
}

export default function AppNavigator() {
    return (
        <SafeAreaProvider>
            <AppNavigatorInner />
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#000', // nền đen ở trên + dưới
    },
});

// Fix chữ trắng thành chữ đen
const LightTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: '#fff',
        text: '#000',
    },
};
