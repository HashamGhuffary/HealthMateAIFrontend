import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SPACING } from '../theme/global';

const DiagnosisScreen = ({ route, navigation }) => {
  const { diagnosisId } = route.params || {};
  const [diagnosis, setDiagnosis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // In a real app, this would fetch from an API
    const fetchDiagnosis = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockDiagnosis = {
          id: diagnosisId || '1',
          title: 'Upper Respiratory Infection',
          date: '2023-10-10',
          doctor: 'Dr. Sarah Johnson',
          symptoms: [
            { name: 'Cough', severity: 'Moderate', duration: '5 days' },
            { name: 'Sore Throat', severity: 'Severe', duration: '3 days' },
            { name: 'Fever', severity: 'Mild', duration: '2 days' },
            { name: 'Fatigue', severity: 'Moderate', duration: '5 days' },
          ],
          diagnosis: 'Acute upper respiratory infection, likely viral in origin.',
          recommendations: [
            'Rest and hydration',
            'Over-the-counter pain relievers for symptom management',
            'Throat lozenges for sore throat',
            'Humidifier to ease congestion',
            'Follow up if symptoms worsen or do not improve within 7 days'
          ],
          medications: [
            { name: 'Acetaminophen', dosage: '500mg', frequency: 'Every 6 hours as needed' },
            { name: 'Dextromethorphan', dosage: '30mg', frequency: 'Every 6-8 hours as needed for cough' }
          ],
          nextSteps: [
            { type: 'Follow-up', date: '2023-10-17', description: 'Virtual follow-up if symptoms persist' },
            { type: 'Test', date: 'If symptoms worsen', description: 'Strep test may be needed if throat pain increases' }
          ],
          notes: 'Patient advised to monitor temperature and stay hydrated. Discussed warning signs that would require immediate follow-up.',
        };
        
        setDiagnosis(mockDiagnosis);
      } catch (err) {
        setError('Failed to load diagnosis information. Please try again.');
        console.error('Error fetching diagnosis:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDiagnosis();
  }, [diagnosisId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error || !diagnosis) {
    return (
      <View style={styles.errorContainer}>
        <Feather name="alert-circle" size={50} color={COLORS.error} />
        <Text style={styles.errorText}>{error || 'Diagnosis not found'}</Text>
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
        <Text style={styles.headerTitle}>Diagnosis</Text>
        <TouchableOpacity 
          style={styles.shareButton}
          onPress={() => {}}
        >
          <Feather name="share-2" size={22} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.diagnosisHeader}>
          <Text style={styles.diagnosisTitle}>{diagnosis.title}</Text>
          <View style={styles.diagnosisInfo}>
            <View style={styles.infoItem}>
              <Feather name="calendar" size={16} color={COLORS.muted} />
              <Text style={styles.infoText}>{diagnosis.date}</Text>
            </View>
            <View style={styles.infoItem}>
              <Feather name="user" size={16} color={COLORS.muted} />
              <Text style={styles.infoText}>{diagnosis.doctor}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Symptoms</Text>
          {diagnosis.symptoms.map((symptom, index) => (
            <View key={index} style={styles.symptomItem}>
              <View style={styles.symptomHeader}>
                <Text style={styles.symptomName}>{symptom.name}</Text>
                <View style={[
                  styles.severityTag, 
                  { backgroundColor: getSeverityColor(symptom.severity) }
                ]}>
                  <Text style={styles.severityText}>{symptom.severity}</Text>
                </View>
              </View>
              <Text style={styles.symptomDuration}>Duration: {symptom.duration}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Diagnosis</Text>
          <Text style={styles.diagnosisText}>{diagnosis.diagnosis}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommendations</Text>
          {diagnosis.recommendations.map((recommendation, index) => (
            <View key={index} style={styles.recommendationItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.recommendationText}>{recommendation}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medications</Text>
          {diagnosis.medications.map((medication, index) => (
            <View key={index} style={styles.medicationItem}>
              <Text style={styles.medicationName}>{medication.name}</Text>
              <Text style={styles.medicationDosage}>Dosage: {medication.dosage}</Text>
              <Text style={styles.medicationFrequency}>Frequency: {medication.frequency}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Next Steps</Text>
          {diagnosis.nextSteps.map((step, index) => (
            <View key={index} style={styles.nextStepItem}>
              <View style={styles.nextStepHeader}>
                <Text style={styles.nextStepType}>{step.type}</Text>
                <Text style={styles.nextStepDate}>{step.date}</Text>
              </View>
              <Text style={styles.nextStepDescription}>{step.description}</Text>
            </View>
          ))}
        </View>

        {diagnosis.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Notes</Text>
            <Text style={styles.notesText}>{diagnosis.notes}</Text>
          </View>
        )}

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Treatment', { diagnosisId: diagnosis.id })}
          >
            <Text style={styles.primaryButtonText}>View Treatment Plan</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Appointment', { reason: diagnosis.title })}
          >
            <Text style={styles.secondaryButtonText}>Schedule Follow-Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

// Helper function to get color based on severity
const getSeverityColor = (severity) => {
  switch (severity.toLowerCase()) {
    case 'mild':
      return COLORS.info + '80'; // 50% opacity
    case 'moderate':
      return COLORS.warning + '80'; // 50% opacity
    case 'severe':
      return COLORS.error + '80'; // 50% opacity
    default:
      return COLORS.muted + '80'; // 50% opacity
  }
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
  scrollContainer: {
    flex: 1,
  },
  diagnosisHeader: {
    backgroundColor: COLORS.card,
    padding: SPACING.lg,
    paddingTop: SPACING.md,
  },
  diagnosisTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  diagnosisInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.lg,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.muted,
    marginLeft: SPACING.xs,
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
  symptomItem: {
    marginBottom: SPACING.md,
  },
  symptomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  symptomName: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
  severityTag: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.text,
  },
  symptomDuration: {
    fontSize: 14,
    color: COLORS.muted,
  },
  diagnosisText: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.text,
  },
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: SPACING.xs,
  },
  bulletPoint: {
    fontSize: 16,
    marginRight: SPACING.xs,
    color: COLORS.text,
  },
  recommendationText: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.text,
    flex: 1,
  },
  medicationItem: {
    marginBottom: SPACING.md,
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: 8,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 4,
  },
  medicationDosage: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 2,
  },
  medicationFrequency: {
    fontSize: 14,
    color: COLORS.text,
  },
  nextStepItem: {
    marginBottom: SPACING.md,
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: 8,
  },
  nextStepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  nextStepType: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
  nextStepDate: {
    fontSize: 14,
    color: COLORS.muted,
  },
  nextStepDescription: {
    fontSize: 14,
    color: COLORS.text,
  },
  notesText: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.text,
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'column',
    marginVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  primaryButtonText: {
    color: COLORS.card,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: COLORS.card,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  secondaryButtonText: {
    color: COLORS.primary,
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

export default DiagnosisScreen; 