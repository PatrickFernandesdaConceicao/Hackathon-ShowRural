import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';

const primaryColor = '#0a4fd9';
const whiteColor = '#ffffff';
const containerColor = '#eeeffb'; // Container background
const backgroundColor = '#ffffff'; // Main background
const borderColor = '#0a4fd9';
const blackColor = '#110c11';
const darkBlueColor = '#041745';
const offWhiteColor = '#f2f0e8';

export default function CadastroDocumento() {
  const [nome, setNome] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('');
  const [dataVencimento, setDataVencimento] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const handleDocumentSelection = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf'], // Allow only PDF
        copyToCacheDirectory: false,
      });

      if (result.type === 'success') {
        const { name, size, uri } = result;
        const fileExtension = name.split('.').pop().toLowerCase();

        if (fileExtension === 'pdf') {
          setSelectedDocument({ name, size, uri });
        } else {
          Alert.alert('Erro', 'Por favor, selecione um arquivo PDF.');
        }
      }
    } catch (err) {
      console.error('Erro ao selecionar o documento:', err);
      Alert.alert('Erro', 'Ocorreu um erro ao selecionar o documento.');
    }
  };

  const handleSubmit = () => {
    if (!nome || !cpfCnpj || !tipoDocumento || !dataVencimento) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    if (!termsAccepted) {
      Alert.alert('Erro', 'Por favor, aceite os termos de condições do usuário.');
      return;
    }

    if (!selectedDocument) {
      Alert.alert('Erro', 'Por favor, selecione um documento.');
      return;
    }

    // Aqui você pode adicionar a lógica para enviar os dados e o documento para o servidor
    Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
    console.log('Dados do formulário:', {
      nome,
      cpfCnpj,
      tipoDocumento,
      dataVencimento,
      termsAccepted,
      selectedDocument,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: backgroundColor }]}>
      <View style={styles.contentContainer}>
        <View style={[styles.formContainer, { backgroundColor: containerColor, borderRadius: 10 }]}>
          <Text style={[styles.label, { color: darkBlueColor }]}>Digite seu nome</Text>
          <TextInput
            style={[styles.input, { backgroundColor: whiteColor, borderColor: borderColor, borderRadius: 5, color: darkBlueColor }]}
            value={nome}
            onChangeText={setNome}
          />

          <Text style={[styles.label, { color: darkBlueColor }]}>CPF / CNPJ</Text>
          <TextInput
            style={[styles.input, { backgroundColor: whiteColor, borderColor: borderColor, borderRadius: 5, color: darkBlueColor }]}
            value={cpfCnpj}
            onChangeText={setCpfCnpj}
            keyboardType="numeric"
          />

          <Text style={[styles.label, { color: darkBlueColor }]}>Tipo de documento</Text>
          <TextInput
            style={[styles.input, { backgroundColor: whiteColor, borderColor: borderColor, borderRadius: 5, color: darkBlueColor }]}
            value={tipoDocumento}
            onChangeText={setTipoDocumento}
          />

          <Text style={[styles.label, { color: darkBlueColor }]}>Data de vencimento</Text>
          <TextInput
            style={[styles.input, { backgroundColor: whiteColor, borderColor: borderColor, borderRadius: 5, color: darkBlueColor }]}
            value={dataVencimento}
            onChangeText={setDataVencimento}
            placeholder="DD/MM/AAAA"
            placeholderTextColor={darkBlueColor}
          />

          <View style={styles.termsContainer}>
            <TouchableOpacity style={styles.checkbox} onPress={() => setTermsAccepted(!termsAccepted)}>
              <MaterialCommunityIcons
                name={termsAccepted ? "check-circle" : "circle-outline"}
                size={24}
                color={borderColor}
              />
            </TouchableOpacity>
            <Text style={[styles.termsText, { color: darkBlueColor }]}>Concordo que li e aceito os termos de condições do usuário</Text>
          </View>
        </View>

        <View style={[styles.uploadContainer, { backgroundColor: containerColor, borderRadius: 10 }]}>
          <Text style={[styles.uploadTitle, { color: darkBlueColor }]}>Faça upload do documento:</Text>
          <TouchableOpacity style={[styles.uploadButton, { backgroundColor: whiteColor, borderColor: borderColor, borderStyle: 'dashed', borderRadius: 10 }] } onPress={handleDocumentSelection}>
            <MaterialCommunityIcons name="upload" size={24} color={borderColor} />
            <Text style={[styles.uploadButtonText, { color: borderColor }]}>Faça o upload</Text>
          </TouchableOpacity>
          {selectedDocument && (
            <View style={styles.selectedDocumentContainer}>
              <Text style={[styles.selectedDocumentText, { color: darkBlueColor }]}>
                Documento selecionado: {selectedDocument.name}
              </Text>
            </View>
          )}
          <Text style={[styles.pdfText, { color: darkBlueColor }]}>Somente PDF</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={[styles.submitButtonText, { color: darkBlueColor }]}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  formContainer: {
    padding: 20,
    width: '45%',
    marginRight: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkbox: {
    marginRight: 10,
  },
  termsText: {
    fontSize: 12,
  },
  uploadContainer: {
    padding: 20,
    width: '45%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  uploadButton: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  uploadButtonText: {
    fontSize: 14,
    marginTop: 5,
  },
  pdfText: {
    fontSize: 12,
  },
  selectedDocumentContainer: {
    marginTop: 10,
  },
  selectedDocumentText: {
  },
  submitButton: {
    backgroundColor: whiteColor,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});