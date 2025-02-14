import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Alert, Dimensions, Image, Modal, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Linking } from 'react-native';

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
const DashboardScreen = ({ documents, calculateBarWidth, maxValue, styles, isWeb, isSmallScreen }) => {
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

  // Lógica para contagem total de contratos (MAIS ROBUSTA)
  const totalContracts = useMemo(() => {
    if (!documents || !Array.isArray(documents)) {
      return 0;
    }
    return documents.length;
  }, [documents]);

  // Contagem de licenças ativas
  const activeContracts = useMemo(() => {
    if (!documents || !Array.isArray(documents)) {
      return 0;
    }
    return documents.filter(doc => new Date(doc.expirate_date) > new Date()).length;
  }, [documents]);

  // Contagem de licenças a 6 meses do vencimento
  const expiringContracts = useMemo(() => {
    if (!documents || !Array.isArray(documents)) {
      return 0;
    }
    return documents.filter(doc => {
      const expirationDate = new Date(doc.expirate_date);
      const sixMonthsFromNow = new Date();
      sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
      return expirationDate <= sixMonthsFromNow && expirationDate > new Date();
    }).length;
  }, [documents]);

  // Contagem de licenças vencidas
  const expiredContracts = useMemo(() => {
    if (!documents || !Array.isArray(documents)) {
      return 0;
    }
    return documents.filter(doc => new Date(doc.expirate_date) < new Date()).length;
  }, [documents]);

  // Contratos por CNPJ (Substituindo os dados de exemplo)
  const contractsByCNPJ = useMemo(() => {
    if (!documents || !Array.isArray(documents)) {
      return [];
    }

    const counts = {};
    documents.forEach(doc => {
      const cnpj = doc.cpf_cnpj || 'Sem CNPJ'; // Use cpf_cnpj instead of corporate_reason
      counts[cnpj] = (counts[cnpj] || 0) + 1;
    });

    return Object.entries(counts).map(([label, value]) => ({ label, value }));
  }, [documents]);

  const maxCNPJValue = useMemo(() => {
    return Math.max(...contractsByCNPJ.map(item => item.value), 0);
  }, [contractsByCNPJ]);


  return (
    <View>
      <View style={styles.searchContainer}>
        <TextInput style={styles.searchInput} placeholder="Pesquisar Atividade específica" />
      </View>
      <View style={styles.row}>
        <View style={[styles.card, cardStyle]}>
          <Text style={[styles.cardTitle, isWeb && styles.cardTitleWeb]}>Licenças Ativas</Text>
          <Text style={[styles.cardValue, isWeb && styles.cardValueWeb]}>{activeContracts}</Text>
        </View>
        <View style={[styles.card, cardStyle, styles.middleCardSpacing]}>
          <Text style={[styles.cardTitle, isWeb && styles.cardTitleWeb]}>Licenças a 6 meses </Text>
          <Text style={[styles.cardValue, isWeb && styles.cardValueWeb]}>{expiringContracts}</Text>
        </View>
        <View style={[styles.card, cardStyle]}>
          <Text style={[styles.cardTitle, isWeb && styles.cardTitleWeb]}>Licenças Vencidas</Text>
          <Text style={[styles.cardValue, isWeb && styles.cardValueWeb]}>{expiredContracts}</Text>
        </View>
      </View>

      {/* Novos cards para exibir a contagem de CNPJs e contratos */}
      {/* <View style={styles.row}>
        <View style={[styles.card, cardStyle]}>
          <Text style={[styles.cardTitle, isWeb && styles.cardTitleWeb]}>Total de Contratos</Text>
          <Text style={[styles.cardValue, isWeb && styles.cardValueWeb]}>{totalContracts}</Text>
        </View>
      </View> */}


      <View style={[styles.chartCard, styles.sectionSpacing]}>
        <Text style={[styles.chartTitle, isWeb && styles.chartTitleWeb]}>CNPJ </Text>
        {contractsByCNPJ.map((item, index) => (
          <View style={styles.bar} key={index}>
            <View style={styles.barLabelContainer}>
              <Text style={[styles.barLabel, isWeb && styles.barLabelWeb]}>{item.label}</Text>
            </View>
            <View style={styles.barContainer}>
              <LinearGradient
                colors={[primaryColor, '#668ad8']}
                style={[styles.barFill, { width: calculateBarWidth(item.value, maxCNPJValue) }]}
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

  const tableHeaderTextSize = useMemo(() => isSmallScreen ? 16 : 20, [isSmallScreen]);
  const tableCellTextSize = useMemo(() => isSmallScreen ? 14 : 16, [isSmallScreen]);

  const tableFlexBasis = useMemo(() => isSmallScreen ? '25%' : '20%', [isSmallScreen]);

  return (
    <View>
      <View style={styles.searchContainer}>
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
          <Text style={[styles.tableHeaderText, { flexBasis: tableFlexBasis, flex: 1.5, fontSize: tableHeaderTextSize }, isWeb && styles.tableHeaderTextWeb]}>CNPJ</Text>
          <Text style={[styles.tableHeaderText, { flexBasis: tableFlexBasis, flex: 1.5, fontSize: tableHeaderTextSize }, isWeb && styles.tableHeaderTextWeb]}>Número do Documento</Text>
          <Text style={[styles.tableHeaderText, { flexBasis: tableFlexBasis, flex: 1.5, fontSize: tableHeaderTextSize }, isWeb && styles.tableHeaderTextWeb]}>Vencimento</Text>
          <Text style={[styles.tableHeaderText, { flexBasis: tableFlexBasis, flex: 1.5, fontSize: tableHeaderTextSize, textAlign: 'flex-end' }, isWeb && styles.tableHeaderTextWeb]}></Text>
        </View>
        {filteredTableData.map((row, index) => (
          <View style={styles.tableRow} key={index}>
            <Text style={[styles.tableCell, { flexBasis: tableFlexBasis, flex: 1.5, fontSize: tableCellTextSize }, isWeb && styles.tableCellTextWeb]}>{row.cpf_cnpj}</Text>
            <Text style={[styles.tableCell, { flexBasis: tableFlexBasis, flex: 1.5, fontSize: tableCellTextSize }, isWeb && styles.tableCellTextWeb]}>{row.num_documento}</Text>
            <Text style={[styles.tableCell, { flexBasis: tableFlexBasis, flex: 1.5, fontSize: tableCellTextSize }, isWeb && styles.tableCellTextWeb]}>{new Date(row.expirate_date).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}</Text>
            <TouchableOpacity style={styles.downloadButton} onPress={() => handleDownload(row)}>
              <MaterialIcons name="file-download" size={isSmallScreen ? 20 : 24} color={whiteColor} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.plusButton, styles.plusButtonSpacing]} onPress={() => onPlusPress(row)}>
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
          <Text><Text style={styles.boldText}>CNPJ/CPF:</Text> {documentData.cpf_cnpj}</Text>
          <Text><Text style={styles.boldText}>Razão social:</Text> {documentData.corporate_reason}</Text>
          <Text><Text style={styles.boldText}>Número do protocolo:</Text> {documentData.num_protocol}</Text>
          <Text><Text style={styles.boldText}>Número do documento:</Text> {documentData.num_documento}</Text>
          <Text><Text style={styles.boldText}>Validade da Licença:</Text> {new Date(documentData.expirate_date).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}</Text>
          <Text><Text style={styles.boldText}>Atividade específica:</Text> {documentData.specific_activity}</Text>
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

      if (result.canceled === false) {
        setSelectedDocument({ ...result });
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

    try {
      const fileUri = selectedDocument.assets[0].uri;
      const base64 = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 });

      const documentData = {
        renewalDate: renewalAlertDate.toISOString(),
        file: base64,
        name: selectedDocument.assets[0].name,
        type: selectedDocument.assets[0].mimeType,
      };

      onUpload(documentData);
      onClose();

    } catch (error) {
      console.error("Erro ao ler o arquivo:", error);
      Alert.alert('Erro', 'Erro ao processar o arquivo.');
    }
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
                <Text style={styles.uploadButtonTextModal}>Documento Selecionado: {selectedDocument.assets[0].name}</Text>
              </>
            ) : (
              <>
                <MaterialIcons name="file-upload" size={24} color={primaryColor} style={{ marginRight: 5 }} />
                <Text style={styles.uploadButtonTextModal}>Insira o documento</Text>
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
  const [documents, setDocuments] = useState([])
  const [filterValue, setFilterValue] = useState('TODOS');
  const [filteredTableData, setFilteredTableData] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const isWeb = Platform.OS === 'web';
  const screenSize = useScreenSize();
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedDocumentForDetails, setSelectedDocumentForDetails] = useState(null);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [renewalAlertDate, setRenewalAlertDate] = useState(new Date()); // Initialize with a default value
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null); // Changed to selectedDocument for consistency

  const isSmallScreen = useMemo(() => {
    return screenSize === 'small' || screenSize === 'medium';
  }, [screenSize]);

  const applyFilter = useCallback((documents) => {
    let filteredData = documents;

    if (filterValue === '6 Meses') {
      filteredData = filteredData.filter(item => {
        const expirationDate = new Date(item.expirate_date);
        const sixMonthsFromNow = new Date();
        sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
        return expirationDate <= sixMonthsFromNow && expirationDate > new Date();
      });
    } else if (filterValue === 'Vencidos') {
      filteredData = filteredData.filter(item => {
        const expirationDate = new Date(item.expirate_date);
        const now = new Date();
        return expirationDate < now;
      });
    }

    setFilteredTableData(filteredData);
  }, [filterValue]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch("http://hackathon-showrural-backend-production.up.railway.app/documents/");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const documents = await response.json();
        setDocuments(documents);
        applyFilter(documents);
      } catch (error) {
        console.error("Failed to fetch documents:", error);
        Alert.alert('Erro', 'Falha ao carregar os documentos.');
      }
    };

    fetchDocuments();
  }, [applyFilter]);


  const calculateBarWidth = (value, maxValue) => {
    const maxWidthPercentage = 80;
    const calculatedWidth = (value / maxValue) * maxWidthPercentage;
    return `${Math.min(calculatedWidth, maxWidthPercentage)}%`;
  };

  const handleDocumentUpload = () => {
    setUploadModalVisible(true);
  };

  const handleCloseUploadModal = () => {
    setUploadModalVisible(false);
    setRenewalAlertDate(new Date()); // Reset to default value
    setSelectedDocument(null);
    setShowDatePicker(false);
  };

  const handleDocumentUploadComplete = async (documentData) => {
    try {
      const json = JSON.stringify(documentData);

      const response = await fetch("http://hackathon-showrural-backend-production.up.railway.app/documentFiles/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: json
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Upload successful:", result);

      // Refresh documents after successful upload
      const fetchDocuments = async () => {
        try {
          const response = await fetch("http://hackathon-showrural-backend-production.up.railway.app/documents/");
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const documents = await response.json();
          setDocuments(documents);
          applyFilter(documents);
        } catch (error) {
          console.error("Failed to fetch documents:", error);
          Alert.alert('Erro', 'Falha ao carregar os documentos.');
        }
      };

      fetchDocuments();

    } catch (error) {
      console.error("Upload failed:", error);
      Alert.alert('Erro', 'Falha ao enviar o documento.');
    }
  };

  const handlePlusPress = (rowData) => {
    setSelectedDocumentForDetails(rowData);
    setDetailModalVisible(true);
  };

  const handleCloseDetailModal = () => {
    setDetailModalVisible(false);
  };

  const handleDownload = useCallback(async (rowData) => {
    if (!isWeb) {
      Alert.alert('Download', 'Download não suportado nesta plataforma.');
      return;
    }
  
    try {
      const documentId = rowData.id;
      if (!documentId) {
        Alert.alert('Erro', 'ID do documento não encontrado.');
        return;
      }
  
      // Show loading state to user
      Alert.alert('Download', 'Iniciando download...');
  
      const response = await fetch(`http://hackathon-showrural-backend-production.up.railway.app/documentFiles/${documentId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const documentData = await response.json();
      console.log(documentData)

      if (!documentData || !documentData.file) {
        throw new Error('Documento não encontrado ou sem conteúdo.');
      }
  
      // Get file info
      const filename = documentData.name || 'documento.pdf';
      const base64Data = documentData.file;
      const fileType = documentData.type || 'application/pdf';
  
      // Create blob from base64
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: fileType });
  
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
  
    } catch (error) {
      console.error("Download failed:", error);
      Alert.alert('Erro', `Falha ao baixar o documento: ${error.message}`);
    }
  }, [isWeb]);

  const maxValue = useMemo(() => {
    const contractsByCNPJ = () => {
      if (!documents || !Array.isArray(documents)) {
        return [];
      }

      const counts = {};
      documents.forEach(doc => {
        const cnpj = doc.cpf_cnpj || 'Sem CNPJ'; // Use cpf_cnpj instead of corporate_reason
        counts[cnpj] = (counts[cnpj] || 0) + 1;
      });

      return Object.entries(counts).map(([label, value]) => ({ label, value }));
    };
    return Math.max(...contractsByCNPJ().map(item => item.value), 0);
  }, [documents]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.blueBar}>
        <View style={styles.tabButtonsContainer}>
          <TouchableOpacity onPress={() => setActiveTab('dashboard')} style={styles.blueBarButton}>
            <Text style={[styles.blueBarText, activeTab === 'dashboard' && styles.activeTabText, isWeb && styles.blueBarTextWeb]}>DASHBOARD</Text>
          </TouchableOpacity>
          <View style={styles.verticalSeparator} />
          <TouchableOpacity onPress={() => setActiveTab('documents')} style={styles.blueBarButton}>
            <Text style={[styles.blueBarText, activeTab === 'documents' && styles.activeTabText, isWeb && styles.blueBarTextWeb]}>DOCUMENTOS</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.uploadIconContainer}>
          <TouchableOpacity onPress={handleDocumentUpload}>
            <MaterialIcons name="upload-file" size={30} color={whiteColor} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {activeTab === 'dashboard' ? (
          <DashboardScreen
            documents={documents}
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
        selectedDocument={selectedDocument}
        setSelectedDocument={setSelectedDocument}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: containerColor,
  },
  container: {
    flexGrow: 1, // Allow content to grow and scroll
    paddingHorizontal: '5%', // Use percentage for responsiveness
    paddingTop: 20,
    paddingBottom: 40,
    maxWidth: 1200,
    alignSelf: 'center', // Center the content horizontally
    width: '100%', // Take up full width of the screen
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
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 16,
  },
  card: {
    backgroundColor: whiteColor,
    width: '100%', // Cards take full width
    height: 120,
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardTitle: {
    width: '100%',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: primaryColor,
    marginBottom: 12,
    textAlign: 'center',
  },
  cardValue: {
    fontSize: 32,
    fontWeight: '600',
    color: primaryColor,
  },
  chartCard: {
    backgroundColor: whiteColor,
    borderRadius: 12,
    padding: 20,
    elevation: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    borderColor: lightGrayColor,
    borderWidth: 1,
    marginBottom: 24,
    width: '100%', // Chart card takes full width
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: primaryColor,
    marginBottom: 16,
  },
  bar: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  barLabelContainer: {
    flex: 1,
    marginRight: 10,
  },
  barLabel: {
    fontSize: 16,
    color: primaryColor,
    textAlign: 'left',
  },
  barContainer: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    height: 18,
    position: 'relative',
  },
  barFill: {
    height: 18,
    backgroundColor: primaryColor,
    borderRadius: 9,
    overflow: 'hidden',
    position: 'absolute',
    left: '5mm', // Desloca a barra 0.5cm para a direita
  },
  barValue: {
    fontSize: 16,
    color: primaryColor,
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    marginLeft: 5,
  },
  tableCard: {
    backgroundColor: whiteColor,
    borderRadius: 12,
    padding: 15, // Reduced padding
    elevation: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    width: '100%', // Table card takes full width
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8, // Reduced margin
  },
  tableHeaderText: {
    fontWeight: 'bold',
    color: primaryColor,
    textAlign: 'left',
    flex: 1,
    fontSize: 14, // Reduced font size
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8, // Reduced padding
    borderBottomWidth: 1,
    borderBottomColor: lightGrayColor,
  },
  tableCell: {
    color: grayColor,
    textAlign: 'left',
    flex: 1,
    overflow: 'hidden',
    fontSize: 10, // Reduced font size
  },
  uploadButton: {
    flexDirection: 'row',
    backgroundColor: whiteColor,
    borderRadius: 24,
    paddingVertical: 10, // Reduced padding
    paddingHorizontal: 20, // Reduced padding
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: primaryColor,
    alignSelf: 'center',
    width: '100%', // Make it wider
  },
  uploadButtonText: {
    fontSize: 16, // Reduced font size
    fontWeight: '600',
    color: primaryColor,
  },
  middleCardSpacing: {
    marginLeft: 0,
    marginRight: 0,
  },
  sectionSpacing: {
    width: '100%',
    marginBottom: 16, // Reduced margin
    marginTop: 16, // Reduced margin
  },
  filterUploadContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8, // Reduced margin
  },
  filterLabel: {
    fontSize: 16, // Reduced font size
    fontWeight: 'bold',
    color: primaryColor,
    marginRight: 0, // Reduced margin
  },
  picker: {
    width: '100%',
    height: 36, // Reduced height
    backgroundColor: whiteColor,
    color: primaryColor,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: primaryColor,
    fontSize: 14, // Reduced font size
  },
  uploadButtonSmall: {
    paddingVertical: 8, // Reduced padding
    paddingHorizontal: 16, // Reduced padding
  },
  uploadButtonTextSmall: {
    fontSize: 14, // Reduced font size
  },
  blueBar: {
    backgroundColor: primaryColor,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    marginTop: 0,
    paddingTop: 36,
    paddingHorizontal: 20,
  },
  blueBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  blueBarButton: {
    alignItems: 'flex-start',
  },
  blueBarText: {
    color: whiteColor,
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 16,
  },
  activeTabText: {
    textDecorationLine: 'underline',
  },
  logo: {
    width: 100,
    height: 100,
  },
  logoContainer: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBackground: {
    backgroundColor: whiteColor,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  verticalSeparator: {
    width: '50%',
    height: '70%',
    width: 1,
    backgroundColor: whiteColor,
    marginHorizontal: 12,
  },
  cardTitleWeb: {
    fontSize: 20,
  },
  cardValueWeb: {
    fontSize: 36,
  },
  chartTitleWeb: {
    fontSize: 22,
  },
  barLabelWeb: {
    fontSize: 14,
  },
  barValueWeb: {
    fontSize: 18,
  },
  filterLabelWeb: {
    fontSize: 20,

  },
  pickerWeb: {
    height: 40, // Reduced height
    width: 200, // Adjusted width
  },
  uploadButtonWeb: {
    paddingVertical: 12, // Reduced padding
    paddingHorizontal: 24, // Reduced padding
  },
  uploadButtonTextWeb: {
    fontSize: 18,
  },
  tableHeaderTextWeb: {
    fontSize: 16, // Reduced font size
  },
  tableCellTextWeb: {
    fontSize: 14, // Reduced font size
  },
  blueBarTextWeb: {
    flex: 1,
    fontSize: 22,
    textAlign: 'left',
  },
  downloadButton: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: primaryColor,
    width: 30, // Reduced width
    height: 30, // Reduced height
    borderRadius: 15, // Reduced radius
  },
  filterButton: {
    backgroundColor: whiteColor,
    borderRadius: 24,
    paddingVertical: 10, // Reduced padding
    paddingHorizontal: 20, // Reduced padding
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: primaryColor,
    marginBottom: 10, // Reduced margin
    width: '100%', // Make it wider
  },
  filterButtonText: {
    fontSize: 16, // Reduced font size
    fontWeight: '600',
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
    fontSize: 22,
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
    marginBottom: 10, // Reduced margin
    width: '100%', // Search container takes full width
  },
  searchInput: {
    flex: 1,
    backgroundColor: whiteColor,
    borderRadius: 20,
    paddingVertical: 8, // Reduced padding
    paddingHorizontal: 16, // Reduced padding
    marginRight: 8, // Reduced margin
    elevation: 3,
    boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.1)',
  },
  plusButton: {
    backgroundColor: primaryColor,
    width: 30, // Reduced width
    height: 30, // Reduced height
    borderRadius: 15, // Reduced radius
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusButtonText: {
    color: whiteColor,
    fontSize: 14, // Reduced font size
    fontWeight: 'bold',
  },
  uploadButtonModal: {
    flexDirection: 'row',
    backgroundColor: whiteColor,
    borderRadius: 20,
    paddingVertical: 12, // Reduced padding
    paddingHorizontal: 16, // Reduced padding
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.1)',
    borderWidth: 1,
    borderColor: primaryColor,
    marginBottom: 16, // Reduced margin
    width: '100%',
  },
  uploadButtonTextModal: {
    fontSize: 14, // Reduced font size
    fontWeight: 'bold',
    color: primaryColor,
    textAlign: 'center',
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16, // Reduced margin
  },
  datePickerButton: {
    backgroundColor: whiteColor,
    borderRadius: 20,
    paddingVertical: 8, // Reduced padding
    paddingHorizontal: 16, // Reduced padding
    elevation: 3,
    boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.1)',
    flex: 1,
    marginLeft: 8, // Reduced margin
  },
  datePickerButtonText: {
    fontSize: 14, // Reduced font size
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
    paddingVertical: 8, // Reduced padding
    paddingHorizontal: 16, // Reduced padding
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
    marginLeft: 'auto',
  },
  webDatePickerInput: {
    padding: 8, // Reduced padding
    borderWidth: 1,
    borderColor: lightGrayColor,
    borderRadius: 5,
    fontSize: 14, // Reduced font size
    color: primaryColor,
    width: '100%',
  },
  plusButtonSpacing: {
    marginLeft: 6, // Reduced margin
  },
  barInfoContainer: {
    marginBottom: 10,
  },
  barInfoText: {
    fontSize: 14,
    color: grayColor,
  },
});