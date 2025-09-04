import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const scanSize = width * 0.7;

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: { flex: 1 },

  // overlay mờ xung quanh
  overlay: {
    flex: 1,
  },
  mask: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  centerRow: {
    flexDirection: 'row',
  },
  scanColumn: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  scanArea: {
    width: scanSize,
    height: scanSize,
    backgroundColor: 'transparent',
  },

  // góc khung
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#00FF00',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderLeftWidth: 4,
    borderTopWidth: 4,
  },
  topRight: {
    top: 0,
    right: 0,
    borderRightWidth: 4,
    borderTopWidth: 4,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderLeftWidth: 4,
    borderBottomWidth: 4,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderRightWidth: 4,
    borderBottomWidth: 4,
  },

  // text hướng dẫn (đưa hẳn lên đầu màn hình)
  infoBox: {
    position: 'absolute',
    top: 40,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  scanText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 4,
    textAlign: 'center',
  },

  // button đổi camera
  buttonContainer: {
    position: 'absolute',
    top: height * 0.72,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});
