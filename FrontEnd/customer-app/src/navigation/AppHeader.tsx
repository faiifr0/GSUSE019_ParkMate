import React from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../constants/colors";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  Home: undefined;
  Notifications: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type Props = {
  coin?: number;
};

export default function AppHeader({ coin = 0 }: Props) {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "transparent", // hoàn toàn trong suốt
        ...Platform.select({
          ios: {
            shadowColor: "transparent", // không shadow
          },
          android: {
            elevation: 0,
          },
        }),
      }}
    >
      {/* Tên App */}
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: colors.primary,
        }}
      >
        🎡 ParkMate
      </Text>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {/* Coin */}
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 20,
            marginRight: 12,
            borderWidth: 1.5,
            borderColor: colors.primary,
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              color: colors.primary,
            }}
          >
            🪙 {coin}
          </Text>
        </View>

        {/* Notification */}
        <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
          <Ionicons
            name="notifications-outline"
            size={26}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
