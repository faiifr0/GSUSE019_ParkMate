import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../redux/userSlice';
import { login } from '../../api/localApi'; // ✅ import hàm login

export default function LoginScreen({ navigation }: any) {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            console.log('🟡 Đang gọi login với:', email, password);
            const response = await login(email, password); // ✅ gọi API giả
            console.log('🟢 Login thành công:', response.data);

            const { token, user } = response.data;

            dispatch(setCredentials({ token, userInfo: user }));
            navigation.replace('MainApp');
        } catch (error: any) {
            const message = error?.response?.data?.message || 'Lỗi đăng nhập không xác định';
            console.log('🔴 Login thất bại:', message);
            Alert.alert('Đăng nhập thất bại', message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Đăng nhập</Text>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                autoCapitalize="none"
            />
            <TextInput
                placeholder="Mật khẩu"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />
            <Button title="Đăng nhập" onPress={handleLogin} />
            <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
                Chưa có tài khoản? Đăng ký
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
