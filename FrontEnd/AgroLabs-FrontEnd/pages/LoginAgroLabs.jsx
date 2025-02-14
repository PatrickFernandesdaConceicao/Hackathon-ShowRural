import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  Animated,
  Image,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

// Cores e constantes
const COLORS = {
  primary: '#2563EB',
  secondary: '#1D4ED8',
  background: '#F8FAFC',
  text: '#1E293B',
  muted: '#64748B',
  error: '#DC2626',
  white: '#FFFFFF',
};

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;

const LoginAgroLabs = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [shakeAnimation] = useState(new Animated.Value(0));
  const navigation = useNavigation();

  const validateForm = () => {
    if (!credentials.username || !credentials.password) {
      triggerShakeAnimation();
      setError('Por favor, preencha todos os campos');
      return false;
    }
    setError('');
    return true;
  };

  const triggerShakeAnimation = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleLogin = () => {
    if (!validateForm()) return;
    
    console.log('Login attempt with:', credentials);
    navigation.navigate('Dashboard');
  };

  const animatedStyle = {
    transform: [{ translateX: shakeAnimation }]
  };

  return (

        <View style={styles.innerContainer}>
          <Image
            source={require('../assets/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <Animated.View style={[styles.formContainer, animatedStyle]}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite seu username"
                placeholderTextColor={COLORS.muted}
                value={credentials.username}
                onChangeText={(text) => setCredentials({ ...credentials, username: text })}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Senha</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite sua senha"
                placeholderTextColor={COLORS.muted}
                secureTextEntry
                value={credentials.password}
                onChangeText={(text) => setCredentials({ ...credentials, password: text })}
              />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity 
              style={styles.loginButton}
              onPress={handleLogin}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={[COLORS.primary, COLORS.secondary]}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.buttonText}>Entrar</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.forgotPasswordButton}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: isSmallDevice ? 20 : 30,
  },
  logo: {
    width: isSmallDevice ? 120 : 150,
    height: isSmallDevice ? 120 : 150,
    marginBottom: isSmallDevice ? 30 : 40,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: isSmallDevice ? 14 : 16,
    color: COLORS.text,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: Platform.OS === 'ios' ? 16 : 14,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  loginButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 15,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  gradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPasswordButton: {
    marginTop: 20,
    alignSelf: 'center',
  },
  forgotPasswordText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    marginVertical: 10,
    textAlign: 'center',
  },
});

export default LoginAgroLabs;