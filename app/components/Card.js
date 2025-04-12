import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SHADOWS, SPACING } from '../theme/global';

const Card = ({
  title,
  subtitle,
  children,
  onPress,
  style,
  titleStyle,
  subtitleStyle,
  contentStyle,
  elevation = 'small',
  variant = 'default',
  ...props
}) => {
  const getShadow = () => {
    switch (elevation) {
      case 'none':
        return {};
      case 'small':
        return SHADOWS.small;
      case 'medium':
        return SHADOWS.medium;
      case 'large':
        return SHADOWS.large;
      default:
        return SHADOWS.small;
    }
  };

  const getCardStyle = () => {
    switch (variant) {
      case 'default':
        return {
          backgroundColor: COLORS.card,
          borderColor: COLORS.border,
        };
      case 'primary':
        return {
          backgroundColor: COLORS.primary,
          borderColor: COLORS.primary,
        };
      case 'success':
        return {
          backgroundColor: COLORS.success,
          borderColor: COLORS.success,
        };
      case 'warning':
        return {
          backgroundColor: COLORS.warning,
          borderColor: COLORS.warning,
        };
      case 'error':
        return {
          backgroundColor: COLORS.error,
          borderColor: COLORS.error,
        };
      case 'outline':
        return {
          backgroundColor: COLORS.card,
          borderColor: COLORS.border,
          borderWidth: 1,
        };
      default:
        return {
          backgroundColor: COLORS.card,
          borderColor: COLORS.border,
        };
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary':
      case 'success':
      case 'warning':
      case 'error':
        return COLORS.card;
      default:
        return COLORS.text;
    }
  };

  const SubtitleColor = () => {
    switch (variant) {
      case 'primary':
      case 'success':
      case 'warning':
      case 'error':
        return COLORS.card;
      default:
        return COLORS.muted;
    }
  };

  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <CardComponent
      style={[
        styles.card,
        getShadow(),
        getCardStyle(),
        style,
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      {...props}
    >
      {(title || subtitle) && (
        <View style={styles.header}>
          {title && (
            <Text style={[
              styles.title,
              { color: getTextColor() },
              titleStyle,
            ]}>
              {title}
            </Text>
          )}
          {subtitle && (
            <Text style={[
              styles.subtitle,
              { color: SubtitleColor() },
              subtitleStyle,
            ]}>
              {subtitle}
            </Text>
          )}
        </View>
      )}
      <View style={[styles.content, contentStyle]}>
        {children}
      </View>
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: SPACING.sm,
  },
  header: {
    padding: SPACING.md,
    paddingBottom: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: SPACING.xs,
  },
  content: {
    padding: SPACING.md,
  },
});

export default Card; 