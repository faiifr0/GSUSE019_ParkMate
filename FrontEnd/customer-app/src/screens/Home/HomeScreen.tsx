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
import styles from "../../styles/HomeScreenStyles";
import colors from "../../constants/colors";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { walletService } from "../../services/walletService";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

// ------------ TYPES ------------
type RootStackParamList = {
  BranchDetail: { branchId: number };
  Notifications: undefined;
};

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

// ------------ HEADER ------------
function AppHeader({
  coin,
  onNotificationPress,
}: {
  coin: number;
  onNotificationPress: () => void;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: colors.primary,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "bold", color: "white" }}>
        🎡 ParkMate
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View
          style={{
            backgroundColor: "white",
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 20,
            marginRight: 12,
          }}
        >
          <Text style={{ fontWeight: "bold", color: colors.primary }}>
            🪙 {coin}
          </Text>
        </View>

        <TouchableOpacity onPress={onNotificationPress}>
          <Ionicons name="notifications-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

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
        setError("⚠️ Vị trí không được cấp phép. Chỉ hiển thị chi nhánh và khuyến mãi.");
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
      <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
        {/* Hero Section */}
        <View
          style={{
            paddingVertical: 80,
            alignItems: "center",
            backgroundImage:
              "linear-gradient(135deg, #FF9A8B, #FF6A88, #FF99AC)",
          } as any}
        >
          <Text
            style={{
              fontSize: 42,
              fontWeight: "bold",
              color: "white",
              textAlign: "center",
            }}
          >
            KHU VUI CHƠI ĐẦY SẮC MÀU
          </Text>
          <TouchableOpacity
            style={{
              marginTop: 20,
              backgroundColor: "#fff",
              paddingVertical: 14,
              paddingHorizontal: 28,
              borderRadius: 30,
            }}
          >
            <Text
              style={{
                color: "#FF6A88",
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              KHÁM PHÁ NGAY
            </Text>
          </TouchableOpacity>
        </View>

        {/* Trò chơi hot */}
        <View style={{ padding: 40, alignItems: "center" }}>
          <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 20 }}>
            🎡 Trò chơi hot
          </Text>
          {branches.length > 0 ? (
            <FlatList
              horizontal
              data={branches.slice(0, 5)}
              renderItem={({ item }) => (
                <View
                  style={{
                    width: 250,
                    marginHorizontal: 10,
                    backgroundColor: "#f9f9f9",
                    borderRadius: 12,
                    padding: 12,
                    shadowColor: "#000",
                    shadowOpacity: 0.1,
                    shadowRadius: 6,
                  }}
                >
                  <Image
                    source={{ uri: "https://via.placeholder.com/250x150" }}
                    style={{ width: "100%", height: 150, borderRadius: 8 }}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      marginTop: 10,
                    }}
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  <Text style={{ color: "#555" }} numberOfLines={1}>
                    {item.address}
                  </Text>
                </View>
              )}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
            />
          ) : (
            <Text>Chưa có dữ liệu trò chơi</Text>
          )}
        </View>

        {/* Khuyến mãi nổi bật */}
        <View
          style={{
            padding: 40,
            alignItems: "center",
            backgroundColor: "#fff5f5",
          }}
        >
          <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 20 }}>
            🔥 Khuyến mãi nổi bật
          </Text>
          {promotions.length > 0 ? (
            promotions.map((promo) => (
              <View
                key={promo.id}
                style={{
                  width: 600,
                  backgroundColor: "white",
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 20,
                  shadowColor: "#000",
                  shadowOpacity: 0.1,
                  shadowRadius: 6,
                }}
              >
                <Image
                  source={{
                    uri: promo.image || "https://via.placeholder.com/600x200",
                  }}
                  style={{ width: "100%", height: 200, borderRadius: 8 }}
                />
                <Text
                  style={{
                    marginTop: 10,
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  {promo.description}
                </Text>
                <Text style={{ color: "#FF6A88", marginTop: 4 }}>
                  Giảm {promo.discount}%
                </Text>
              </View>
            ))
          ) : (
            <Text>Không có khuyến mãi</Text>
          )}
        </View>

        {/* Chi nhánh gần bạn */}
        <View style={{ padding: 40, alignItems: "center" }}>
          <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 20 }}>
            📍 Chi nhánh gần bạn
          </Text>
          {nearestBranch ? (
            <View
              style={{
                width: 600,
                backgroundColor: "#f9f9f9",
                borderRadius: 12,
                padding: 16,
                shadowColor: "#000",
                shadowOpacity: 0.1,
                shadowRadius: 6,
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                {nearestBranch.name}
              </Text>
              <Text style={{ marginTop: 4 }}>
                {nearestBranch.address ?? "Chưa có địa chỉ"}
              </Text>
              <Text style={{ marginTop: 4 }}>
                🕒 {nearestBranch.open ?? "?"} - {nearestBranch.close ?? "?"}
              </Text>
            </View>
          ) : (
            <Text>Không tìm thấy chi nhánh gần bạn</Text>
          )}
        </View>

        {/* Tải ứng dụng */}
        <View
          style={{ alignItems: "center", padding: 40, backgroundColor: "#fafafa" }}
        >
          <Text
            style={{ fontSize: 24, fontWeight: "bold", marginBottom: 12 }}
          >
            Tải ứng dụng:
          </Text>
          <View style={{ flexDirection: "row", gap: 15 }}>
            <Image
              source={{
                uri: "https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg",
              }}
              style={{ width: 160, height: 50 }}
            />
            <Image
              source={{
                uri: "https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg",
              }}
              style={{ width: 180, height: 50 }}
            />
          </View>
        </View>
      </ScrollView>
    );
  }

  // ------------ APP HOME ------------
  return (
    <View style={styles.container}>
      <AppHeader
        coin={coin}
        onNotificationPress={() => navigation.navigate("Notifications")}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
      >
        <Animatable.Text animation="fadeIn" style={styles.title}>
          🎡 Chào mừng đến với ParkMate
        </Animatable.Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={styles.loader}
          />
        ) : (
          <>
            {error && <Text style={styles.errorText}>{error}</Text>}

            {/* Chi nhánh gần nhất */}
            {nearestBranch && (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("BranchDetail", {
                    branchId: nearestBranch.id,
                  })
                }
              >
                <Animatable.View
                  animation="bounceIn"
                  duration={900}
                  style={styles.branchBox}
                >
                  <Text style={styles.branchTitle}>Chi nhánh gần nhất</Text>
                  <Text style={styles.text} numberOfLines={1}>
                    {nearestBranch.name}
                  </Text>
                  <Text style={styles.text} numberOfLines={1}>
                    {nearestBranch.address ?? "Chưa có địa chỉ"}
                  </Text>
                  <Text style={styles.text}>
                    🕒 {nearestBranch.open ?? "?"} - {nearestBranch.close ?? "?"}
                  </Text>
                </Animatable.View>
              </TouchableOpacity>
            )}

            {/* Danh sách chi nhánh */}
            <Animatable.Text animation="fadeIn" style={styles.sectionTitle}>
              Danh sách chi nhánh
            </Animatable.Text>
            {branches.length > 0 ? (
              <FlatList
                horizontal
                data={branches}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("BranchDetail", { branchId: item.id })
                    }
                  >
                    <Animatable.View
                      animation="fadeInUp"
                      delay={index * 100}
                      style={styles.branchCard}
                    >
                      <Image
                        source={{ uri: "https://via.placeholder.com/150" }}
                        style={styles.branchImage}
                      />
                      <Text style={styles.branchName} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text style={styles.branchAddress} numberOfLines={1}>
                        {item.address ?? ""}
                      </Text>
                    </Animatable.View>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.flatListContent}
              />
            ) : (
              <Text style={styles.text}>Không có chi nhánh</Text>
            )}

            {/* Khuyến mãi nổi bật */}
            <Animatable.Text animation="fadeIn" style={styles.sectionTitle}>
              Khuyến mãi nổi bật
            </Animatable.Text>
            {promotions.length > 0 ? (
              <FlatList
                horizontal
                data={promotions}
                renderItem={({ item, index }) => (
                  <Animatable.View
                    animation="fadeInUp"
                    delay={index * 150}
                    style={styles.promoCard}
                  >
                    <Image
                      source={{
                        uri: item.image || "https://via.placeholder.com/150",
                      }}
                      style={styles.promoImage}
                    />
                    <Text style={styles.promoText} numberOfLines={2}>
                      {item.description}
                    </Text>
                    <Text style={styles.discountText}>
                      🔥 Giảm {item.discount}%
                    </Text>
                  </Animatable.View>
                )}
                keyExtractor={(item) => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.flatListContent}
              />
            ) : (
              <Text style={styles.text}>Không có khuyến mãi</Text>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}
