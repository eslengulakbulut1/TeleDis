import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import * as Haptics from 'expo-haptics';

export default function HeaderBar({ title, onBack, onMenu, onThemeToggle }) {
    const { theme, isDark } = useTheme();
    const insets = useSafeAreaInsets();

    return (
        <View style={[
            styles.container,
            {
                paddingTop: insets.top,
                backgroundColor: theme.colors.card,
                borderBottomColor: theme.colors.border,
            }
        ]}>
            <View style={styles.content}>
                {onBack ? (
                    <Pressable onPress={() => { Haptics.selectionAsync(); onBack(); }} style={styles.iconButton}>
                        <Text style={{ color: theme.colors.primary, fontSize: 24 }}>{'<'}</Text>
                    </Pressable>
                ) : onMenu ? (
                    <Pressable onPress={() => { Haptics.selectionAsync(); onMenu(); }} style={styles.iconButton}>
                        <Text style={{ color: theme.colors.primary, fontSize: 24 }}>{'≡'}</Text>
                    </Pressable>
                ) : (
                    <View style={styles.iconSpacer} />
                )}

                <Text style={[styles.title, { color: theme.colors.text, ...theme.typography.h2 }]}>
                    {title}
                </Text>

                {onThemeToggle ? (
                    <Pressable onPress={() => { Haptics.selectionAsync(); onThemeToggle(); }} style={styles.iconButton}>
                        <Text style={{ color: theme.colors.primary, fontSize: 20 }}>{isDark ? '☀️' : '🌙'}</Text>
                    </Pressable>
                ) : (
                    <View style={styles.iconSpacer} />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 1,
    },
    content: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    title: {
        flex: 1,
        textAlign: 'center',
    },
    iconButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconSpacer: {
        width: 40,
    }
});
