import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import Screen from '../components/Screen';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { COLORS, SPACING } from '../theme/global';
import { symptomService } from '../api/apiService';

const SymptomCheckerScreen = () => {
  const navigation = useNavigation();
  const [step, setStep] = useState('initial'); // initial, symptom-selection, additional-info, results
  const [isLoading, setIsLoading] = useState(false);
  const [predefinedSymptoms, setPredefinedSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSymptoms, setFilteredSymptoms] = useState([]);
  const [additionalInfo, setAdditionalInfo] = useState({
    age: '',
    gender: '',
    preExistingConditions: [],
    duration: '',
    severity: '',
  });
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPredefinedSymptoms();
  }, []);

  useEffect(() => {
    if (predefinedSymptoms.length > 0 && searchQuery) {
      const filtered = predefinedSymptoms.filter(symptom => 
        symptom.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSymptoms(filtered);
    } else {
      setFilteredSymptoms(predefinedSymptoms);
    }
  }, [searchQuery, predefinedSymptoms]);

  const fetchPredefinedSymptoms = async () => {
    setIsLoading(true);
    try {
      const response = await symptomService.getPredefinedSymptoms();
      setPredefinedSymptoms(response.data);
      setFilteredSymptoms(response.data);
    } catch (error) {
      console.error('Failed to fetch symptoms', error);
      setError('Unable to load symptoms. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSymptomSelect = (symptom) => {
    // Check if already selected
    const isAlreadySelected = selectedSymptoms.some(s => s.id === symptom.id);
    
    if (isAlreadySelected) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s.id !== symptom.id));
    } else {
      setSelectedSymptoms([...selectedSymptoms, { 
        ...symptom, 
        severity: 5, // Default severity
      }]);
    }
  };

  const updateSymptomSeverity = (symptomId, severity) => {
    setSelectedSymptoms(selectedSymptoms.map(s => 
      s.id === symptomId ? { ...s, severity } : s
    ));
  };

  const handleUpdateAdditionalInfo = (key, value) => {
    setAdditionalInfo({
      ...additionalInfo,
      [key]: value,
    });
  };

  const handleSubmitSymptoms = () => {
    if (selectedSymptoms.length === 0) {
      setError('Please select at least one symptom');
      return;
    }
    setError(null);
    setStep('additional-info');
  };

  const handleSubmitCheck = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const checkData = {
        symptom_ids: selectedSymptoms.map(s => s.id),
        additional_info: {
          ...additionalInfo,
          severity: selectedSymptoms.map(s => ({
            symptom_id: s.id,
            severity: s.severity
          }))
        },
      };
      console.log('checkData', checkData);
      const response = await symptomService.createSymptomCheck(checkData);
      setResults(response.data);
      setStep('results');
    } catch (error) {
      console.error('Failed to submit symptom check', error);
      setError('Unable to process your symptoms. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigateToDiagnosis = (diagnosisId) => {
    navigation.navigate('Diagnosis', { id: diagnosisId });
  };

  // Render initial screen with active symptoms and option to add new ones
  const renderInitialScreen = () => (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Symptom Checker</Text>
      <Text style={styles.screenSubtitle}>
        Check your symptoms and discover possible conditions.
      </Text>
      
      <Button
        title="Check New Symptoms"
        onPress={() => setStep('symptom-selection')}
        style={styles.startButton}
        icon={<Feather name="plus" size={18} color="white" style={{marginRight: 8}} />}
      />
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <>
          {/* Placeholder for user's active symptoms */}
          <Card title="Your Active Symptoms" style={styles.card}>
            <Text style={styles.placeholderText}>
              Your currently tracked symptoms will appear here.
            </Text>
            <Button
              title="View Symptom History"
              variant="outline"
              style={styles.secondaryButton}
              onPress={() => {}}
            />
          </Card>
          
          {/* Placeholder for recent check results */}
          <Card title="Recent Check Results" style={styles.card}>
            <Text style={styles.placeholderText}>
              Your most recent symptom check results will appear here.
            </Text>
          </Card>
        </>
      )}
    </View>
  );

  // Render symptom selection screen
  const renderSymptomSelection = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setStep('initial')}
        >
          <Feather name="arrow-left" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Symptoms</Text>
        <View style={{width: 24}} />
      </View>
      
      <Input
        placeholder="Search symptoms..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        leftIcon={<Feather name="search" size={20} color={COLORS.muted} />}
        containerStyle={styles.searchInput}
      />
      
      {selectedSymptoms.length > 0 && (
        <View style={styles.selectedContainer}>
          <Text style={styles.selectedTitle}>Selected Symptoms:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {selectedSymptoms.map(symptom => (
              <TouchableOpacity
                key={symptom.id}
                style={styles.selectedChip}
                onPress={() => handleSymptomSelect(symptom)}
              >
                <Text style={styles.selectedChipText}>{symptom.name}</Text>
                <Feather name="x" size={16} color={COLORS.primary} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredSymptoms}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.symptomItem,
                selectedSymptoms.some(s => s.id === item.id) && styles.symptomItemSelected
              ]}
              onPress={() => handleSymptomSelect(item)}
            >
              <View style={styles.symptomInfo}>
                <Text style={styles.symptomName}>{item.name}</Text>
                {item.body_part && (
                  <Text style={styles.symptomBodyPart}>{item.body_part}</Text>
                )}
              </View>
              {selectedSymptoms.some(s => s.id === item.id) && (
                <Feather name="check" size={20} color={COLORS.primary} />
              )}
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {searchQuery ? 'No symptoms found for your search' : 'No symptoms available'}
            </Text>
          }
          contentContainerStyle={styles.symptomsList}
        />
      )}
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
      
      <View style={styles.footer}>
        <Button
          title="Continue"
          onPress={handleSubmitSymptoms}
          disabled={selectedSymptoms.length === 0}
          style={styles.continueButton}
        />
      </View>
    </View>
  );

  // Render additional info collection screen
  const renderAdditionalInfo = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setStep('symptom-selection')}
        >
          <Feather name="arrow-left" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Additional Details</Text>
        <View style={{width: 24}} />
      </View>
      
      <Text style={styles.infoText}>
        Provide more details to get more accurate results
      </Text>
      
      <ScrollView style={styles.scrollView}>
        {/* This is just a placeholder for the real form */}
        <Card title="Symptom Severity" style={styles.card}>
          {selectedSymptoms.map(symptom => (
            <View key={symptom.id} style={styles.severityContainer}>
              <Text style={styles.severityLabel}>{symptom.name}</Text>
              <View style={styles.severityButtons}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(value => (
                  <TouchableOpacity
                    key={value}
                    style={[
                      styles.severityButton,
                      symptom.severity === value && styles.severityButtonSelected,
                      {
                        backgroundColor: 
                          value > 7 ? 'rgba(239, 68, 68, 0.2)' : 
                          value > 4 ? 'rgba(251, 191, 36, 0.2)' : 
                          'rgba(16, 185, 129, 0.2)'
                      }
                    ]}
                    onPress={() => updateSymptomSeverity(symptom.id, value)}
                  >
                    <Text 
                      style={[
                        styles.severityButtonText,
                        symptom.severity === value && styles.severityButtonTextSelected
                      ]}
                    >
                      {value}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </Card>
        
        <Card title="Personal Information" style={styles.card}>
          {/* Age */}
          <Input
            label="Age"
            value={additionalInfo.age}
            onChangeText={(value) => handleUpdateAdditionalInfo('age', value)}
            keyboardType="number-pad"
            placeholder="Your age"
            containerStyle={styles.inputContainer}
          />
          
          {/* Gender */}
          <Text style={styles.inputLabel}>Gender</Text>
          <View style={styles.radioContainer}>
            {['Male', 'Female', 'Other'].map((gender) => (
              <TouchableOpacity
                key={gender}
                style={[
                  styles.radioButton,
                  additionalInfo.gender === gender.toLowerCase() && styles.radioButtonSelected
                ]}
                onPress={() => handleUpdateAdditionalInfo('gender', gender.toLowerCase())}
              >
                <Text 
                  style={[
                    styles.radioButtonText,
                    additionalInfo.gender === gender.toLowerCase() && styles.radioButtonTextSelected
                  ]}
                >
                  {gender}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>
      </ScrollView>
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
      
      <View style={styles.footer}>
        <Button
          title="Check Symptoms"
          onPress={handleSubmitCheck}
          loading={isLoading}
          style={styles.continueButton}
        />
      </View>
    </View>
  );

  // Render results screen
  const renderResults = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setStep('initial')}
        >
          <Feather name="arrow-left" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Results</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => {}}
        >
          <Feather name="share" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView}>
        {/* Displaying the results - this is a placeholder */}
        <Card 
          title="AI Analysis" 
          style={styles.card}
        >
          <Text style={styles.analysisText}>
            {results?.ai_analysis || "Based on your symptoms, here's what might be happening..."}
          </Text>
        </Card>
        
        <Card 
          title="Possible Conditions" 
          style={styles.card}
        >
          {results?.possible_conditions ? (
            Object.entries(results.possible_conditions).map(([condition, data], index) => (
              <View key={index} style={styles.conditionItem}>
                <View style={styles.conditionInfo}>
                  <Text style={styles.conditionName}>{condition}</Text>
                  <Text style={styles.conditionConfidence}>
                    {/* Confidence: high  */}
                    {typeof data === 'number' 
                      ? `${Math.round(data)}% match` 
                      : typeof data === 'object' && data.match_percentage
                      ? `${Math.round(data.match_percentage)}% match`
                      : 'Unknown confidence'
                    }
                  </Text>
                </View>
                <View 
                  style={[
                    styles.confidenceBar, 
                    { 
                      width: `${typeof data === 'number' 
                        ? data 
                        : typeof data === 'object' && data.match_percentage
                        ? data.match_percentage
                        : 50}%`,
                      backgroundColor: 
                        (typeof data === 'number' && data > 70) || 
                        (typeof data === 'object' && data.match_percentage > 70) 
                          ? COLORS.error :
                        (typeof data === 'number' && data > 40) || 
                        (typeof data === 'object' && data.match_percentage > 40)
                          ? COLORS.warning :
                        COLORS.success
                    }
                  ]} 
                />
                {typeof data === 'object' && data.description && (
                  <Text style={styles.conditionDescription}>{data.description}</Text>
                )}
              </View>
            ))
          ) : (
            <Text style={styles.placeholderText}>
              Potential conditions based on your symptoms will be shown here.
            </Text>
          )}
        </Card>
        
        <Card 
          title="Recommendations" 
          style={styles.card}
        >
          <Text style={styles.recommendationsText}>
            {results?.recommendations || "Here are some steps you can take..."}
          </Text>
          
          <View style={styles.actionsContainer}>
            <Button 
              title="Save as Diagnosis" 
              onPress={() => {}}
              style={styles.actionButton}
            />
            <Button 
              title="Consult a Doctor" 
              variant="outline"
              onPress={() => navigation.navigate('Doctors')}
              style={styles.actionButton}
            />
          </View>
        </Card>
        
        {results?.emergency_level && (
          <Card 
            title="Emergency Alert" 
            variant="error"
            style={styles.card}
          >
            <Text style={styles.emergencyText}>
              Your symptoms suggest a potentially serious condition that requires immediate medical attention.
            </Text>
            <Button 
              title="Call Emergency Services" 
              variant="danger"
              onPress={() => {}}
              style={styles.emergencyButton}
            />
          </Card>
        )}
      </ScrollView>
    </View>
  );

  // Render the current step
  const renderContent = () => {
    switch (step) {
      case 'initial':
        return renderInitialScreen();
      case 'symptom-selection':
        return renderSymptomSelection();
      case 'additional-info':
        return renderAdditionalInfo();
      case 'results':
        return renderResults();
      default:
        return renderInitialScreen();
    }
  };

  return (
    <Screen 
      scroll={false}
      keyboardAvoid={step !== 'symptom-selection'}
      statusBarColor={COLORS.background}
      statusBarStyle="dark-content"
    >
      <StatusBar style="dark" />
      {renderContent()}
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: SPACING.xs,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
    marginTop: SPACING.md,
    marginHorizontal: SPACING.md,
  },
  screenSubtitle: {
    fontSize: 16,
    color: COLORS.muted,
    marginBottom: SPACING.lg,
    marginHorizontal: SPACING.md,
  },
  startButton: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
  },
  card: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  secondaryButton: {
    marginTop: SPACING.md,
  },
  placeholderText: {
    color: COLORS.muted,
    textAlign: 'center',
    marginVertical: SPACING.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  selectedContainer: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  selectedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  selectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedChipText: {
    color: COLORS.primary,
    marginRight: 4,
  },
  symptomsList: {
    paddingHorizontal: SPACING.md,
    paddingBottom: 100,
  },
  symptomItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.card,
    borderRadius: 8,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  symptomItemSelected: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}10`,
  },
  symptomInfo: {
    flex: 1,
  },
  symptomName: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
  symptomBodyPart: {
    fontSize: 14,
    color: COLORS.muted,
    marginTop: 2,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.muted,
    marginTop: SPACING.lg,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.card,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  continueButton: {
    width: '100%',
  },
  errorText: {
    color: COLORS.error,
    textAlign: 'center',
    marginVertical: SPACING.sm,
  },
  scrollView: {
    flex: 1,
  },
  infoText: {
    fontSize: 16,
    color: COLORS.text,
    marginVertical: SPACING.md,
    marginHorizontal: SPACING.md,
  },
  severityContainer: {
    marginBottom: SPACING.md,
  },
  severityLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  severityButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  severityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  severityButtonSelected: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  severityButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  severityButtonTextSelected: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: SPACING.md,
  },
  inputLabel: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 6,
    fontWeight: '500',
  },
  radioContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  radioButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
  },
  radioButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  radioButtonText: {
    color: COLORS.text,
    fontWeight: '500',
  },
  radioButtonTextSelected: {
    color: 'white',
  },
  analysisText: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.text,
  },
  conditionItem: {
    marginBottom: SPACING.md,
  },
  conditionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  conditionName: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
  conditionConfidence: {
    fontSize: 14,
    color: COLORS.muted,
  },
  confidenceBar: {
    height: 6,
    borderRadius: 3,
  },
  recommendationsText: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  emergencyText: {
    fontSize: 16,
    lineHeight: 24,
    color: 'white',
    marginBottom: SPACING.md,
  },
  emergencyButton: {
    backgroundColor: 'white',
  },
  conditionDescription: {
    fontSize: 14,
    color: COLORS.muted,
    marginTop: 4,
    lineHeight: 20,
  },
});

export default SymptomCheckerScreen; 