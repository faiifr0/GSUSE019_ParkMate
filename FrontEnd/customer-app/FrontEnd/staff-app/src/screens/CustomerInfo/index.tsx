import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CustomerInfoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 Customer Info</Text>
      <Text>Tìm kiếm / quét mã khách hàng (placeholder)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  title: { fontSize: 20, marginBottom: 8 }
});
