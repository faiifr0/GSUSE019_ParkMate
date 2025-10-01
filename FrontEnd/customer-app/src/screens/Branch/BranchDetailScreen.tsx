import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { styles } from "../../styles/BranchDetailScreenStyles";

import { Game } from "../../types/Game";
import { Branch } from "../../types/Branch";
import { BranchReview, CreateBranchReviewDto } from "../../types/BranchReview";
import { getGamesByBranch } from "../../services/gameService";
import branchService from "../../services/branchService";
import { branchReviewService } from "../../services/branchReviewService";

// 👉 import RootStackParamList chuẩn từ types.ts
import { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "BranchDetail">;

export default function BranchDetailScreen({ route }: Props) {
  const { branchId } = route.params;
  const [branch, setBranch] = useState<Branch | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [reviews, setReviews] = useState<BranchReview[]>([]);
  const [loading, setLoading] = useState(true);

  // State cho review mới
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>("");

  useEffect(() => {
    fetchBranchData();
  }, []);

  const fetchBranchData = async () => {
    setLoading(true);
    try {
      const branchData = await branchService.getById(branchId);
      setBranch(branchData);

      const gamesData = await getGamesByBranch(branchId);
      setGames(gamesData);

      const reviewsData = await branchReviewService.getAll();
      setReviews(
        reviewsData.filter((r) => r.branchId === branchId && r.approved)
      );
    } catch (err: any) {
      console.log("Error fetching branch detail:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderGameItem = ({ item }: { item: Game }) => (
    <View style={styles.gameCard}>
      <Image
        source={{
          uri: item.imageUrl || "https://via.placeholder.com/100",
        }}
        style={styles.gameImage}
      />
      <Text style={styles.gameName} numberOfLines={1}>
        {item.name}
      </Text>
    </View>
  );

  const renderReviewItem = ({ item }: { item: BranchReview }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <Text style={styles.reviewRating}>⭐ {item.rating}</Text>
        <Text style={styles.reviewUser}>
          {item.userId ?? "Người dùng ẩn danh"}
        </Text>
      </View>
      <Text style={styles.reviewComment}>{item.comment}</Text>
    </View>
  );

  const handleSubmitReview = async () => {
    if (!newComment.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập nội dung đánh giá");
      return;
    }

    const data: CreateBranchReviewDto = {
      userId: 0, // giả định guest user
      branchId,
      rating: newRating,
      comment: newComment,
      approved: false, // admin duyệt
    };

    try {
      await branchReviewService.create(data);
      Alert.alert("Thành công", "Đánh giá của bạn đã gửi, chờ duyệt");
      setNewComment("");
      setNewRating(5);
      fetchBranchData(); // reload reviews
    } catch (err: any) {
      Alert.alert("Lỗi", "Không thể gửi đánh giá, thử lại sau");
      console.log(err);
    }
  };

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color={styles.statText.color}
        style={{ flex: 1, justifyContent: "center" }}
      />
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Banner chi nhánh */}
      {branch && (
        <View style={styles.branchBanner}>
          <Text style={styles.branchName}>{branch.name}</Text>
          <Text style={styles.branchAddress}>
            {branch.address ?? "Chưa có địa chỉ"}
          </Text>
          <Text style={styles.branchHours}>
            🕒 {branch.open ?? "?"} - {branch.close ?? "?"}
          </Text>
        </View>
      )}

      {/* Thống kê */}
      <View style={styles.statsBox}>
        <Text style={styles.statText}>🎮 {games.length} trò chơi</Text>
        <Text style={styles.statText}>⭐ {reviews.length} đánh giá</Text>
      </View>

      {/* Danh sách game */}
      <Text style={styles.sectionTitle}>Các game nổi bật</Text>
      {games.length > 0 ? (
        <FlatList
          data={games}
          renderItem={renderGameItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />
      ) : (
        <Text style={styles.noGames}>Chi nhánh này chưa có game.</Text>
      )}

      {/* Review khách hàng */}
      <Text style={styles.sectionTitle}>Đánh giá khách hàng</Text>
      {reviews.length > 0 ? (
        <FlatList
          data={reviews}
          renderItem={renderReviewItem}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />
      ) : (
        <Text style={styles.noGames}>Chưa có đánh giá nào.</Text>
      )}

      {/* Form gửi review mới */}
      <View
        style={{
          margin: 16,
          padding: 16,
          backgroundColor: "#fff",
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "#ddd",
        }}
      >
        <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
          Đánh giá chi nhánh này
        </Text>

        <Text style={{ marginBottom: 4 }}>Chọn số sao:</Text>
        <View style={{ flexDirection: "row", marginBottom: 12 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <TouchableOpacity key={i} onPress={() => setNewRating(i)}>
              <Text
                style={{
                  fontSize: 24,
                  color: i <= newRating ? "#FFD700" : "#ccc",
                }}
              >
                ★
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          placeholder="Viết đánh giá của bạn..."
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 8,
            padding: 8,
            marginBottom: 12,
          }}
          multiline
          value={newComment}
          onChangeText={setNewComment}
        />

        <TouchableOpacity
          onPress={handleSubmitReview}
          style={{
            backgroundColor: "#FF6B6B",
            padding: 12,
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>
            Gửi đánh giá
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
