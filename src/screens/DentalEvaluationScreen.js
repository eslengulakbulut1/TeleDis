import React from 'react';
import { View, Text, Button } from 'react-native';

export default function DentalEvaluationScreen({ navigation }) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Dental Evaluation Screen</Text>
            <Button title="Back" onPress={() => navigation.goBack()} />
        </View>
    );
}
