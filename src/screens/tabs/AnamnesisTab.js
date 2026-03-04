import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeIn, SlideInRight } from 'react-native-reanimated';
import { usePatient } from '../../context/PatientContext';
import { useTheme } from '../../theme/ThemeContext';
import CustomInput from '../../components/CustomInput';
import PrimaryButton from '../../components/PrimaryButton';

export default function AnamnesisTab() {
    const { selectedPatient, anamnesis, saveAnamnesis } = usePatient();
    const { theme } = useTheme();

    const patientAnamnesis = anamnesis[selectedPatient?.id] || {};

    const [formData, setFormData] = useState({
        systemicDisease: patientAnamnesis.systemicDisease || '',
        allergy: patientAnamnesis.allergy || '',
        medication: patientAnamnesis.medication || '',
        complaint: patientAnamnesis.complaint || ''
    });

    const [isSaved, setIsSaved] = useState(false);

    const handleSave = () => {
        saveAnamnesis(selectedPatient.id, formData);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <Animated.ScrollView
            entering={FadeIn.duration(400)}
            contentContainerStyle={styles.container}
        >
            <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, ...theme.shadows }]}>
                <CustomInput
                    label="Sistemik Hastalık"
                    value={formData.systemicDisease}
                    onChangeText={t => setFormData({ ...formData, systemicDisease: t })}
                    multiline
                />
                <CustomInput
                    label="Alerji"
                    value={formData.allergy}
                    onChangeText={t => setFormData({ ...formData, allergy: t })}
                    multiline
                />
                <CustomInput
                    label="Sürekli Kullanılan İlaç"
                    value={formData.medication}
                    onChangeText={t => setFormData({ ...formData, medication: t })}
                    multiline
                />
                <CustomInput
                    label="Şikayet"
                    value={formData.complaint}
                    onChangeText={t => setFormData({ ...formData, complaint: t })}
                    multiline
                />

                <View style={styles.buttonContainer}>
                    <PrimaryButton title="Anamnezi Kaydet" onPress={handleSave} />
                </View>

                {isSaved && (
                    <Animated.Text
                        entering={SlideInRight}
                        style={[styles.successText, { color: theme.colors.success, ...theme.typography.body1 }]}
                    >
                        ✓ Anamnez başarıyla kaydedildi.
                    </Animated.Text>
                )}
            </View>
        </Animated.ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: 40,
    },
    card: {
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
    },
    buttonContainer: {
        marginTop: 24,
    },
    successText: {
        textAlign: 'center',
        marginTop: 16,
        fontWeight: 'bold',
    }
});
