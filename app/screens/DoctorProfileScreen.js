import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Image
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SPACING } from '../theme/global';

const DoctorProfileScreen = ({ route, navigation }) => {
  const { doctorId } = route.params || {};
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Mock data loading
    const fetchDoctorProfile = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockDoctor = {
          id: doctorId || '1',
          name: 'Dr. Sarah Johnson',
          specialty: 'Cardiology',
          rating: 4.8,
          experience: '15 years',
          image: 'https://randomuser.me/api/portraits/women/32.jpg',
          background: 'Dr. Sarah Johnson is a board-certified cardiologist with 15 years of clinical experience specializing in interventional cardiology and heart failure management.',
          education: [
            { degree: 'MD', institution: 'Harvard Medical School', year: '2008' },
            { degree: 'Residency', institution: 'Massachusetts General Hospital', year: '2012' },
            { degree: 'Fellowship', institution: 'Cleveland Clinic', year: '2014' }
          ],
          availability: {
            Monday: ['9:00 AM - 12:00 PM', '2:00 PM - 5:00 PM'],
            Tuesday: ['9:00 AM - 12:00 PM', '2:00 PM - 5:00 PM'],
            Wednesday: ['9:00 AM - 12:00 PM'],
            Thursday: ['9:00 AM - 12:00 PM', '2:00 PM - 5:00 PM'],
            Friday: ['9:00 AM - 12:00 PM', '2:00 PM - 4:00 PM'],
          },
          address: '123 Medical Center Dr, Suite 456, Boston, MA 02215',
          phone: '(617) 123-4567',
          email: 'dr.johnson@healthmateai.com',
          reviews: [
            { id: '1', user: 'John D.', rating: 5, comment: 'Excellent doctor! Very thorough and caring.', date: '2023-09-15' },
            { id: '2', user: 'Maria S.', rating: 4, comment: 'Very knowledgeable and helped me understand my condition better.', date: '2023-08-22' },
            { id: '3', user: 'Robert L.', rating: 5, comment: 'Dr. Johnson is patient and answers all my questions.', date: '2023-07-30' },
          ]
        };
        
        setDoctor(mockDoctor);
      } catch (error) {
        console.error('Error fetching doctor profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorProfile();
  }, [doctorId]);

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
        <Text style={styles.errorText}>Doctor not found</Text>
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
        <Text style={styles.headerTitle}>Doctor Profile</Text>
        <TouchableOpacity style={styles.favoriteButton}>
          <Feather name="heart" size={22} color={COLORS.muted} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHeader}>
          <Image 
            source={{ uri: doctor.image }} 
            style={styles.doctorImage} 
            defaultSource={require('../../assets/default-avatar.png')}
          />
          <Text style={styles.doctorName}>{doctor.name}</Text>
          <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
          
          <View style={styles.ratingContainer}>
            <Feather name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>{doctor.rating}</Text>
            <Text style={styles.experience}> • {doctor.experience} exp</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.sectionContent}>{doctor.background}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {doctor.education.map((edu, index) => (
            <View key={index} style={styles.educationItem}>
              <Text style={styles.educationDegree}>{edu.degree}</Text>
              <Text style={styles.educationInstitution}>{edu.institution}</Text>
              <Text style={styles.educationYear}>{edu.year}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Working Hours</Text>
          {Object.entries(doctor.availability).map(([day, hours]) => (
            <View key={day} style={styles.availabilityItem}>
              <Text style={styles.availabilityDay}>{day}</Text>
              <View style={styles.availabilityHours}>
                {hours.map((timeSlot, index) => (
                  <Text key={index} style={styles.availabilityTime}>{timeSlot}</Text>
                ))}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.contactItem}>
            <Feather name="map-pin" size={16} color={COLORS.muted} />
            <Text style={styles.contactText}>{doctor.address}</Text>
          </View>
          <View style={styles.contactItem}>
            <Feather name="phone" size={16} color={COLORS.muted} />
            <Text style={styles.contactText}>{doctor.phone}</Text>
          </View>
          <View style={styles.contactItem}>
            <Feather name="mail" size={16} color={COLORS.muted} />
            <Text style={styles.contactText}>{doctor.email}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            <Text style={styles.reviewsCount}>{doctor.reviews.length} reviews</Text>
          </View>
          
          {doctor.reviews.map(review => (
            <View key={review.id} style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewUsername}>{review.user}</Text>
                <View style={styles.reviewRating}>
                  <Feather name="star" size={14} color="#FFD700" />
                  <Text style={styles.reviewRatingText}>{review.rating}</Text>
                </View>
              </View>
              <Text style={styles.reviewComment}>{review.comment}</Text>
              <Text style={styles.reviewDate}>{review.date}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity 
          style={styles.appointmentButton}
          onPress={() => navigation.navigate('Appointment', { doctorId: doctor.id })}
        >
          <Text style={styles.appointmentButtonText}>Book Appointment</Text>
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
  favoriteButton: {
    padding: SPACING.xs,
  },
  scrollContainer: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: COLORS.card,
    alignItems: 'center',
    paddingBottom: SPACING.xl,
  },
  doctorImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: SPACING.md,
  },
  doctorName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  doctorSpecialty: {
    fontSize: 16,
    color: COLORS.muted,
    marginBottom: SPACING.sm,
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
  section: {
    backgroundColor: COLORS.card,
    padding: SPACING.lg,
    marginTop: SPACING.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  sectionContent: {
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.text,
  },
  educationItem: {
    marginBottom: SPACING.md,
  },
  educationDegree: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
  educationInstitution: {
    fontSize: 14,
    color: COLORS.text,
  },
  educationYear: {
    fontSize: 14,
    color: COLORS.muted,
  },
  availabilityItem: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  availabilityDay: {
    width: 90,
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
  availabilityHours: {
    flex: 1,
  },
  availabilityTime: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 4,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  contactText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  reviewsCount: {
    fontSize: 14,
    color: COLORS.muted,
  },
  reviewItem: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  reviewUsername: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewRatingText: {
    fontSize: 14,
    marginLeft: 4,
    color: COLORS.text,
  },
  reviewComment: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  reviewDate: {
    fontSize: 12,
    color: COLORS.muted,
  },
  appointmentButton: {
    backgroundColor: COLORS.primary,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  appointmentButtonText: {
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

export default DoctorProfileScreen; 