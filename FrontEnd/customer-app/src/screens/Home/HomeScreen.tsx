// src/screens/Home/HomeScreen.tsx
import React from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Platform,
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import * as Animatable from "react-native-animatable";
import colors from "../../constants/colors";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";
import { useHomeData } from "../../hooks/useHomeData";

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

// Hoverable wrapper cho web
const HoverableCard = ({ children, style }: { children: React.ReactNode; style?: any }) => {
  const [hover, setHover] = React.useState(false);

  if (Platform.OS === "web") {
    return (
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          ...style,
          ...(hover && { transform: "scale(1.05)", boxShadow: "0 4px 24px rgba(0,0,0,0.25)" }),
        }}
      >
        {children}
      </div>
    );
  }

  return <View style={style}>{children}</View>;
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const user = useSelector((state: RootState) => state.user.userInfo);
  const { branches, nearestBranch, promotions, hotGames, coin, loading, refreshing, error, onRefresh } =
    useHomeData(user?.id);

  // ---------------- WEB ----------------
  if (Platform.OS === "web") {
    if (loading)
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );

    if (error)
      return (
        <View style={styles.centered}>
          <Text style={{ color: "red" }}>{error}</Text>
        </View>
      );

    return (
      <ScrollView style={styles.webScroll} contentContainerStyle={styles.webContainer} keyboardShouldPersistTaps="handled">
        {/* Hero */}
        <View style={styles.heroContainer}>
          <Text style={styles.heroText}>KHU VUI CHƠI ĐẦY SẮC MÀU</Text>
          <TouchableOpacity
            onPress={() => hotGames.length > 0 && navigation.navigate("GameDetail", { gameId: hotGames[0].id })}
            style={styles.heroButton}
          >
            <Text style={styles.heroButtonText}>Khám phá ngay</Text>
          </TouchableOpacity>
        </View>

        {/* Hot Games */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>🎡 Trò chơi hot</Text>
          <View style={styles.grid}>
            {hotGames.map((game) => (
              <HoverableCard key={game.id} style={styles.card}>
                <TouchableOpacity onPress={() => navigation.navigate("GameDetail", { gameId: game.id })}>
                  <Image
                    source={{ uri: game.imageUrl || "https://via.placeholder.com/220x140" }}
                    style={styles.cardImage}
                  />
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{game.name}</Text>
                    <Text style={styles.cardSubtitle}>{game.description}</Text>
                  </View>
                </TouchableOpacity>
              </HoverableCard>
            ))}
          </View>
        </View>

        {/* Promotions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: "#e63946" }]}>🔥 Khuyến mãi nổi bật</Text>
          <View style={{ flexDirection: "column", gap: 20 }}>
            {promotions.length > 0 ? (
              promotions.map((promo) => (
                <HoverableCard key={promo.id} style={styles.promoCard}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("PromotionDetail", { promoId: promo.id })}
                  >
                    <Image
                      source={{ uri: promo.imageUrl || "https://via.placeholder.com/600x200" }}
                      style={{ width: "100%", height: 160 }}
                    />
                    <View style={{ padding: 16 }}>
                      <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 6 }}>{promo.description}</Text>
                      <Text style={{ color: "#ff6a88", fontSize: 16 }}>Giảm {promo.discount}%</Text>
                    </View>
                  </TouchableOpacity>
                </HoverableCard>
              ))
            ) : (
              <Text>Không có khuyến mãi</Text>
            )}
          </View>
        </View>

        {/* Nearest Branch */}
        <View style={styles.nearestBranch}>
          <Text style={[styles.sectionTitle, { color: "#1d3557" }]}>📍 Chi nhánh gần bạn</Text>
          {nearestBranch ? (
            <View>
              <Text style={{ fontSize: 20, fontWeight: "600" }}>{nearestBranch.name}</Text>
              <Text style={{ marginTop: 4 }}>{nearestBranch.address}</Text>
              <Text style={{ marginTop: 4 }}>
                🕒 {nearestBranch.open ?? "?"} - {nearestBranch.close ?? "?"}
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("BranchDetail", { branchId: nearestBranch.id })}
                style={{ marginTop: 12 }}
              >
                <Text style={{ color: colors.primary, fontWeight: "600" }}>👉 Xem chi tiết</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text>Không tìm thấy chi nhánh gần bạn</Text>
          )}
        </View>

        {/* All Branches */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: "#1d3557" }]}>🏢 Tất cả chi nhánh</Text>
          <View style={styles.grid}>
            {branches.map((branch) => (
              <HoverableCard key={branch.id} style={styles.card}>
                <TouchableOpacity onPress={() => navigation.navigate("BranchDetail", { branchId: branch.id })}>
                  <Image
                    source={{ uri: branch.imageUrl || "https://via.placeholder.com/220x140" }}
                    style={styles.cardImage}
                  />
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{branch.name}</Text>
                    <Text style={styles.cardSubtitle}>{branch.address}</Text>
                    <Text style={{ marginTop: 4, fontSize: 14, color: "#666" }}>
                      🕒 {branch.open ?? "?"} - {branch.close ?? "?"}
                    </Text>
                  </View>
                </TouchableOpacity>
              </HoverableCard>
            ))}
          </View>
        </View>
      </ScrollView>
    );
  }

  // ---------------- MOBILE ----------------
  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
      >
        <Animatable.Text animation="fadeIn" style={styles.mobileTitle}>
          🎡 Chào mừng đến với ParkMate
        </Animatable.Text>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <>
            {error && <Text style={{ color: "red" }}>{error}</Text>}

            {/* Nearest Branch */}
            {nearestBranch && (
              <TouchableOpacity onPress={() => navigation.navigate("BranchDetail", { branchId: nearestBranch.id })}>
                <Animatable.View animation="bounceIn" duration={900} style={styles.mobileNearestBranch}>
                  <Text style={{ fontWeight: "bold", fontSize: 18 }}>Chi nhánh gần nhất</Text>
                  <Text>{nearestBranch.name}</Text>
                  <Text>{nearestBranch.address ?? "Chưa có địa chỉ"}</Text>
                  <Text>🕒 {nearestBranch.open ?? "?"} - {nearestBranch.close ?? "?"}</Text>
                </Animatable.View>
              </TouchableOpacity>
            )}

            {/* Branches */}
            <Animatable.Text animation="fadeIn" style={styles.mobileSectionTitle}>
              Danh sách chi nhánh
            </Animatable.Text>
            <FlatList
              horizontal
              data={branches}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => navigation.navigate("BranchDetail", { branchId: item.id })}>
                  <Animatable.View animation="fadeInUp" style={styles.mobileCard}>
                    <Image source={{ uri: item.imageUrl || "https://via.placeholder.com/150" }} style={styles.mobileCardImage} />
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

            {/* Promotions */}
            <Animatable.Text animation="fadeIn" style={styles.mobileSectionTitle}>
              Khuyến mãi nổi bật
            </Animatable.Text>
            <FlatList
              horizontal
              data={promotions}
              renderItem={({ item }) => (
                <Animatable.View animation="fadeInUp" style={styles.mobileCard}>
                  <Image source={{ uri: item.imageUrl || "https://via.placeholder.com/150" }} style={styles.mobileCardImage} />
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

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  webScroll: { flex: 1, backgroundColor: "transparent" },
  webContainer: { flexGrow: 1, padding: 60 },
  heroContainer: { paddingVertical: 120, alignItems: "center", justifyContent: "center" },
  heroText: { fontSize: 52, fontWeight: "900", color: "white", textAlign: "center" },
  heroButton: { marginTop: 40, backgroundColor: colors.primary, paddingVertical: 16, paddingHorizontal: 32, borderRadius: 12 },
  heroButtonText: { color: "white", fontSize: 20, fontWeight: "700" },
  section: { marginBottom: 60 },
  sectionTitle: { fontSize: 28, fontWeight: "700", marginBottom: 20 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 20, justifyContent: "center" },
  card: { width: 220, backgroundColor: "#fff", borderRadius: 16, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
  cardImage: { width: "100%", height: 140 },
  cardContent: { padding: 12 },
  cardTitle: { fontSize: 16, fontWeight: "600" },
  cardSubtitle: { fontSize: 14, color: "#666" },
  promoCard: { backgroundColor: "#fff", borderRadius: 16, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
  nearestBranch: { backgroundColor: "#fff", borderRadius: 20, padding: 30, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 6, elevation: 3, marginBottom: 40 },
  mobileTitle: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  mobileNearestBranch: { backgroundColor: "#f9f9f9", padding: 16, borderRadius: 12, marginBottom: 20 },
  mobileSectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
  mobileCard: { width: 150, marginRight: 12, backgroundColor: "#fff", borderRadius: 12, padding: 8, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4 },
  mobileCardImage: { width: "100%", height: 100, borderRadius: 8 },
});
