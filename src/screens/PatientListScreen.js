import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Image, Pressable } from 'react-native';
import Animated, { FadeIn, SlideInRight } from 'react-native-reanimated';
import { usePatient } from '../context/PatientContext';
import { useTheme } from '../theme/ThemeContext';
import HeaderBar from '../components/HeaderBar';
import CustomInput from '../components/CustomInput';
import AnimatedFAB from '../components/AnimatedFAB';
import AnimatedBottomSheet from '../components/AnimatedBottomSheet';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';

export default function PatientListScreen({ navigation }) {
    const { patients, addPatient, setSelectedPatient } = usePatient();
    const { theme, toggleTheme } = useTheme();

    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [isAddModalVisible, setAddModalVisible] = useState(false);

    const [newPatient, setNewPatient] = useState({ name: '', gender: '', dob: '', phone: '' });

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.patientNo.includes(searchQuery)
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, []);

    const handlePatientPress = (patient) => {
        setSelectedPatient(patient);
        navigation.navigate('PatientDetail');
    };

    const handleSavePatient = () => {
        addPatient(newPatient);
        setAddModalVisible(false);
        setNewPatient({ name: '', gender: '', dob: '', phone: '' });
    };

    const renderItem = ({ item, index }) => (
        <Animated.View entering={SlideInRight.delay(index * 100).springify()}>
            <Pressable
                style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, ...theme.shadows }]}
                onPress={() => handlePatientPress(item)}
            >
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                <View style={styles.cardContent}>
                    <Text style={[styles.name, { color: theme.colors.text, ...theme.typography.h3 }]}>{item.name}</Text>
                    <Text style={{ color: theme.colors.textSecondary, ...theme.typography.body2 }}>No: {item.patientNo} • {item.age}</Text>
                    <Text style={{ color: theme.colors.textSecondary, ...theme.typography.caption, marginTop: 4 }}>Son Ziyaret: {item.lastVisit}</Text>
                </View>
                <Text style={{ color: theme.colors.primary, fontSize: 24 }}>{'›'}</Text>
            </Pressable>
        </Animated.View>
    );

    const renderEmpty = () => (
        <Animated.View entering={FadeIn.delay(300)} style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary, ...theme.typography.h2 }]}>
                Hasta bulunamadı.
            </Text>
            <Text style={{ color: theme.colors.textSecondary, ...theme.typography.body1, textAlign: 'center', marginTop: 8 }}>
                Yeni hasta eklemek için + butonuna tıklayın veya aramayı temizleyin.
            </Text>
        </Animated.View>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <HeaderBar
                title="Hasta Listesi"
                onMenu={() => navigation.toggleDrawer()}
                onThemeToggle={toggleTheme}
            />

            <View style={styles.searchContainer}>
                <CustomInput
                    label="Hasta Ara (İsim veya No)"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <FlatList
                data={filteredPatients}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                ListEmptyComponent={renderEmpty}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
                }
            />

            <AnimatedFAB onPress={() => setAddModalVisible(true)} icon="+" />

            <AnimatedBottomSheet
                isVisible={isAddModalVisible}
                onClose={() => setAddModalVisible(false)}
                height={500}
            >
                <Text style={[{ color: theme.colors.text, ...theme.typography.h2, marginBottom: 16 }]}>Yeni Hasta Ekle</Text>
                <CustomInput label="Ad Soyad" value={newPatient.name} onChangeText={t => setNewPatient({ ...newPatient, name: t })} />
                <CustomInput label="Cinsiyet" value={newPatient.gender} onChangeText={t => setNewPatient({ ...newPatient, gender: t })} />
                <CustomInput label="Doğum Tarihi" value={newPatient.dob} onChangeText={t => setNewPatient({ ...newPatient, dob: t })} />
                <CustomInput label="Telefon" value={newPatient.phone} onChangeText={t => setNewPatient({ ...newPatient, phone: t })} keyboardType="phone-pad" />

                <View style={styles.modalButtons}>
                    <SecondaryButton title="İptal" onPress={() => setAddModalVisible(false)} style={{ flex: 1, marginRight: 8 }} />
                    <PrimaryButton title="Kaydet" onPress={handleSavePatient} style={{ flex: 1, marginLeft: 8 }} />
                </View>
            </AnimatedBottomSheet>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchContainer: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 4,
    },
    listContent: {
        padding: 16,
        paddingBottom: 100,
        flexGrow: 1,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginBottom: 12,
        borderRadius: 16,
        borderWidth: 1,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 16,
    },
    cardContent: {
        flex: 1,
    },
    name: {
        marginBottom: 4,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 60,
    },
    emptyText: {
        marginBottom: 8,
    },
    modalButtons: {
        flexDirection: 'row',
        marginTop: 24,
    }
});
