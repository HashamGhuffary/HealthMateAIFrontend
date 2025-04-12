import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  TextInput,
  Alert
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SPACING } from '../theme/global';

const AppointmentScreen = ({ route, navigation }) => {
  const { doctorId } = route.params || {};
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedReason, setSelectedReason] = useState('');
  const [notes, setNotes] = useState('');

  const reasonOptions = [
    'Regular Checkup',
    'Consultation',
    'Follow-up',
    'Urgent Care',
    'Other'
  ];
  
  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockDoctor = {
          id: doctorId || '1',
          name: 'Dr. Sarah Johnson',
          specialty: 'Cardiology',
          image: 'https://randomuser.me/api/portraits/women/32.jpg',
          availableDates: [
            {
              date: '2023-10-20',
              day: 'Monday',
              slots: [
                { time: '09:00 AM', available: true },
                { time: '10:00 AM', available: true },
                { time: '11:00 AM', available: false },
                { time: '02:00 PM', available: true },
                { time: '03:00 PM', available: true },
                { time: '04:00 PM', available: false },
              ]
            },
            {
              date: '2023-10-21',
              day: 'Tuesday',
              slots: [
                { time: '09:00 AM', available: true },
                { time: '10:00 AM', available: false },
                { time: '11:00 AM', available: true },
                { time: '02:00 PM', available: true },
                { time: '03:00 PM', available: false },
                { time: '04:00 PM', available: true },
              ]
            },
            {
              date: '2023-10-22',
              day: 'Wednesday',
              slots: [
                { time: '09:00 AM', available: true },
                { time: '10:00 AM', available: true },
                { time: '11:00 AM', available: true },
              ]
            },
            {
              date: '2023-10-23',
              day: 'Thursday',
              slots: [
                { time: '09:00 AM', available: false },
                { time: '10:00 AM', available: true },
                { time: '11:00 AM', available: true },
                { time: '02:00 PM', available: true },
                { time: '03:00 PM', available: true },
                { time: '04:00 PM', available: true },
              ]
            },
            {
              date: '2023-10-24',
              day: 'Friday',
              slots: [
                { time: '09:00 AM', available: true },
                { time: '10:00 AM', available: true },
                { time: '11:00 AM', available: false },
                { time: '02:00 PM', available: true },
              ]
            },
          ]
        };
        
        setDoctor(mockDoctor);
        // Set default selected date to the first available date
        setSelectedDate(mockDoctor.availableDates[0].date);
      } catch (error) {
        console.error('Error fetching doctor details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorDetails();
  }, [doctorId]);

  const handleBookAppointment = () => {
    if (!selectedDate || !selectedTime || !selectedReason) {
      Alert.alert('Missing Information', 'Please select a date, time, and reason for your appointment.');
      return;
    }

    // In a real app, this would make an API call to book the appointment
    Alert.alert(
      'Appointment Booked',
      `Your appointment with ${doctor.name} has been scheduled for ${selectedDate} at ${selectedTime}.`,
      [
        { 
          text: 'OK', 
          onPress: () => navigation.navigate('Doctors') 
        }
      ]
    );
  };

  const getAvailableTimeSlots = () => {
    if (!selectedDate || !doctor) return [];
    
    const dateInfo = doctor.availableDates.find(d => d.date === selectedDate);
    return dateInfo ? dateInfo.slots : [];
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!doctor) {
    return (
      <View style={styles.errorContainer}>
        <Feather name="alert-circle" size={50} color={COLORS.error} />
        <Text style={styles.errorText}>Doctor information not available</Text>
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
        <Text style={styles.headerTitle}>Book Appointment</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.doctorInfo}>
          <Text style={styles.sectionTitle}>Doctor</Text>
          <View style={styles.doctorCard}>
            <Text style={styles.doctorName}>{doctor.name}</Text>
            <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
          </View>
        </View>

        <View style={styles.dateSection}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dateScrollContent}
          >
            {doctor.availableDates.map((dateInfo) => (
              <TouchableOpacity 
                key={dateInfo.date}
                style={[
                  styles.dateCard,
                  selectedDate === dateInfo.date && styles.selectedDateCard
                ]}
                onPress={() => setSelectedDate(dateInfo.date)}
              >
                <Text 
                  style={[
                    styles.dateDay,
                    selectedDate === dateInfo.date && styles.selectedDateText
                  ]}
                >
                  {dateInfo.day.substring(0, 3)}
                </Text>
                <Text 
                  style={[
                    styles.dateNumber,
                    selectedDate === dateInfo.date && styles.selectedDateText
                  ]}
                >
                  {dateInfo.date.split('-')[2]}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.timeSection}>
          <Text style={styles.sectionTitle}>Select Time</Text>
          <View style={styles.timeGrid}>
            {getAvailableTimeSlots().map((slot, index) => (
              <TouchableOpacity 
                key={index}
                style={[
                  styles.timeCard,
                  selectedTime === slot.time && styles.selectedTimeCard,
                  !slot.available && styles.unavailableTimeCard
                ]}
                disabled={!slot.available}
                onPress={() => setSelectedTime(slot.time)}
              >
                <Text 
                  style={[
                    styles.timeText,
                    selectedTime === slot.time && styles.selectedTimeText,
                    !slot.available && styles.unavailableTimeText
                  ]}
                >
                  {slot.time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.reasonSection}>
          <Text style={styles.sectionTitle}>Reason for Visit</Text>
          <View style={styles.reasonOptions}>
            {reasonOptions.map((reason) => (
              <TouchableOpacity 
                key={reason}
                style={[
                  styles.reasonChip,
                  selectedReason === reason && styles.selectedReasonChip
                ]}
                onPress={() => setSelectedReason(reason)}
              >
                <Text 
                  style={[
                    styles.reasonChipText,
                    selectedReason === reason && styles.selectedReasonChipText
                  ]}
                >
                  {reason}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.notesSection}>
          <Text style={styles.sectionTitle}>Additional Notes</Text>
          <TextInput
            style={styles.notesInput}
            multiline
            numberOfLines={4}
            placeholder="Any specific symptoms or concerns you'd like to mention..."
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        <TouchableOpacity 
          style={styles.bookButton}
          onPress={handleBookAppointment}
        >
          <Text style={styles.bookButtonText}>Book Appointment</Text>
        </TouchableOpacity>
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
  scrollContainer: {
    flex: 1,
  },
  doctorInfo: {
    backgroundColor: COLORS.card,
    padding: SPACING.lg,
  },
  doctorCard: {
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: COLORS.muted,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  dateSection: {
    backgroundColor: COLORS.card,
    padding: SPACING.lg,
    marginTop: SPACING.md,
  },
  dateScrollContent: {
    paddingRight: SPACING.lg,
  },
  dateCard: {
    width: 60,
    height: 80,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    marginRight: SPACING.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  selectedDateCard: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  dateDay: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 4,
  },
  dateNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  selectedDateText: {
    color: COLORS.card,
  },
  timeSection: {
    backgroundColor: COLORS.card,
    padding: SPACING.lg,
    marginTop: SPACING.md,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginRight: -SPACING.md,
  },
  timeCard: {
    width: '31%',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: SPACING.md,
    margin: '1%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  selectedTimeCard: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  unavailableTimeCard: {
    backgroundColor: COLORS.background,
    borderColor: COLORS.border,
    opacity: 0.4,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
  selectedTimeText: {
    color: COLORS.card,
  },
  unavailableTimeText: {
    color: COLORS.muted,
  },
  reasonSection: {
    backgroundColor: COLORS.card,
    padding: SPACING.lg,
    marginTop: SPACING.md,
  },
  reasonOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  reasonChip: {
    backgroundColor: COLORS.background,
    borderRadius: 20,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  selectedReasonChip: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  reasonChipText: {
    fontSize: 14,
    color: COLORS.text,
  },
  selectedReasonChipText: {
    color: COLORS.card,
  },
  notesSection: {
    backgroundColor: COLORS.card,
    padding: SPACING.lg,
    marginTop: SPACING.md,
  },
  notesInput: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    minHeight: 100,
    textAlignVertical: 'top',
    color: COLORS.text,
  },
  bookButton: {
    backgroundColor: COLORS.primary,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  bookButtonText: {
    color: COLORS.card,
    fontSize: 16,
    fontWeight: '600',
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

export default AppointmentScreen; 