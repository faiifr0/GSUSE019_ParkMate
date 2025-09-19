import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Button, TouchableOpacity, Alert } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from '../../styles/QRCodeScannerScreenstyles';

export default function QRCodeScannerScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setActive(true);
      return () => setActive(false);
    }, [])
  );

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text>Đang kiểm tra quyền truy cập camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>Ứng dụng cần quyền truy cập camera để quét mã.</Text>
        <Button title="Cấp quyền" onPress={requestPermission} />
      </View>
    );
  }

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    setScanned(true);
    Alert.alert('Mã QR đã quét được', data, [
      { text: 'Quét lại', onPress: () => setScanned(false) },
      { text: 'Đóng', style: 'cancel' }
    ]);
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  return (
    <View style={styles.container}>
      {active && (
        <CameraView
          style={styles.camera}
          facing={facing}
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr', 'ean13', 'code128'],
          }}
        >
          <View style={styles.infoBox}>
            <Text style={styles.scanText}>Đưa mã QR vào khung để quét</Text>
            <Text style={styles.subText}>
              Bạn có thể quét để thanh toán hoặc xác nhận trò chơi nếu đủ điểm
            </Text>
          </View>

          {/* lớp nền mờ */}
          <View style={styles.overlay}>
            <View style={styles.mask} />

            <View style={styles.centerRow}>
              <View style={styles.mask} />

              {/* khung + text hướng dẫn */}
              <View style={styles.scanColumn}>


                <View style={styles.scanArea}>
                  <View style={[styles.corner, styles.topLeft]} />
                  <View style={[styles.corner, styles.topRight]} />
                  <View style={[styles.corner, styles.bottomLeft]} />
                  <View style={[styles.corner, styles.bottomRight]} />
                </View>
              </View>

              <View style={styles.mask} />
            </View>

            <View style={styles.mask} />
          </View>

          {/* nút đổi camera */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
              <Text style={styles.text}>Đổi camera</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      )}
    </View>
  );
}
