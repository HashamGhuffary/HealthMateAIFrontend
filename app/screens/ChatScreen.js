import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { useNavigation } from '@react-navigation/native';

import Screen from '../components/Screen';
import { COLORS, SPACING } from '../theme/global';
import { chatService } from '../api/apiService';

const ChatScreen = () => {
  const navigation = useNavigation();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [speaking, setSpeaking] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    setIsLoading(true);
    try {
      const response = await chatService.getChatHistory();
      if (response && Array.isArray(response)) {
        const conversationsFromHistory = response.map(log => [
          { 
            id: `${log.id}-user`, 
            text: log.message, 
            isUser: true, 
            timestamp: new Date(log.timestamp) 
          },
          { 
            id: `${log.id}-ai`, 
            text: log.response, 
            isUser: false, 
            timestamp: new Date(log.timestamp) 
          }
        ]).flat();
        
        setConversations(conversationsFromHistory);
      } else {
        setConversations([{
          id: 'welcome',
          text: "Hello! I'm your HealthMate AI assistant. How can I help you today?",
          isUser: false,
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error('Failed to load chat history', error);
      setConversations([{
        id: 'welcome',
        text: "Hello! I'm your HealthMate AI assistant. How can I help you today?",
        isUser: false,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!message.trim()) return;
    
    const userMessage = {
      id: `user-${Date.now()}`,
      text: message,
      isUser: true,
      timestamp: new Date()
    };
    
    setConversations(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);
    
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
    
    try {
      const response = await chatService.sendMessage(message);
      const aiMessage = {
        id: `ai-${Date.now()}`,
        text: response.reply,
        isUser: false,
        timestamp: new Date()
      };

      setConversations(prev => [...prev, aiMessage]);
      
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Failed to send message', error);
      
      const errorMessage = {
        id: `error-${Date.now()}`,
        text: "Sorry, I couldn't process your request. Please try again.",
        isUser: false,
        isError: true,
        timestamp: new Date()
      };
      
      setConversations(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoice = async (text) => {
    if (speaking) {
      Speech.stop();
      setSpeaking(false);
      return;
    }
    
    try {
      setSpeaking(true);
      await Speech.speak(text, {
        language: 'en',
        rate: 0.9,
        onDone: () => setSpeaking(false),
        onError: () => setSpeaking(false),
      });
    } catch (error) {
      console.error('Speech error', error);
      setSpeaking(false);
    }
  };

  const navigateToSymptomChecker = () => {
    navigation.navigate('SymptomChecker');
  };

  const renderMessage = ({ item }) => {
    return (
      <View style={[
        styles.messageContainer,
        item.isUser ? styles.userMessageContainer : styles.aiMessageContainer,
        item.isError && styles.errorMessageContainer
      ]}>
        {!item.isUser && (
          <View style={styles.avatarContainer}>
            {item.isError ? (
              <View style={styles.errorAvatar}>
                <Feather name="alert-circle" size={16} color="white" />
              </View>
            ) : (
              <Image
                source={require('../../assets/adaptive-icon.png')}
                style={styles.avatarImage}
              />
            )}
          </View>
        )}
        
        <View style={[
          styles.messageBubble,
          item.isUser ? styles.userMessageBubble : styles.aiMessageBubble,
          item.isError && styles.errorMessageBubble
        ]}>
          <Text style={[
            styles.messageText,
            item.isUser ? styles.userMessageText : styles.aiMessageText,
            item.isError && styles.errorMessageText
          ]}>
            {item.text}
          </Text>
          
          {!item.isUser && !item.isError && (
            <TouchableOpacity 
              style={styles.speakButton}
              onPress={() => handleVoice(item.text)}
            >
              <Feather 
                name={speaking ? "volume-x" : "volume-2"} 
                size={16} 
                color={COLORS.primary} 
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderSuggestions = () => (
    <View style={styles.suggestionsContainer}>
      <Text style={styles.suggestionsTitle}>Try asking about:</Text>
      <View style={styles.suggestionBubblesContainer}>
        <TouchableOpacity 
          style={styles.suggestionBubble}
          onPress={() => setMessage('What should I do for a sore throat?')}
        >
          <Text style={styles.suggestionText}>Sore throat remedies</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.suggestionBubble}
          onPress={() => setMessage('How do I lower my blood pressure naturally?')}
        >
          <Text style={styles.suggestionText}>Lower blood pressure</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.suggestionBubble}
          onPress={() => setMessage('What are the symptoms of anxiety?')}
        >
          <Text style={styles.suggestionText}>Anxiety symptoms</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.suggestionBubble}
          onPress={navigateToSymptomChecker}
        >
          <Feather name="activity" size={14} color={COLORS.primary} />
          <Text style={styles.suggestionText}>Symptom checker</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Screen
      scroll={false}
      keyboardAvoid={false}
      style={styles.screen}
      statusBarColor={COLORS.background}
      statusBarStyle="dark-content"
    >
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>HealthMate AI</Text>
        <TouchableOpacity 
          style={styles.symptomButton}
          onPress={navigateToSymptomChecker}
        >
          <Feather name="activity" size={20} color={COLORS.primary} />
          <Text style={styles.symptomButtonText}>Check Symptoms</Text>
        </TouchableOpacity>
      </View>

      {isLoading && conversations.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading your conversation...</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={conversations}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => {
            flatListRef.current?.scrollToEnd({ animated: false });
          }}
          onLayout={() => {
            flatListRef.current?.scrollToEnd({ animated: false });
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Image
                source={require('../../assets/adaptive-icon.png')}
                style={styles.emptyImage}
              />
              <Text style={styles.emptyTitle}>Ask me anything about health</Text>
              <Text style={styles.emptySubtitle}>
                I can help with medical questions, symptoms, and health advice.
              </Text>
              {renderSuggestions()}
            </View>
          }
          ListFooterComponent={
            conversations.length > 0 ? renderSuggestions() : null
          }
        />
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type your health question..."
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={300}
          />
          
          <TouchableOpacity
            style={[
              styles.sendButton,
              !message.trim() && styles.disabledSendButton
            ]}
            onPress={handleSend}
            disabled={!message.trim() || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Feather name="send" size={20} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  symptomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  symptomButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: 16,
    color: COLORS.text,
  },
  messagesContainer: {
    flexGrow: 1,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xl,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
    maxWidth: '85%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  aiMessageContainer: {
    alignSelf: 'flex-start',
  },
  errorMessageContainer: {
    alignSelf: 'flex-start',
  },
  avatarContainer: {
    marginRight: 8,
    alignSelf: 'flex-end',
  },
  avatarImage: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  errorAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageBubble: {
    padding: SPACING.md,
    borderRadius: 18,
    maxWidth: '100%',
  },
  userMessageBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  aiMessageBubble: {
    backgroundColor: COLORS.card,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  errorMessageBubble: {
    backgroundColor: '#FEECEC',
    borderColor: COLORS.error,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: 'white',
  },
  aiMessageText: {
    color: COLORS.text,
  },
  errorMessageText: {
    color: COLORS.error,
  },
  speakButton: {
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: SPACING.md,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingRight: 40,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  disabledSendButton: {
    backgroundColor: COLORS.muted,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xxl,
  },
  emptyImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: COLORS.muted,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  suggestionsContainer: {
    width: '100%',
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.muted,
    marginBottom: SPACING.sm,
  },
  suggestionBubblesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  suggestionBubble: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  suggestionText: {
    fontSize: 14,
    color: COLORS.primary,
    marginLeft: 4,
  },
});

export default ChatScreen; 