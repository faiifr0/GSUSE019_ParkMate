import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity
} from 'react-native';
import {
    TextInput,
    Button,
    Text,
    ActivityIndicator
} from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../redux/userSlice';
import axiosClient from '../../api/axiosClient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen({ navigation }: any) {
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert('Thiếu thông tin', 'Vui lòng nhập đầy đủ tài khoản và mật khẩu');
            return;
        }

        try {
            setLoading(true);
            const response = await axiosClient.post('/users/login', {
                username,
                password
            });

            const token = response.data?.token;
            const user = response.data?.user;

            if (!token) {
                throw new Error('Không nhận được token từ API');
            }

            dispatch(setCredentials({ token, userInfo: user }));

            Alert.alert('Thành công', 'Đăng nhập thành công');
            navigation.replace('MainApp');
        } catch (error: any) {
            const message =
                error?.response?.data?.message === 'Invalid credentials'
                    ? 'Sai tài khoản hoặc mật khẩu'
                    : 'Lỗi đăng nhập. Vui lòng thử lại sau';
            Alert.alert('Đăng nhập thất bại', message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient
            colors={['#e0f7fa', '#ffffff']}
            style={styles.safe}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView
                    style={styles.container}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <View style={styles.form}>
                        <Text variant="headlineMedium" style={styles.title}>
                            🎡 Chào mừng bạn!
                        </Text>

                        <TextInput
                            label="Tài khoản"
                            value={username}
                            onChangeText={setUsername}
                            style={styles.input}
                            autoCapitalize="none"
                            mode="outlined"
                        />
                        <TextInput
                            label="Mật khẩu"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            style={styles.input}
                            mode="outlined"
                        />

                        <Button
                            mode="contained"
                            onPress={handleLogin}
                            disabled={loading}
                            style={styles.button}
                            contentStyle={{ paddingVertical: 6 }}
                        >
                            {loading ? <ActivityIndicator animating color="white" /> : 'Đăng nhập'}
                        </Button>

                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text style={styles.link}>Chưa có tài khoản? Đăng ký ngay</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    form: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#ffffffee',
        padding: 24,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        textAlign: 'center',
        marginBottom: 24,
        fontWeight: 'bold',
    },
    input: {
        marginBottom: 16,
    },
    button: {
        borderRadius: 8,
    },
    link: {
        marginTop: 20,
        textAlign: 'center',
        color: '#007bff',
        fontSize: 14,
    },
});
