import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { logout } from '../../redux/userSlice';

export default function ProfileScreen({ navigation }: any) {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user.userInfo);

    const handleLogout = () => {
        dispatch(logout());
        navigation.replace('Login'); // Quay về màn hình Login sau khi logout
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Thông tin người dùng</Text>
            {user ? (
                <>
                    <Text style={styles.info}>Tên: {user.name}</Text>
                    <Text style={styles.info}>Email: {user.email}</Text>
                </>
            ) : (
                <Text>Chưa có thông tin người dùng</Text>
            )}
            <Button title="Đăng xuất" onPress={handleLogout} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    info: {
        fontSize: 16,
        marginBottom: 8,
    },
});
