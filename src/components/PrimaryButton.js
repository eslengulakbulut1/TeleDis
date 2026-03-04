import React from 'react';
import { Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeContext';
import * as Haptics from 'expo-haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function PrimaryButton({ title, onPress, isLoading = false, disabled = false, style }) {
    const { theme } = useTheme();
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }]
        };
    });

    const handlePressIn = () => {
        if (disabled || isLoading) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        scale.value = withSpring(0.95, { stiffness: 400, damping: 10 });
    };

    const handlePressOut = () => {
        if (disabled || isLoading) return;
        scale.value = withSpring(1);
    };

    const handlePress = (e) => {
        if (disabled || isLoading) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        if (onPress) onPress(e);
    };

    return (
        <AnimatedPressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handlePress}
            disabled={disabled || isLoading}
            style={[
                styles.button,
                {
                    backgroundColor: disabled ? theme.colors.border : theme.colors.primary,
                    borderRadius: theme.borderRadius.xl,
                    ...theme.shadows,
                },
                animatedStyle,
                style
            ]}
        >
            {isLoading ? (
                <ActivityIndicator color={theme.colors.card} />
            ) : (
                <Text style={[styles.text, { color: theme.colors.card, ...theme.typography.body1, fontWeight: 'bold' }]}>
                    {title}
                </Text>
            )}
        </AnimatedPressable>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        justifyContent: 'center',
        alignItems: 'center',
        height: 56,
    },
    text: {
        textAlign: 'center',
    }
});
