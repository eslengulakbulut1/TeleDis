import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Animated as RNAnimated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeContext';
import CustomInput from '../components/CustomInput';
import PrimaryButton from '../components/PrimaryButton';

export default function LoginScreen({ setIsAuthenticated }) {
    const { theme } = useTheme();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Hekim Girişi');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        setIsLoading(true);
        // Simulate network request
        setTimeout(async () => {
            try {
                await AsyncStorage.setItem('@userToken', 'dummy_token');
                setIsAuthenticated(true);
            } catch (e) {
                console.error('Login error', e);
            } finally {
                setIsLoading(false);
            }
        }, 1500);
    };

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: theme.colors.background }]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

                <Animated.View
                    entering={FadeInUp.duration(800).springify()}
                    style={styles.headerContainer}
                >
                    <Text style={[styles.title, { color: theme.colors.text, ...theme.typography.h1 }]}>
                        TeleDiş Giriş
                    </Text>
                    <Text style={[styles.subtitle, { color: theme.colors.textSecondary, ...theme.typography.body1 }]}>
                        Yapay Zeka Destekli Dental Değerlendirme
                    </Text>
                </Animated.View>

                <Animated.View
                    entering={FadeInDown.duration(800).delay(200).springify()}
                    style={[styles.formContainer, { backgroundColor: theme.colors.card, ...theme.shadows, borderRadius: theme.borderRadius.xl }]}
                >
                    {/* Typically this would be a dropdown, simplified to input for now */}
                    <CustomInput
                        label="Giriş Tipi"
                        value={role}
                        onChangeText={setRole}
                        style={styles.input}
                    />
                    <CustomInput
                        label="Kullanıcı Adı"
                        value={username}
                        onChangeText={setUsername}
                        style={styles.input}
                    />
                    <CustomInput
                        label="Şifre"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        style={styles.input}
                    />

                    <View style={styles.buttonContainer}>
                        <PrimaryButton
                            title="Giriş Yap"
                            onPress={handleLogin}
                            isLoading={isLoading}
                        />
                    </View>
                </Animated.View>

            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 48,
    },
    title: {
        marginBottom: 8,
    },
    subtitle: {
        textAlign: 'center',
    },
    formContainer: {
        padding: 24,
        width: '100%',
    },
    input: {
        marginBottom: 16,
    },
    buttonContainer: {
        marginTop: 24,
    }
});
