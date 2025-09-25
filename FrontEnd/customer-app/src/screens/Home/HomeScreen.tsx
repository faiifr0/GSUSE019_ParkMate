// src/screens/Home/HomeScreen.tsx
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Platform,
} from "react-native";
import * as Location from "expo-location";
import { getDistance } from "geolib";
import * as Animatable from "react-native-animatable";
import branchPromotionService from "../../services/branchPromotionService";
import { BranchPromotion } from "../../types/BranchPromotion";
import branchService from "../../services/branchService";
import { Branch } from "../../types/Branch";
import colors from "../../constants/colors";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { walletService } from "../../services/walletService";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { RootStackParamList } from "../../navigation/types";

// ------------ TYPES ------------
type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

// ------------ MAIN SCREEN ------------
export default function HomeScreen({ navigation }: HomeScreenProps) {
  const user = useSelector((state: RootState) => state.user.userInfo);

  const [nearestBranch, setNearestBranch] = useState<Branch | null>(null);
  const [promotions, setPromotions] = useState<BranchPromotion[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [coin, setCoin] = useState<number>(0);
  const [refreshing, setRefreshing] = useState(false);

  // 👉 Lấy số dư ví
  const fetchWallet = useCallback(async () => {
    if (!user?.id) return;
    try {
      const wallet = await walletService.getWalletById(user.id);
      setCoin(wallet.balance || 0);
    } catch (err) {
      console.error("Lỗi khi lấy số dư ví:", err);
      setCoin(0);
    }
  }, [user?.id]);

  // 👉 Lấy danh sách chi nhánh + khuyến mãi
  const fetchBranches = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      let userCoords: { latitude: number; longitude: number } | null = null;

      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        userCoords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
      }

      const branchList: Branch[] = await branchService.getAll();
      setBranches(branchList);

      let closest: Branch | null = null;
      let minDistance = Infinity;

      if (userCoords) {
        branchList.forEach((b: Branch) => {
          if (typeof b.lat !== "number" || typeof b.lon !== "number") return;
          const dist = getDistance(userCoords!, {
            latitude: b.lat,
            longitude: b.lon,
          });
          if (dist < minDistance) {
            minDistance = dist;
            closest = b;
          }
        });
      }

      setNearestBranch(closest);

      if (closest && (closest as Branch).id) {
        const promos = await branchPromotionService.getByBranchId((closest as Branch).id);
        setPromotions(promos || []);
      } else {
        setPromotions([]);
      }

      if (!userCoords) {
        setError(
          "⚠️ Vị trí không được cấp phép. Chỉ hiển thị chi nhánh và khuyến mãi."
        );
      }
    } catch (err: any) {
      setError(err?.message ?? "Có lỗi khi tải dữ liệu.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchWallet();
    fetchBranches();
  }, [fetchWallet, fetchBranches]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchWallet();
    fetchBranches();
  };

// ------------ WEB LANDING PAGE ------------
if (Platform.OS === "web") {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "transparent" }}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ flexGrow: 1, backgroundColor: "transparent" }}
    >
      {/* Hero Section */}
      <View
        style={{
          paddingVertical: 120,
          alignItems: "center",
          justifyContent: "center",
          backgroundImage:
            "linear-gradient(135deg, #FF9A8B, #FF6A88, #FF99AC, #FBC2EB)",
        } as any}
      >
        <Text
          style={{
            fontSize: 52,
            fontWeight: "900",
            color: "white",
            textAlign: "center",
            letterSpacing: 1,
          }}
        >
          KHU VUI CHƠI ĐẦY SẮC MÀU
        </Text>
        <TouchableOpacity
          onPress={() => console.log("👉 KHÁM PHÁ NGAY")}
          style={{
            marginTop: 40,
            backgroundColor: "white",
            paddingVertical: 16,
            paddingHorizontal: 50,
            borderRadius: 30,
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowRadius: 8,
          }}
        >
          <Text
            style={{
              color: "#FF6A88",
              fontWeight: "bold",
              fontSize: 18,
              textTransform: "uppercase",
            }}
          >
            Khám phá ngay
          </Text>
        </TouchableOpacity>
      </View>

      {/* Các section */}
      <View style={{ padding: 60, backgroundColor: "transparent" }}>
        {/* Trò chơi hot */}
        <View style={{ marginBottom: 60 }}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "700",
              marginBottom: 20,
              color: colors.primary,
            }}
          >
            🎡 Trò chơi hot
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 20,
            }}
          >
            {branches.slice(0, 4).map((item) => (
              <TouchableOpacity
                key={item.id}
                style={{
                  width: 220,
                  backgroundColor: "#fff", // chỉ card mới trắng
                  borderRadius: 16,
                  overflow: "hidden",
                  shadowColor: "#000",
                  shadowOpacity: 0.1,
                  shadowRadius: 6,
                }}
              >
                <Image
                  source={{ uri: "https://via.placeholder.com/220x140" }}
                  style={{ width: "100%", height: 140 }}
                />
                <View style={{ padding: 12 }}>
                  <Text style={{ fontSize: 16, fontWeight: "600" }}>
                    {item.name}
                  </Text>
                  <Text style={{ fontSize: 14, color: "#666" }}>
                    {item.address}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Khuyến mãi nổi bật */}
        <View style={{ marginBottom: 60 }}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "700",
              marginBottom: 20,
              color: "#e63946",
            }}
          >
            🔥 Khuyến mãi nổi bật
          </Text>
          <View style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {promotions.length > 0 ? (
              promotions.map((promo) => (
                <TouchableOpacity
                  key={promo.id}
                  style={{
                    backgroundColor: "#fff", // box riêng
                    borderRadius: 16,
                    overflow: "hidden",
                    shadowColor: "#000",
                    shadowOpacity: 0.1,
                    shadowRadius: 6,
                  }}
                >
                  <Image
                    source={{
                      uri: promo.image || "https://via.placeholder.com/600x200",
                    }}
                    style={{ width: "100%", height: 160 }}
                  />
                  <View style={{ padding: 16 }}>
                    <Text
                      style={{ fontSize: 18, fontWeight: "600", marginBottom: 6 }}
                    >
                      {promo.description}
                    </Text>
                    <Text style={{ color: "#ff6a88", fontSize: 16 }}>
                      Giảm {promo.discount}%
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text>Không có khuyến mãi</Text>
            )}
          </View>
        </View>

        {/* Chi nhánh gần bạn */}
        <View
          style={{
            backgroundColor: "#fff", // chỉ box riêng
            borderRadius: 20,
            padding: 30,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 8,
          }}
        >
          <Text
            style={{
              fontSize: 28,
              fontWeight: "700",
              marginBottom: 20,
              color: "#1d3557",
            }}
          >
            📍 Chi nhánh gần bạn
          </Text>
          {nearestBranch ? (
            <View>
              <Text style={{ fontSize: 20, fontWeight: "600" }}>
                {nearestBranch.name}
              </Text>
              <Text style={{ marginTop: 4 }}>{nearestBranch.address}</Text>
              <Text style={{ marginTop: 4 }}>
                🕒 {nearestBranch.open ?? "?"} - {nearestBranch.close ?? "?"}
              </Text>
            </View>
          ) : (
            <Text>Không tìm thấy chi nhánh gần bạn</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}



  // ------------ APP HOME ------------
  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
      >
        <Animatable.Text animation="fadeIn" style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
          🎡 Chào mừng đến với ParkMate
        </Animatable.Text>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <>
            {error && <Text style={{ color: "red" }}>{error}</Text>}

            {/* Chi nhánh gần nhất */}
            {nearestBranch && (
              <TouchableOpacity
                onPress={() => navigation.navigate("BranchDetail", { branchId: nearestBranch.id })}
              >
                <Animatable.View
                  animation="bounceIn"
                  duration={900}
                  style={{
                    backgroundColor: "#f9f9f9",
                    padding: 16,
                    borderRadius: 12,
                    marginBottom: 20,
                  }}
                >
                  <Text style={{ fontWeight: "bold", fontSize: 18 }}>Chi nhánh gần nhất</Text>
                  <Text>{nearestBranch.name}</Text>
                  <Text>{nearestBranch.address ?? "Chưa có địa chỉ"}</Text>
                  <Text>
                    🕒 {nearestBranch.open ?? "?"} - {nearestBranch.close ?? "?"}
                  </Text>
                </Animatable.View>
              </TouchableOpacity>
            )}

            {/* Danh sách chi nhánh */}
            <Animatable.Text animation="fadeIn" style={{ fontSize: 20, fontWeight: "bold", marginBottom: 16 }}>
              Danh sách chi nhánh
            </Animatable.Text>
            <FlatList
              horizontal
              data={branches}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => navigation.navigate("BranchDetail", { branchId: item.id })}>
                  <Animatable.View
                    animation="fadeInUp"
                    style={{
                      width: 150,
                      marginRight: 12,
                      backgroundColor: "#fff",
                      borderRadius: 12,
                      padding: 8,
                      shadowColor: "#000",
                      shadowOpacity: 0.05,
                      shadowRadius: 4,
                    }}
                  >
                    <Image source={{ uri: "https://via.placeholder.com/150" }} style={{ width: "100%", height: 100, borderRadius: 8 }} />
                    <Text style={{ fontWeight: "bold", marginTop: 8 }} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={{ color: "#555" }} numberOfLines={1}>
                      {item.address ?? ""}
                    </Text>
                  </Animatable.View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
            />

            {/* Khuyến mãi nổi bật */}
            <Animatable.Text animation="fadeIn" style={{ fontSize: 20, fontWeight: "bold", marginVertical: 16 }}>
              Khuyến mãi nổi bật
            </Animatable.Text>
            <FlatList
              horizontal
              data={promotions}
              renderItem={({ item }) => (
                <Animatable.View
                  animation="fadeInUp"
                  style={{
                    width: 150,
                    marginRight: 12,
                    backgroundColor: "#fff",
                    borderRadius: 12,
                    padding: 8,
                    shadowColor: "#000",
                    shadowOpacity: 0.05,
                    shadowRadius: 4,
                  }}
                >
                  <Image source={{ uri: item.image || "https://via.placeholder.com/150" }} style={{ width: "100%", height: 100, borderRadius: 8 }} />
                  <Text style={{ fontWeight: "bold", marginTop: 8 }} numberOfLines={2}>
                    {item.description}
                  </Text>
                  <Text style={{ color: "#FF6A88", marginTop: 4 }}>🔥 Giảm {item.discount}%</Text>
                </Animatable.View>
              )}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
}