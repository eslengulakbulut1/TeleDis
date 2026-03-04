import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthStack from './AuthStack';
import DrawerNavigator from './DrawerNavigator';
import { useTheme } from '../theme/ThemeContext';

export default function AppNavigator() {
    const { theme } = useTheme();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = await AsyncStorage.getItem('@userToken');
                if (token) setIsAuthenticated(true);
            } catch (e) {
                // ignore
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, []);

    if (isLoading) return null; // Or a splash screen

    return (
        <NavigationContainer theme={{
            dark: theme.isDark,
            colors: {
                primary: theme.colors.primary,
                background: theme.colors.background,
                card: theme.colors.card,
                text: theme.colors.text,
                border: theme.colors.border,
                notification: theme.colors.primary,
            },
            fonts: {
                regular: { fontFamily: 'System', fontWeight: '400' },
                medium: { fontFamily: 'System', fontWeight: '500' },
                bold: { fontFamily: 'System', fontWeight: '700' },
                heavy: { fontFamily: 'System', fontWeight: '900' },
            }
        }}>
            {isAuthenticated ? <DrawerNavigator /> : <AuthStack setIsAuthenticated={setIsAuthenticated} />}
        </NavigationContainer>
    );
}
