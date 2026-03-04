import React, { useEffect } from 'react';
import { StyleSheet, Dimensions, KeyboardAvoidingView, Platform, View, Modal, Pressable } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    Easing
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { useTheme } from '../theme/ThemeContext';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function AnimatedBottomSheet({ isVisible, onClose, children, height = 400 }) {
    const { theme } = useTheme();

    const translateY = useSharedValue(SCREEN_HEIGHT);
    const opacity = useSharedValue(0);

    useEffect(() => {
        if (isVisible) {
            translateY.value = withTiming(0, {
                duration: 400,
                easing: Easing.out(Easing.back(0.5))
            });
            opacity.value = withTiming(1, { duration: 300 });
        } else {
            translateY.value = withTiming(SCREEN_HEIGHT, {
                duration: 300,
                easing: Easing.in(Easing.ease)
            });
            opacity.value = withTiming(0, { duration: 300 });
        }
    }, [isVisible, translateY, opacity]);

    const pan = Gesture.Pan()
        .onChange((event) => {
            if (event.translationY > 0) {
                translateY.value = event.translationY;
            }
        })
        .onEnd((event) => {
            if (event.translationY > height / 3) {
                translateY.value = withTiming(SCREEN_HEIGHT, { duration: 300 });
                setTimeout(onClose, 300);
            } else {
                translateY.value = withTiming(0, { duration: 300 });
            }
        });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
        };
    });

    const backdropStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
        };
    });

    return (
        <Modal
            visible={isVisible}
            transparent
            animationType="none"
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <Animated.View style={[styles.backdrop, backdropStyle]}>
                    <Pressable style={styles.backdropPress} onPress={onClose} />
                </Animated.View>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardContainer}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
                >
                    <GestureDetector gesture={pan}>
                        <Animated.View style={[
                            styles.sheet,
                            {
                                height,
                                backgroundColor: theme.colors.card,
                                ...theme.shadows.medium
                            },
                            animatedStyle
                        ]}>
                            <View style={[styles.handle, { backgroundColor: theme.colors.border }]} />
                            {children}
                        </Animated.View>
                    </GestureDetector>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    backdropPress: {
        ...StyleSheet.absoluteFillObject,
    },
    keyboardContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    sheet: {
        width: '100%',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingTop: 10,
        overflow: 'hidden',
    },
    handle: {
        width: 50,
        height: 6,
        borderRadius: 3,
        alignSelf: 'center',
        marginBottom: 20,
    }
});
