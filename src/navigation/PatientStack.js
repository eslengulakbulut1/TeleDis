import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PatientListScreen from '../screens/PatientListScreen';
import PatientDetailScreen from '../screens/PatientDetailScreen';
import DentalEvaluationScreen from '../screens/DentalEvaluationScreen';

const Stack = createNativeStackNavigator();

export default function PatientStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="PatientList" component={PatientListScreen} />
            <Stack.Screen name="PatientDetail" component={PatientDetailScreen} />
            <Stack.Screen name="DentalEvaluation" component={DentalEvaluationScreen} />
        </Stack.Navigator>
    );
}
