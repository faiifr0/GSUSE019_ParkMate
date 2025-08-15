import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, Alert } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useFocusEffect } from '@react-navigation/native';

export default function QRCodeScannerScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [active, setActive] = useState(true); // camera active khi tab focus

  // Yêu cầu quyền khi vào lần đầu
  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, []);

  // Dùng hook để biết khi nào tab focus
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
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
              <Text style={styles.text}>Đổi camera</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      )}

      <View style={styles.overlay}>
        <Text style={styles.scanText}>Đưa mã QR vào khung</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  overlay: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    alignItems: 'center',
  },
  scanText: {
    fontSize: 18,
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
});
