import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from './src/theme/ThemeContext';
import { PatientProvider } from './src/context/PatientContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <ThemeProvider>
      <PatientProvider>
        <AppNavigator />
        <StatusBar style="auto" />
      </PatientProvider>
    </ThemeProvider>
  );
}
