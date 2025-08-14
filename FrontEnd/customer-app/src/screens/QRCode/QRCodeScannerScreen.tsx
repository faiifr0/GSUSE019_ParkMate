// ScanQRScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function ScanQRScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, []);

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text>Đang kiểm tra quyền truy cập camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>Ứng dụng cần quyền truy cập camera để quét mã.</Text>
        <Button title="Cấp quyền" onPress={requestPermission} />
      </View>
    );
  }

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScanned(true);
    Alert.alert('Mã đã quét được', data, [
      { text: 'OK', onPress: () => setScanned(false) }
    ]);
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'ean13', 'code128'],
        }}
      />
      <View style={styles.overlay}>
        <Text style={styles.text}>Quét mã QR</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
    borderRadius: 8,
  },
});
