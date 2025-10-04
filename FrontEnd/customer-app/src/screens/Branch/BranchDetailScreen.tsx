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
import { Game } from "../../types/Game";
import { Branch } from "../../types/Branch";
import { BranchReview, CreateBranchReviewDto } from "../../types/BranchReview";
import { getGamesByBranch } from "../../services/gameService";
import branchService from "../../services/branchService";
import { branchReviewService } from "../../services/branchReviewService";
import colors from "../../constants/colors";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Platform } from "react-native";
import eventService from "../../services/eventService";
import { Event } from "../../types/Event";

type Props = NativeStackScreenProps<RootStackParamList, "BranchDetail">;

export default function BranchDetailScreen({ route }: Props) {
  const { branchId } = route.params;
  const [branch, setBranch] = useState<Branch | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [reviews, setReviews] = useState<BranchReview[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();

  // Lấy user từ Redux
  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  // State cho review mới
  const [newRating, setNewRating] = useState<number>(0);
  const [newComment, setNewComment] = useState<string>("");

  // State validate realtime
  const [commentError, setCommentError] = useState<string>("");

  // Check validity toàn form
  const isFormValid = newRating >= 1 && !commentError;

  useEffect(() => {
    fetchBranchData();
  }, []);

  // Validate realtime khi comment thay đổi
  useEffect(() => {
    validateComment(newComment);
  }, [newComment]);

  const validateComment = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) {
      setCommentError("Vui lòng nhập nội dung đánh giá");
      return false;
    }
    if (trimmed.length < 10) {
      setCommentError("Nội dung đánh giá phải ít nhất 10 ký tự");
      return false;
    }
    if (trimmed.length > 500) {
      setCommentError("Nội dung đánh giá tối đa 500 ký tự");
      return false;
    }
    setCommentError("");
    return true;
  };

  const fetchBranchData = async () => {
    setLoading(true);
    try {
      const branchData = await branchService.getById(branchId);
      setBranch(branchData);

      const gamesData = await getGamesByBranch(branchId);
      setGames(gamesData);

      const reviewsData = await branchReviewService.getOfBranch(branchId);
      setReviews(reviewsData.filter((r) => r.approved));

      // Lấy sự kiện sắp tới
      const eventsData = await eventService.getOfBranch(branchId);
      const upcoming = eventsData.filter(e => new Date(e.endAt) >= new Date());
      setEvents(upcoming);

    } catch (err: any) {
      console.log("Error fetching branch detail:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!userInfo) {
      Alert.alert("Thông báo", "Bạn cần đăng nhập để đánh giá");
      return;
    }

    if (newRating < 1 || newRating > 5) {
      Alert.alert("Lỗi", "Vui lòng chọn số sao từ 1 đến 5");
      return;
    }

    if (!validateComment(newComment)) {
      Alert.alert("Lỗi", commentError || "Nội dung đánh giá không hợp lệ");
      return;
    }

    const data: CreateBranchReviewDto = {
      userId: Number(userInfo.id),
      branchId: Number(branchId),
      rating: newRating,
      comment: newComment.trim(),
      approved: true,
    };

    try {
      await branchReviewService.create(data);
      Alert.alert("Thành công", "Đánh giá của bạn đã gửi, chờ duyệt");
      setNewComment("");
      setNewRating(0);
      fetchBranchData();
    } catch (err: any) {
      console.log("Review error:", err.response?.data || err.message);
      Alert.alert("Lỗi", "Không thể gửi đánh giá, thử lại sau");
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
    <ScrollView style={{ flex: 1 }}>
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

      {/* Wrapper responsive */}
      <View
        style={{
          flex: 1,
          width: Platform.OS === "web" ? "60%" : "100%",
          alignSelf: "center",
        }}
      >
        {/* Thống kê */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: 16,
            width: "100%",
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
              marginHorizontal: 16,
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

        {/* Games */}
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            marginVertical: 16,
            color: colors.textPrimary,
            textAlign: Platform.OS === "web" ? "center" : "left",
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
            columnWrapperStyle={{
              justifyContent: "space-between",
              width: "100%",
              marginBottom: 16,
            }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  flex: 1,
                  margin: 8,
                  backgroundColor: "#fff",
                  borderRadius: 12,
                  width: "100%",
                  padding: 12,
                  alignItems: "center",
                  elevation: 2,
                }}
                onPress={() => navigation.navigate("GameDetail", { gameId: item.id })}
              >
                <Image
      source={{ uri: item.imageUrl || "https://via.placeholder.com/100" }}
      style={{
        width: "100%",         
    aspectRatio: 1,        // giữ hình vuông
        borderRadius: 12,
            maxWidth: 200,         // giới hạn max width
    maxHeight: 200,        
      }}
      resizeMode="cover"       // cover luôn đầy khung
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
              </TouchableOpacity>
            )}
          />
        ) : (
          <Text style={{ textAlign: "center", color: colors.textSecondary }}>
            Chi nhánh này chưa có game.
          </Text>
        )}

        {/* Upcoming Events */}
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            marginVertical: 16,
            color: colors.textPrimary,
            textAlign: Platform.OS === "web" ? "center" : "left",
          }}
        >
          🎉 Sự kiện sắp tới
        </Text>
        {events.length > 0 ? (
          <FlatList
            data={events}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            contentContainerStyle={{ width: "100%" }}
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
                  {item.name}
                </Text>
                <Text style={{ color: colors.textSecondary, marginBottom: 4 }}>
                  {new Date(item.startAt).toLocaleDateString()} - {new Date(item.endAt).toLocaleDateString()}
                </Text>
                <Text numberOfLines={2}>{item.description}</Text>
              </View>
            )}
          />
        ) : (
          <Text style={{ textAlign: "center", color: colors.textSecondary }}>
            Chưa có sự kiện nào.
          </Text>
        )}

        {/* Reviews */}
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            marginVertical: 16,
            color: colors.textPrimary,
            textAlign: Platform.OS === "web" ? "center" : "left",
          }}
        >
          ⭐ Đánh giá khách hàng
        </Text>
        {reviews.length > 0 ? (
          <FlatList
            data={reviews}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            contentContainerStyle={{ width: "100%" }}
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
                <Text style={{ fontWeight: "bold", color: colors.primary }}>⭐ {item.rating}</Text>
                <Text style={{ color: colors.textSecondary, marginBottom: 4 }}>
                  {item.email || "Người dùng ẩn danh"}
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
            marginVertical: 16,
            padding: 16,
            backgroundColor: "#fff",
            borderRadius: 12,
            elevation: 2,
            width: "100%",
          }}
        >
          <Text style={{ fontWeight: "bold", marginBottom: 8 }}>✍️ Đánh giá chi nhánh này</Text>

          {/* Rating */}
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
          {newRating < 1 && <Text style={{ color: "red", marginBottom: 6 }}>Vui lòng chọn số sao</Text>}

          <TextInput
            placeholder="Viết đánh giá của bạn..."
            style={{
              borderWidth: 1,
              borderColor: commentError ? "red" : "#ddd",
              borderRadius: 8,
              padding: 8,
              marginBottom: 6,
            }}
            multiline
            value={newComment}
            onChangeText={setNewComment}
            maxLength={500}
          />
          <Text style={{ color: commentError ? "red" : colors.textSecondary, marginBottom: 12 }}>
            {commentError || `${newComment.length}/500`}
          </Text>

          <TouchableOpacity
            onPress={handleSubmitReview}
            disabled={!isFormValid}
            style={{
              backgroundColor: isFormValid ? colors.primary : "#ccc",
              padding: 12,
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Gửi đánh giá</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
