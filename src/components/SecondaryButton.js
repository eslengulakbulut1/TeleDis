import React from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeContext';
import * as Haptics from 'expo-haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function SecondaryButton({ title, onPress, disabled = false, style }) {
    const { theme } = useTheme();
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }]
        };
    });

    const handlePressIn = () => {
        if (disabled) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        scale.value = withSpring(0.97, { stiffness: 400, damping: 10 });
    };

    const handlePressOut = () => {
        if (disabled) return;
        scale.value = withSpring(1);
    };

    const handlePress = (e) => {
        if (disabled) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        if (onPress) onPress(e);
    };

    return (
        <AnimatedPressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handlePress}
            disabled={disabled}
            style={[
                styles.button,
                {
                    backgroundColor: 'transparent',
                    borderColor: disabled ? theme.colors.border : theme.colors.primary,
                    borderWidth: 1,
                    borderRadius: theme.borderRadius.xl,
                },
                animatedStyle,
                style
            ]}
        >
            <Text style={[styles.text, { color: disabled ? theme.colors.textSecondary : theme.colors.primary, ...theme.typography.body1, fontWeight: 'bold' }]}>
                {title}
            </Text>
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
