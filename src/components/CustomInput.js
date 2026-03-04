import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    interpolateColor
} from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeContext';

export default function CustomInput({
    label,
    value,
    onChangeText,
    secureTextEntry,
    keyboardType = 'default',
    style,
    multiline = false
}) {
    const { theme } = useTheme();
    const [isFocused, setIsFocused] = useState(false);

    // Animation values
    const focusAnim = useSharedValue(value ? 1 : 0);
    const colorAnim = useSharedValue(0);

    const handleFocus = () => {
        setIsFocused(true);
        focusAnim.value = withTiming(1, { duration: 200 });
        colorAnim.value = withTiming(1, { duration: 200 });
    };

    const handleBlur = () => {
        setIsFocused(false);
        colorAnim.value = withTiming(0, { duration: 200 });
        if (!value) {
            focusAnim.value = withTiming(0, { duration: 200 });
        }
    };

    const labelAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateY: withTiming(focusAnim.value === 1 ? -24 : 0, { duration: 200 }) },
                { scale: withTiming(focusAnim.value === 1 ? 0.85 : 1, { duration: 200 }) },
            ],
        };
    });

    const borderAnimatedStyle = useAnimatedStyle(() => {
        const borderColor = interpolateColor(
            colorAnim.value,
            [0, 1],
            [theme.colors.border, theme.colors.primary]
        );

        return {
            borderColor,
            borderWidth: colorAnim.value === 1 ? 2 : 1,
        };
    });

    const labelColorStyle = useAnimatedStyle(() => {
        return {
            color: interpolateColor(
                colorAnim.value,
                [0, 1],
                [theme.colors.textSecondary, theme.colors.primary]
            )
        }
    });

    return (
        <View style={[styles.container, style]}>
            <Animated.View style={[
                styles.inputContainer,
                {
                    backgroundColor: theme.colors.inputBackground,
                    borderRadius: theme.borderRadius.m,
                },
                borderAnimatedStyle
            ]}>
                <Animated.Text
                    style={[
                        styles.label,
                        { ...theme.typography.body1, left: theme.spacing.m },
                        labelAnimatedStyle,
                        labelColorStyle
                    ]}
                    pointerEvents="none"
                >
                    {label}
                </Animated.Text>
                <TextInput
                    style={[
                        styles.input,
                        { color: theme.colors.text, ...theme.typography.body1 },
                        multiline && { height: 100, textAlignVertical: 'top' }
                    ]}
                    value={value}
                    onChangeText={onChangeText}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    selectionColor={theme.colors.primary}
                    multiline={multiline}
                />
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
        width: '100%',
    },
    inputContainer: {
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 4,
        minHeight: 60,
    },
    label: {
        position: 'absolute',
        top: 20,
        zIndex: 1,
    },
    input: {
        flex: 1,
        marginTop: 8, // makes room for the floating label
        padding: 0,
    }
});
