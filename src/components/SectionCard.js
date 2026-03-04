import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withDelay,
    withTiming
} from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeContext';

export default function SectionCard({ title, children, index = 0, style }) {
    const { theme } = useTheme();

    // Enter animation
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(20);

    useEffect(() => {
        opacity.value = withDelay(index * 100, withTiming(1, { duration: 400 }));
        translateY.value = withDelay(index * 100, withSpring(0, { damping: 12 }));
    }, [index, opacity, translateY]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
            transform: [{ translateY: translateY.value }]
        };
    });

    return (
        <Animated.View style={[
            styles.card,
            {
                backgroundColor: theme.colors.card,
                borderRadius: theme.borderRadius.l,
                borderColor: theme.colors.border,
                ...theme.shadows,
            },
            animatedStyle,
            style
        ]}>
            {title && (
                <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
                    <Text style={[styles.title, { color: theme.colors.text, ...theme.typography.h3 }]}>
                        {title}
                    </Text>
                </View>
            )}
            <View style={styles.content}>
                {children}
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    card: {
        marginVertical: 8,
        borderWidth: 1,
        overflow: 'hidden',
    },
    header: {
        padding: 16,
        borderBottomWidth: 1,
    },
    title: {
        // handled by theme
    },
    content: {
        padding: 16,
    }
});
