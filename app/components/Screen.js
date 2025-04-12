import React from 'react';
import { 
  View, 
  StyleSheet, 
  StatusBar, 
  SafeAreaView, 
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { COLORS } from '../theme/global';

const Screen = ({
  children,
  style,
  scroll = true,
  keyboardAvoid = true,
  backgroundColor = COLORS.background,
  statusBarColor = COLORS.primary,
  statusBarStyle = 'light-content',
  edges = ['right', 'left', 'top'],
  contentContainerStyle,
  scrollViewProps,
}) => {
  const renderContent = () => {
    if (scroll) {
      return (
        <ScrollView
          style={[styles.scrollView, { backgroundColor }]}
          contentContainerStyle={[
            styles.scrollViewContent,
            contentContainerStyle,
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          {...scrollViewProps}
        >
          {children}
        </ScrollView>
      );
    }

    return (
      <View style={[styles.innerContainer, { backgroundColor }, style]}>
        {children}
      </View>
    );
  };

  const renderWithKeyboardAvoid = (content) => {
    if (keyboardAvoid) {
      return (
        <KeyboardAvoidingView
          style={styles.keyboardAvoid}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
          {content}
        </KeyboardAvoidingView>
      );
    }

    return content;
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor }]}
      edges={edges}
    >
      <StatusBar
        backgroundColor={statusBarColor}
        barStyle={statusBarStyle}
        translucent={false}
      />
      {renderWithKeyboardAvoid(renderContent())}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    padding: 16,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 16,
  },
});

export default Screen; 