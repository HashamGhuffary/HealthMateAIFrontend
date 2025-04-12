import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';

import Screen from '../components/Screen';
import { COLORS, SPACING } from '../theme/global';
import { chatService } from '../api/apiService';

const SymptomsScreen = () => {
  const [symptoms, setSymptoms] = useState([]);
  const [recentChecks, setRecentChecks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingChecks, setIsLoadingChecks] = useState(false);

  useEffect(() => {
    loadSymptomsHistory();
    loadRecentChecks();
  }, []);

  const loadSymptomsHistory = async () => {
    setIsLoading(true);
    try {
      const response = await chatService.getUserSymptoms();
      if (response && Array.isArray(response)) {
        setSymptoms(response);
      } else {
        setSymptoms([]);
      }
    } catch (error) {
      console.error('Failed to load symptoms history', error);
      setSymptoms([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadRecentChecks = async () => {
    setIsLoadingChecks(true);
    try {
      const response = await chatService.getRecentSymptomChecks();
      console.log('Recent checks response:', response); // Debug log
      
      if (response && Array.isArray(response)) {
        // Take only the 3 most recent checks
        const recentChecks = response.slice(0, 3);
        console.log('Processed recent checks:', recentChecks); // Debug log
        setRecentChecks(recentChecks);
      } else {
        console.warn('Invalid response format for recent checks:', response);
        setRecentChecks([]);
      }
    } catch (error) {
      console.error('Failed to load recent checks:', error);
      setRecentChecks([]);
    } finally {
      setIsLoadingChecks(false);
    }
  };

  const renderRecentChecks = () => {
    if (isLoadingChecks) {
      return (
        <View style={styles.checksLoadingContainer}>
          <ActivityIndicator size="small" color={COLORS.primary} />
          <Text style={styles.checksLoadingText}>Loading recent checks...</Text>
        </View>
      );
    }

    if (!recentChecks || recentChecks.length === 0) {
      return (
        <View style={styles.noChecksContainer}>
          <Text style={styles.noChecksText}>No recent symptom checks</Text>
        </View>
      );
    }

    return (
      <View style={styles.recentChecksContainer}>
        <Text style={styles.recentChecksTitle}>Recent Symptom Checks</Text>
        {recentChecks.map((check) => (
          <View key={check.id} style={styles.checkCard}>
            <View style={styles.checkHeader}>
              <Text style={styles.checkDate}>
                {new Date(check.created_at).toLocaleDateString()}
              </Text>
              {check.emergency_level && (
                <View style={styles.emergencyBadge}>
                  <Text style={styles.emergencyText}>Emergency</Text>
                </View>
              )}
            </View>
            <Text style={styles.checkSymptoms}>
              {check.symptoms?.map(s => s.symptom_name).join(', ')}
            </Text>
            {check.ai_analysis && (
              <Text style={styles.checkAnalysis} numberOfLines={2}>
                {check.ai_analysis}
              </Text>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderSymptomsHistory = () => {
    if (isLoading) {
      return (
        <View style={styles.symptomsLoadingContainer}>
          <ActivityIndicator size="small" color={COLORS.primary} />
          <Text style={styles.symptomsLoadingText}>Loading symptoms history...</Text>
        </View>
      );
    }

    if (!symptoms || symptoms.length === 0) {
      return (
        <View style={styles.noSymptomsContainer}>
          <Text style={styles.noSymptomsText}>No symptoms recorded yet</Text>
        </View>
      );
    }

    return (
      <View style={styles.symptomsContainer}>
        <Text style={styles.symptomsTitle}>Your Symptoms History</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {symptoms.map((symptom) => (
            <View key={symptom.id} style={styles.symptomCard}>
              <Text style={styles.symptomName}>{symptom.symptom_name}</Text>
              <View style={styles.severityContainer}>
                <Text style={styles.severityLabel}>Severity:</Text>
                <View style={[styles.severityBar, { width: `${symptom.severity * 10}%` }]} />
                <Text style={styles.severityValue}>{symptom.severity}/10</Text>
              </View>
              <Text style={styles.symptomDate}>
                {new Date(symptom.onset_date).toLocaleDateString()}
                {symptom.resolved_date ? ` - ${new Date(symptom.resolved_date).toLocaleDateString()}` : ' (Active)'}
              </Text>
              {symptom.notes && (
                <Text style={styles.symptomNotes} numberOfLines={2}>{symptom.notes}</Text>
              )}
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <Screen
      scroll={true}
      keyboardAvoid={false}
      style={styles.screen}
      statusBarColor={COLORS.background}
      statusBarStyle="dark-content"
    >
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Symptoms History</Text>
      </View>

      {renderRecentChecks()}
      {renderSymptomsHistory()}
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  recentChecksContainer: {
    padding: SPACING.md,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  recentChecksTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  checkCard: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  checkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  checkDate: {
    fontSize: 14,
    color: COLORS.muted,
  },
  emergencyBadge: {
    backgroundColor: COLORS.error,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 4,
  },
  emergencyText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  checkSymptoms: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  checkAnalysis: {
    fontSize: 12,
    color: COLORS.muted,
    fontStyle: 'italic',
  },
  checksLoadingContainer: {
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checksLoadingText: {
    marginLeft: SPACING.sm,
    color: COLORS.muted,
  },
  noChecksContainer: {
    padding: SPACING.md,
    alignItems: 'center',
  },
  noChecksText: {
    color: COLORS.muted,
    fontStyle: 'italic',
  },
  symptomsContainer: {
    padding: SPACING.md,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  symptomsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  symptomCard: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: SPACING.md,
    marginRight: SPACING.sm,
    width: 200,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  symptomName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  severityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  severityLabel: {
    fontSize: 12,
    color: COLORS.muted,
    marginRight: SPACING.xs,
  },
  severityBar: {
    height: 4,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
    marginRight: SPACING.xs,
  },
  severityValue: {
    fontSize: 12,
    color: COLORS.text,
  },
  symptomDate: {
    fontSize: 12,
    color: COLORS.muted,
    marginBottom: SPACING.xs,
  },
  symptomNotes: {
    fontSize: 12,
    color: COLORS.text,
    fontStyle: 'italic',
  },
  symptomsLoadingContainer: {
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  symptomsLoadingText: {
    marginLeft: SPACING.sm,
    color: COLORS.muted,
  },
  noSymptomsContainer: {
    padding: SPACING.md,
    alignItems: 'center',
  },
  noSymptomsText: {
    color: COLORS.muted,
    fontStyle: 'italic',
  },
});

export default SymptomsScreen; 