import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator, 
  FlatList,
  TextInput,
  Alert,
  Modal,
  ScrollView
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SPACING } from '../theme/global';

const EmergencyContactsScreen = ({ navigation }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    relation: '',
    phone: '',
    email: '',
    isEmergency: true
  });
  const [editingContact, setEditingContact] = useState(null);

  useEffect(() => {
    // In a real app, this would fetch from an API
    const fetchContacts = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockContacts = [
          {
            id: '1',
            name: 'John Smith',
            relation: 'Spouse',
            phone: '(555) 123-4567',
            email: 'john.smith@example.com',
            isEmergency: true
          },
          {
            id: '2',
            name: 'Mary Johnson',
            relation: 'Mother',
            phone: '(555) 987-6543',
            email: 'mary.johnson@example.com',
            isEmergency: true
          },
          {
            id: '3',
            name: 'Dr. Robert Chen',
            relation: 'Primary Doctor',
            phone: '(555) 456-7890',
            email: 'dr.chen@healthcare.com',
            isEmergency: true
          },
          {
            id: '4',
            name: 'Sarah Williams',
            relation: 'Sister',
            phone: '(555) 789-0123',
            email: 'sarah.williams@example.com',
            isEmergency: false
          }
        ];
        
        setContacts(mockContacts);
      } catch (err) {
        setError('Failed to load emergency contacts. Please try again.');
        console.error('Error fetching contacts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const handleDeleteContact = (id) => {
    Alert.alert(
      'Delete Contact',
      'Are you sure you want to delete this contact?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          onPress: () => {
            setContacts(contacts.filter(contact => contact.id !== id));
          },
          style: 'destructive'
        }
      ]
    );
  };

  const handleSaveContact = () => {
    if (!newContact.name.trim() || !newContact.phone.trim()) {
      Alert.alert('Missing Information', 'Please enter at least a name and phone number.');
      return;
    }

    if (editingContact) {
      // Update existing contact
      setContacts(
        contacts.map(contact => 
          contact.id === editingContact.id 
            ? { ...newContact, id: contact.id } 
            : contact
        )
      );
      setEditingContact(null);
    } else {
      // Add new contact
      const newContactItem = {
        ...newContact,
        id: (contacts.length + 1).toString()
      };
      setContacts([...contacts, newContactItem]);
    }

    setModalVisible(false);
    resetContactForm();
  };

  const handleEditContact = (contact) => {
    setNewContact({ ...contact });
    setEditingContact(contact);
    setModalVisible(true);
  };

  const resetContactForm = () => {
    setNewContact({
      name: '',
      relation: '',
      phone: '',
      email: '',
      isEmergency: true
    });
  };

  const toggleEmergencyStatus = (id) => {
    setContacts(
      contacts.map(contact => 
        contact.id === id 
          ? { ...contact, isEmergency: !contact.isEmergency } 
          : contact
      )
    );
  };

  const renderContactItem = ({ item }) => (
    <View style={styles.contactCard}>
      <View style={styles.contactHeader}>
        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{item.name}</Text>
          <Text style={styles.contactRelation}>{item.relation}</Text>
        </View>
        <View style={styles.contactActions}>
          <TouchableOpacity
            style={[
              styles.emergencyTag,
              { backgroundColor: item.isEmergency ? COLORS.error + '20' : COLORS.muted + '20' }
            ]}
            onPress={() => toggleEmergencyStatus(item.id)}
          >
            <Text 
              style={[
                styles.emergencyTagText, 
                { color: item.isEmergency ? COLORS.error : COLORS.muted }
              ]}
            >
              {item.isEmergency ? 'Emergency' : 'Regular'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.contactDetails}>
        <View style={styles.contactDetailItem}>
          <Feather name="phone" size={16} color={COLORS.muted} />
          <Text style={styles.contactDetailText}>{item.phone}</Text>
        </View>
        {item.email && (
          <View style={styles.contactDetailItem}>
            <Feather name="mail" size={16} color={COLORS.muted} />
            <Text style={styles.contactDetailText}>{item.email}</Text>
          </View>
        )}
      </View>

      <View style={styles.contactButtonsRow}>
        <TouchableOpacity 
          style={styles.contactButton}
          onPress={() => handleEditContact(item)}
        >
          <Feather name="edit" size={16} color={COLORS.primary} />
          <Text style={styles.contactButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.contactButton}
          onPress={() => handleDeleteContact(item.id)}
        >
          <Feather name="trash-2" size={16} color={COLORS.error} />
          <Text style={[styles.contactButtonText, { color: COLORS.error }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderAddContactModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingContact ? 'Edit Contact' : 'Add New Contact'}
            </Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => {
                setModalVisible(false);
                setEditingContact(null);
                resetContactForm();
              }}
            >
              <Feather name="x" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Name*</Text>
              <TextInput
                style={styles.formInput}
                value={newContact.name}
                onChangeText={(text) => setNewContact(prev => ({ ...prev, name: text }))}
                placeholder="Contact name"
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Relationship</Text>
              <TextInput
                style={styles.formInput}
                value={newContact.relation}
                onChangeText={(text) => setNewContact(prev => ({ ...prev, relation: text }))}
                placeholder="E.g., Parent, Spouse, Doctor"
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Phone Number*</Text>
              <TextInput
                style={styles.formInput}
                value={newContact.phone}
                onChangeText={(text) => setNewContact(prev => ({ ...prev, phone: text }))}
                placeholder="Phone number"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Email Address</Text>
              <TextInput
                style={styles.formInput}
                value={newContact.email}
                onChangeText={(text) => setNewContact(prev => ({ ...prev, email: text }))}
                placeholder="Email address"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.formField}>
              <View style={styles.checkboxRow}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => setNewContact(prev => ({ ...prev, isEmergency: !prev.isEmergency }))}
                >
                  {newContact.isEmergency && (
                    <Feather name="check" size={16} color={COLORS.card} />
                  )}
                </TouchableOpacity>
                <Text style={styles.checkboxLabel}>
                  Mark as emergency contact
                </Text>
              </View>
              <Text style={styles.checkboxHint}>
                Emergency contacts are easily accessible during emergencies
              </Text>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => {
                setModalVisible(false);
                setEditingContact(null);
                resetContactForm();
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSaveContact}
            >
              <Text style={styles.saveButtonText}>Save Contact</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
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
        <Text style={styles.headerTitle}>Emergency Contacts</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => {
            resetContactForm();
            setModalVisible(true);
          }}
        >
          <Feather name="plus" size={22} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.emergencyCallSection}>
        <TouchableOpacity 
          style={styles.emergencyCallButton}
          onPress={() => {
            Alert.alert(
              'Emergency Call',
              'In a real app, this would initiate an emergency call to 911 or local emergency services.',
              [{ text: 'OK' }]
            );
          }}
        >
          <Feather name="phone" size={22} color={COLORS.card} />
          <Text style={styles.emergencyCallText}>Call Emergency Services (911)</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoSection}>
        <Feather name="info" size={16} color={COLORS.primary} />
        <Text style={styles.infoText}>
          Add important contacts that should be accessible in case of emergency.
        </Text>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={50} color={COLORS.error} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => setLoading(true)}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : contacts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="users" size={50} color={COLORS.muted} />
          <Text style={styles.emptyText}>You haven't added any emergency contacts yet</Text>
          <TouchableOpacity 
            style={styles.addContactButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.addContactButtonText}>Add Your First Contact</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={contacts}
          renderItem={renderContactItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.contactsList}
          showsVerticalScrollIndicator={false}
        />
      )}

      {renderAddContactModal()}
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
  addButton: {
    padding: SPACING.xs,
  },
  emergencyCallSection: {
    padding: SPACING.lg,
    backgroundColor: COLORS.card,
  },
  emergencyCallButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.error,
    paddingVertical: SPACING.md,
    borderRadius: 8,
  },
  emergencyCallText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.card,
    marginLeft: SPACING.sm,
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.primary + '10',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: SPACING.sm,
    flex: 1,
  },
  contactsList: {
    padding: SPACING.lg,
  },
  contactCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  contactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 2,
  },
  contactRelation: {
    fontSize: 14,
    color: COLORS.muted,
  },
  contactActions: {
    alignItems: 'flex-end',
  },
  emergencyTag: {
    paddingVertical: 4,
    paddingHorizontal: SPACING.sm,
    borderRadius: 16,
    marginBottom: SPACING.xs,
  },
  emergencyTagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  contactDetails: {
    marginBottom: SPACING.md,
  },
  contactDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  contactDetailText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },
  contactButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    marginLeft: SPACING.md,
  },
  contactButtonText: {
    fontSize: 14,
    color: COLORS.primary,
    marginLeft: 4,
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
    fontSize: 16,
    color: COLORS.text,
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: 8,
  },
  retryButtonText: {
    color: COLORS.card,
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.muted,
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  addContactButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: 8,
  },
  addContactButtonText: {
    color: COLORS.card,
    fontSize: 14,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  closeButton: {
    padding: SPACING.xs,
  },
  modalBody: {
    padding: SPACING.lg,
    maxHeight: '70%',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  formField: {
    marginBottom: SPACING.lg,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  formInput: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    fontSize: 16,
    color: COLORS.text,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  checkboxLabel: {
    fontSize: 16,
    color: COLORS.text,
  },
  checkboxHint: {
    fontSize: 14,
    color: COLORS.muted,
    marginTop: 4,
    marginLeft: 30,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    marginRight: SPACING.md,
  },
  cancelButtonText: {
    fontSize: 16,
    color: COLORS.text,
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderRadius: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.card,
  },
});

export default EmergencyContactsScreen; 