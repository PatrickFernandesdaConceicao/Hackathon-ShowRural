import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons'; // Changed import
import * as DocumentPicker from 'expo-document-picker';
import * as Notifications from 'expo-notifications';
import AppLoading from 'expo-app-loading';

// Responsive Design
const { width, height } = Dimensions.get('window');
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const scale = size => (width / guidelineBaseWidth) * size;
const verticalScale = size => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

// Configure notifications (required for Expo)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const CadastroDocumento = () => {
  const [step, setStep] = useState(1);
  const [nome, setNome] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [valorContrato, setValorContrato] = useState('');
  const [numParcelas, setNumParcelas] = useState('');
  const [dataVencimento, setDataVencimento] = useState('');
  const [selectedDocument, setSelectedDocument] = useState(null);



  const handleDocumentSelection = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*', // Allow all file types
        copyToCacheDirectory: false,
      });

      if (result.type === 'success') {
        setSelectedDocument({
          name: result.name,
          uri: result.uri,
        });
      } else {
        console.log('Document selection cancelled');
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao selecionar o documento.');
    }
  };

  const handleNextStep = useCallback(async () => {
    if (step === 1) {
      // Validate form data for step 1
      if (!nome || !cpfCnpj || !valorContrato || !numParcelas || !dataVencimento) {
        Alert.alert('Atenção', 'Por favor, preencha todos os campos do questionário.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!selectedDocument) {
        Alert.alert('Atenção', 'Por favor, selecione um documento para upload.');
        return;
      }
      setStep(3);
      await scheduleNotification();
    }
  }, [step, nome, cpfCnpj, valorContrato, numParcelas, dataVencimento, selectedDocument]);

  const scheduleNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Documento Cadastrado!',
        body: 'Seu documento foi cadastrado com sucesso!',
        sound: 'default',
      },
      trigger: { seconds: 1 }, // Send immediately for demonstration
    });
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Etapa 1: Questionário</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome"
              placeholderTextColor="#666"
              value={nome}
              onChangeText={setNome}
            />
            <TextInput
              style={styles.input}
              placeholder="CPF/CNPJ"
              placeholderTextColor="#666"
              value={cpfCnpj}
              onChangeText={setCpfCnpj}
              keyboardType="number-pad"
            />
            <TextInput
              style={styles.input}
              placeholder="Valor do Contrato"
              placeholderTextColor="#666"
              value={valorContrato}
              onChangeText={setValorContrato}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Número de Parcelas"
              placeholderTextColor="#666"
              value={numParcelas}
              onChangeText={setNumParcelas}
              keyboardType="number-pad"
            />
            <TextInput
              style={styles.input}
              placeholder="Data de Vencimento"
              placeholderTextColor="#666"
              value={dataVencimento}
              onChangeText={setDataVencimento}
            />
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Etapa 2: Upload de Documento</Text>
            <TouchableOpacity style={styles.uploadButton} onPress={handleDocumentSelection}>
              <Ionicons name="cloud-upload-outline" size={moderateScale(30)} color="#fff" />
              <Text style={styles.uploadButtonText}>Selecionar Documento</Text>
            </TouchableOpacity>
            {selectedDocument && (
              <View style={styles.selectedDocumentContainer}>
                <Text style={styles.selectedDocumentText}>
                  Documento Selecionado: {selectedDocument.name}
                </Text>
              </View>
            )}
          </View>
        );
      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Etapa 3: Notificação</Text>
            <Text style={styles.notificationText}>
              Seu documento foi cadastrado com sucesso! Você receberá uma notificação em breve.
            </Text>
            <Ionicons name="checkmark-circle-outline" size={moderateScale(60)} color="#4CAF50" style={styles.notificationIcon} />
          </View>
        );
      default:
        return null;
    }
  };

  // Assuming you don't need custom fonts anymore, remove font-related code
  const fontsLoaded = true; // Always true now

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <LinearGradient colors={['#2148C0', '#3498db']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Image
            source={{
              uri:
                'https://raw.githubusercontent.com/brunobolsoni/ia-images/main/ia-logo.png',
            }}
            style={styles.logo}
          />
          {renderStepContent()}
          {step < 3 && (
            <TouchableOpacity style={styles.nextButton} onPress={handleNextStep}>
              <Text style={styles.nextButtonText}>Avançar</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(20),
  },
  container: {
    width: '80%',
    maxWidth: moderateScale(400),
    padding: moderateScale(20),
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: moderateScale(10),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  logo: {
    width: scale(120),
    height: verticalScale(120),
    marginBottom: verticalScale(20),
  },
  stepContainer: {
    width: '100%',
    marginBottom: verticalScale(20),
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: 'white',
    marginBottom: verticalScale(15),
    //fontFamily: 'Montserrat-Bold', // Removed font
  },
  input: {
    width: '100%',
    height: verticalScale(45),
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: moderateScale(5),
    paddingHorizontal: moderateScale(15),
    marginBottom: verticalScale(15),
    color: 'white',
    fontSize: moderateScale(16),
    //fontFamily: 'Montserrat-Regular', // Removed font
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    paddingVertical: verticalScale(12),
    paddingHorizontal: moderateScale(20),
    borderRadius: moderateScale(5),
    marginBottom: verticalScale(15),
    elevation: 3,
  },
  uploadButtonText: {
    color: 'white',
    fontSize: moderateScale(18),
    marginLeft: moderateScale(10),
    //fontFamily: 'Montserrat-Regular', // Removed font
  },
  selectedDocumentContainer: {
    width: '100%',
    padding: moderateScale(10),
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: moderateScale(5),
    alignItems: 'center',
  },
  selectedDocumentText: {
    color: 'white',
    fontSize: moderateScale(16),
    //fontFamily: 'Montserrat-Regular', // Removed font
  },
  nextButton: {
    backgroundColor: 'white',
    paddingVertical: verticalScale(12),
    paddingHorizontal: moderateScale(20),
    borderRadius: moderateScale(5),
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  nextButtonText: {
    color: '#2148C0',
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    textTransform: 'uppercase',
    //fontFamily: 'Montserrat-Bold', // Removed font
  },
  notificationText: {
    fontSize: moderateScale(18),
    color: 'white',
    textAlign: 'center',
    marginBottom: verticalScale(20),
    //fontFamily: 'Montserrat-Regular', // Removed font
  },
  notificationIcon: {
    marginBottom: verticalScale(20),
  },
});

export default CadastroDocumento;