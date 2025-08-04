import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Image
} from 'react-native';
import {
    TextInput,
    Button,
    Text,
    ActivityIndicator
} from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../redux/userSlice';
import { login } from '../../api/localApi';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen({ navigation }: any) {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Thiếu thông tin', 'Vui lòng nhập đầy đủ email và mật khẩu');
            return;
        }

        try {
            setLoading(true);
            const response = await login(email, password);

            const { token, user } = response.data;
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
                        {/* <Image
                            source={require('../../../assets/logo.png')} // 👉 đặt logo ở đây nếu có
                            style={styles.logo}
                            resizeMode="contain"
                        /> */}
                        <Text variant="headlineMedium" style={styles.title}>
                            🎡 Chào mừng bạn!
                        </Text>

                        <TextInput
                            label="Email"
                            value={email}
                            onChangeText={setEmail}
                            style={styles.input}
                            autoCapitalize="none"
                            keyboardType="email-address"
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
    logo: {
        width: 80,
        height: 80,
        alignSelf: 'center',
        marginBottom: 16,
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
