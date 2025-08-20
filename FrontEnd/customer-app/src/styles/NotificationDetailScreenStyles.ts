import { StyleSheet } from "react-native";
import colors from "../constants/colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  content: {
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 24,
    marginBottom: 16,
  },
  status: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.accent || colors.primary, // nếu có accent thì dùng, không thì fallback sang primary
    marginBottom: 12,
  },
  noData: {
    textAlign: "center",
    color: colors.textSecondary,
    marginTop: 20,
  },
});
