import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../constants/colors";
import { getGameById } from "../../services/gameService";
import { gameReviewService } from "../../services/gameReviewService";
import { Game } from "../../types/Game";
import { GameReview } from "../../types/GameReview";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import { fetchBranches } from "../../redux/branchSlice";
import { AppDispatch } from "../../redux/store";


export default function GameDetailScreen({ route, navigation }: any) {
  const { gameId } = route.params;
  const [game, setGame] = useState<Game | null>(null);
  const [reviews, setReviews] = useState<GameReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { branches, loading: branchLoading } = useSelector(
    (state: RootState) => state.branch
  );

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);

      // ✅ getGameById trả trực tiếp object Game
      const gameData = await getGameById(gameId);
      setGame(gameData);

      // ✅ gọi đúng hàm từ gameReviewService
      try {
        const reviewList = await gameReviewService.getOfGame(gameId);
        setReviews(reviewList.filter((r) => r.approved));
      } catch (reviewErr) {
        console.warn("Không thể tải đánh giá:", reviewErr);
        setReviews([]); // ⛔ Nếu lỗi 500 hoặc không có, vẫn cho mảng rỗng
      }

    } catch (err: any) {
      console.error("Error fetching game detail:", err);
      setError(err.message ?? "Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  if (gameId) fetchData();
  if (!branches || branches.length === 0) dispatch(fetchBranches());
}, [gameId]);


  if (loading || branchLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 8, color: colors.textSecondary }}>
          Đang tải thông tin trò chơi...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );
  }

  if (!game) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Không tìm thấy trò chơi</Text>
      </View>
    );
  }

  const branch = branches.find((b) => b.id === game.branchId);

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
      contentContainerStyle={{
        alignItems: Platform.OS === "web" ? "center" : "stretch",
        paddingVertical: 20,
      }}
    >
      <View
        style={{
          width: Platform.OS === "web" ? "70%" : "90%",
          backgroundColor: "#fff",
          borderRadius: 16,
          elevation: 3,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 5,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.primary,
            padding: 12,
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text
            style={{
              color: "#fff",
              fontSize: 18,
              fontWeight: "bold",
              marginLeft: 10,
            }}
          >
            Chi tiết trò chơi
          </Text>
        </View>

        {/* Ảnh + mô tả */}
        <View style={{ alignItems: "center", padding: 20 }}>
          <Image
            source={{
              uri: game.imageUrl || "https://via.placeholder.com/200",
            }}
            style={{
              width: 220,
              height: 220,
              borderRadius: 16,
              backgroundColor: "#eee",
            }}
          />
          <Text
            style={{
              fontSize: 26,
              fontWeight: "bold",
              marginTop: 12,
              color: colors.textPrimary,
              textAlign: "center",
            }}
          >
            {game.name}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: colors.textSecondary,
              marginTop: 6,
              textAlign: "center",
            }}
          >
            {game.description || "Chưa có mô tả cho trò chơi này."}
          </Text>
        </View>

        {/* Thông tin chi nhánh */}
        <View
          style={{
            borderTopWidth: 1,
            borderColor: "#eee",
            padding: 16,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: colors.textPrimary,
              marginBottom: 6,
            }}
          >
            🏢 Thông tin chi nhánh
          </Text>
          {branch ? (
            <>
              <Text style={{ color: colors.textSecondary }}>
                Tên chi nhánh: {branch.name}
              </Text>
              <Text style={{ color: colors.textSecondary }}>
                Địa chỉ: {branch.address}
              </Text>
              <Text style={{ color: colors.textSecondary }}>
                Giờ mở cửa: {branch.open ?? "?"} - {branch.close ?? "?"}
              </Text>
            </>
          ) : (
            <Text style={{ color: colors.textSecondary }}>
              Không tìm thấy chi nhánh cho game này.
            </Text>
          )}
          <Text style={{ color: colors.textSecondary }}>
            Trạng thái: {game.status ? "Hoạt động" : "Tạm ngưng"}
          </Text>
        </View>

        {/* Đánh giá */}
        <View style={{ padding: 16, borderTopWidth: 1, borderColor: "#eee" }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginBottom: 10,
              color: colors.textPrimary,
            }}
          >
            ⭐ Đánh giá người chơi
          </Text>

          {reviews.length > 0 ? (
            <FlatList
              data={reviews}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View
                  style={{
                    backgroundColor: "#fafafa",
                    borderRadius: 10,
                    padding: 12,
                    marginBottom: 10,
                    borderWidth: 1,
                    borderColor: "#eee",
                  }}
                >
                  <Text style={{ fontWeight: "bold", color: colors.primary }}>
                    ⭐ {item.rating}
                  </Text>
                  <Text style={{ marginTop: 4 }}>{item.comment}</Text>
                </View>
              )}
            />
          ) : (
            <Text style={{ textAlign: "center", color: colors.textSecondary }}>
              Chưa có đánh giá nào.
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
