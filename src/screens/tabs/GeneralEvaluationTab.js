import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import Animated, { FadeIn, SlideInRight } from 'react-native-reanimated';
import { usePatient } from '../../context/PatientContext';
import { useTheme } from '../../theme/ThemeContext';
import SectionCard from '../../components/SectionCard';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton';

export default function GeneralEvaluationTab({ photo }) {
    const { theme } = useTheme();
    const { selectedPatient, generalEvaluation, saveGeneralEvaluation } = usePatient();

    const patientEval = generalEvaluation[selectedPatient?.id] || {
        gingival: 'Kanama Yok',
        periodontal: 'Hafif Plak',
        hygieneScore: 70
    };

    const [formData, setFormData] = useState(patientEval);
    const [isSaved, setIsSaved] = useState(false);

    const gingivalOptions = ['Kanama Yok', 'Hafif', 'Orta', 'Şiddetli'];
    const periodontalOptions = ['Hafif Plak', 'Orta', 'İleri'];

    const handleSave = () => {
        saveGeneralEvaluation(selectedPatient.id, formData);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <Animated.ScrollView
            entering={FadeIn.duration(400)}
            contentContainerStyle={styles.container}
        >
            <View style={[styles.card, { backgroundColor: theme.colors.card, ...theme.shadows.light }]}>
                <Text style={[styles.mainTitle, { color: theme.colors.text, ...theme.typography.h3 }]}>
                    Genel Muayene: {photo?.label || 'Genel Görünüm'}
                </Text>

                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: photo?.uri || 'https://img.freepik.com/free-photo/dentist-working-patient-dentist-office_23-2149129598.jpg' }}
                        style={styles.contextImage}
                    />
                </View>
            </View>

            <SectionCard title="Diş Eti Muayenesi" index={0}>
                <View style={styles.optionContainer}>
                    {gingivalOptions.map((opt) => (
                        <PressableOption
                            key={opt}
                            label={opt}
                            selected={formData.gingival === opt}
                            onPress={() => setFormData({ ...formData, gingival: opt })}
                        />
                    ))}
                </View>
            </SectionCard>

            <SectionCard title="Periodontal Muayene" index={1}>
                <View style={styles.optionContainer}>
                    {periodontalOptions.map((opt) => (
                        <PressableOption
                            key={opt}
                            label={opt}
                            selected={formData.periodontal === opt}
                            onPress={() => setFormData({ ...formData, periodontal: opt })}
                        />
                    ))}
                </View>
            </SectionCard>

            <SectionCard title="Ağız Hijyen Skoru" index={2}>
                <View style={styles.sliderContainer}>
                    <Text style={[styles.scoreText, { color: theme.colors.primary, ...theme.typography.h1 }]}>
                        %{formData.hygieneScore}
                    </Text>
                    <Text style={{ color: theme.colors.textSecondary, ...theme.typography.body2, textAlign: 'center' }}>
                        Genel hijyen puanı
                    </Text>
                    {/* A real slider would be implemented here, using a simple button for demo */}
                    <View style={styles.sliderButtons}>
                        <SecondaryButton title="-" onPress={() => setFormData({ ...formData, hygieneScore: Math.max(0, formData.hygieneScore - 10) })} style={styles.smallBtn} />
                        <SecondaryButton title="+" onPress={() => setFormData({ ...formData, hygieneScore: Math.min(100, formData.hygieneScore + 10) })} style={styles.smallBtn} />
                    </View>
                </View>
            </SectionCard>

            <View style={styles.buttonContainer}>
                <PrimaryButton title="Genel Değerlendirmeyi Kaydet" onPress={handleSave} />
            </View>

            {isSaved && (
                <Animated.Text
                    entering={SlideInRight}
                    style={[styles.successText, { color: theme.colors.success, ...theme.typography.body1 }]}
                >
                    ✓ Başarıyla kaydedildi.
                </Animated.Text>
            )}
        </Animated.ScrollView>
    );
}

function PressableOption({ label, selected, onPress }) {
    const { theme } = useTheme();
    return (
        <View style={styles.optionWrapper}>
            <SecondaryButton
                title={label}
                onPress={onPress}
                style={[
                    styles.optionBtn,
                    selected && { backgroundColor: theme.colors.primary + '10', borderColor: theme.colors.primary }
                ]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: 40,
    },
    card: {
        padding: 16,
        borderRadius: 20,
        marginBottom: 16,
    },
    mainTitle: {
        marginBottom: 16,
        fontWeight: 'bold',
    },
    imageContainer: {
        height: 150,
        width: '100%',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 8,
    },
    contextImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    section: {
        marginBottom: 20,
    },
    optionContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -4,
    },
    optionWrapper: {
        width: '50%',
        padding: 4,
    },
    optionBtn: {
        paddingVertical: 12,
        height: 50,
    },
    sliderContainer: {
        alignItems: 'center',
        paddingVertical: 16,
    },
    scoreText: {
        fontWeight: 'bold',
    },
    sliderButtons: {
        flexDirection: 'row',
        marginTop: 16,
    },
    smallBtn: {
        width: 60,
        marginHorizontal: 8,
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
