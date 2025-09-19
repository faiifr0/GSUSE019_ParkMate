import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { registerUser, loginUser } from '../../services/userService';
import { walletService } from '../../services/walletService';
import { decodeJWT, setUserId } from '../../api/axiosClient';

export default function RegisterScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    setBusy(true);
    try {
      // 1️⃣ Đăng ký user
      await registerUser(email, password);

      // 2️⃣ Login ngay để lấy token
      const res = await loginUser(email, password);
      const token = res.data?.accessToken;
      if (!token) throw new Error("Login failed");

      // 3️⃣ Lưu token & userId vào storage
      const payload = decodeJWT(token);
      const userId = payload?.sub || payload?.userId;
      if (!userId) throw new Error("Invalid token payload");
      await setUserId(userId);

      // 4️⃣ Tạo ví (ensureWallet) **sau khi token + userId đã lưu**
      await walletService.ensureWallet();

      Alert.alert('Thành công', 'Bạn đã đăng ký và ví đã được tạo.');
      navigation.navigate('Login');
    } catch (err: any) {
      console.error(err);
      Alert.alert('Lỗi', err?.response?.data?.message || err.message || 'Có lỗi xảy ra.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng ký</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={styles.input}
        editable={!busy}
      />
      <TextInput
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        editable={!busy}
      />
      <Button title={busy ? 'Đang xử lý...' : 'Đăng ký'} onPress={handleRegister} disabled={busy} />
      <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
        Đã có tài khoản? Đăng nhập
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 12, padding: 8 },
  link: { marginTop: 16, textAlign: 'center', color: 'blue' },
});
