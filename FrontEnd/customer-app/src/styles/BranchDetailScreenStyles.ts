import { StyleSheet } from "react-native";
import colors from "../constants/colors";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  // Banner chi nhánh
  branchBanner: {
    padding: 24,
    backgroundColor: colors.gradientStart,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  branchName: { fontSize: 26, fontWeight: "bold", color: colors.surface, marginBottom: 6 },
  branchAddress: { fontSize: 14, color: colors.surface, marginBottom: 2 },
  branchHours: { fontSize: 14, color: colors.surface },

  // Thống kê trò chơi và đánh giá
  statsBox: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 14,
    backgroundColor: colors.surface,
    marginVertical: 12,
    borderRadius: 16,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statText: { fontSize: 14, fontWeight: "600", color: colors.textPrimary },

  // Tiêu đề các section
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginLeft: 16,
    marginBottom: 12,
    color: colors.textPrimary,
  },

  // Game card
  gameCard: {
    width: 130,
    marginRight: 16,
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  gameImage: { width: 120, height: 120, borderRadius: 12, marginBottom: 6, backgroundColor: colors.border },
  gameName: { fontSize: 14, textAlign: "center", fontWeight: "500", color: colors.textPrimary },

  noGames: { padding: 16, fontSize: 14, color: colors.textSecondary, textAlign: "center" },

  // Review khách hàng
  reviewCard: {
    padding: 14,
    marginBottom: 10,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  reviewHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  reviewRating: { fontSize: 14, fontWeight: "bold", color: colors.accent },
  reviewUser: { fontSize: 12, color: colors.textSecondary },
  reviewComment: { fontSize: 14, color: colors.textPrimary },

  // Banner promotion / highlight nếu muốn thêm
  promoBanner: {
    height: 180,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 12,
    overflow: "hidden",
    backgroundColor: colors.secondary,
  },
  promoImage: { width: "100%", height: "100%" },
});
