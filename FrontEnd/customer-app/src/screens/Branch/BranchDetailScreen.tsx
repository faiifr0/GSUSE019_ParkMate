import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";
import { useNavigation } from "@react-navigation/native"; 
import { styles as baseStyles } from "../../styles/BranchDetailScreenStyles";
import { Game } from "../../types/Game";
import { Branch } from "../../types/Branch";
import { BranchReview, CreateBranchReviewDto } from "../../types/BranchReview";
import { getGamesByBranch } from "../../services/gameService";
import branchService from "../../services/branchService";
import { branchReviewService } from "../../services/branchReviewService";
import colors from "../../constants/colors";

type Props = NativeStackScreenProps<RootStackParamList, "BranchDetail">;

export default function BranchDetailScreen({ route }: Props) {
  const { branchId } = route.params;
  const [branch, setBranch] = useState<Branch | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [reviews, setReviews] = useState<BranchReview[]>([]);
  const [loading, setLoading] = useState(true);
const navigation = useNavigation<any>();
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

  const handleSubmitReview = async () => {
    if (!newComment.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập nội dung đánh giá");
      return;
    }

    const data: CreateBranchReviewDto = {
      userId: 0,
      branchId,
      rating: newRating,
      comment: newComment,
      approved: false,
    };

    try {
      await branchReviewService.create(data);
      Alert.alert("Thành công", "Đánh giá của bạn đã gửi, chờ duyệt");
      setNewComment("");
      setNewRating(5);
      fetchBranchData();
    } catch (err: any) {
      Alert.alert("Lỗi", "Không thể gửi đánh giá, thử lại sau");
      console.log(err);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 8, color: colors.textSecondary }}>
          Đang tải chi nhánh...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Banner chi nhánh */}
      {branch && (
        <View
          style={{
            backgroundColor: colors.primary,
            padding: 20,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "#fff" }}>
            {branch.name}
          </Text>
          <Text style={{ color: "#fff", marginTop: 4 }}>{branch.address}</Text>
          <Text style={{ color: "#fff", marginTop: 4 }}>
            🕒 {branch.open ?? "?"} - {branch.close ?? "?"}
          </Text>
          {/* 👇 Nút mua vé ngay */}
          <TouchableOpacity
            onPress={() => navigation.navigate("TicketList", { branchId })}
            style={{
              marginTop: 16,
              backgroundColor: "#E85C5C",
              paddingVertical: 14,
              paddingHorizontal: 32,
              borderRadius: 30,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              🎟️ Mua vé ngay
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Thống kê */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginTop: 16,
        }}
      >
        <View
          style={{
            flex: 1,
            marginHorizontal: 8,
            backgroundColor: colors.surface,
            padding: 16,
            borderRadius: 12,
            alignItems: "center",
            elevation: 2,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold", color: colors.primary }}>
            {games.length}
          </Text>
          <Text style={{ color: colors.textSecondary }}>Trò chơi</Text>
        </View>
        <View
          style={{
            flex: 1,
            marginHorizontal: 8,
            backgroundColor: colors.surface,
            padding: 16,
            borderRadius: 12,
            alignItems: "center",
            elevation: 2,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#FFD700" }}>
            {reviews.length}
          </Text>
          <Text style={{ color: colors.textSecondary }}>Đánh giá</Text>
        </View>
      </View>

      {/* Danh sách game */}
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          margin: 16,
          color: colors.textPrimary,
        }}
      >
        🎮 Các game nổi bật
      </Text>
      {games.length > 0 ? (
        <FlatList
          data={games}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          columnWrapperStyle={{ justifyContent: "space-between", paddingHorizontal: 16 }}
          renderItem={({ item }) => (
            <View
              style={{
                flex: 1,
                marginBottom: 16,
                backgroundColor: "#fff",
                borderRadius: 12,
                padding: 12,
                alignItems: "center",
                elevation: 2,
              }}
            >
              <Image
                source={{ uri: item.imageUrl || "https://via.placeholder.com/100" }}
                style={{ width: 100, height: 100, borderRadius: 12 }}
              />
              <Text
                style={{
                  marginTop: 8,
                  fontWeight: "bold",
                  color: colors.textPrimary,
                }}
                numberOfLines={1}
              >
                {item.name}
              </Text>
            </View>
          )}
        />
      ) : (
        <Text style={{ textAlign: "center", color: colors.textSecondary }}>
          Chi nhánh này chưa có game.
        </Text>
      )}

      {/* Đánh giá khách hàng */}
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          margin: 16,
          color: colors.textPrimary,
        }}
      >
        ⭐ Đánh giá khách hàng
      </Text>
      {reviews.length > 0 ? (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 12,
                padding: 12,
                marginBottom: 12,
                elevation: 1,
              }}
            >
              <Text style={{ fontWeight: "bold", color: colors.primary }}>
                ⭐ {item.rating}
              </Text>
              <Text style={{ color: colors.textSecondary, marginBottom: 4 }}>
                {item.userId ?? "Người dùng ẩn danh"}
              </Text>
              <Text>{item.comment}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={{ textAlign: "center", color: colors.textSecondary }}>
          Chưa có đánh giá nào.
        </Text>
      )}

      {/* Form gửi review */}
      <View
        style={{
          margin: 16,
          padding: 16,
          backgroundColor: "#fff",
          borderRadius: 12,
          elevation: 2,
        }}
      >
        <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
          ✍️ Đánh giá chi nhánh này
        </Text>

        {/* Rating sao */}
        <View style={{ flexDirection: "row", marginBottom: 12 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <TouchableOpacity key={i} onPress={() => setNewRating(i)}>
              <Text
                style={{
                  fontSize: 28,
                  marginRight: 6,
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
            minHeight: 80,
          }}
          multiline
          value={newComment}
          onChangeText={setNewComment}
        />

        <TouchableOpacity
          onPress={handleSubmitReview}
          style={{
            backgroundColor: colors.primary,
            padding: 12,
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Gửi đánh giá</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
