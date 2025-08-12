import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { userService } from '../../services/userService';

export default function RegisterScreen({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        if (!email || !password) {
            Alert.alert('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        try {
            const res = await userService.register(email, password);
            console.log('Đăng ký thành công:', res.data);
            Alert.alert('Thành công', 'Bạn có thể đăng nhập ngay.');
            navigation.navigate('Login');
        } catch (err: any) {
            console.error(err);
            Alert.alert('Lỗi đăng ký', err?.response?.data?.message || 'Có lỗi xảy ra.');
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
