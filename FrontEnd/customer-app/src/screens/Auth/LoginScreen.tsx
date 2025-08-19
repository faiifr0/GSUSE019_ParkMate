import React, { useState, useCallback, useEffect } from 'react';
import { TouchableOpacity, View, Image } from 'react-native';
import { TextInput, Button, Text, ActivityIndicator, Snackbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { setCredentials } from '../../redux/userSlice';
import axiosClient from '../../api/axiosClient';
import styles from '../../styles/LoginScreenStyles';
import colors from '../../constants/colors';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  MainApp: undefined;
  ForgotPassword: undefined;
  Register: undefined;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function LoginScreen({ navigation }: { navigation: LoginScreenNavigationProp }) {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [snackbarColor, setSnackbarColor] = useState(colors.secondary);

  const opacity = useSharedValue(0);
  useEffect(() => {
    opacity.value = withTiming(1, { duration: 500 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  const showMessage = (msg: string, type: 'error' | 'success' | 'warn') => {
    setSnackbarMsg(msg);
    setSnackbarColor(type === 'success' ? colors.success : type === 'error' ? colors.error : colors.warning);
    setSnackbarVisible(true);
  };

  const handleLogin = useCallback(async () => {
    const trimmedUsername = username.trim();
    if (!trimmedUsername || !password) {
      showMessage('⚠️ Vui lòng nhập tài khoản và mật khẩu', 'warn');
      return;
    }
    try {
      setLoading(true);
      const response = await axiosClient.post('/users/login', { username: trimmedUsername, password });
      const token = response.data?.accessToken;
      if (!token) throw new Error('No token');
      await SecureStore.setItemAsync('token', token);
      dispatch(setCredentials({ token, userInfo: { username: trimmedUsername } }));
      showMessage('🎉 Đăng nhập thành công!', 'success');
      navigation.replace('MainApp');
    } catch (error) {
      showMessage('❌ Sai tài khoản hoặc mật khẩu', 'error');
    } finally {
      setLoading(false);
    }
  }, [username, password, navigation, dispatch]);

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
      style={styles.safe}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safe}>
        <Image
          source={require('../../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
          accessible
          accessibilityLabel="Logo ParkMate"
        />
        <Text style={styles.title}>🎡 ParkMate</Text>
        <Text style={styles.subtitle}>🎢 Khám phá khu vui chơi!</Text>

        <Animated.View style={[styles.form, animatedStyle]}>
          <TextInput
            label="Email"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            mode="outlined"
            style={styles.input}
            outlineStyle={styles.inputOutline}
            outlineColor={colors.border}
            activeOutlineColor={colors.primary}
            textColor={colors.textPrimary}
            accessible
            accessibilityLabel="Nhập email"
          />
          <TextInput
            label="Mật khẩu"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secureText}
            mode="outlined"
            style={styles.input}
            outlineStyle={styles.inputOutline}
            outlineColor={colors.border}
            activeOutlineColor={colors.primary}
            textColor={colors.textPrimary}
            right={<TextInput.Icon icon={secureText ? 'eye-off' : 'eye'} onPress={() => setSecureText(!secureText)} />}
            accessible
            accessibilityLabel="Nhập mật khẩu"
          />
          <Button
            mode="contained"
            onPress={handleLogin}
            disabled={loading}
            style={styles.button}
            buttonColor={loading ? colors.disabled : colors.primary}
            labelStyle={styles.buttonLabel}
            accessible
            accessibilityLabel="Đăng nhập"
          >
            {loading ? <ActivityIndicator color={colors.textPrimary} /> : 'Đăng nhập'}
          </Button>
          <View style={styles.linkContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.link}>Quên mật khẩu?</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.link}>Đăng ký</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={2500}
          style={{ backgroundColor: snackbarColor }}
          action={{ label: 'OK', onPress: () => setSnackbarVisible(false) }}
        >
          {snackbarMsg}
        </Snackbar>
      </SafeAreaView>
    </LinearGradient>
  );
}