import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    ScrollView,
    Pressable,
    Alert,
    ActionSheetIOS,
    TouchableOpacity,
    Platform
} from 'react-native';
import Animated, {
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
    interpolate,
    Extrapolate,
    FadeIn,
    SlideInRight
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { usePatient } from '../context/PatientContext';
import HeaderBar from '../components/HeaderBar';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

// Tabs
import PatientInfoTab from './tabs/PatientInfoTab';
import AnamnesisTab from './tabs/AnamnesisTab';
import DentalEvaluationTab from './tabs/DentalEvaluationTab';
import GeneralEvaluationTab from './tabs/GeneralEvaluationTab';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HEADER_HEIGHT = 350;

export default function PatientDetailScreen({ navigation }) {
    const { theme } = useTheme();
    const { selectedPatient, photos, savePhoto } = usePatient();
    const insets = useSafeAreaInsets();

    const [activeTab, setActiveTab] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const scrollY = useSharedValue(0);

    const patientPhotos = photos[selectedPatient?.id] || [
        { id: 'default', uri: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=1000&auto=format&fit=crop', label: 'Ön Ağız içi' }
    ];

    const tabs = [
        { title: 'Hasta Bilgileri', component: PatientInfoTab },
        { title: 'Anamnez', component: AnamnesisTab },
        { title: 'Dental', component: DentalEvaluationTab },
        { title: 'Genel', component: GeneralEvaluationTab },
    ];

    const scrollHandler = useAnimatedScrollHandler((event) => {
        scrollY.value = event.contentOffset.y;
    });

    const headerAnimatedStyle = useAnimatedStyle(() => {
        const translateY = interpolate(
            scrollY.value,
            [0, HEADER_HEIGHT],
            [0, -HEADER_HEIGHT / 4],
            Extrapolate.CLAMP
        );

        return {
            transform: [{ translateY }],
        };
    });

    const handleAddImage = async () => {
        const pickerOptions = async () => {
            const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();

            if (libraryStatus !== 'granted' || cameraStatus !== 'granted') {
                Alert.alert('İzin Gerekli', 'Kamera ve galeri izinleri verilmeden resim eklenemez.');
                return;
            }

            const promptPicker = (index) => {
                if (index === 0) {
                    ImagePicker.launchImageLibraryAsync({
                        mediaTypes: ImagePicker.MediaTypeOptions.Images,
                        allowsEditing: true,
                        aspect: [4, 3],
                        quality: 1,
                    }).then(processResult).catch(err => console.error('Library Error:', err));
                } else if (index === 1) {
                    ImagePicker.launchCameraAsync({
                        allowsEditing: true,
                        aspect: [4, 3],
                        quality: 1,
                    }).then(processResult).catch(err => console.error('Camera Error:', err));
                }
            };

            const processResult = (result) => {
                if (result && !result.canceled) {
                    Alert.prompt(
                        'Fotoğraf Etiketi',
                        'Bu fotoğraf için bir etiket girin (örn: Alt Okluzal)',
                        [
                            { text: 'İptal', style: 'cancel' },
                            {
                                text: 'Tamam',
                                onPress: (label) => {
                                    const photoData = {
                                        uri: result.assets[0].uri,
                                        label: label || 'Yeni Fotoğraf',
                                        date: new Date().toISOString()
                                    };
                                    savePhoto(selectedPatient.id, photoData);
                                }
                            }
                        ],
                        'plain-text',
                        ''
                    );
                }
            };

            if (Platform.OS === 'ios') {
                ActionSheetIOS.showActionSheetWithOptions(
                    { options: ['Fotoğraf Arşivi', 'Fotoğraf Çek', 'İptal'], cancelButtonIndex: 2 },
                    (btnIdx) => { if (btnIdx !== 2) promptPicker(btnIdx); }
                );
            } else {
                Alert.alert(
                    'Resim Ekle',
                    'Lütfen bir kaynak seçin',
                    [
                        { text: 'Fotoğraf Arşivi', onPress: () => promptPicker(0) },
                        { text: 'Fotoğraf Çek', onPress: () => promptPicker(1) },
                        { text: 'İptal', style: 'cancel' }
                    ]
                );
            }
        };

        pickerOptions().catch(err => console.error('Picker Flow Error:', err));
    };

    const renderEvaluationButtons = () => (
        <Animated.View entering={FadeIn.delay(300)} style={styles.evaluationOverlay}>
            <TouchableOpacity
                style={[styles.evalButton, { backgroundColor: theme.colors.primary }]}
                onPress={() => setActiveTab(2)}
            >
                <Text style={styles.evalButtonText}>DENTAL DEĞERLENDİRME</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.evalButton, { backgroundColor: theme.colors.primary, marginTop: 8 }]}
                onPress={() => setActiveTab(3)}
            >
                <Text style={styles.evalButtonText}>GENEL DEĞERLENDİRME</Text>
            </TouchableOpacity>
        </Animated.View>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <HeaderBar
                title={selectedPatient?.name || 'Hasta Detay'}
                onBack={() => navigation.goBack()}
            />

            <Animated.ScrollView
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                contentContainerStyle={{ paddingTop: HEADER_HEIGHT }}
                stickyHeaderIndices={[1]}
            >
                {/* Parallax Image Carousel Header */}
                <Animated.View style={[styles.header, headerAnimatedStyle]}>
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onMomentumScrollEnd={(e) => {
                            const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
                            setCurrentImageIndex(index);
                        }}
                    >
                        {patientPhotos.map((photo, index) => (
                            <View key={photo.id || index} style={{ width: SCREEN_WIDTH, height: HEADER_HEIGHT }}>
                                <Image
                                    source={{ uri: photo.uri }}
                                    style={styles.image}
                                    resizeMode="cover"
                                />
                                <View style={styles.imageLabelContainer}>
                                    <Text style={styles.imageLabel}>{photo.label}</Text>
                                </View>
                                {renderEvaluationButtons()}
                            </View>
                        ))}
                    </ScrollView>

                    {/* Add Photo Button Overlay */}
                    <TouchableOpacity style={styles.addPhotoButton} onPress={handleAddImage}>
                        <Ionicons name="camera" size={24} color="#FFF" />
                        <Text style={styles.addPhotoText}>Resim Ekle</Text>
                    </TouchableOpacity>

                    {/* Image Indicator Dots */}
                    <View style={styles.pagination}>
                        {patientPhotos.map((_, i) => (
                            <View
                                key={i}
                                style={[
                                    styles.dot,
                                    { backgroundColor: i === currentImageIndex ? theme.colors.primary : '#FFF' }
                                ]}
                            />
                        ))}
                    </View>
                </Animated.View>

                {/* Sticky Tab Selector */}
                <View style={[styles.tabContainer, { backgroundColor: theme.colors.background, borderBottomColor: theme.colors.border }]}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
                        {tabs.map((tab, index) => (
                            <Pressable
                                key={index}
                                onPress={() => setActiveTab(index)}
                                style={[
                                    styles.tab,
                                    activeTab === index && { borderBottomColor: theme.colors.primary, borderBottomWidth: 3 }
                                ]}
                            >
                                <Text style={[
                                    styles.tabText,
                                    { color: activeTab === index ? theme.colors.primary : theme.colors.textSecondary, ...theme.typography.body2, fontWeight: activeTab === index ? 'bold' : 'normal' }
                                ]}>
                                    {tab.title}
                                </Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>

                {/* Tab Content */}
                <View style={styles.content}>
                    {(() => {
                        const TabComponent = tabs[activeTab].component;
                        return TabComponent ? (
                            <TabComponent
                                photo={patientPhotos[currentImageIndex]}
                                navigation={navigation}
                            />
                        ) : null;
                    })()}
                </View>
            </Animated.ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: HEADER_HEIGHT,
        overflow: 'hidden',
    },
    image: {
        width: SCREEN_WIDTH,
        height: HEADER_HEIGHT,
    },
    imageLabelContainer: {
        position: 'absolute',
        bottom: 120,
        left: 0,
        backgroundColor: '#00000080',
        paddingHorizontal: 16,
        paddingVertical: 4,
    },
    imageLabel: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
    },
    evaluationOverlay: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
        alignItems: 'center',
    },
    evalButton: {
        width: '100%',
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    evalButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    addPhotoButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#00000060',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderRadius: 20,
    },
    addPhotoText: {
        color: '#FFF',
        marginLeft: 6,
        fontSize: 12,
        fontWeight: 'bold',
    },
    pagination: {
        position: 'absolute',
        top: 10,
        left: 10,
        flexDirection: 'row',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 3,
        borderWidth: 1,
        borderColor: '#00000040',
    },
    tabContainer: {
        borderBottomWidth: 1,
        zIndex: 10,
    },
    tabScroll: {
        paddingHorizontal: 8,
    },
    tab: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        marginHorizontal: 4,
    },
    tabText: {
        textAlign: 'center',
    },
    content: {
        flex: 1,
        minHeight: 500,
    }
});
