import { StyleSheet } from "react-native";
import colors from "../constants/colors";

export default StyleSheet.create({
  safe: { flex: 1, justifyContent: "center", paddingHorizontal: 24 },
  logo: { width: 180, height: 180, alignSelf: "center", marginBottom: 12 },
  title: {
    fontSize: 32,
    fontFamily: "Poppins-Bold",
    color: colors.surface,
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: colors.surface,
    textAlign: "center",
    marginBottom: 28,
  },
  input: {
    marginBottom: 16,
    backgroundColor: colors.surface,
  },
  inputOutline: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  button: {
    borderRadius: 14,
    marginTop: 8,
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: colors.surface,
  },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  link: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: "#2563EB", // xanh dương tươi, dễ nhìn trên cả nền sáng/tối
  },

  highlightLink: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: "#F97316", // cam nổi bật (cho nút Đăng ký)
  },
});
