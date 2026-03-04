import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withSequence,
    withTiming
} from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeContext';
import * as Haptics from 'expo-haptics';

export default function ToothItem({ number, isSelected, diagnosis, onPress }) {
    const { theme } = useTheme();
    const scale = useSharedValue(1);
    const pulseScale = useSharedValue(1);

    useEffect(() => {
        // Pulse animation if diagnosis exists
        if (diagnosis) {
            pulseScale.value = withSequence(
                withTiming(1.3, { duration: 500 }),
                withTiming(1, { duration: 500 })
            );
        }
    }, [diagnosis, pulseScale]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }]
        };
    });

    const pulseAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: pulseScale.value }]
        };
    });

    const handlePressIn = () => {
        scale.value = withSpring(0.9);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1);
    };

    const handlePress = () => {
        Haptics.selectionAsync();
        onPress();
    };

    return (
        <Pressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handlePress}
        >
            <Animated.View style={[
                styles.container,
                {
                    backgroundColor: isSelected ? theme.colors.primary + '15' : theme.colors.card,
                    borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                    borderRadius: theme.borderRadius.m,
                    ...theme.shadows.light
                },
                animatedStyle
            ]}>
                <Image
                    source={require('../../assets/tooth.png')}
                    style={[
                        styles.toothIcon,
                        {
                            tintColor: diagnosis ? theme.colors.error : (isSelected ? theme.colors.primary : theme.colors.textSecondary)
                        }
                    ]}
                />
                <Text style={[styles.text, { color: isSelected ? theme.colors.primary : theme.colors.text, ...theme.typography.caption }]}>
                    {number}
                </Text>
                {diagnosis && (
                    <Animated.View style={[
                        styles.indicator,
                        { backgroundColor: theme.colors.error },
                        pulseAnimatedStyle
                    ]} />
                )}
            </Animated.View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 44,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        margin: 4,
        padding: 4,
    },
    toothIcon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
        marginBottom: 2,
    },
    text: {
        fontWeight: 'bold',
    },
    indicator: {
        position: 'absolute',
        top: 4,
        right: 4,
        width: 8,
        height: 8,
        borderRadius: 4,
    }
});
