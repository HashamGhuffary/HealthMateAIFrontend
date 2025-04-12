import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  FlatList 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SPACING } from '../theme/global';

const RecordsScreen = ({ navigation }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    // This would be replaced with an actual API call in a real app
    const fetchRecords = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockRecords = [
          { id: '1', title: 'Annual Checkup', date: '2023-10-15', type: 'checkup', doctor: 'Dr. Smith' },
          { id: '2', title: 'Blood Test Results', date: '2023-09-20', type: 'test', doctor: 'Dr. Johnson' },
          { id: '3', title: 'Vaccination Record', date: '2023-08-05', type: 'vaccination', doctor: 'Dr. Wilson' },
          { id: '4', title: 'Allergy Test', date: '2023-07-12', type: 'test', doctor: 'Dr. Brown' },
          { id: '5', title: 'Physical Therapy', date: '2023-06-28', type: 'therapy', doctor: 'Dr. Davis' },
        ];
        
        setRecords(mockRecords);
      } catch (error) {
        console.error('Error fetching records:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  const filteredRecords = activeTab === 'all' 
    ? records 
    : records.filter(record => record.type === activeTab);

  const renderRecordItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.recordItem}
      onPress={() => {
        // Navigate to record details
        // navigation.navigate('RecordDetails', { recordId: item.id });
      }}
    >
      <View style={styles.recordHeader}>
        <Text style={styles.recordTitle}>{item.title}</Text>
        <Feather name="chevron-right" size={20} color={COLORS.muted} />
      </View>
      <Text style={styles.recordDate}>Date: {item.date}</Text>
      <Text style={styles.recordDoctor}>Doctor: {item.doctor}</Text>
      <View style={styles.recordTypeContainer}>
        <Text style={styles.recordType}>{item.type.toUpperCase()}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Medical Records</Text>
        <TouchableOpacity>
          <Feather name="plus" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'checkup' && styles.activeTab]}
          onPress={() => setActiveTab('checkup')}
        >
          <Text style={[styles.tabText, activeTab === 'checkup' && styles.activeTabText]}>Checkups</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'test' && styles.activeTab]}
          onPress={() => setActiveTab('test')}
        >
          <Text style={[styles.tabText, activeTab === 'test' && styles.activeTabText]}>Tests</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'vaccination' && styles.activeTab]}
          onPress={() => setActiveTab('vaccination')}
        >
          <Text style={[styles.tabText, activeTab === 'vaccination' && styles.activeTabText]}>Vaccines</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredRecords}
          renderItem={renderRecordItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.recordsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="file-text" size={50} color={COLORS.muted} />
              <Text style={styles.emptyText}>No records found</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    paddingTop: SPACING.xl * 2,
    backgroundColor: COLORS.card,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    marginRight: SPACING.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    color: COLORS.text,
    fontWeight: '500',
  },
  activeTabText: {
    color: COLORS.card,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordsList: {
    padding: SPACING.lg,
  },
  recordItem: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  recordTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  recordDate: {
    fontSize: 14,
    color: COLORS.muted,
    marginBottom: 4,
  },
  recordDoctor: {
    fontSize: 14,
    color: COLORS.muted,
    marginBottom: SPACING.sm,
  },
  recordTypeContainer: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primary + '20', // 20% opacity
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 16,
  },
  recordType: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.primary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyText: {
    marginTop: SPACING.md,
    fontSize: 16,
    color: COLORS.muted,
    textAlign: 'center',
  },
});

export default RecordsScreen; 