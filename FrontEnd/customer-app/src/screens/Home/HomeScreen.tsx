import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';
import * as Animatable from 'react-native-animatable';
import branchPromotionService from '../../services/branchPromotionService';
import { BranchPromotion } from '../../types/BranchPromotion';
import branchService from '../../services/branchService';
import { Branch } from '../../types/Branch';
import styles from '../../styles/HomeScreenStyles';
import colors from '../../constants/colors';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

type RootStackParamList = {
  BranchDetail: { branchId: number };
  Notifications: undefined;
};

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

// ✅ Header component để reuse
function AppHeader({ coin, onNotificationPress }: { coin: number; onNotificationPress: () => void }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: colors.primary,
      }}
    >
      {/* Tên App */}
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>🎡 ParkMate</Text>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {/* Coin */}
        <View
          style={{
            backgroundColor: 'white',
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 20,
            marginRight: 12,
          }}
        >
          <Text style={{ fontWeight: 'bold', color: colors.primary }}>🪙 {coin}</Text>
        </View>

        {/* Notification */}
        <TouchableOpacity onPress={onNotificationPress}>
          <Ionicons name="notifications-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [nearestBranch, setNearestBranch] = useState<Branch | null>(null);
  const [promotions, setPromotions] = useState<BranchPromotion[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 🚀 coin giả định, sau này lấy từ API hoặc Redux
  const [coin] = useState<number>(120);

  useEffect(() => {
    const fetchBranches = async () => {
      setLoading(true);
      setError(null);

      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        let userCoords: { latitude: number; longitude: number } | null = null;

        if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({});
          userCoords = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };
        }

        const branchList: Branch[] = await branchService.getAll();
        setBranches(branchList);

        // Tìm chi nhánh gần nhất
        let closest: Branch | null = null;
        let minDistance = Infinity;

        if (userCoords) {
          branchList.forEach((b: Branch) => {
            if (typeof b.lat !== 'number' || typeof b.lon !== 'number') return;
            const dist = getDistance(userCoords!, { latitude: b.lat, longitude: b.lon });
            if (dist < minDistance) {
              minDistance = dist;
              closest = b;
            }
          });
        }

        setNearestBranch(closest);

        if (closest && (closest as Branch).id) {
          const promos = await branchPromotionService.getByBranchId((closest as Branch).id);
          setPromotions(promos || []);
        } else {
          setPromotions([]);
        }

        if (!userCoords) {
          setError('Vị trí không được cấp phép. Chỉ hiển thị chi nhánh và khuyến mãi.');
        }
      } catch (err: any) {
        setError(err?.message ?? 'Có lỗi khi tải dữ liệu.');
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  const renderPromoItem = ({ item, index }: { item: BranchPromotion; index: number }) => (
    <Animatable.View animation="fadeInUp" delay={index * 150} style={styles.promoCard}>
      <Image
        source={{ uri: item.image || 'https://via.placeholder.com/150' }}
        style={styles.promoImage}
      />
      <Text style={styles.promoText} numberOfLines={2}>{item.description}</Text>
      <Text style={styles.discountText}>🔥 Giảm {item.discount}%</Text>
    </Animatable.View>
  );

  const renderBranchItem = ({ item, index }: { item: Branch; index: number }) => (
    <TouchableOpacity onPress={() => navigation.navigate('BranchDetail', { branchId: item.id })}>
      <Animatable.View animation="fadeInUp" delay={index * 100} style={styles.branchCard}>
        <Image
          source={{ uri: 'https://via.placeholder.com/150' }}
          style={styles.branchImage}
        />
        <Text style={styles.branchName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.branchAddress} numberOfLines={1}>{item.address ?? ''}</Text>
      </Animatable.View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* ✅ Header mới */}
      <AppHeader
        coin={coin}
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animatable.Text animation="fadeIn" style={styles.title}>
          🎡 Chào mừng đến với ParkMate
        </Animatable.Text>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
        ) : (
          <>
            {error && <Text style={styles.errorText}>{error}</Text>}

            {nearestBranch && (
              <Animatable.View animation="bounceIn" duration={900} style={styles.branchBox}>
                <Text style={styles.branchTitle}>Chi nhánh gần nhất</Text>
                <Text style={styles.text} numberOfLines={1}>{nearestBranch.name}</Text>
                <Text style={styles.text} numberOfLines={1}>{nearestBranch.address ?? 'Chưa có địa chỉ'}</Text>
                <Text style={styles.text}>🕒 {nearestBranch.open ?? '?'} - {nearestBranch.close ?? '?'}</Text>
              </Animatable.View>
            )}

            <Animatable.Text animation="fadeIn" style={styles.sectionTitle}>
              Danh sách chi nhánh
            </Animatable.Text>
            {branches.length > 0 ? (
              <FlatList
                horizontal
                data={branches}
                renderItem={renderBranchItem}
                keyExtractor={(item) => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.flatListContent}
              />
            ) : (
              <Text style={styles.text}>Không có chi nhánh</Text>
            )}

            <Animatable.Text animation="fadeIn" style={styles.sectionTitle}>
              Khuyến mãi nổi bật
            </Animatable.Text>
            {promotions.length > 0 ? (
              <FlatList
                horizontal
                data={promotions}
                renderItem={renderPromoItem}
                keyExtractor={(item) => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.flatListContent}
              />
            ) : (
              <Text style={styles.text}>Không có khuyến mãi</Text>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}
