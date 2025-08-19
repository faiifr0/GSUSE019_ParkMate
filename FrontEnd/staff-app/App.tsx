import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';

export default function App() {
  return (
    <>
      <BottomTabNavigator />
      <StatusBar style="auto" />
    </>
  );
}
