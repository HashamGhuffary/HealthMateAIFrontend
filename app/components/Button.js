import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS, SHADOWS } from '../theme/global';

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon = null,
  style,
  textStyle,
  ...props
}) => {
  // Determine button style based on variant
  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: disabled ? COLORS.muted : COLORS.primary,
          ...SHADOWS.small,
        };
      case 'secondary':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: disabled ? COLORS.muted : COLORS.primary,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: disabled ? COLORS.muted : COLORS.border,
        };
      case 'text':
        return {
          backgroundColor: 'transparent',
        };
      case 'success':
        return {
          backgroundColor: disabled ? COLORS.muted : COLORS.success,
          ...SHADOWS.small,
        };
      case 'danger':
        return {
          backgroundColor: disabled ? COLORS.muted : COLORS.error,
          ...SHADOWS.small,
        };
      default:
        return {
          backgroundColor: disabled ? COLORS.muted : COLORS.primary,
          ...SHADOWS.small,
        };
    }
  };

  // Determine text color based on variant
  const getTextColor = () => {
    switch (variant) {
      case 'primary':
      case 'success':
      case 'danger':
        return COLORS.card;
      case 'secondary':
      case 'outline':
        return disabled ? COLORS.muted : COLORS.text;
      case 'text':
        return disabled ? COLORS.muted : COLORS.primary;
      default:
        return COLORS.card;
    }
  };

  // Determine button size
  const getButtonSize = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderRadius: 6,
        };
      case 'medium':
        return {
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: 8,
        };
      case 'large':
        return {
          paddingVertical: 16,
          paddingHorizontal: 32,
          borderRadius: 10,
        };
      default:
        return {
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: 8,
        };
    }
  };

  // Determine text size
  const getTextSize = () => {
    switch (size) {
      case 'small':
        return {
          fontSize: 14,
        };
      case 'medium':
        return {
          fontSize: 16,
        };
      case 'large':
        return {
          fontSize: 18,
        };
      default:
        return {
          fontSize: 16,
        };
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.button,
        getButtonStyle(),
        getButtonSize(),
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={getTextColor()} 
        />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.text,
              getTextSize(),
              { color: getTextColor() },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default Button; 