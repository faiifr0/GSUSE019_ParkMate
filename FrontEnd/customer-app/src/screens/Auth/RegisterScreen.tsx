import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

export default function RegisterScreen({ navigation }: any) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = () => {
        // Fake đăng ký - chỉ kiểm tra nhập đủ
        if (!name || !email || !password) {
            Alert.alert('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        // Sau này thay bằng gọi API ở đây
        console.log('Đăng ký thành công với:', { name, email, password });

        Alert.alert('Đăng ký thành công', 'Bạn có thể đăng nhập ngay');
        navigation.navigate('Login'); // ✅ Quay về màn Login
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Đăng ký</Text>

            <TextInput
                placeholder="Họ tên"
                value={name}
                onChangeText={setName}
                style={styles.input}
            />

            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                style={styles.input}
            />

            <TextInput
                placeholder="Mật khẩu"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />

            <Button title="Đăng ký" onPress={handleRegister} />
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
