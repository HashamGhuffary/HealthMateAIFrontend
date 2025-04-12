import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  FlatList,
  Image 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SPACING } from '../theme/global';

const DoctorsScreen = ({ navigation }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    // Mock data loading
    const fetchDoctors = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockDoctors = [
          { 
            id: '1', 
            name: 'Dr. Sarah Johnson', 
            specialty: 'Cardiology', 
            rating: 4.8,
            experience: '15 years',
            image: 'https://randomuser.me/api/portraits/women/32.jpg',
            available: true
          },
          { 
            id: '2', 
            name: 'Dr. Michael Chen', 
            specialty: 'Neurology', 
            rating: 4.9,
            experience: '12 years',
            image: 'https://randomuser.me/api/portraits/men/45.jpg',
            available: true
          },
          { 
            id: '3', 
            name: 'Dr. Elizabeth Taylor', 
            specialty: 'Dermatology', 
            rating: 4.7,
            experience: '8 years',
            image: 'https://randomuser.me/api/portraits/women/68.jpg',
            available: false
          },
          { 
            id: '4', 
            name: 'Dr. James Williams', 
            specialty: 'Pediatrics', 
            rating: 4.6,
            experience: '10 years',
            image: 'https://randomuser.me/api/portraits/men/29.jpg',
            available: true
          },
          { 
            id: '5', 
            name: 'Dr. Maria Rodriguez', 
            specialty: 'Psychiatry', 
            rating: 4.9,
            experience: '14 years',
            image: 'https://randomuser.me/api/portraits/women/45.jpg',
            available: false
          },
        ];
        
        setDoctors(mockDoctors);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = activeTab === 'all' 
    ? doctors 
    : doctors.filter(doctor => 
        activeTab === 'available' ? doctor.available : !doctor.available
      );

  const renderDoctorItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.doctorCard}
      onPress={() => navigation.navigate('DoctorProfile', { doctorId: item.id })}
    >
      <Image 
        source={{ uri: item.image }} 
        style={styles.doctorImage} 
        defaultSource={require('../../assets/default-avatar.png')}
      />
      <View style={styles.doctorInfo}>
        <Text style={styles.doctorName}>{item.name}</Text>
        <Text style={styles.doctorSpecialty}>{item.specialty}</Text>
        <View style={styles.ratingContainer}>
          <Feather name="star" size={16} color="#FFD700" />
          <Text style={styles.rating}>{item.rating}</Text>
          <Text style={styles.experience}> • {item.experience} exp</Text>
        </View>
      </View>
      <View style={styles.actionContainer}>
        <View style={[
          styles.statusIndicator, 
          { backgroundColor: item.available ? COLORS.success : COLORS.muted }
        ]} />
        <Text style={[
          styles.statusText,
          { color: item.available ? COLORS.success : COLORS.muted }
        ]}>
          {item.available ? 'Available' : 'Unavailable'}
        </Text>
        <TouchableOpacity 
          style={[
            styles.appointmentButton,
            { opacity: item.available ? 1 : 0.5 }
          ]}
          disabled={!item.available}
          onPress={() => navigation.navigate('Appointment', { doctorId: item.id })}
        >
          <Text style={styles.appointmentButtonText}>Book</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find Doctors</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Feather name="search" size={22} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'available' && styles.activeTab]}
          onPress={() => setActiveTab('available')}
        >
          <Text style={[styles.tabText, activeTab === 'available' && styles.activeTabText]}>Available</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'unavailable' && styles.activeTab]}
          onPress={() => setActiveTab('unavailable')}
        >
          <Text style={[styles.tabText, activeTab === 'unavailable' && styles.activeTabText]}>Unavailable</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredDoctors}
          renderItem={renderDoctorItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.doctorsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="user" size={50} color={COLORS.muted} />
              <Text style={styles.emptyText}>No doctors found</Text>
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
  searchButton: {
    padding: SPACING.sm,
  },
  tabContainer: {
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
  doctorsList: {
    padding: SPACING.lg,
  },
  doctorCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  doctorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: SPACING.md,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 2,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: COLORS.muted,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    marginLeft: 4,
  },
  experience: {
    fontSize: 14,
    color: COLORS.muted,
  },
  actionContainer: {
    alignItems: 'flex-end',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    marginBottom: 8,
  },
  appointmentButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: 16,
  },
  appointmentButtonText: {
    color: COLORS.card,
    fontSize: 12,
    fontWeight: '500',
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

export default DoctorsScreen; 