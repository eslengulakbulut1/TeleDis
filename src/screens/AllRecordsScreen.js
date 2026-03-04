import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Pressable, ScrollView } from 'react-native';
import Animated, { FadeIn, SlideInRight } from 'react-native-reanimated';
import { usePatient } from '../context/PatientContext';
import { useTheme } from '../theme/ThemeContext';
import HeaderBar from '../components/HeaderBar';
import SectionCard from '../components/SectionCard';
import CustomInput from '../components/CustomInput';

export default function AllRecordsScreen({ navigation }) {
    const { patients, anamnesis, generalEvaluation, setSelectedPatient } = usePatient();
    const { theme, toggleTheme } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.patientNo.includes(searchQuery)
    );

    const handlePatientPress = (patient) => {
        setSelectedPatient(patient);
        navigation.navigate('Dashboard', { screen: 'PatientDetail' });
    };

    const renderPatientSummary = ({ item, index }) => {
        const patientAnamnesis = anamnesis[item.id];
        const patientEval = generalEvaluation[item.id];

        const hasAnamnesis = patientAnamnesis && Object.values(patientAnamnesis).some(v => v === true || (typeof v === 'string' && v.length > 0));
        const hasEval = !!patientEval;

        return (
            <Animated.View entering={SlideInRight.delay(index * 100).springify()}>
                <Pressable
                    onPress={() => handlePatientPress(item)}
                    style={[styles.patientCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, ...theme.shadows }]}
                >
                    <View style={styles.patientHeader}>
                        <Image source={{ uri: item.avatar }} style={styles.avatar} />
                        <View style={styles.patientInfo}>
                            <Text style={[styles.name, { color: theme.colors.text, ...theme.typography.h3 }]}>{item.name}</Text>
                            <Text style={{ color: theme.colors.textSecondary, ...theme.typography.caption }}>No: {item.patientNo} • {item.age}</Text>
                        </View>
                        <View style={[styles.badge, { backgroundColor: (hasAnamnesis || hasEval) ? theme.colors.success + '20' : theme.colors.border }]}>
                            <Text style={[styles.badgeText, { color: (hasAnamnesis || hasEval) ? theme.colors.success : theme.colors.textSecondary }]}>
                                {(hasAnamnesis || hasEval) ? 'Kayıt Var' : 'Kayıt Yok'}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.summaryContent}>
                        {hasAnamnesis ? (
                            <View style={styles.summarySection}>
                                <Text style={[styles.summaryLabel, { color: theme.colors.primary }]}>Anamnez Özeti:</Text>
                                <Text style={[styles.summaryText, { color: theme.colors.text }]} numberOfLines={2}>
                                    {Object.entries(patientAnamnesis)
                                        .filter(([k, v]) => v === true)
                                        .map(([k]) => k.charAt(0).toUpperCase() + k.slice(1))
                                        .join(', ') || 'Herhangi bir şikayet belirtilmedi.'}
                                </Text>
                            </View>
                        ) : (
                            <Text style={[styles.noData, { color: theme.colors.textSecondary }]}>Anamnez kaydı bulunmuyor.</Text>
                        )}

                        {hasEval && (
                            <View style={styles.summarySection}>
                                <Text style={[styles.summaryLabel, { color: theme.colors.primary }]}>Genel Muayene:</Text>
                                <Text style={[styles.summaryText, { color: theme.colors.text }]}>
                                    Diş Eti: {patientEval.gingival} • Hijyen: %{patientEval.hygieneScore}
                                </Text>
                            </View>
                        )}
                    </View>
                </Pressable>
            </Animated.View>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <HeaderBar
                title="Tüm Anamnezler"
                onMenu={() => navigation.openDrawer()}
                onThemeToggle={toggleTheme}
            />

            <View style={styles.searchBox}>
                <CustomInput
                    label="Hasta Ara..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <FlatList
                data={filteredPatients}
                keyExtractor={item => item.id}
                renderItem={renderPatientSummary}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={{ color: theme.colors.textSecondary }}>Sonuç bulunamadı.</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchBox: {
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    list: {
        padding: 16,
        paddingBottom: 40,
    },
    patientCard: {
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
    },
    patientHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        marginRight: 12,
    },
    patientInfo: {
        flex: 1,
    },
    name: {
        fontWeight: 'bold',
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    summaryContent: {
        borderTopWidth: 1,
        borderTopColor: '#00000010',
        paddingTop: 12,
    },
    summarySection: {
        marginBottom: 8,
    },
    summaryLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    summaryText: {
        fontSize: 13,
    },
    noData: {
        fontSize: 12,
        fontStyle: 'italic',
    },
    empty: {
        alignItems: 'center',
        marginTop: 50,
    }
});
