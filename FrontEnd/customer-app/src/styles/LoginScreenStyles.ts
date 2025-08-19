import { StyleSheet } from 'react-native';
import colors from '../constants/colors';

export default StyleSheet.create({
  safe: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  logo: { width: 150, height: 150, alignSelf: 'center', marginBottom: 16 },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: colors.surface,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: colors.surface,
    textAlign: 'center',
    marginBottom: 24,
  },
  form: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  inputOutline: {
    borderWidth: 1,
    borderRadius: 10,
  },
  button: {
    borderRadius: 10,
    marginTop: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: colors.surface,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  link: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: colors.secondary,
  },
});