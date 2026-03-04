import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
    interpolate
} from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeContext';

export default function SkeletonLoader({ width = '100%', height = 20, style, isCircle = false }) {
    const { theme } = useTheme();
    const animation = useSharedValue(0);

    useEffect(() => {
        animation.value = withRepeat(
            withTiming(1, { duration: 1000 }),
            -1,
            true
        );
    }, [animation]);

    const animatedStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            animation.value,
            [0, 1],
            [0.3, 0.7]
        );

        return { opacity };
    });

    return (
        <Animated.View style={[
            styles.skeleton,
            {
                width,
                height,
                backgroundColor: theme.colors.border,
                borderRadius: isCircle ? height / 2 : theme.borderRadius.s,
            },
            style,
            animatedStyle
        ]} />
    );
}

const styles = StyleSheet.create({
    skeleton: {
        overflow: 'hidden',
        marginVertical: 4,
    }
});
