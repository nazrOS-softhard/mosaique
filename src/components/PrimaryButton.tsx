import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius } from '../lib/theme';

export default function PrimaryButton({
  title,
  onPress,
  loading,
  disabled,
  style,
  variant = 'filled',
}: {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  variant?: 'filled' | 'outline';
}) {
  if (variant === 'outline') {
    return (
      <TouchableOpacity
        style={[stylesOutline.button, style]}
        onPress={onPress}
        disabled={disabled || loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.accentPrimary} />
        ) : (
          <Text style={stylesOutline.text}>{title}</Text>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      style={[{ opacity: disabled ? 0.6 : 1 }, style]}
    >
      <LinearGradient
        colors={[colors.accentPrimary, colors.accentSecondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.button}
      >
        {loading ? (
          <ActivityIndicator color={colors.text} />
        ) : (
          <Text style={styles.text}>{title}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: radius.button,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 16,
  },
});

const stylesOutline = StyleSheet.create({
  button: {
    borderRadius: radius.button,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.accentPrimary,
  },
  text: {
    color: colors.accentPrimary,
    fontWeight: '600',
    fontSize: 16,
  },
});
