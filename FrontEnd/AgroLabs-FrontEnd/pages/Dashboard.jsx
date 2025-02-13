import { FontAwesome } from '@expo/vector-icons';
import { faker } from '@faker-js/faker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert, Platform } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Picker } from '@react-native-picker/picker';

const primaryColor = '#0a4fd9';
const whiteColor = '#ffffff';
const containerColor = '#eeeffb';
const redColor = '#ff4d4d';
const grayColor = '#888888';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// Adjusted breakpoints for better responsiveness
const breakpoints = {
  small: 480, // Extra small screens (phones)
  medium: 768, // Small screens (tablets)
  large: 992, // Medium screens (desktops)
  xLarge: 1200, // Large screens (large desktops)
};

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

    Dimensions.addEventListener('change', handleResize);

    return () => Dimensions.removeEventListener('change', handleResize);
  }, []);

  return screenSize;
};

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
    })),
    loading: false,
  });

  const [filterValue, setFilterValue] = useState('TODOS');
  const [filteredTableData, setFilteredTableData] = useState(contractData.tableData);

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
        return expirationDate <= sixMonthsFromNow;
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

  const screenSize = useScreenSize();

  const calculateBarWidth = (value, maxValue) => {
    const maxWidthPercentage = 80;
    const calculatedWidth = (value / maxValue) * maxWidthPercentage;
    return `${Math.min(calculatedWidth, maxWidthPercentage)}%`;
  };

  const maxValue = Math.max(...contractData.cnpjContracts.map(item => item.value));

  const cardStyle = {
    width: screenSize === 'small' ? '100%' : screenSize === 'medium' ? '48%' : '30%', // Adjusted for better tablet layout
    marginBottom: 15, // Added margin for spacing
  };

  const tableHeaderTextSize = screenSize === 'small' ? 12 : 14;
  const tableCellTextSize = screenSize === 'small' ? 10 : 12;
  const tableFlexBasis = 'auto';
  const tableConditionFlex = 2;

  const handleDocumentUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        multiple: false,
      });

      if (result.type === 'success') {
        console.log('Document URI:', result.uri);
        console.log('Document Name:', result.name);
        console.log('Document Size:', result.size);
        console.log('Document Type:', result.mimeType);

        Alert.alert(
          'Document Selected',
          `Name: ${result.name}\nType: ${result.mimeType}\nSize: ${result.size} bytes`,
          [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
        );
      } else {
        console.log('Document picking cancelled');
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


  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.row}>
          <View style={[styles.card, cardStyle]}>
            <Text style={styles.cardTitle}>Contratos ativos</Text>
            <Text style={styles.cardValue}>{contractData.activeContracts}</Text>
          </View>
          <View style={[styles.card, cardStyle, styles.middleCardSpacing]}>
            <Text style={styles.cardTitle}>Contratos a 6 meses do vencimento</Text>
            <Text style={styles.cardValue}>{contractData.expiringContracts}</Text>
          </View>
          <View style={[styles.card, cardStyle]}>
            <Text style={styles.cardTitle}>Contratos vencidos</Text>
            <Text style={styles.cardValue}>{contractData.expiredContracts}</Text>
          </View>
        </View>

        <View style={[styles.chartCard, styles.sectionSpacing]}>
          <Text style={styles.chartTitle}>Contratos por CNPJ</Text>
          {contractData.cnpjContracts.map((item, index) => (
            <View style={styles.bar} key={index}>
              <Text style={styles.barLabel}>{item.label}</Text>
              <View style={styles.barContainer}>
                <LinearGradient
                  colors={[primaryColor, '#668ad8']}
                  style={[styles.barFill, { width: calculateBarWidth(item.value, maxValue) }]}
                  start={[0, 0]}
                  end={[1, 0]}
                />
                <Text style={styles.barValue}>{item.value}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.filterUploadContainer, styles.sectionSpacing]}>
          <View style={styles.filterContainer}>
            <Text style={styles.filterLabel}>Filtro:</Text>
            <Picker
              selectedValue={filterValue}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) => setFilterValue(itemValue)}
            >
              <Picker.Item label="TODOS" value="TODOS" />
              <Picker.Item label="6 Meses" value="6 Meses" />
              <Picker.Item label="Vencidos" value="Vencidos" />
            </Picker>
          </View>

          <TouchableOpacity style={[styles.uploadButton, screenSize === 'small' && styles.uploadButtonSmall]} onPress={handleDocumentUpload}>
            <FontAwesome name="upload" size={screenSize === 'small' ? 14 : 16} color={primaryColor} style={{ marginRight: 5 }} />
            <Text style={[styles.uploadButtonText, screenSize === 'small' && styles.uploadButtonTextSmall]}>
              Faça upload de um novo documento
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.tableCard, styles.sectionSpacing]}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { flexBasis: tableFlexBasis, flex: 1, fontSize: tableHeaderTextSize }]}>CNPJ</Text>
            <Text style={[styles.tableHeaderText, { flexBasis: tableFlexBasis, flex: 1, fontSize: tableHeaderTextSize }]}>Tipo</Text>
            <Text style={[styles.tableHeaderText, { flexBasis: tableFlexBasis, flex: 1, fontSize: tableHeaderTextSize }]}>Vencimento</Text>
            <Text style={[styles.tableHeaderText, { flexBasis: tableFlexBasis, flex: tableConditionFlex, fontSize: tableHeaderTextSize }]}>Condicionamento</Text>
            <Text style={[styles.tableHeaderText, { flexBasis: tableFlexBasis, flex: 0.5, fontSize: tableHeaderTextSize, textAlign: 'center' }]}>Arquivo</Text>
          </View>
          {filteredTableData.map((row, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={[styles.tableCell, { flexBasis: tableFlexBasis, flex: 1, fontSize: tableCellTextSize }]}>{row.cnpj}</Text>
              <Text style={[styles.tableCell, { flexBasis: tableFlexBasis, flex: 1, fontSize: tableCellTextSize }]}>{row.type}</Text>
              <Text style={[styles.tableCell, { flexBasis: tableFlexBasis, flex: 1, fontSize: tableCellTextSize }]}>{row.expirationDate}</Text>
              <Text style={[styles.tableCell, { flexBasis: tableFlexBasis, flex: tableConditionFlex, fontSize: tableCellTextSize }]}>{row.condition}</Text>
              <TouchableOpacity style={{ flex: 0.5, alignItems: 'center' }}>
                <FontAwesome name="download" size={20} color={primaryColor} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: containerColor,
  },
  container: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 30,
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
    marginBottom: 15,
    flexWrap: 'wrap',
  },
  card: {
    backgroundColor: whiteColor,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: primaryColor,
    marginBottom: 5,
    textAlign: 'center',
  },
  cardValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: primaryColor,
  },
  chartCard: {
    backgroundColor: whiteColor,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    borderColor: '#9966CC',
    borderWidth: 1,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: primaryColor,
    marginBottom: 10,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
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
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tableHeaderText: {
    fontWeight: 'bold',
    color: primaryColor,
    textAlign: 'left',
    flex: 1,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: containerColor,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    borderWidth: 1,
    borderColor: primaryColor,
    alignSelf: 'center', // Centraliza o botão
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
    flexDirection: 'row', // Alinha os itens horizontalmente
    justifyContent: 'space-between', // Espaço entre os itens
    alignItems: 'center', // Alinha os itens verticalmente ao centro
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: primaryColor,
    marginRight: 10,
  },
  picker: {
    height: 40,
    width: Platform.OS === 'web' ? 200 : 150, // Adjust width for web
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
});