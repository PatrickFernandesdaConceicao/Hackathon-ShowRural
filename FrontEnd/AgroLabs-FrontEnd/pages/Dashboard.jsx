import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, Dimensions, SafeAreaView, Platform, TouchableOpacity } from 'react-native';
import { faker } from '@faker-js/faker';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';

const primaryColor = '#0a4fd9';
const whiteColor = '#ffffff';
const containerColor = '#eeeffb';
const redColor = '#ff4d4d';
const grayColor = '#888888';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const breakpoints = {
  small: 600,
  medium: 900,
  large: 1200,
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
    expiringContracts: 125,
    expiredContracts: 125,
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

  const screenSize = useScreenSize();

  const calculateBarWidth = (value, maxValue) => {
    const maxWidthPercentage = 80;
    const calculatedWidth = (value / maxValue) * maxWidthPercentage;
    return `${Math.min(calculatedWidth, maxWidthPercentage)}%`;
  };

  const maxValue = Math.max(...contractData.cnpjContracts.map(item => item.value));

  const cardStyle = {
    width: screenSize === 'small' ? '100%' : screenSize === 'medium' ? '45%' : '30%',
  };

  const tableHeaderTextSize = screenSize === 'small' ? 12 : 14;
  const tableCellTextSize = screenSize === 'small' ? 10 : 12;
  const tableFlexBasis = 'auto';
  const tableConditionFlex = 2;

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
            <Text style={styles.cardTitle}>Contratos a 6 meses do vencimento</Text>
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

        <TouchableOpacity style={[styles.uploadButton, styles.sectionSpacing]}>
          <FontAwesome name="upload" size={16} color={primaryColor} style={{ marginRight: 5 }} />
          <Text style={styles.uploadButtonText}>Faça upload de um novo documento</Text>
        </TouchableOpacity>

        <View style={[styles.tableCard, styles.sectionSpacing]}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { flexBasis: tableFlexBasis, flex: 1, fontSize: tableHeaderTextSize }]}>CNPJ</Text>
            <Text style={[styles.tableHeaderText, { flexBasis: tableFlexBasis, flex: 1, fontSize: tableHeaderTextSize }]}>Tipo</Text>
            <Text style={[styles.tableHeaderText, { flexBasis: tableFlexBasis, flex: 1, fontSize: tableHeaderTextSize }]}>Vencimento</Text>
            <Text style={[styles.tableHeaderText, { flexBasis: tableFlexBasis, flex: tableConditionFlex, fontSize: tableHeaderTextSize }]}>Condicionamento</Text>
            <Text style={[styles.tableHeaderText, { flexBasis: tableFlexBasis, flex: 0.5, fontSize: tableHeaderTextSize, textAlign: 'center' }]}>Arquivo</Text>
          </View>
          {contractData.tableData.map((row, index) => (
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
    borderColor: '#9966CC', // Border color
    borderWidth: 1, // Border width
    marginBottom: 20, // Adjusted margin
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
    borderRadius: 20, // Make it rounded
    paddingVertical: 20, // Adjust vertical padding
    paddingHorizontal: 20, // Adjust horizontal padding
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    alignSelf: 'center',
    borderWidth: 1, // Add border
    borderColor: primaryColor, // Border color
    width: '80%', // Adjust the width to center it
    marginTop: 20, // Adjusted margin
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: primaryColor,
  },
  middleCardSpacing: {
    marginLeft: 10,
    marginRight: 10,
  },
  sectionSpacing: {
    marginTop: 20, // Add spacing between sections
  },
});