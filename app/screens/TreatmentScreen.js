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

const TreatmentScreen = ({ route, navigation }) => {
  const { diagnosisId } = route.params || {};
  const [treatment, setTreatment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('medications');

  useEffect(() => {
    // In a real app, this would fetch from an API
    const fetchTreatment = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockTreatment = {
          id: '1',
          diagnosisId: diagnosisId || '1',
          diagnosisTitle: 'Upper Respiratory Infection',
          startDate: '2023-10-10',
          endDate: '2023-10-17',
          status: 'active',
          medications: [
            { 
              id: '1',
              name: 'Acetaminophen',
              dosage: '500mg',
              frequency: 'Every 6 hours as needed',
              duration: '7 days',
              instructions: 'Take with food. Do not exceed 4 doses in 24 hours.',
              status: 'active',
              schedule: [
                { time: '08:00 AM', taken: true, date: '2023-10-10' },
                { time: '02:00 PM', taken: true, date: '2023-10-10' },
                { time: '08:00 PM', taken: false, date: '2023-10-10' },
                { time: '08:00 AM', taken: false, date: '2023-10-11' },
              ]
            },
            { 
              id: '2',
              name: 'Dextromethorphan',
              dosage: '30mg',
              frequency: 'Every 6-8 hours as needed for cough',
              duration: '7 days',
              instructions: 'Take as needed for cough. May cause drowsiness.',
              status: 'active',
              schedule: [
                { time: '08:00 AM', taken: true, date: '2023-10-10' },
                { time: '04:00 PM', taken: false, date: '2023-10-10' },
                { time: '08:00 AM', taken: false, date: '2023-10-11' },
              ]
            }
          ],
          activities: [
            {
              id: '1',
              type: 'Rest',
              frequency: 'Daily',
              instructions: 'Get at least 8 hours of sleep each night. Take naps as needed during the day.',
              status: 'recommended'
            },
            {
              id: '2',
              type: 'Hydration',
              frequency: 'Throughout the day',
              instructions: 'Drink at least 8-10 glasses of water daily.',
              status: 'recommended'
            },
            {
              id: '3',
              type: 'Exercise',
              frequency: 'Avoid until symptoms improve',
              instructions: 'Avoid strenuous exercise until symptoms improve, typically 3-5 days.',
              status: 'avoid'
            }
          ],
          diet: [
            {
              id: '1',
              type: 'Warm liquids',
              recommendation: 'Recommended',
              instructions: 'Consume warm liquids like tea with honey, clear broths, and warm water to soothe throat.',
            },
            {
              id: '2',
              type: 'Soft foods',
              recommendation: 'Recommended',
              instructions: 'If throat is sore, eat soft, easy-to-swallow foods.',
            },
            {
              id: '3',
              type: 'Alcohol',
              recommendation: 'Avoid',
              instructions: 'Avoid alcohol as it can dehydrate you and interact with medications.',
            },
            {
              id: '4',
              type: 'Caffeine',
              recommendation: 'Limit',
              instructions: 'Limit caffeine intake as it can contribute to dehydration.',
            }
          ],
          appointments: [
            {
              id: '1',
              type: 'Follow-up',
              date: '2023-10-17',
              time: '10:00 AM',
              provider: 'Dr. Sarah Johnson',
              location: 'Virtual Visit',
              notes: 'Follow-up if symptoms persist after 7 days.',
              status: 'scheduled'
            }
          ],
          progressNotes: [
            {
              id: '1',
              date: '2023-10-10',
              note: 'Treatment plan initiated. Patient instructed on medication regimen and recommendations.',
              provider: 'Dr. Sarah Johnson'
            }
          ]
        };
        
        setTreatment(mockTreatment);
      } catch (err) {
        setError('Failed to load treatment information. Please try again.');
        console.error('Error fetching treatment:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTreatment();
  }, [diagnosisId]);

  const renderMedications = () => (
    <View style={styles.tabContent}>
      {treatment.medications.map((medication) => (
        <View key={medication.id} style={styles.medicationCard}>
          <View style={styles.medicationHeader}>
            <Text style={styles.medicationName}>{medication.name}</Text>
            <View style={[
              styles.statusTag,
              { backgroundColor: medication.status === 'active' ? COLORS.success + '30' : COLORS.muted + '30' }
            ]}>
              <Text style={[
                styles.statusText,
                { color: medication.status === 'active' ? COLORS.success : COLORS.muted }
              ]}>
                {medication.status.toUpperCase()}
              </Text>
            </View>
          </View>
          
          <View style={styles.medicationDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Dosage:</Text>
              <Text style={styles.detailValue}>{medication.dosage}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Frequency:</Text>
              <Text style={styles.detailValue}>{medication.frequency}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Duration:</Text>
              <Text style={styles.detailValue}>{medication.duration}</Text>
            </View>
          </View>

          <View style={styles.instructions}>
            <Text style={styles.instructionsLabel}>Instructions:</Text>
            <Text style={styles.instructionsText}>{medication.instructions}</Text>
          </View>

          <Text style={styles.scheduleTitle}>Upcoming Doses</Text>
          <FlatList
            data={medication.schedule}
            keyExtractor={(item, index) => `${medication.id}-${index}`}
            renderItem={({ item }) => (
              <View style={styles.scheduleItem}>
                <View style={styles.scheduleDateTime}>
                  <Text style={styles.scheduleDate}>{item.date}</Text>
                  <Text style={styles.scheduleTime}>{item.time}</Text>
                </View>
                <TouchableOpacity 
                  style={[
                    styles.scheduleTakenButton,
                    item.taken ? styles.takenButton : styles.notTakenButton
                  ]}
                  disabled={item.taken}
                >
                  <Text style={[
                    styles.scheduleTakenText,
                    item.taken ? styles.takenText : styles.notTakenText
                  ]}>
                    {item.taken ? 'Taken' : 'Mark as Taken'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            scrollEnabled={false}
            contentContainerStyle={styles.scheduleList}
          />
        </View>
      ))}
    </View>
  );

  const renderActivities = () => (
    <View style={styles.tabContent}>
      {treatment.activities.map((activity) => (
        <View key={activity.id} style={styles.activityCard}>
          <View style={styles.activityHeader}>
            <Text style={styles.activityType}>{activity.type}</Text>
            <View style={[
              styles.recommendationTag,
              { 
                backgroundColor: activity.status === 'recommended' 
                  ? COLORS.success + '30'
                  : activity.status === 'avoid'
                  ? COLORS.error + '30'
                  : COLORS.muted + '30'
              }
            ]}>
              <Text style={[
                styles.recommendationText,
                { 
                  color: activity.status === 'recommended' 
                    ? COLORS.success
                    : activity.status === 'avoid'
                    ? COLORS.error
                    : COLORS.muted
                }
              ]}>
                {activity.status.toUpperCase()}
              </Text>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Frequency:</Text>
            <Text style={styles.detailValue}>{activity.frequency}</Text>
          </View>

          <View style={styles.instructions}>
            <Text style={styles.instructionsLabel}>Instructions:</Text>
            <Text style={styles.instructionsText}>{activity.instructions}</Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderDiet = () => (
    <View style={styles.tabContent}>
      {treatment.diet.map((item) => (
        <View key={item.id} style={styles.dietCard}>
          <View style={styles.dietHeader}>
            <Text style={styles.dietType}>{item.type}</Text>
            <View style={[
              styles.recommendationTag,
              { 
                backgroundColor: item.recommendation.toLowerCase() === 'recommended' 
                  ? COLORS.success + '30'
                  : item.recommendation.toLowerCase() === 'avoid'
                  ? COLORS.error + '30'
                  : COLORS.warning + '30'
              }
            ]}>
              <Text style={[
                styles.recommendationText,
                { 
                  color: item.recommendation.toLowerCase() === 'recommended' 
                    ? COLORS.success
                    : item.recommendation.toLowerCase() === 'avoid'
                    ? COLORS.error
                    : COLORS.warning
                }
              ]}>
                {item.recommendation.toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={styles.instructions}>
            <Text style={styles.instructionsText}>{item.instructions}</Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderAppointments = () => (
    <View style={styles.tabContent}>
      {treatment.appointments.map((appointment) => (
        <View key={appointment.id} style={styles.appointmentCard}>
          <View style={styles.appointmentHeader}>
            <Text style={styles.appointmentType}>{appointment.type}</Text>
            <View style={[
              styles.statusTag,
              { backgroundColor: COLORS.primary + '30' }
            ]}>
              <Text style={[
                styles.statusText,
                { color: COLORS.primary }
              ]}>
                {appointment.status.toUpperCase()}
              </Text>
            </View>
          </View>
          
          <View style={styles.appointmentDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date & Time:</Text>
              <Text style={styles.detailValue}>{appointment.date} at {appointment.time}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Provider:</Text>
              <Text style={styles.detailValue}>{appointment.provider}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Location:</Text>
              <Text style={styles.detailValue}>{appointment.location}</Text>
            </View>
          </View>

          {appointment.notes && (
            <View style={styles.instructions}>
              <Text style={styles.instructionsLabel}>Notes:</Text>
              <Text style={styles.instructionsText}>{appointment.notes}</Text>
            </View>
          )}

          <View style={styles.appointmentActions}>
            <TouchableOpacity 
              style={styles.appointmentButton}
              onPress={() => navigation.navigate('Appointment', { appointmentId: appointment.id })}
            >
              <Text style={styles.appointmentButtonText}>View Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'medications':
        return renderMedications();
      case 'activities':
        return renderActivities();
      case 'diet':
        return renderDiet();
      case 'appointments':
        return renderAppointments();
      default:
        return renderMedications();
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error || !treatment) {
    return (
      <View style={styles.errorContainer}>
        <Feather name="alert-circle" size={50} color={COLORS.error} />
        <Text style={styles.errorText}>{error || 'Treatment plan not found'}</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backIconButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Treatment Plan</Text>
        <TouchableOpacity 
          style={styles.shareButton}
          onPress={() => {}}
        >
          <Feather name="share-2" size={22} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.treatmentHeader}>
        <Text style={styles.treatmentTitle}>{treatment.diagnosisTitle}</Text>
        <View style={styles.treatmentDates}>
          <Text style={styles.treatmentDateText}>
            {treatment.startDate} - {treatment.endDate}
          </Text>
          <View style={[
            styles.statusTag,
            { backgroundColor: treatment.status === 'active' ? COLORS.success + '30' : COLORS.muted + '30' }
          ]}>
            <Text style={[
              styles.statusText,
              { color: treatment.status === 'active' ? COLORS.success : COLORS.muted }
            ]}>
              {treatment.status.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.tabBar}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabBarContent}
        >
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'medications' && styles.activeTab]}
            onPress={() => setActiveTab('medications')}
          >
            <Text 
              style={[styles.tabText, activeTab === 'medications' && styles.activeTabText]}
            >
              Medications
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'activities' && styles.activeTab]}
            onPress={() => setActiveTab('activities')}
          >
            <Text 
              style={[styles.tabText, activeTab === 'activities' && styles.activeTabText]}
            >
              Activities
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'diet' && styles.activeTab]}
            onPress={() => setActiveTab('diet')}
          >
            <Text 
              style={[styles.tabText, activeTab === 'diet' && styles.activeTabText]}
            >
              Diet
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'appointments' && styles.activeTab]}
            onPress={() => setActiveTab('appointments')}
          >
            <Text 
              style={[styles.tabText, activeTab === 'appointments' && styles.activeTabText]}
            >
              Appointments
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderActiveTabContent()}
      </ScrollView>
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
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  backIconButton: {
    padding: SPACING.xs,
  },
  shareButton: {
    padding: SPACING.xs,
  },
  treatmentHeader: {
    backgroundColor: COLORS.card,
    padding: SPACING.lg,
    paddingTop: 0,
  },
  treatmentTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  treatmentDates: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  treatmentDateText: {
    fontSize: 14,
    color: COLORS.muted,
  },
  statusTag: {
    paddingVertical: 4,
    paddingHorizontal: SPACING.sm,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  tabBar: {
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tabBarContent: {
    paddingHorizontal: SPACING.lg,
  },
  tab: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    marginRight: SPACING.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.muted,
  },
  activeTabText: {
    color: COLORS.primary,
  },
  scrollContainer: {
    flex: 1,
  },
  tabContent: {
    padding: SPACING.lg,
  },
  medicationCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  medicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  medicationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  recommendationTag: {
    paddingVertical: 4,
    paddingHorizontal: SPACING.sm,
    borderRadius: 16,
  },
  recommendationText: {
    fontSize: 12,
    fontWeight: '500',
  },
  medicationDetails: {
    marginBottom: SPACING.md,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    width: 90,
  },
  detailValue: {
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
  },
  instructions: {
    marginBottom: SPACING.md,
  },
  instructionsLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 4,
  },
  instructionsText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  scheduleList: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: SPACING.sm,
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border + '50',
    marginBottom: SPACING.xs,
  },
  scheduleDateTime: {
    flexDirection: 'column',
  },
  scheduleDate: {
    fontSize: 12,
    color: COLORS.muted,
  },
  scheduleTime: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
  scheduleTakenButton: {
    paddingVertical: 6,
    paddingHorizontal: SPACING.sm,
    borderRadius: 16,
  },
  takenButton: {
    backgroundColor: COLORS.success + '20',
  },
  notTakenButton: {
    backgroundColor: COLORS.primary + '20',
  },
  scheduleTakenText: {
    fontSize: 12,
    fontWeight: '500',
  },
  takenText: {
    color: COLORS.success,
  },
  notTakenText: {
    color: COLORS.primary,
  },
  activityCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  activityType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  dietCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dietHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  dietType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  appointmentCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  appointmentType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  appointmentDetails: {
    marginBottom: SPACING.md,
  },
  appointmentActions: {
    marginTop: SPACING.sm,
  },
  appointmentButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  appointmentButtonText: {
    color: COLORS.card,
    fontSize: 14,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  errorText: {
    fontSize: 18,
    color: COLORS.text,
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: 8,
  },
  backButtonText: {
    color: COLORS.card,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default TreatmentScreen; 