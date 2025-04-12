import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Button from '../components/Button';
import { COLORS, SPACING } from '../theme/global';

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/adaptive-icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>HealthMate AI</Text>
        <Text style={styles.subtitle}>Your personal health assistant</Text>
      </View>

      <View style={styles.featureContainer}>
        <FeatureItem 
          title="AI Doctor Chat"
          description="Get instant answers to your health concerns"
          icon="🧠"
        />
        <FeatureItem 
          title="Find Specialists"
          description="Connect with real doctors when you need them"
          icon="👨‍⚕️"
        />
        <FeatureItem 
          title="Secure Records"
          description="Keep your medical history in one place"
          icon="🔒"
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button 
          title="Get Started" 
          onPress={() => navigation.navigate('Onboarding')}
          style={styles.button} 
          size="large"
        />
        <Button 
          title="I already have an account" 
          onPress={() => navigation.navigate('Login')}
          variant="text"
          style={styles.secondaryButton}
        />
      </View>
    </View>
  );
};

const FeatureItem = ({ title, description, icon }) => (
  <View style={styles.featureItem}>
    <Text style={styles.featureIcon}>{icon}</Text>
    <View style={styles.featureTextContainer}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: SPACING.xxl,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.muted,
    textAlign: 'center',
  },
  featureContainer: {
    marginVertical: SPACING.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  featureIcon: {
    fontSize: 32,
    marginRight: SPACING.md,
    width: 40,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: COLORS.muted,
  },
  buttonContainer: {
    marginBottom: SPACING.xl,
  },
  button: {
    marginBottom: SPACING.md,
  },
  secondaryButton: {
    marginBottom: SPACING.md,
  },
});

export default WelcomeScreen; 