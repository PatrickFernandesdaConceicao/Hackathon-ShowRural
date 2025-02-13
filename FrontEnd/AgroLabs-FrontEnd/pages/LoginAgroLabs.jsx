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
  Platform, // Importe Platform
} from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

// Cores reutilizáveis
const lightBlueColor = '#E8F0FE'; // Cor de fundo dos inputs
const darkBlueColor = '#00008B';
const whiteColor = '#FFFFFF';
const transparentWhiteColor = 'rgba(255,255,255,0.3)';
const semiTransparentWhiteColor = 'rgba(255,255,255,0.1)';
const shadowColor = '#000';
const agroLabsBlueColor = '#2148C0';

const { width, height } = Dimensions.get('window');

const LoginAgroLabs = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [shakeAnimation] = useState(new Animated.Value(0));
  const navigation = useNavigation();

  const handleLogin = () => {
    if (!username || !password) {
      Animated.sequence([
        Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: -10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: 0, duration: 100, useNativeDriver: true }),
      ]).start();
      return;
    }

    console.log('Logging in with:', username, password);
    navigation.navigate('Dashboard');
  };

  const handleForgotPassword = () => {
    console.log('Forgot Password pressed');
  };

  const shake = shakeAnimation.interpolate({
    inputRange: [-1, 1],
    outputRange: [-5, 5],
  });

  return (

        <View style={styles.container}>
          <Image
            source={require('../assets/icon.png')} // Caminho para a sua logo
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.formContainer}>
            <Text style={styles.label}>Username</Text>
            <Animated.View style={[styles.inputContainer, { transform: [{ translateX: shake }] }]}>
              <TextInput
                style={styles.input}
                placeholder="Digite seu username"
                placeholderTextColor="#888"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </Animated.View>

            <Text style={styles.label}>Password</Text>
            <Animated.View style={[styles.inputContainer, { transform: [{ translateX: shake }] }]}>
              <TextInput
                style={styles.input}
                placeholder="Digite sua senha"
                placeholderTextColor="#888"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
              />
            </Animated.View>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <LinearGradient
                colors={[agroLabsBlueColor, darkBlueColor]}
                style={styles.gradientButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.loginButtonText}>Login</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={styles.forgotPasswordText}>Esqueci minha senha?</Text>
            </TouchableOpacity>
          </View>
        </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Fundo branco
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  formContainer: {
    width: '80%',
    maxWidth: 400,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
    shadowColor: shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: lightBlueColor, // Cor de fundo dos inputs
    color: '#333',
  },
  loginButton: {
    borderRadius: 12,
    overflow: 'hidden', // Garante que o gradiente não vaze
    marginBottom: 15,
  },
  gradientButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  loginButtonText: {
    color: whiteColor,
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPasswordText: {
    color: agroLabsBlueColor,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default LoginAgroLabs;