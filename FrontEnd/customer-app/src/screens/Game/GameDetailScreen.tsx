import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  FlatList,
  TouchableOpacity,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../constants/colors";
import { getGameById } from "../../services/gameService";
import { gameReviewService } from "../../services/gameReviewService";
import { Game } from "../../types/Game";
import { GameReview } from "../../types/GameReview";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { fetchBranches } from "../../redux/branchSlice";

export default function GameDetailScreen({ route, navigation }: any) {
  const { gameId } = route.params;
  const [game, setGame] = useState<Game | null>(null);
  const [reviews, setReviews] = useState<GameReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewError, setReviewError] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();
  const { branches, loading: branchLoading } = useSelector(
    (state: RootState) => state.branch
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const gameData = await getGameById(gameId);
        setGame(gameData);

        try {
          const reviewList = await gameReviewService.getOfGame(gameId);
          setReviews(reviewList.filter((r) => r.approved));
          setReviewError(false);
        } catch (reviewErr) {
          console.warn("⚠️ Không thể tải đánh giá:", reviewErr);
          setReviews([]);
          setReviewError(true);
        }
      } catch (err: any) {
        console.error("❌ Lỗi khi tải trò chơi:", err);
        setError(err.message ?? "Không tải được trò chơi");
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

  if (error || !game) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "red", textAlign: "center", padding: 16 }}>
          {error ?? "Không tìm thấy trò chơi"}
        </Text>
      </View>
    );
  }

  const branch = branches.find((b) => b.id === game.branchId);

  return (
    <ScrollView
      contentContainerStyle={{
        padding: Platform.OS === "web" ? 40 : 0,
        alignItems: "center",
        backgroundColor: "#f8f9fa",
        flexGrow: 1,
      }}
    >
{/* Header */}
{Platform.OS === "web" ? (
  // 👉 Web version: chỉ là nút back gọn
  <View
    style={{
      width: "80%",
      maxWidth: 1200,
      marginTop: 24,
      marginBottom: 8,
      alignSelf: "center",
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    }}
  >
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
      <Text style={{ marginLeft: 6, color: colors.textPrimary, fontWeight: "600" }}>
        Quay lại
      </Text>
    </TouchableOpacity>
  </View>
) : (
  // 👉 App version: full header bar
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.primary,
      paddingVertical: 14,
      paddingHorizontal: 16,
      width: "100%",
    }}
  >
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Ionicons name="arrow-back" size={26} color="#fff" />
    </TouchableOpacity>
    <Text
      style={{
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
        marginLeft: 10,
      }}
    >
      Chi tiết trò chơi
    </Text>
  </View>
)}

<View
  style={{
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    width: Platform.OS === "web" ? "80%" : "100%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    borderWidth: Platform.OS === "web" ? 1 : 0,
    borderColor: "#eee",
  }}
>
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    }}
  >
    <Ionicons name="business-outline" size={22} color={colors.primary} />
    <Text
      style={{
        fontSize: 18,
        fontWeight: "bold",
        color: colors.primary,
        marginLeft: 8,
      }}
    >
      Thông tin chi nhánh
    </Text>
  </View>

  {branch ? (
    <>
      <View style={{ marginBottom: 6 }}>
        <Text style={{ color: colors.textSecondary }}>
          <Text style={{ fontWeight: "600", color: colors.textPrimary }}>Tên: </Text>
          {branch.name}
        </Text>
      </View>
      <View style={{ marginBottom: 6 }}>
        <Text style={{ color: colors.textSecondary }}>
          <Text style={{ fontWeight: "600", color: colors.textPrimary }}>Địa chỉ: </Text>
          {branch.address}
        </Text>
      </View>
      <View>
        <Text style={{ color: colors.textSecondary }}>
          <Text style={{ fontWeight: "600", color: colors.textPrimary }}>Giờ mở cửa: </Text>
          {branch.open ?? "?"} - {branch.close ?? "?"}
        </Text>
      </View>
    </>
  ) : (
    <Text style={{ color: colors.textSecondary }}>
      Không tìm thấy chi nhánh cho game này.
    </Text>
  )}
</View>


      {/* Nội dung chính */}
      <View
        style={{
          width: Platform.OS === "web" ? "80%" : "100%",
          maxWidth: 1200,
          flexDirection: Platform.OS === "web" ? "row" : "column",
          gap: Platform.OS === "web" ? 32 : 0,
          padding: Platform.OS === "web" ? 24 : 0,
        }}
      >
        {/* Cột trái - Game info */}
        <View
          style={{
            flex: 1,
            backgroundColor: "#fff",
            borderRadius: 16,
            padding: 16,
            marginTop: 16,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 2,
          }}
        >
          <Image
            source={{
              uri: game.imageUrl || "https://via.placeholder.com/300",
            }}
            style={{
              width: "100%",
              height: Platform.OS === "web" ? 300 : 250,
              borderRadius: 12,
              backgroundColor: "#eee",
              marginBottom: 16,
              resizeMode: "cover",
            }}
          />
          <Text
            style={{
              fontSize: 26,
              fontWeight: "bold",
              color: colors.textPrimary,
              marginBottom: 10,
            }}
          >
            {game.name}
          </Text>
          <Text style={{ color: colors.textSecondary, lineHeight: 22 }}>
            {game.description || "Chưa có mô tả cho trò chơi này."}
          </Text>

          
        </View>

        {/* Cột phải - Review */}
        <View
          style={{
            flex: 1,
            marginTop: Platform.OS === "web" ? 16 : 0,
          }}
        >
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

          {reviews.length === 0 ? (
            <Text style={{ color: colors.textSecondary, marginTop: 8 }}>
              {reviewError
                ? "Không thể tải đánh giá."
                : "Chưa có đánh giá nào."}
            </Text>
          ) : (
            reviews.map((item) => (
              <View
                key={item.id}
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
                <Text
                  style={{
                    marginTop: 4,
                    color: colors.textSecondary,
                    lineHeight: 20,
                  }}
                >
                  {item.comment}
                </Text>
              </View>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
}
