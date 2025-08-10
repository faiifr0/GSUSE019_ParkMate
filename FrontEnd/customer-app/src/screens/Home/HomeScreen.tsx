// HomeScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, ScrollView } from "react-native";
import * as Location from "expo-location";
import { getDistance } from "geolib";
import { branches, promotions } from "../../api/mockData";

export default function HomeScreen() {
  const [nearestBranch, setNearestBranch] = useState<any>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      let location = await Location.getCurrentPositionAsync({});
      const userCoords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      let closest = null;
      let minDistance = Infinity;

      branches.forEach(branch => {
        const dist = getDistance(userCoords, {
          latitude: branch.lat,
          longitude: branch.lon,
        });
        if (dist < minDistance) {
          minDistance = dist;
          closest = branch;
        }
      });

      setNearestBranch(closest);
    })();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Trang chủ</Text>
      {nearestBranch && (
        <View style={styles.branchBox}>
          <Text style={styles.branchTitle}>Chi nhánh gần nhất</Text>
          <Text>{nearestBranch.name}</Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>Khuyến mãi nổi bật</Text>
      <FlatList
        horizontal
        data={promotions}
        renderItem={({ item }) => (
          <View style={styles.promoCard}>
            <Image source={{ uri: item.image }} style={styles.promoImage} />
            <Text style={styles.promoText}>{item.title}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  branchBox: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  branchTitle: { fontWeight: "bold" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  promoCard: { marginRight: 12, width: 150 },
  promoImage: { width: "100%", height: 90, borderRadius: 8 },
  promoText: { marginTop: 5, fontSize: 14 },
});
