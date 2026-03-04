import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { usePatient } from '../../context/PatientContext';
import { useTheme } from '../../theme/ThemeContext';
import ToothItem from '../../components/ToothItem';
import AnimatedBottomSheet from '../../components/AnimatedBottomSheet';
import CustomInput from '../../components/CustomInput';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton';

const UPPER_JAW = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
const LOWER_JAW = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

export default function DentalEvaluationTab({ photo }) {
    const { theme } = useTheme();
    const { selectedPatient, dentalRecords, saveDentalRecord } = usePatient();

    const [selectedTooth, setSelectedTooth] = useState(null);
    const [isSheetVisible, setIsSheetVisible] = useState(false);
    const [diagnosis, setDiagnosis] = useState('');
    const [note, setNote] = useState('');

    const patientRecords = dentalRecords[selectedPatient?.id] || {};

    const handleToothPress = (number) => {
        setSelectedTooth(number);
        const existing = patientRecords[number];
        setDiagnosis(existing?.diagnosis || '');
        setNote(existing?.note || '');
        setIsSheetVisible(true);
    };

    const handleSave = () => {
        saveDentalRecord(selectedPatient.id, selectedTooth, diagnosis, note);
        setIsSheetVisible(false);
    };

    const renderToothSection = (title, teeth) => (
        <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary, ...theme.typography.caption }]}>
                {title}
            </Text>
            <View style={styles.toothGrid}>
                {teeth.map((num) => (
                    <ToothItem
                        key={num}
                        number={num}
                        isSelected={selectedTooth === num}
                        diagnosis={patientRecords[num]?.diagnosis}
                        onPress={() => handleToothPress(num)}
                    />
                ))}
            </View>
        </View>
    );

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <Animated.View entering={FadeIn} style={styles.container}>
                <View style={[styles.card, { backgroundColor: theme.colors.card, ...theme.shadows.light }]}>
                    <Text style={[styles.mainTitle, { color: theme.colors.text, ...theme.typography.h3 }]}>
                        Dental Muayene: {photo?.label || 'Genel Görünüm'}
                    </Text>

                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: photo?.uri || 'https://img.freepik.com/free-photo/human-jaw-model-with-teeth_23-2149129596.jpg' }}
                            style={styles.dentalImage}
                        />
                        <View style={[styles.imageOverlay, { backgroundColor: theme.colors.primary + '10' }]} />
                    </View>

                    {renderToothSection('ÜST ÇENE (Upper)', UPPER_JAW)}

                    <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

                    {renderToothSection('ALT ÇENE (Lower)', LOWER_JAW)}
                </View>

                <AnimatedBottomSheet
                    isVisible={isSheetVisible}
                    onClose={() => setIsSheetVisible(false)}
                    height={550}
                >
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sheetContent}>
                        <Text style={[styles.sheetTitle, { color: theme.colors.text, ...theme.typography.h2 }]}>
                            Diş #{selectedTooth} Değerlendirmesi
                        </Text>

                        <CustomInput
                            label="Tanı (Çürük, Dolgu, vb.)"
                            value={diagnosis}
                            onChangeText={setDiagnosis}
                        />

                        <CustomInput
                            label="Notlar"
                            value={note}
                            onChangeText={setNote}
                            multiline
                        />

                        <View style={styles.sheetButtons}>
                            <SecondaryButton
                                title="Kapat"
                                onPress={() => setIsSheetVisible(false)}
                                style={{ flex: 1, marginRight: 8 }}
                            />
                            <PrimaryButton
                                title="Kaydet"
                                onPress={handleSave}
                                style={{ flex: 1, marginLeft: 8 }}
                            />
                        </View>
                    </ScrollView>
                </AnimatedBottomSheet>
            </Animated.View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: 32,
    },
    card: {
        padding: 16,
        borderRadius: 20,
    },
    mainTitle: {
        marginBottom: 20,
        fontWeight: '700',
    },
    imageContainer: {
        height: 180,
        width: '100%',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 24,
        position: 'relative',
    },
    dentalImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        marginBottom: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    toothGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    divider: {
        height: 1,
        width: '100%',
        marginVertical: 12,
        opacity: 0.5,
    },
    sheetTitle: {
        marginBottom: 20,
        textAlign: 'center',
    },
    sheetButtons: {
        flexDirection: 'row',
        marginTop: 24,
        marginBottom: 32,
    },
    sheetContent: {
        paddingBottom: 40,
    }
});
