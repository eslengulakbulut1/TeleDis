import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PatientContext = createContext();

const mockPatients = [
    { id: '1', patientNo: '75', name: 'Ayşe Yılmaz', gender: 'Kadın', dob: '2016-01-01', age: '6 Yaş', region: 'Merkez/SİVAS', phone: '05551234567', clinic: 'Merkez Klinik', lastVisit: '12.10.2023', avatar: 'https://i.pravatar.cc/150?u=1' },
    { id: '2', patientNo: '82', name: 'Ahmet Demir', gender: 'Erkek', dob: '2015-05-12', age: '7 Yaş', region: 'Şarkışla/SİVAS', phone: '05559876543', clinic: 'Merkez Klinik', lastVisit: '05.11.2023', avatar: 'https://i.pravatar.cc/150?u=2' },
    { id: '3', patientNo: '91', name: 'Zeynep Kaya', gender: 'Kadın', dob: '2010-09-21', age: '12 Yaş', region: 'Kangal/SİVAS', phone: '05051112233', clinic: 'Şube Klinik', lastVisit: '01.12.2023', avatar: 'https://i.pravatar.cc/150?u=3' },
];

export const PatientProvider = ({ children }) => {
    const [patients, setPatients] = useState(mockPatients);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [dentalRecords, setDentalRecords] = useState({});
    const [anamnesis, setAnamnesis] = useState({});
    const [generalEvaluation, setGeneralEvaluation] = useState({});
    const [photos, setPhotos] = useState({});

    useEffect(() => {
        const loadData = async () => {
            try {
                const storedPatients = await AsyncStorage.getItem('@patients');
                if (storedPatients) setPatients(JSON.parse(storedPatients));

                const storedDental = await AsyncStorage.getItem('@dentalRecords');
                if (storedDental) setDentalRecords(JSON.parse(storedDental));

                const storedAnamnesis = await AsyncStorage.getItem('@anamnesis');
                if (storedAnamnesis) setAnamnesis(JSON.parse(storedAnamnesis));

                const storedGeneral = await AsyncStorage.getItem('@generalEvaluation');
                if (storedGeneral) setGeneralEvaluation(JSON.parse(storedGeneral));

                const storedPhotos = await AsyncStorage.getItem('@photos');
                if (storedPhotos) setPhotos(JSON.parse(storedPhotos));
            } catch (e) {
                console.error('Error loading patient data', e);
            }
        };
        loadData();
    }, []);

    const saveAnamnesis = async (patientId, data) => {
        const newRecords = { ...anamnesis, [patientId]: data };
        setAnamnesis(newRecords);
        await AsyncStorage.setItem('@anamnesis', JSON.stringify(newRecords));
    };

    const saveDentalRecord = async (patientId, toothNo, diagnosis, note) => {
        const newRecords = { ...dentalRecords };
        if (!newRecords[patientId]) newRecords[patientId] = {};
        newRecords[patientId][toothNo] = { diagnosis, note, date: new Date().toISOString() };

        setDentalRecords(newRecords);
        await AsyncStorage.setItem('@dentalRecords', JSON.stringify(newRecords));
    };

    const saveGeneralEvaluation = async (patientId, data) => {
        const newRecords = { ...generalEvaluation, [patientId]: data };
        setGeneralEvaluation(newRecords);
        await AsyncStorage.setItem('@generalEvaluation', JSON.stringify(newRecords));
    };

    const savePhoto = async (patientId, photoData) => {
        const patientPhotos = photos[patientId] || [];
        const newPhotos = [...patientPhotos, { ...photoData, id: Date.now().toString() }];
        const allPhotos = { ...photos, [patientId]: newPhotos };
        setPhotos(allPhotos);
        await AsyncStorage.setItem('@photos', JSON.stringify(allPhotos));
    };

    const exportData = async () => {
        const data = {
            patients,
            dentalRecords,
            anamnesis,
            generalEvaluation
        };
        return JSON.stringify(data, null, 2);
    };

    const addPatient = async (patientData) => {
        const newPatient = {
            ...patientData,
            id: Date.now().toString(),
            patientNo: Math.floor(Math.random() * 1000).toString(),
            avatar: `https://i.pravatar.cc/150?u=${Date.now()}`
        };
        const updatedList = [newPatient, ...patients];
        setPatients(updatedList);
        await AsyncStorage.setItem('@patients', JSON.stringify(updatedList));
    };

    return (
        <PatientContext.Provider value={{
            patients,
            selectedPatient,
            setSelectedPatient,
            dentalRecords,
            saveDentalRecord,
            anamnesis,
            saveAnamnesis,
            generalEvaluation,
            saveGeneralEvaluation,
            photos,
            savePhoto,
            addPatient,
            exportData
        }}>
            {children}
        </PatientContext.Provider>
    );
};

export const usePatient = () => useContext(PatientContext);
