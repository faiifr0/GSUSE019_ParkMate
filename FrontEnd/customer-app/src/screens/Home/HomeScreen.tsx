import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import { getDistance } from "geolib";
import branchPromotionService, { BranchPromotion } from "../../services/branchPromotionService";
import branchService, { Branch } from "../../services/branchService";
import * as Animatable from "react-native-animatable";

export default function HomeScreen() {
  const [nearestBranch, setNearestBranch] = useState<Branch | null>(null);
  const [promotions, setPromotions] = useState<BranchPromotion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError("Không có quyền truy cập vị trí.");
          setLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const userCoords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        const branchList = await branchService.getAll();

        let closest: Branch | null = null;
        let minDistance = Infinity;

        branchList.forEach((b) => {
          if (typeof b.lat !== "number" || typeof b.lon !== "number") return;
          const dist = getDistance(userCoords, { latitude: b.lat, longitude: b.lon });
          if (dist < minDistance) {
            minDistance = dist;
            closest = b;
          }
        });

        setNearestBranch(closest);

        if (closest) {
          const promos = await branchPromotionService.getByBranchId((closest as Branch).id);
          setPromotions(promos);
        } else {
          setPromotions([]);
        }
      } catch (err: any) {
        console.error(err);
        setError(err?.message ?? "Có lỗi khi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderPromoItem = ({ item, index }: { item: BranchPromotion; index: number }) => (
    <Animatable.View
      animation="fadeInUp"
      delay={index * 150}
      duration={700}
      style={styles.promoCard}
    >
      <Animatable.Image
        animation="zoomIn"
        duration={700}
        source={{ uri: item.image || "https://via.placeholder.com/150" }}
        style={styles.promoImage}
      />
      <Text style={styles.promoText}>{item.description}</Text>
      <Text style={{ fontSize: 12, color: "green" }}>Giảm {item.discount}%</Text>
    </Animatable.View>
  );

  return (
    <ScrollView style={styles.container}>
      <Animatable.Text animation="fadeIn" style={styles.title}>
        Trang chủ
      </Animatable.Text>

      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : error ? (
        <Text style={{ color: "red" }}>{error}</Text>
      ) : (
        <>
          {nearestBranch ? (
            <Animatable.View
              animation="bounceIn"
              duration={900}
              style={styles.branchBox}
            >
              <Text style={styles.branchTitle}>Chi nhánh gần nhất</Text>
              <Text style={styles.text}>{nearestBranch.name}</Text>
              <Text style={styles.text}>{nearestBranch.address ?? "Chưa có địa chỉ"}</Text>
              <Text style={styles.text}>Giờ mở cửa: {nearestBranch.open ?? "Chưa có"}</Text>
              <Text style={styles.text}>Giờ đóng cửa: {nearestBranch.close ?? "Chưa có"}</Text>
            </Animatable.View>
          ) : (
            <Text style={styles.text}>Không tìm thấy chi nhánh gần bạn</Text>
          )}

          <Animatable.Text animation="fadeIn" style={styles.sectionTitle}>
            Khuyến mãi nổi bật
          </Animatable.Text>
          {promotions.length > 0 ? (
            <FlatList
              horizontal
              data={promotions}
              renderItem={renderPromoItem}
              keyExtractor={(item, index) => String((item as any).id ?? (item as any).promotionId ?? index)}
              showsHorizontalScrollIndicator={false}
            />
          ) : (
            <Text style={styles.text}>Không có khuyến mãi</Text>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10, color: "#000" },
  branchBox: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  branchTitle: { fontWeight: "bold", color: "#000" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8, color: "#000" },
  promoCard: { marginRight: 12, width: 150 },
  promoImage: { width: "100%", height: 90, borderRadius: 8 },
  promoText: { marginTop: 5, fontSize: 14, color: "#000" },
  text: { color: "#000" },
});
