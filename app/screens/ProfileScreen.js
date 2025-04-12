import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Switch,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

import Screen from '../components/Screen';
import Card from '../components/Card';
import Button from '../components/Button';
import { COLORS, SPACING } from '../theme/global';
import { authService } from '../api/apiService';
import { AuthContext } from '../contexts/AuthContext';

const ProfileScreen = () => {
  const { user, logout } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.getProfile();
      setProfileData(response.data);
    } catch (error) {
      console.error('Failed to fetch profile', error);
      setError('Unable to load your profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfilePictureChange = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert(
          'Permission Required', 
          'You need to give permission to access your photos',
          [{ text: 'OK' }]
        );
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!pickerResult.canceled) {
        // Here you would typically upload the image to your server
        // and then update the profile with the new image URL
        Alert.alert('Success', 'Profile picture updated successfully');
      }
    } catch (error) {
      console.error('Error updating profile picture', error);
      Alert.alert('Error', 'Failed to update profile picture');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => logout()
        }
      ]
    );
  };

  if (isLoading && !profileData) {
    return (
      <Screen>
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </Screen>
    );
  }

  if (error && !profileData) {
    return (
      <Screen>
        <StatusBar style="dark" />
        <Card
          title="Error"
          variant="error"
          style={styles.errorCard}
        >
          <Text style={styles.errorText}>{error}</Text>
          <Button
            title="Try Again"
            onPress={fetchProfile}
            style={styles.errorButton}
            textColor={COLORS.error}
          />
        </Card>
      </Screen>
    );
  }

  return (
    <Screen>
      <StatusBar style="dark" />
      <ScrollView>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <TouchableOpacity 
            style={styles.profileImageContainer}
            onPress={handleProfilePictureChange}
          >
            {profileData?.profilePicture ? (
              <Image 
                source={{ uri: profileData.profilePicture }} 
                style={styles.profileImage} 
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Feather name="user" size={40} color={COLORS.muted} />
              </View>
            )}
            <View style={styles.editProfileImageButton}>
              <Feather name="camera" size={12} color="white" />
            </View>
          </TouchableOpacity>
          
          <Text style={styles.profileName}>
            {profileData?.fullName || user?.name || 'Your Name'}
          </Text>
          <Text style={styles.profileEmail}>
            {profileData?.email || user?.email || 'email@example.com'}
          </Text>
          
          <Button
            title="Edit Profile"
            variant="outline"
            onPress={() => {}}
            style={styles.editProfileButton}
            icon={<Feather name="edit" size={16} color={COLORS.primary} style={{marginRight: 8}} />}
          />
        </View>
        
        {/* Profile Actions */}
        <Card title="Quick Actions" style={styles.card}>
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('Records')}
            >
              <View style={[styles.actionIcon, { backgroundColor: `${COLORS.primary}15` }]}>
                <Feather name="file-text" size={20} color={COLORS.primary} />
              </View>
              <Text style={styles.actionText}>My Records</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('Doctors')}
            >
              <View style={[styles.actionIcon, { backgroundColor: `${COLORS.warning}15` }]}>
                <Feather name="users" size={20} color={COLORS.warning} />
              </View>
              <Text style={styles.actionText}>Doctors</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('SymptomChecker')}
            >
              <View style={[styles.actionIcon, { backgroundColor: `${COLORS.success}15` }]}>
                <Feather name="activity" size={20} color={COLORS.success} />
              </View>
              <Text style={styles.actionText}>Symptoms</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('Chat')}
            >
              <View style={[styles.actionIcon, { backgroundColor: `${COLORS.info}15` }]}>
                <Feather name="message-circle" size={20} color={COLORS.info} />
              </View>
              <Text style={styles.actionText}>Chat</Text>
            </TouchableOpacity>
          </View>
        </Card>
        
        {/* Account Settings */}
        <Card title="Account" style={styles.card}>
          <TouchableOpacity 
            style={[styles.menuItem, styles.logoutItem]}
            onPress={handleLogout}
          >
            <View style={styles.menuItemContent}>
              <Feather name="log-out" size={18} color={COLORS.error} style={styles.menuItemIcon} />
              <Text style={[styles.menuItemText, { color: COLORS.error }]}>Logout</Text>
            </View>
          </TouchableOpacity>
        </Card>
        
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    color: COLORS.text,
    fontSize: 16,
  },
  errorCard: {
    marginVertical: SPACING.md,
    marginHorizontal: SPACING.md,
  },
  errorText: {
    color: 'white',
    marginBottom: SPACING.md,
  },
  errorButton: {
    backgroundColor: 'white',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: SPACING.md,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  editProfileImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  profileEmail: {
    fontSize: 16,
    color: COLORS.muted,
    marginBottom: SPACING.md,
  },
  editProfileButton: {
    paddingHorizontal: SPACING.lg,
  },
  card: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.card,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingInfo: {
    flex: 1,
    paddingRight: SPACING.md,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: COLORS.muted,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {
    marginRight: SPACING.md,
  },
  menuItemText: {
    fontSize: 16,
    color: COLORS.text,
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  versionText: {
    textAlign: 'center',
    color: COLORS.muted,
    marginVertical: SPACING.md,
  },
});

export default ProfileScreen; 