// src/screens/Home/HomeScreen.tsx
import React, { useEffect, useState, useRef } from "react";
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
import eventService from "../../services/eventService";
import { Event } from "../../types/Event";

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

  // ---------------- Event state ----------------
  const [events, setEvents] = useState<Event[]>([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const scrollRefWeb = useRef<ScrollView>(null);
  const flatListRefMobile = useRef<FlatList>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await eventService.getAll();
      setEvents(data);
    } catch (err) {
      console.log("Error fetching events:", err);
    }
  };

// ---------------- AUTO SCROLL WEB ----------------
useEffect(() => {
  if (Platform.OS === "web" && events.length > 0) {
    const interval = setInterval(() => {
      const nextIndex = (currentEventIndex + 4) % events.length; // mỗi lần 4 event
      setCurrentEventIndex(nextIndex);
      scrollRefWeb.current?.scrollTo({
        x: nextIndex * (220 + 16), // width item + marginRight
        animated: true,
      });
    }, 3000);
    return () => clearInterval(interval);
  }
}, [currentEventIndex, events]);

  const handlePrevWeb = () => {
    const prevIndex = (currentEventIndex - 1 + events.length) % events.length;
    setCurrentEventIndex(prevIndex);
    scrollRefWeb.current?.scrollTo({ x: prevIndex * 240, animated: true });
  };

  const handleNextWeb = () => {
    const nextIndex = (currentEventIndex + 1) % events.length;
    setCurrentEventIndex(nextIndex);
    scrollRefWeb.current?.scrollTo({ x: nextIndex * 240, animated: true });
  };

  // ---------------- Mobile auto scroll ----------------
  useEffect(() => {
    if (Platform.OS !== "web") {
      const interval = setInterval(() => {
        if (events.length === 0) return;
        const nextIndex = (currentEventIndex + 1) % events.length;
        setCurrentEventIndex(nextIndex);
        flatListRefMobile.current?.scrollToIndex({ index: nextIndex, animated: true });
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [currentEventIndex, events]);

// ---------------- AUTO SCROLL ----------------
useEffect(() => {
  if (Platform.OS !== "web" && events.length > 0) {
    const interval = setInterval(() => {
      // mỗi lần next 4 item
      const nextIndex = (currentEventIndex + 4) % events.length;
      setCurrentEventIndex(nextIndex);
      flatListRefMobile.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
        viewPosition: 0, // luôn show đầu tiên của lượt
      });
    }, 3000); // 3 giây
    return () => clearInterval(interval);
  }
}, [currentEventIndex, events]);

  const handlePrevMobile = () => {
    const prevIndex = (currentEventIndex - 1 + events.length) % events.length;
    setCurrentEventIndex(prevIndex);
    flatListRefMobile.current?.scrollToIndex({ index: prevIndex, animated: true });
  };

  const handleNextMobile = () => {
    const nextIndex = (currentEventIndex + 1) % events.length;
    setCurrentEventIndex(nextIndex);
    flatListRefMobile.current?.scrollToIndex({ index: nextIndex, animated: true });
  };

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
      <ScrollView style={styles.webScroll} contentContainerStyle={styles.webContainer}>
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

{/* Events */}
<View style={styles.section}>
  <Text style={[styles.sectionTitle, { color: "#FF6A00" }]}>🎉 Sự kiện nổi bật</Text>
  {events.length > 0 ? (
    <ScrollView
      ref={scrollRefWeb}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ flexDirection: "row" }}
      pagingEnabled={true}
    >
      {events.map((event, index) => (
        <HoverableCard
          key={event.id}
          style={{
            width: 220,
            marginRight: 16,
            borderRadius: 12,
            overflow: "hidden",
            backgroundColor: "#fff",
            elevation: 3,
          }}
        >
          <TouchableOpacity onPress={() => navigation.navigate("EventDetail", { eventId: event.id })}>
            <Image
              source={{ uri: event.imageUrl || "https://via.placeholder.com/220x140" }}
              style={{ width: "100%", height: 140 }}
            />
            <View style={{ padding: 12 }}>
              <Text style={{ fontWeight: "bold" }} numberOfLines={2}>
                {event.name}
              </Text>
              <Text style={{ color: "#666", marginTop: 4 }} numberOfLines={2}>
                {event.description}
              </Text>
            </View>
          </TouchableOpacity>
        </HoverableCard>
      ))}
    </ScrollView>
  ) : (
    <Text>Chưa có sự kiện</Text>
  )}
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

{/* Events Mobile */}
<Text style={styles.mobileSectionTitle}>🎉 Sự kiện nổi bật</Text>
{events.length > 0 ? (
  <FlatList
    ref={flatListRefMobile}
    horizontal
    data={events}
    showsHorizontalScrollIndicator={false}
    keyExtractor={(item) => item.id.toString()}
    pagingEnabled
    snapToInterval={240 * 4 + 16 * 4} // mỗi item 240, margin 16, 4 item/lượt
    decelerationRate="fast"
    renderItem={({ item }) => (
      <TouchableOpacity
        onPress={() => navigation.navigate("EventDetail", { eventId: item.id })}
        style={{
          width: 240,
          marginRight: 16,
          borderRadius: 16,
          overflow: "hidden",
          backgroundColor: "#fff",
          elevation: 3,
        }}
      >
        <Image
          source={{ uri: item.imageUrl || "https://via.placeholder.com/240x150" }}
          style={{ width: "100%", height: 150 }}
        />
        <View style={{ padding: 12 }}>
          <Text style={{ fontWeight: "bold", fontSize: 16 }} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={{ color: "#666", marginTop: 4 }} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
      </TouchableOpacity>
    )}
  />
) : (
  <Text>Chưa có sự kiện</Text>
)}


            {/* Hot Games Mobile */}
            <Animatable.Text animation="fadeIn" style={styles.mobileSectionTitle}>
              🎡 Trò chơi hot
            </Animatable.Text>
            <FlatList
              horizontal
              data={hotGames}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => navigation.navigate("GameDetail", { gameId: item.id })}>
                  <Animatable.View animation="fadeInUp" style={styles.mobileCard}>
                    <Image source={{ uri: item.imageUrl || "https://via.placeholder.com/150" }} style={styles.mobileCardImage} />
                    <Text style={{ fontWeight: "bold", marginTop: 8 }} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={{ color: "#555" }} numberOfLines={1}>
                      {item.description}
                    </Text>
                  </Animatable.View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
            />

            {/* Promotions Mobile */}
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

            {/* Nearest Branch Mobile */}
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

            {/* Branches Mobile */}
            <Animatable.Text animation="fadeIn"   style={styles.mobileSectionTitle}>
              Danh sách chi nhánh
            </Animatable.Text>
            <FlatList
              horizontal
              data={branches}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => navigation.navigate("BranchDetail", { branchId: item.id })}>
                  <Animatable.View animation="fadeInUp" style={styles.mobileCard}>
                    <Image source={{ uri: item.imageUrl || "https://via.placeholder.com/150" }} style={styles.mobileCardImage} />
                    <Text style={{ fontWeight: "bold", marginTop: 8 }} numberOfLines={1}>{item.name}</Text>
                    <Text style={{ color: "#555" }} numberOfLines={1}>{item.address ?? ""}</Text>
                  </Animatable.View>
                </TouchableOpacity>
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
  webContainer: { flexGrow: 1, width: "80%", marginHorizontal: "auto" },
  heroContainer: { paddingVertical: 120, alignItems: "center", justifyContent: "center" },
  heroText: { fontSize: 52, fontWeight: "900", color: "white", textAlign: "center" },
  heroButton: { marginTop: 40, backgroundColor: colors.primary, paddingVertical: 16, paddingHorizontal: 32, borderRadius: 12 },
  heroButtonText: { color: "white", fontSize: 20, fontWeight: "700" },
  section: { marginBottom: 60 },
  sectionTitle: { fontSize: 28, fontWeight: "700", marginBottom: 20 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 16 },
  card: { width: 220, borderRadius: 12, overflow: "hidden", backgroundColor: "#fff", elevation: 3 },
  cardImage: { width: "100%", height: 140 },
  cardContent: { padding: 12 },
  cardTitle: { fontWeight: "bold", fontSize: 16 },
  cardSubtitle: { color: "#666", fontSize: 14, marginTop: 4 },
  promoCard: { borderRadius: 12, overflow: "hidden", backgroundColor: "#fff", elevation: 3 },
  nearestBranch: { marginBottom: 60 },
  mobileTitle: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  mobileSectionTitle: { fontSize: 20, fontWeight: "bold", marginVertical: 12 },
  mobileCard: { width: 160,marginBottom:60, borderRadius: 12, backgroundColor: "#fff", marginRight: 12, overflow: "hidden", elevation: 3, padding: 8 },
  mobileCardImage: { width: "100%", height: 100, borderRadius: 8 },
  mobileNearestBranch: { backgroundColor: "#fff", padding: 16, borderRadius: 12, elevation: 3, marginVertical: 12 },
});
