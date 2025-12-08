import React, { useState } from 'react';
import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { X, Diamond, Play } from 'lucide-react-native';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { addDiamonds, CURRENCY_CONSTANTS, saveCurrencyToStorage } from '@/store/slices/currencySlice';
import { loadRewardedAd, showRewardedAd, isRewardedAdReady } from '@/utils/ads';
import { Colors } from '@/constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface DiamondModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function DiamondModal({ visible, onClose }: DiamondModalProps) {
    const dispatch = useAppDispatch();
    const { diamonds, energy, lastEnergyUpdate } = useAppSelector((state) => state.currency);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const { AD_REWARD_DIAMONDS } = CURRENCY_CONSTANTS;

    const handleWatchAd = async () => {
        setIsLoading(true);
        setMessage('');

        try {
            // Load ad if not ready
            if (!isRewardedAdReady()) {
                await loadRewardedAd();
            }

            // Show the ad
            showRewardedAd(
                // On reward earned
                async () => {
                    dispatch(addDiamonds(AD_REWARD_DIAMONDS));
                    // Save to storage
                    const newState = {
                        energy,
                        diamonds: diamonds + AD_REWARD_DIAMONDS,
                        lastEnergyUpdate,
                    };
                    await saveCurrencyToStorage(newState);
                    setMessage(`🎉 ${AD_REWARD_DIAMONDS} elmas kazandın!`);
                    setIsLoading(false);
                },
                // On ad closed
                () => {
                    setIsLoading(false);
                },
                // On error
                (error) => {
                    console.error('Ad error:', error);
                    setMessage('Reklam yüklenemedi. Tekrar dene.');
                    setIsLoading(false);
                }
            );
        } catch (error) {
            console.error('Ad loading error:', error);
            setMessage('Reklam yüklenemedi. Tekrar dene.');
            setIsLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <X size={24} color="#666" />
                    </TouchableOpacity>

                    <View style={styles.iconContainer}>
                        <Diamond size={48} color="#60A5FA" fill="#60A5FA" />
                    </View>

                    <Text style={styles.title}>Elmas</Text>

                    <View style={styles.diamondDisplay}>
                        <Diamond size={32} color="#60A5FA" fill="#60A5FA" />
                        <Text style={styles.diamondCount}>{diamonds}</Text>
                    </View>

                    <View style={styles.divider} />

                    <Text style={styles.infoText}>
                        Elmaslar ile enerjini doldurabilirsin! Reklam izleyerek elmas kazanabilirsin.
                    </Text>

                    <View style={styles.rewardInfo}>
                        <Play size={20} color="#48BB78" />
                        <Text style={styles.rewardText}>
                            Her reklam = {AD_REWARD_DIAMONDS} 💎
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.watchAdButton, isLoading && styles.watchAdButtonDisabled]}
                        onPress={handleWatchAd}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <>
                                <Play size={24} color="#FFF" fill="#FFF" />
                                <Text style={styles.watchAdButtonText}>
                                    Reklam İzle
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>

                    {message !== '' && (
                        <Text style={styles.messageText}>{message}</Text>
                    )}

                    <View style={styles.usageInfo}>
                        <Text style={styles.usageTitle}>Elmas Kullanımı:</Text>
                        <Text style={styles.usageItem}>• 50 💎 = Tam enerji dolumu</Text>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: SCREEN_WIDTH - 48,
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        padding: 4,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#DBEAFE',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: '#2D3748',
        marginBottom: 16,
    },
    diamondDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    diamondCount: {
        fontSize: 36,
        fontWeight: '800',
        color: '#2D3748',
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: '#E2E8F0',
        marginVertical: 16,
    },
    infoText: {
        fontSize: 14,
        color: '#718096',
        textAlign: 'center',
        marginBottom: 16,
        lineHeight: 20,
    },
    rewardInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#F0FFF4',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        marginBottom: 20,
    },
    rewardText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#48BB78',
    },
    watchAdButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: Colors.primary,
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 12,
        width: '100%',
        justifyContent: 'center',
    },
    watchAdButtonDisabled: {
        backgroundColor: '#CBD5E0',
    },
    watchAdButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
    },
    messageText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#48BB78',
        marginTop: 16,
        textAlign: 'center',
    },
    usageInfo: {
        marginTop: 20,
        width: '100%',
        backgroundColor: '#F7FAFC',
        padding: 16,
        borderRadius: 12,
    },
    usageTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#2D3748',
        marginBottom: 8,
    },
    usageItem: {
        fontSize: 14,
        color: '#718096',
    },
});
