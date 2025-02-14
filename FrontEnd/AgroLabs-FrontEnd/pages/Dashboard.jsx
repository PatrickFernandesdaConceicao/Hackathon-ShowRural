import { MaterialIcons } from '@expo/vector-icons';
import { faker } from '@faker-js/faker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Dimensions, Image, Modal, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Cores
const primaryColor = '#0a4fd9';
const whiteColor = '#ffffff';
const containerColor = '#f5f5f5';
const redColor = '#ff4d4d';
const grayColor = '#888888';
const lightGrayColor = '#cccccc';

// Dimensões da tela
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// Breakpoints para responsividade
const breakpoints = {
  small: 480,
  medium: 768,
  large: 992,
  xLarge: 1200,
};

// Hook para detectar o tamanho da tela
const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState('large');

  useEffect(() => {
    const handleResize = () => {
      const width = Dimensions.get('window').width;

      if (width < breakpoints.small) {
        setScreenSize('small');
      } else if (width < breakpoints.medium) {
        setScreenSize('medium');
      } else if (width < breakpoints.large) {
        setScreenSize('large');
      } else {
        setScreenSize('xLarge');
      }
    };

    handleResize();

    const subscription = Dimensions.addEventListener('change', handleResize);

    return () => subscription.remove();
  }, []);

  return screenSize;
};

// Componente para a tela de Dashboard
const DashboardScreen = ({ contractData, calculateBarWidth, maxValue, styles, isWeb, isSmallScreen }) => {
  const cardStyle = useMemo(() => ({
    width: isSmallScreen ? '100%' : '30%',
    marginBottom: 15,
    backgroundColor: whiteColor,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 1,
    elevation: 2,
  }), [isSmallScreen]);

  return (
    <View>
      <View style={styles.searchContainer}>
        <TextInput style={styles.searchInput} placeholder="Pesquisar CNPJ" />
        <TextInput style={styles.searchInput} placeholder="Pesquisar Atividade específica" />
      </View>
      <View style={styles.row}>
        <View style={[styles.card, cardStyle]}>
          <Text style={[styles.cardTitle, isWeb && styles.cardTitleWeb]}>Licenças Ativas</Text>
          <Text style={[styles.cardValue, isWeb && styles.cardValueWeb]}>{contractData.activeContracts}</Text>
        </View>
        <View style={[styles.card, cardStyle, styles.middleCardSpacing]}>
          <Text style={[styles.cardTitle, isWeb && styles.cardTitleWeb]}>Licenças a 6 meses do vencimento</Text>
          <Text style={[styles.cardValue, isWeb && styles.cardValueWeb]}>{contractData.expiringContracts}</Text>
        </View>
        <View style={[styles.card, cardStyle]}>
          <Text style={[styles.cardTitle, isWeb && styles.cardTitleWeb]}>Licenças Vencidas</Text>
          <Text style={[styles.cardValue, isWeb && styles.cardValueWeb]}>{contractData.expiredContracts}</Text>
        </View>
      </View>

      <View style={[styles.chartCard, styles.sectionSpacing]}>
        <Text style={[styles.chartTitle, isWeb && styles.chartTitleWeb]}>Contratos por CNPJ</Text>
        {contractData.cnpjContracts.map((item, index) => (
          <View style={styles.bar} key={index}>
            <Text style={[styles.barLabel, isWeb && styles.barLabelWeb]}>{item.label}</Text>
            <View style={styles.barContainer}>
              <LinearGradient
                colors={[primaryColor, '#668ad8']}
                style={[styles.barFill, { width: calculateBarWidth(item.value, maxValue) }]}
                start={[0, 0]}
                end={[1, 0]}
              />
              <Text style={[styles.barValue, isWeb && styles.barValueWeb]}>{item.value}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

// Componente para a tela de Documentos
const DocumentsScreen = ({ filterValue, setFilterValue, filteredTableData, styles, handleDocumentUpload, screenSize, isWeb, isSmallScreen, onPlusPress, handleDownload }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const openFilterModal = () => {
    setModalVisible(true);
  };

  const closeFilterModal = () => {
    setModalVisible(false);
  };

  const tableHeaderTextSize = useMemo(() => isSmallScreen ? 12 : 14, [isSmallScreen]);
  const tableCellTextSize = useMemo(() => isSmallScreen ? 10 : 12, [isSmallScreen]);
  const tableFlexBasis = 'auto';
  const tableConditionFlex = 2;

  return (
    <View>
      <View style={styles.searchContainer}>
        <TextInput style={styles.searchInput} placeholder="Pesquisar CNPJ" />
        <TextInput style={styles.searchInput} placeholder="Pesquisar Atividade específica" />
      </View>
      <View style={[styles.filterUploadContainer, styles.sectionSpacing]}>
        {isSmallScreen ? (
          <TouchableOpacity style={styles.filterButton} onPress={openFilterModal}>
            <Text style={styles.filterButtonText}>Filtro</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.filterContainer}>
            <Text style={[styles.filterLabel, isWeb && styles.filterLabelWeb]}>Filtro:</Text>
            <Picker
              selectedValue={filterValue}
              style={[styles.picker, isWeb && styles.pickerWeb]}
              onValueChange={(itemValue) => setFilterValue(itemValue)}
            >
              <Picker.Item label="TODOS" value="TODOS" style={isWeb && styles.pickerItemWeb} />
              <Picker.Item label="6 Meses" value="6 Meses" style={isWeb && styles.pickerItemWeb} />
              <Picker.Item label="Vencidos" value="Vencidos" style={isWeb && styles.pickerItemWeb} />
            </Picker>
          </View>
        )}

        <TouchableOpacity style={[
          styles.uploadButton,
          isSmallScreen && styles.uploadButtonSmall,
          isWeb && styles.uploadButtonWeb,
        ]} onPress={handleDocumentUpload}>
          <MaterialIcons name="upload-file" size={isSmallScreen ? 20 : 24} color={primaryColor} style={{ marginRight: 5 }} />
          <Text style={[
            styles.uploadButtonText,
            isSmallScreen && styles.uploadButtonTextSmall,
          ]}>
            Faça upload de um novo documento
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeFilterModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Selecione o Filtro:</Text>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setFilterValue('TODOS');
                closeFilterModal();
              }}
            >
              <Text style={styles.modalOptionText}>TODOS</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setFilterValue('6 Meses');
                closeFilterModal();
              }}
            >
              <Text style={styles.modalOptionText}>6 Meses</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setFilterValue('Vencidos');
                closeFilterModal();
              }}
            >
              <Text style={styles.modalOptionText}>Vencidos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCloseButton} onPress={closeFilterModal}>
              <Text style={styles.modalCloseButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={[styles.tableCard, styles.sectionSpacing]}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, { flexBasis: tableFlexBasis, flex: 1, fontSize: tableHeaderTextSize }, isWeb && styles.tableHeaderTextWeb]}>CNPJ</Text>
          <Text style={[styles.tableHeaderText, { flexBasis: tableFlexBasis, flex: 1, fontSize: tableHeaderTextSize }, isWeb && styles.tableHeaderTextWeb]}>Tipo</Text>
          <Text style={[styles.tableHeaderText, { flexBasis: tableFlexBasis, flex: 1, fontSize: tableHeaderTextSize }, isWeb && styles.tableHeaderTextWeb]}>Vencimento</Text>
          <Text style={[styles.tableHeaderText, { flexBasis: tableFlexBasis, flex: tableConditionFlex, fontSize: tableHeaderTextSize }, isWeb && styles.tableHeaderTextWeb]}>Condicionamento</Text>
          <Text style={[styles.tableHeaderText, { flexBasis: tableFlexBasis, flex: 0.5, fontSize: tableHeaderTextSize, textAlign: 'center' }, isWeb && styles.tableHeaderTextWeb]}>Arquivo</Text>
          <Text style={[styles.tableHeaderText, { flexBasis: tableFlexBasis, flex: 0.2, fontSize: tableHeaderTextSize, textAlign: 'center' }, isWeb && styles.tableHeaderTextWeb]}></Text>
        </View>
        {filteredTableData.map((row, index) => (
          <View style={styles.tableRow} key={index}>
            <Text style={[styles.tableCell, { flexBasis: tableFlexBasis, flex: 1, fontSize: tableCellTextSize }, isWeb && styles.tableCellTextWeb]}>{row.cnpj}</Text>
            <Text style={[styles.tableCell, { flexBasis: tableFlexBasis, flex: 1, fontSize: tableCellTextSize }, isWeb && styles.tableCellTextWeb]}>{row.type}</Text>
            <Text style={[styles.tableCell, { flexBasis: tableFlexBasis, flex: 1, fontSize: tableCellTextSize }, isWeb && styles.tableCellTextWeb]}>{row.expirationDate}</Text>
            <Text style={[styles.tableCell, { flexBasis: tableFlexBasis, flex: tableConditionFlex, fontSize: tableCellTextSize }, isWeb && styles.tableCellTextWeb]}>{row.condition}</Text>
            <TouchableOpacity style={styles.downloadButton} onPress={() => handleDownload(row)}>
              <MaterialIcons name="file-download" size={isSmallScreen ? 20 : 24} color={whiteColor} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.plusButton} onPress={() => onPlusPress(row)}>
              <Text style={styles.plusButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

// Componente para detalhes do documento
const DocumentDetails = ({ visible, onClose, documentData }) => {
  if (!visible) {
    return null;
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Detalhes do Documento</Text>
          <Text><Text style={styles.boldText}>CNPJ/CPF:</Text> {documentData.cnpj}</Text>
          <Text><Text style={styles.boldText}>Número do protocolo:</Text> {documentData.protocolNumber}</Text>
          <Text><Text style={styles.boldText}>Número do documento:</Text> {documentData.documentNumber}</Text>
          <Text><Text style={styles.boldText}>Validade da Licença:</Text> {documentData.licenseValidity}</Text>
          <Text><Text style={styles.boldText}>Atividade:</Text> {documentData.activity}</Text>
          <Text><Text style={styles.boldText}>Atividade específica:</Text> {documentData.specificActivity}</Text>
          <Text><Text style={styles.boldText}>Detalhes da atividade:</Text> {documentData.activityDetails}</Text>
          <Text><Text style={styles.boldText}>Município:</Text> {documentData.municipality}</Text>
          <Text><Text style={styles.boldText}>Logradouro:</Text> {documentData.address}</Text>
          <Text><Text style={styles.boldText}>CEP:</Text> {documentData.zipCode}</Text>
          <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
            <Text style={styles.modalCloseButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// Custom DateTimePicker component for web
const WebDateTimePicker = ({ value, onChange }) => {
  return (
    <input
      type="date"
      value={value ? value.toISOString().split('T')[0] : ''}
      onChange={(e) => {
        const selectedDate = e.target.value ? new Date(e.target.value) : null;
        onChange(selectedDate);
      }}
      style={styles.webDatePickerInput} // Apply web-specific styles
    />
  );
};

// Componente para o modal de upload de documento
const UploadDocumentModal = ({ visible, onClose, onUpload, renewalAlertDate, setRenewalAlertDate, showDatePicker, setShowDatePicker, isWeb, selectedDocument, setSelectedDocument }) => {

  const handleDocumentSelection = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        multiple: false,
      });

      if (result.type === 'success') {
        const fileUri = result.uri;
        const fileInfo = await FileSystem.getInfoAsync(fileUri, { size: true });

        if (!fileInfo.exists) {
          Alert.alert('Erro', 'O arquivo não existe.');
          return;
        }

        const base64 = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 });
        setSelectedDocument({ ...result, base64 });
      } else {
        setSelectedDocument(null);
      }
    } catch (err) {
      console.error('Error picking document:', err);
      Alert.alert(
        'Error',
        'An error occurred while picking the document.',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
      );
    }
  };

  const handleDateSelection = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setRenewalAlertDate(selectedDate);
    }
  };

  const handleUpload = async () => {
    if (!renewalAlertDate || !selectedDocument) {
      Alert.alert('Erro', 'Por favor, selecione um documento e uma data de renovação.');
      return;
    }

    if (!selectedDocument.base64) {
      Alert.alert('Erro', 'O documento selecionado não possui um conteúdo válido.');
      return;
    }

    const documentData = {
      name: selectedDocument.name,
      renewalDate: renewalAlertDate,
      base64: selectedDocument.base64,
      mimeType: selectedDocument.mimeType,
    };

    onUpload(documentData);
    onClose();
  };

  const formatDate = (date) => {
    if (!date) return '+ Selecionar data';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Upload de Novo Documento</Text>

          <TouchableOpacity style={styles.uploadButtonModal} onPress={handleDocumentSelection}>
            {selectedDocument ? (
              <>
                <MaterialIcons name="file-upload" size={24} color={primaryColor} style={{ marginRight: 5 }} />
                <Text style={styles.uploadButtonTextModal}>Documento Selecionado: {selectedDocument.name}</Text>
              </>
            ) : (
              <>
                <MaterialIcons name="upload-file" size={24} color={primaryColor} style={{ marginRight: 5 }} />
                <Text style={styles.uploadButtonTextModal}>Clique ou Arraste</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.datePickerContainer}>
            <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
              <Text style={styles.datePickerButtonText}>
                {formatDate(renewalAlertDate)}
              </Text>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            Platform.OS === 'web' ? (
              <WebDateTimePicker
                value={renewalAlertDate}
                onChange={(date) => {
                  setRenewalAlertDate(date);
                  setShowDatePicker(false);
                }}
              />
            ) : (
              <DateTimePicker
                testID="dateTimePicker"
                value={renewalAlertDate || new Date()}
                mode="date"
                display="default"
                onChange={handleDateSelection}
              />)
            )}

          <View style={styles.modalButtonsContainer}>
            <TouchableOpacity style={styles.modalButton} onPress={handleUpload}>
              <Text style={styles.modalButtonText}>Enviar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={onClose}>
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Componente principal do Dashboard
export default function Dashboard() {
  const [contractData, setContractData] = useState({
    activeContracts: 125,
    expiringContracts: 50,
    expiredContracts: 5,
    cnpjContracts: [
      { label: 'Exemplo 01', value: 40 },
      { label: 'Exemplo 02', value: 35 },
      { label: 'Exemplo 03', value: 58 },
    ],
    tableData: Array.from({ length: 10 }, () => ({
      cnpj: faker.string.alphanumeric(14),
      type: faker.commerce.product(),
      expirationDate: faker.date.future().toLocaleDateString(),
      condition: faker.lorem.sentence(5),
      protocolNumber: faker.string.alphanumeric(10),
      documentNumber: faker.string.alphanumeric(8),
      licenseValidity: faker.date.future().toLocaleDateString(),
      activity: faker.commerce.department(),
      specificActivity: faker.commerce.productAdjective(),
      activityDetails: faker.lorem.sentence(3),
      municipality: faker.location.city(),
      address: faker.location.streetAddress(),
      zipCode: faker.location.zipCode(),
      base64: null,
      mimeType: null,
      name: faker.system.fileName(),
    })),
    loading: false,
  });

  const [filterValue, setFilterValue] = useState('TODOS');
  const [filteredTableData, setFilteredTableData] = useState(contractData.tableData);
  const [activeTab, setActiveTab] = useState('documents');
  const isWeb = Platform.OS === 'web';
  const screenSize = useScreenSize();
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedDocumentForDetails, setSelectedDocumentForDetails] = useState(null);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [renewalAlertDate, setRenewalAlertDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [uploadedDocument, setUploadedDocument] = useState(null);

  const isSmallScreen = useMemo(() => {
    return screenSize === 'small' || screenSize === 'medium';
  }, [screenSize]);

  useEffect(() => {
    applyFilter();
  }, [filterValue, contractData.tableData]);

  const applyFilter = () => {
    let filteredData = [...contractData.tableData];

    if (filterValue === '6 Meses') {
      filteredData = filteredData.filter(item => {
        const expirationDate = new Date(item.expirationDate);
        const sixMonthsFromNow = new Date();
        sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
        return expirationDate <= sixMonthsFromNow && expirationDate > new Date();
      });
    } else if (filterValue === 'Vencidos') {
      filteredData = filteredData.filter(item => {
        const expirationDate = new Date(item.expirationDate);
        const now = new Date();
        return expirationDate < now;
      });
    }

    setFilteredTableData(filteredData);
  };

  const calculateBarWidth = (value, maxValue) => {
    const maxWidthPercentage = 80;
    const calculatedWidth = (value / maxValue) * maxWidthPercentage;
    return `${Math.min(calculatedWidth, maxWidthPercentage)}%`;
  };

  const maxValue = Math.max(...contractData.cnpjContracts.map(item => item.value));

  const handleDocumentUpload = () => {
    setUploadModalVisible(true);
  };

  const handleCloseUploadModal = () => {
    setUploadModalVisible(false);
    setRenewalAlertDate(null);
    setUploadedDocument(null);
    setShowDatePicker(false);
  };

  const handleDocumentUploadComplete = (documentData) => {
    const formattedRenewalDate = documentData.renewalDate.toLocaleDateString();

    setContractData(prevData => ({
      ...prevData,
      tableData: [...prevData.tableData, {
        cnpj: 'Novo CNPJ',
        type: 'Novo Tipo',
        expirationDate: formattedRenewalDate,
        condition: 'Nova Condição',
        protocolNumber: 'Novo Protocolo',
        documentNumber: 'Novo Documento',
        licenseValidity: formattedRenewalDate,
        activity: 'Nova Atividade',
        specificActivity: 'Nova Atividade Específica',
        activityDetails: 'Novos Detalhes',
        municipality: faker.location.city(),
        address: faker.location.streetAddress(),
        zipCode: faker.location.zipCode(),
        base64: documentData.base64,
        mimeType: documentData.mimeType,
        name: documentData.name,
      }]
    }));
    Alert.alert('Sucesso', 'Documento enviado com sucesso!');
  };

  const handlePlusPress = (rowData) => {
    setSelectedDocumentForDetails(rowData);
    setDetailModalVisible(true);
  };

  const handleCloseDetailModal = () => {
    setDetailModalVisible(false);
  };

  const handleDownload = async (rowData) => {
    if (!rowData.base64) {
      Alert.alert('Erro', 'Documento não disponível para download.');
      return;
    }

    try {
      const filename = rowData.name || 'documento.pdf';
      const uri = FileSystem.cacheDirectory + filename;
      const base64Data = rowData.base64;

      await FileSystem.writeAsStringAsync(uri, base64Data, { encoding: FileSystem.EncodingType.Base64 });

      if (Platform.OS === 'ios') {
        await FileSystem.downloadAsync(
          uri,
          FileSystem.documentDirectory + filename
        );
        Alert.alert('Sucesso', 'Documento salvo em seus arquivos.');
      } else {
        Alert.alert('Sucesso', 'Documento salvo em cache. Por favor, encontre-o e mova para seus arquivos.');
      }
    } catch (error) {
      console.error('Erro ao baixar o documento:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao baixar o documento.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.blueBar}>
        <Image
          source={require('../assets/icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.tabButtonsContainer}>
          <TouchableOpacity onPress={() => setActiveTab('dashboard')} style={styles.blueBarButton}>
            <Text style={[styles.blueBarText, activeTab === 'dashboard' && styles.activeTabText, isWeb && styles.blueBarTextWeb]}>DASHBOARD</Text>
          </TouchableOpacity>
          <View style={styles.verticalSeparator} />
          <TouchableOpacity onPress={() => setActiveTab('documents')} style={styles.blueBarButton}>
            <Text style={[styles.blueBarText, activeTab === 'documents' && styles.activeTabText, isWeb && styles.blueBarTextWeb]}>DOCUMENTOS</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.uploadIconContainer} onPress={handleDocumentUpload}>
          <MaterialIcons name="upload-file" size={30} color={whiteColor} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {activeTab === 'dashboard' ? (
          <DashboardScreen
            contractData={contractData}
            calculateBarWidth={calculateBarWidth}
            maxValue={maxValue}
            styles={styles}
            isWeb={isWeb}
            isSmallScreen={isSmallScreen}
          />
        ) : (
          <DocumentsScreen
            filterValue={filterValue}
            setFilterValue={setFilterValue}
            filteredTableData={filteredTableData}
            styles={styles}
            handleDocumentUpload={handleDocumentUpload}
            screenSize={screenSize}
            isWeb={isWeb}
            isSmallScreen={isSmallScreen}
            onPlusPress={handlePlusPress}
            handleDownload={handleDownload}
          />
        )}
      </ScrollView>

      <DocumentDetails
        visible={detailModalVisible}
        onClose={handleCloseDetailModal}
        documentData={selectedDocumentForDetails || {}}
      />

      <UploadDocumentModal
        visible={uploadModalVisible}
        onClose={handleCloseUploadModal}
        onUpload={handleDocumentUploadComplete}
        renewalAlertDate={renewalAlertDate}
        setRenewalAlertDate={setRenewalAlertDate}
        showDatePicker={showDatePicker}
        setShowDatePicker={setShowDatePicker}
        isWeb={isWeb}
        selectedDocument={uploadedDocument}
        setSelectedDocument={setUploadedDocument}
      />
    </SafeAreaView>
  );
}
// Estilos
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: containerColor,
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
    maxWidth: 1200,
    alignSelf: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: containerColor,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: grayColor,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  card: {
    backgroundColor: whiteColor,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 2,
    boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.08)',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: primaryColor,
    marginBottom: 8,
    textAlign: 'center',
  },
  cardValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: primaryColor,
  },
  chartCard: {
    backgroundColor: whiteColor,
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.08)',
    borderColor: lightGrayColor,
    borderWidth: 1,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: primaryColor,
    marginBottom: 12,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  barLabel: {
    fontSize: 14,
    color: primaryColor,
    width: 70,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    position: 'relative',
  },
  barFill: {
    height: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  barValue: {
    fontSize: 14,
    color: primaryColor,
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    textAlign: 'right',
    paddingRight: 5,
  },
  tableCard: {
    backgroundColor: whiteColor,
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.08)',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tableHeaderText: {
    fontWeight: '600',
    color: primaryColor,
    textAlign: 'left',
    flex: 1,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: lightGrayColor,
  },
  tableCell: {
    color: grayColor,
    textAlign: 'left',
    flex: 1,
    overflow: 'hidden',
  },
  uploadButton: {
    flexDirection: 'row',
    backgroundColor: whiteColor,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.1)',
    borderWidth: 1,
    borderColor: primaryColor,
    alignSelf: 'center',
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: primaryColor,
  },
  middleCardSpacing: {
    marginLeft: 0,
    marginRight: 0,
  },
  sectionSpacing: {
    marginTop: 20,
  },
  filterUploadContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: primaryColor,
    marginRight: 10,
  },
  picker: {
    height: 40,
    width: Platform.OS === 'web' ? 200 : 150,
    backgroundColor: whiteColor,
    color: primaryColor,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: primaryColor,
  },
  uploadButtonSmall: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  uploadButtonTextSmall: {
    fontSize: 14,
  },
  blueBar: {
    backgroundColor: primaryColor,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 0, // Corrigido: Removido o valor negativo para evitar sobreposição
    paddingTop: 30,
    paddingHorizontal: 15,
  },
  blueBarButton: {
    alignItems: 'center',
  },
  blueBarText: {
    color: whiteColor,
    fontSize: 18,
    fontWeight: 'bold',
  },
  activeTabText: {
    textDecorationLine: 'underline',
  },
  logo: {
    width: 100,
    height: 40,
  },
  tabButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verticalSeparator: {
    height: '70%',
    width: 1,
    backgroundColor: whiteColor,
    marginHorizontal: 10,
  },
  cardTitleWeb: {
    fontSize: 18,
  },
  cardValueWeb: {
    fontSize: 32,
  },
  chartTitleWeb: {
    fontSize: 20,
  },
  barLabelWeb: {
    fontSize: 16,
  },
  barValueWeb: {
    fontSize: 16,
  },
  filterLabelWeb: {
    fontSize: 18,
  },
  pickerWeb: {
    height: 45,
    width: 220,
  },
  uploadButtonWeb: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  uploadButtonTextWeb: {
    fontSize: 18,
  },
  tableHeaderTextWeb: {
    fontSize: 16,
  },
  tableCellTextWeb: {
    fontSize: 14,
  },
  blueBarTextWeb: {
    fontSize: 20,
  },
  downloadButton: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: primaryColor,
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  filterButton: {
    backgroundColor: whiteColor,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.1)',
    borderWidth: 1,
    borderColor: primaryColor,
    marginBottom: 10,
  },
  filterButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: primaryColor,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: primaryColor,
  },
  modalOption: {
    backgroundColor: containerColor,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: 16,
    color: primaryColor,
  },
  modalCloseButton: {
    backgroundColor: primaryColor,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 2,
    marginTop: 15,
  },
  modalCloseButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    backgroundColor: whiteColor,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 10,
    elevation: 3,
    boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.1)',
  },
  plusButton: {
    backgroundColor: primaryColor,
    width: 25,
    height: 25,
    borderRadius: 12.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusButtonText: {
    color: whiteColor,
    fontSize: 16,
    fontWeight: 'bold',
  },
  uploadButtonModal: {
    flexDirection: 'row',
    backgroundColor: whiteColor,
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.1)',
    borderWidth: 1,
    borderColor: primaryColor,
    marginBottom: 20,
    width: '100%',
  },
  uploadButtonTextModal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: primaryColor,
    textAlign: 'center',
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  datePickerButton: {
    backgroundColor: whiteColor,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 3,
    boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.1)',
    flex: 1,
    marginLeft: 10,
  },
  datePickerButtonText: {
    fontSize: 16,
    color: primaryColor,
    textAlign: 'center',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    backgroundColor: primaryColor,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 2,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  boldText: {
    fontWeight: 'bold',
    color: primaryColor,
  },
  uploadIconContainer: {
    backgroundColor: primaryColor,
    borderRadius: 20,
    padding: 5,
  },
  webDatePickerInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: lightGrayColor,
    borderRadius: 5,
    fontSize: 16,
    color: primaryColor,
    width: '100%',
  },
});
