import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Image } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import colors from "../../constants/colors";
import { Game } from "../../types/Game";
import { getGamesByBranch } from "../../services/gameService";
import branchService from "../../services/branchService";
import { Branch } from "../../types/Branch";

type RootStackParamList = {
  BranchDetail: { branchId: number };
};

type Props = NativeStackScreenProps<RootStackParamList, "BranchDetail">;

export default function BranchDetailScreen({ route }: Props) {
  const { branchId } = route.params;

  const [branch, setBranch] = useState<Branch | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBranchAndGames();
  }, []);

  const fetchBranchAndGames = async () => {
    setLoading(true);
    try {
      const branchData = await branchService.getById(branchId);
      setBranch(branchData);

      const gamesData = await getGamesByBranch(branchId);
      setGames(gamesData);
    } catch (err: any) {
      console.log("Error fetching branch or games:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderGameItem = ({ item }: { item: Game }) => (
    <View style={styles.gameCard}>
      <Image source={{ uri: item.thumbnail || "https://via.placeholder.com/100" }} style={styles.gameImage} />
      <Text style={styles.gameName} numberOfLines={1}>{item.name}</Text>
    </View>
  );

  if (loading) return <ActivityIndicator size="large" color={colors.primary} style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      {branch && (
        <View style={styles.branchInfo}>
          <Text style={styles.branchName}>{branch.name}</Text>
          <Text style={styles.branchAddress}>{branch.address ?? "Chưa có địa chỉ"}</Text>
          <Text style={styles.branchHours}>🕒 {branch.open ?? "?"} - {branch.close ?? "?"}</Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>Các game có tại chi nhánh</Text>

      {games.length > 0 ? (
        <FlatList
          data={games}
          renderItem={renderGameItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10 }}
        />
      ) : (
        <Text style={styles.noGames}>Chi nhánh này chưa có game.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  branchInfo: { padding: 16, borderBottomWidth: 1, borderBottomColor: "#eee" },
  branchName: { fontSize: 20, fontWeight: "bold", marginBottom: 4 },
  branchAddress: { fontSize: 14, color: "#555", marginBottom: 2 },
  branchHours: { fontSize: 14, color: "#555" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginTop: 16, marginLeft: 16, marginBottom: 8 },
  gameCard: { width: 100, marginRight: 10, alignItems: "center" },
  gameImage: { width: 100, height: 100, borderRadius: 8, marginBottom: 4 },
  gameName: { fontSize: 12, textAlign: "center" },
  noGames: { padding: 16, fontSize: 14, color: "#777" },
});
