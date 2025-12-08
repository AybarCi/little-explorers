import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { X, Zap, Clock, Diamond } from 'lucide-react-native';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { refillEnergyWithDiamonds, CURRENCY_CONSTANTS, saveCurrencyToStorage } from '@/store/slices/currencySlice';
import { Colors } from '@/constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface EnergyModalProps {
    visible: boolean;
    onClose: () => void;
    onWatchAd: () => void;
}

export default function EnergyModal({ visible, onClose, onWatchAd }: EnergyModalProps) {
    const dispatch = useAppDispatch();
    const { energy, diamonds, lastEnergyUpdate } = useAppSelector((state) => state.currency);
    const [countdown, setCountdown] = useState('');

    const { MAX_ENERGY, ENERGY_REGEN_TIME_MS, ENERGY_REFILL_COST } = CURRENCY_CONSTANTS;

    useEffect(() => {
        if (!visible || energy >= MAX_ENERGY) return;

        const updateCountdown = () => {
            const now = Date.now();
            const timePassed = now - lastEnergyUpdate;
            const timeRemaining = ENERGY_REGEN_TIME_MS - (timePassed % ENERGY_REGEN_TIME_MS);

            const hours = Math.floor(timeRemaining / (60 * 60 * 1000));
            const minutes = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000));
            const seconds = Math.floor((timeRemaining % (60 * 1000)) / 1000);

            setCountdown(`${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
        return () => clearInterval(interval);
    }, [visible, energy, lastEnergyUpdate, MAX_ENERGY, ENERGY_REGEN_TIME_MS]);

    const handleRefillWithDiamonds = async () => {
        if (diamonds >= ENERGY_REFILL_COST) {
            dispatch(refillEnergyWithDiamonds());
            // Save to storage
            const newState = {
                energy: MAX_ENERGY,
                diamonds: diamonds - ENERGY_REFILL_COST,
                lastEnergyUpdate: Date.now(),
            };
            await saveCurrencyToStorage(newState);
            onClose();
        }
    };

    const canRefill = diamonds >= ENERGY_REFILL_COST && energy < MAX_ENERGY;

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
                        <Zap size={48} color="#F6AD55" fill="#F6AD55" />
                    </View>

                    <Text style={styles.title}>Enerji</Text>

                    <View style={styles.energyDisplay}>
                        {Array.from({ length: MAX_ENERGY }).map((_, i) => (
                            <View
                                key={i}
                                style={[
                                    styles.energyBar,
                                    i < energy ? styles.energyBarFull : styles.energyBarEmpty,
                                ]}
                            />
                        ))}
                    </View>

                    <Text style={styles.energyText}>{energy} / {MAX_ENERGY}</Text>

                    {energy < MAX_ENERGY && (
                        <View style={styles.timerContainer}>
                            <Clock size={20} color="#718096" />
                            <Text style={styles.timerText}>
                                Sonraki enerji: {countdown}
                            </Text>
                        </View>
                    )}

                    {energy >= MAX_ENERGY && (
                        <Text style={styles.fullText}>✨ Enerji Dolu!</Text>
                    )}

                    <View style={styles.divider} />

                    <Text style={styles.infoText}>
                        Her oyun 1 enerji harcar. Enerji 2 saatte bir otomatik yenilenir.
                    </Text>

                    <TouchableOpacity
                        style={[styles.refillButton, !canRefill && styles.refillButtonDisabled]}
                        onPress={handleRefillWithDiamonds}
                        disabled={!canRefill}
                    >
                        <Diamond size={20} color="#FFF" fill="#FFF" />
                        <Text style={styles.refillButtonText}>
                            {ENERGY_REFILL_COST} 💎 ile Doldur
                        </Text>
                    </TouchableOpacity>

                    <Text style={styles.diamondInfo}>
                        Mevcut: {diamonds} 💎
                    </Text>

                    {diamonds < ENERGY_REFILL_COST && energy < MAX_ENERGY && (
                        <TouchableOpacity style={styles.watchAdButton} onPress={onWatchAd}>
                            <Text style={styles.watchAdButtonText}>
                                🎬 Reklam İzle ve Elmas Kazan
                            </Text>
                        </TouchableOpacity>
                    )}
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
        backgroundColor: '#FEFCBF',
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
    energyDisplay: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 8,
    },
    energyBar: {
        width: 40,
        height: 16,
        borderRadius: 8,
    },
    energyBarFull: {
        backgroundColor: '#F6AD55',
    },
    energyBarEmpty: {
        backgroundColor: '#E2E8F0',
    },
    energyText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2D3748',
        marginBottom: 16,
    },
    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    timerText: {
        fontSize: 16,
        color: '#718096',
        fontWeight: '600',
    },
    fullText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#48BB78',
        marginBottom: 16,
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
        marginBottom: 20,
        lineHeight: 20,
    },
    refillButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: Colors.primary,
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
        width: '100%',
        justifyContent: 'center',
    },
    refillButtonDisabled: {
        backgroundColor: '#CBD5E0',
    },
    refillButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
    diamondInfo: {
        fontSize: 14,
        color: '#718096',
        marginTop: 12,
    },
    watchAdButton: {
        marginTop: 16,
        paddingVertical: 12,
    },
    watchAdButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.primary,
    },
});
