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
  Image, // Importe o componente Image
} from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const { width, height } = Dimensions.get('window');

const LoginAgroLabs = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [shakeAnimation] = useState(new Animated.Value(0));
  const navigation = useNavigation(); // Initialize navigation

  const handleLogin = () => {
    if (!username || !password) {
      // Trigger shake animation
      Animated.sequence([
        Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: -10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: 0, duration: 100, useNativeDriver: true }),
      ]).start();
      return;
    }

    // Implement your login logic here
    console.log('Logging in with:', username, password);

    // Navigate to CadastroDocuments screen
    navigation.navigate('CadastroDocumento');
  };

  const handleForgotPassword = () => {
    // Implement your forgot password logic here
    console.log('Forgot Password pressed');
  };

  const shake = shakeAnimation.interpolate({
    inputRange: [-1, 1],
    outputRange: [-5, 5],
  });

  return (
    <LinearGradient
      colors={['#2148C0', '#294399']} // Gradient background
      style={styles.gradient}
    >
      {/* Diagonal Gradient Background */}
      <LinearGradient
        colors={['#00FF00', '#000080']} // Verde limão e azul marinho
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.diagonalBackground}
      />
      <View style={styles.innerContainer}>
        {/* Logo */}
        <Image
          source={require('../assets/icon.png')} // Caminho para a sua logo
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Username Input */}
        <Animated.View style={[styles.inputContainer, { transform: [{ translateX: shake }] }]}>
          <FontAwesome name="user" size={20} color="white" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </Animated.View>

        {/* Password Input */}
        <Animated.View style={[styles.inputContainer, { transform: [{ translateX: shake }] }]}>
          <FontAwesome name="lock" size={20} color="white" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="rgba(255,255,255,0.7)"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
        </Animated.View>

        {/* Login Button */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        {/* Forgot Password */}
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diagonalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0.2, // Ajuste a opacidade conforme necessário
  },
  innerContainer: {
    width: '80%',
    maxWidth: 400,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 150, // Ajuste o tamanho conforme necessário
    height: 150, // Ajuste o tamanho conforme necessário
    marginBottom: 20, // Espaçamento abaixo da logo
  },
  iconContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  arrowIcon: {
    marginTop: -10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.1)', // Subtle background
  },
  inputIcon: {
    marginRight: 10,
    opacity: 0.8,
  },
  input: {
    flex: 1,
    height: 45,
    color: 'white',
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginButtonText: {
    color: '#2148C0',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  forgotPasswordText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
  },
});

export default LoginAgroLabs;