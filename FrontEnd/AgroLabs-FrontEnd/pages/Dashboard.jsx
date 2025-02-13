import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, Dimensions, SafeAreaView } from 'react-native';
import { faker } from '@faker-js/faker';

const primaryColor = '#0a4fd9';
const whiteColor = '#ffffff';
const containerColor = '#eeeffb';
const redColor = '#ff4d4d';
const grayColor = '#888888';

const screenWidth = Dimensions.get('window').width; // Get screen width
const screenHeight = Dimensions.get('window').height; // Get screen height

export default function Dashboard() {
  const [contractData, setContractData] = useState({
    activeContracts: 0,
    expiringContracts: 0,
    expiredContracts: 0,
    cnpjContracts: [],
    tableData: [],
    loading: true,
  });

  useEffect(() => {
    // Simulate fetching data from an API
    setTimeout(() => {
      const activeContracts = faker.number.int({ min: 100, max: 200 });
      const expiringContracts = faker.number.int({ min: 50, max: 100 });
      const expiredContracts = faker.number.int({ min: 10, max: 30 });

      const cnpjContracts = [
        { label: 'Exemplo 01', value: faker.number.int({ min: 30, max: 60 }) },
        { label: 'Exemplo 02', value: faker.number.int({ min: 20, max: 50 }) },
        { label: 'Exemplo 03', value: faker.number.int({ min: 40, max: 70 }) },
      ];

      const tableData = Array.from({ length: 10 }, () => ({
        cnpj: faker.string.alphanumeric(14),
        type: faker.commerce.product(),
        expirationDate: faker.date.future().toLocaleDateString(),
        condition: faker.lorem.sentence(5),
      }));

      setContractData({
        activeContracts,
        expiringContracts,
        expiredContracts,
        cnpjContracts,
        tableData,
        loading: false,
      });
    }, 1500); // Simulate a 1.5 second loading time
  }, []);

  const calculateBarWidth = (value, maxValue) => {
    const maxWidthPercentage = 80; // Limit the bar width to 80% of the container
    const calculatedWidth = (value / maxValue) * maxWidthPercentage;
    return `${Math.min(calculatedWidth, maxWidthPercentage)}%`; // Ensure it doesn't exceed maxWidthPercentage
  };

  const maxValue = Math.max(...contractData.cnpjContracts.map(item => item.value));

  if (contractData.loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={primaryColor} />
        <Text style={styles.loadingText}>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.row}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Contratos ativos</Text>
            <Text style={styles.cardValue}>{contractData.activeContracts}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Contratos a 6 meses do vencimento</Text>
            <Text style={styles.cardValue}>{contractData.expiringContracts}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Contratos vencidos</Text>
            <Text style={[styles.cardValue, { color: redColor }]}>{contractData.expiredContracts}!</Text>
          </View>
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Contratos por CNPJ</Text>
          {contractData.cnpjContracts.map((item, index) => (
            <View style={styles.bar} key={index}>
              <Text style={styles.barLabel}>{item.label}</Text>
              <View style={[styles.barFill, { width: calculateBarWidth(item.value, maxValue) }]} />
              <Text style={styles.barValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.tableCard}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { flex: 2 }]}>CNPJ</Text>
            <Text style={[styles.tableHeaderText, { flex: 2 }]}>Tipo</Text>
            <Text style={[styles.tableHeaderText, { flex: 2 }]}>Vencimento</Text>
            <Text style={[styles.tableHeaderText, { flex: 3 }]}>Condicionamento</Text>
          </View>
          {contractData.tableData.map((row, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={[styles.tableCell, { flex: 2 }]}>{row.cnpj}</Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>{row.type}</Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>{row.expirationDate}</Text>
              <Text style={[styles.tableCell, { flex: 3 }]}>{row.condition}</Text>
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
    backgroundColor: containerColor, // Ensure the entire screen has the background color
  },
  container: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 30,
    // maxWidth: screenWidth - 30, //  Removed maxWidth to allow full width cards
    // alignSelf: 'center', // Removed alignSelf to allow full width cards
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
  },
  card: {
    backgroundColor: whiteColor,
    borderRadius: 10,
    padding: 15,
    width: '32%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 14,
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
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 16,
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
    fontSize: 12,
    color: primaryColor,
    width: 70,
  },
  barFill: {
    backgroundColor: primaryColor,
    height: 16,
    borderRadius: 8,
    marginRight: 5,
    flexGrow: 1,
  },
  barValue: {
    fontSize: 12,
    color: primaryColor,
    marginLeft: 5,
    width: 35,
    textAlign: 'right',
  },
  tableCard: {
    backgroundColor: whiteColor,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
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
    fontSize: 14,
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
    fontSize: 12,
    color: grayColor,
    textAlign: 'left',
    flex: 1,
    overflow: 'hidden', // Prevent text overflow
  },
});