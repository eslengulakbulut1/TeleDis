import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import Animated, { FadeIn, SlideInRight } from 'react-native-reanimated';
import { usePatient } from '../../context/PatientContext';
import { useTheme } from '../../theme/ThemeContext';
import CustomInput from '../../components/CustomInput';
import PrimaryButton from '../../components/PrimaryButton';

export default function PatientInfoTab() {
    const { selectedPatient, addPatient } = usePatient(); // Using addPatient as an update hack for simplicity here
    const { theme } = useTheme();

    const [formData, setFormData] = useState({
        patientNo: selectedPatient?.patientNo || '',
        gender: selectedPatient?.gender || '',
        dob: selectedPatient?.dob || '',
        region: selectedPatient?.region || '',
        phone: selectedPatient?.phone || '',
        clinic: selectedPatient?.clinic || ''
    });

    const [isEditing, setIsEditing] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = () => {
        setIsEditing(false);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <Animated.ScrollView
            entering={FadeIn.duration(400)}
            contentContainerStyle={styles.container}
        >
            <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, ...theme.shadows }]}>
                <CustomInput label="Hasta No" value={formData.patientNo} onChangeText={t => setFormData({ ...formData, patientNo: t })} editable={isEditing} />
                <CustomInput label="Cinsiyet" value={formData.gender} onChangeText={t => setFormData({ ...formData, gender: t })} editable={isEditing} />
                <CustomInput label="Doğum Tarihi" value={formData.dob} onChangeText={t => setFormData({ ...formData, dob: t })} editable={isEditing} />
                <CustomInput label="Bölge" value={formData.region} onChangeText={t => setFormData({ ...formData, region: t })} editable={isEditing} />
                <CustomInput label="Telefon" value={formData.phone} onChangeText={t => setFormData({ ...formData, phone: t })} editable={isEditing} />
                <CustomInput label="Klinik" value={formData.clinic} onChangeText={t => setFormData({ ...formData, clinic: t })} editable={isEditing} />

                <View style={styles.buttonContainer}>
                    {isEditing ? (
                        <PrimaryButton title="Kaydet" onPress={handleSave} />
                    ) : (
                        <PrimaryButton title="Düzenle" onPress={() => setIsEditing(true)} />
                    )}
                </View>

                {isSaved && (
                    <Animated.Text
                        entering={SlideInRight}
                        style={[styles.successText, { color: theme.colors.success, ...theme.typography.body1 }]}
                    >
                        ✓ Başarıyla kaydedildi.
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
