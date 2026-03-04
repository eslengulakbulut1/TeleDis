import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import PatientStack from './PatientStack';
import AllRecordsScreen from '../screens/AllRecordsScreen';
import { useTheme } from '../theme/ThemeContext';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
    const { theme } = useTheme();

    return (
        <Drawer.Navigator
            screenOptions={{
                headerShown: false,
                drawerStyle: {
                    backgroundColor: theme.colors.card,
                },
                drawerActiveTintColor: theme.colors.primary,
                drawerInactiveTintColor: theme.colors.text,
            }}
        >
            <Drawer.Screen
                name="Dashboard"
                component={PatientStack}
                options={{ title: 'Hasta Listesi' }}
            />
            <Drawer.Screen
                name="AllRecords"
                component={AllRecordsScreen}
                options={{ title: 'Tüm Anamnezler' }}
            />
            {/* Add User Profile or other drawer modules here */}
        </Drawer.Navigator>
    );
}
