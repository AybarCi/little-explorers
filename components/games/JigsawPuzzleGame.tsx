import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
import { PanResponder, Animated } from 'react-native';
import { Colors } from '@/constants/colors';

const SCREEN_WIDTH = Dimensions.get('window').width;
const BOARD_PADDING = 20;
const GRID_SIZE = 4; // 4x4 grid for MVP
const SNAP_THRESHOLD = 30;

interface JigsawPuzzleGameProps {
    onComplete: (score: number) => void;
    ageGroup: string;
}

interface PuzzlePiece {
    id: number;
    row: number;
    col: number;
    currentX: number;
    currentY: number;
    targetX: number;
    targetY: number;
    isLocked: boolean;
}

export default function JigsawPuzzleGame({ onComplete, ageGroup }: JigsawPuzzleGameProps) {
    const boardSize = SCREEN_WIDTH - (BOARD_PADDING * 2);
    const pieceSize = boardSize / GRID_SIZE;

    const [pieces, setPieces] = useState<PuzzlePiece[]>(() => {
        const initialPieces: PuzzlePiece[] = [];
        const shuffleArea = {
            startY: boardSize + BOARD_PADDING + 20,
            width: boardSize,
            height: 200,
        };

        for (let row = 0; row < GRID_SIZE; row++) {
            for (let col = 0; col < GRID_SIZE; col++) {
                const id = row * GRID_SIZE + col;
                initialPieces.push({
                    id,
                    row,
                    col,
                    targetX: BOARD_PADDING + col * pieceSize,
                    targetY: BOARD_PADDING + row * pieceSize,
                    currentX: BOARD_PADDING + Math.random() * (shuffleArea.width - pieceSize),
                    currentY: shuffleArea.startY + Math.random() * (shuffleArea.height - pieceSize),
                    isLocked: false,
                });
            }
        }
        return initialPieces;
    });

    const [gameWon, setGameWon] = useState(false);
    const [showResult, setShowResult] = useState<'correct' | 'wrong' | null>(null);

    // Check if all pieces are on the board (not in shuffle area)
    const allPiecesPlaced = pieces.every(p => p.currentY < boardSize + BOARD_PADDING);

    const handlePieceMove = (piece: PuzzlePiece, finalX: number, finalY: number) => {
        setPieces(prev => prev.map(p =>
            p.id === piece.id ? { ...p, currentX: finalX, currentY: finalY } : p
        ));
    };

    const handleCheck = () => {
        // Check all pieces
        let correctCount = 0;
        pieces.forEach(p => {
            const distance = Math.sqrt(
                Math.pow(p.currentX - p.targetX, 2) + Math.pow(p.currentY - p.targetY, 2)
            );
            if (distance < SNAP_THRESHOLD) {
                correctCount++;
            }
        });

        if (correctCount === GRID_SIZE * GRID_SIZE) {
            // All correct - snap all pieces to exact positions
            setPieces(prev => prev.map(p => ({
                ...p,
                currentX: p.targetX,
                currentY: p.targetY,
                isLocked: true,
            })));
            setShowResult('correct');
            setGameWon(true);
            setTimeout(() => onComplete(100), 2000);
        } else {
            setShowResult('wrong');
            setTimeout(() => setShowResult(null), 2000);
        }
    };

    const handleRestart = () => {
        const shuffleArea = {
            startY: boardSize + BOARD_PADDING + 20,
            width: boardSize,
            height: 200,
        };

        setPieces(prev => prev.map(p => ({
            ...p,
            currentX: BOARD_PADDING + Math.random() * (shuffleArea.width - pieceSize),
            currentY: shuffleArea.startY + Math.random() * (shuffleArea.height - pieceSize),
            isLocked: false,
        })));
        setGameWon(false);
        setShowResult(null);
    };

    // Count pieces on board
    const piecesOnBoard = pieces.filter(p => p.currentY < boardSize + BOARD_PADDING).length;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Yapboz Oyunu 🧩</Text>
                    <Text style={styles.progress}>
                        {piecesOnBoard} / {GRID_SIZE * GRID_SIZE} Parça Yerleştirildi
                    </Text>
                </View>
                <TouchableOpacity style={styles.restartButton} onPress={handleRestart}>
                    <Text style={styles.restartButtonText}>🔄 Yenile</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.gameArea}>
                {/* Target grid */}
                <View
                    style={[
                        styles.targetBoard,
                        { width: boardSize, height: boardSize, left: BOARD_PADDING, top: BOARD_PADDING },
                    ]}
                >
                    {Array.from({ length: GRID_SIZE }).map((_, row) =>
                        Array.from({ length: GRID_SIZE }).map((_, col) => (
                            <View
                                key={`grid-${row}-${col}`}
                                style={[
                                    styles.gridCell,
                                    {
                                        width: pieceSize,
                                        height: pieceSize,
                                        left: col * pieceSize,
                                        top: row * pieceSize,
                                    },
                                ]}
                            />
                        ))
                    )}
                </View>

                {/* Puzzle Pieces */}
                {pieces.map(piece => (
                    <DraggablePiece
                        key={piece.id}
                        piece={piece}
                        pieceSize={pieceSize}
                        onSnapCheck={handlePieceMove}
                    />
                ))}
            </View>

            {/* Check Button - shows when all pieces are placed */}
            {allPiecesPlaced && !gameWon && (
                <View style={styles.checkContainer}>
                    <TouchableOpacity style={styles.checkButton} onPress={handleCheck}>
                        <Text style={styles.checkButtonText}>✅ Kontrol Et</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Result Feedback */}
            {showResult === 'wrong' && (
                <View style={styles.feedbackOverlay}>
                    <View style={styles.feedbackBox}>
                        <Text style={styles.feedbackText}>❌ Bazı parçalar yanlış yerde!</Text>
                        <Text style={styles.feedbackSubtext}>Tekrar dene</Text>
                    </View>
                </View>
            )}

            {gameWon && (
                <View style={styles.modal}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>🎉 Tebrikler!</Text>
                        <Text style={styles.modalText}>Yapbozu doğru tamamladın!</Text>
                        <TouchableOpacity style={styles.modalButton} onPress={() => onComplete(100)}>
                            <Text style={styles.modalButtonText}>Devam Et</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
}

interface DraggablePieceProps {
    piece: PuzzlePiece;
    pieceSize: number;
    onSnapCheck: (piece: PuzzlePiece, x: number, y: number) => void;
}

function DraggablePiece({ piece, pieceSize, onSnapCheck }: DraggablePieceProps) {
    const pan = React.useRef(new Animated.ValueXY({ x: piece.currentX, y: piece.currentY })).current;
    const [zIndex, setZIndex] = React.useState(1);

    // Use ref to always have current position (fixes stale closure)
    const positionRef = React.useRef({ x: piece.currentX, y: piece.currentY });

    React.useEffect(() => {
        positionRef.current = { x: piece.currentX, y: piece.currentY };
        pan.setValue({ x: piece.currentX, y: piece.currentY });
    }, [piece.currentX, piece.currentY]);

    const panResponder = React.useMemo(() =>
        PanResponder.create({
            onStartShouldSetPanResponder: () => !piece.isLocked,
            onPanResponderGrant: () => {
                setZIndex(100);
            },
            onPanResponderMove: (_, gesture) => {
                pan.setValue({
                    x: positionRef.current.x + gesture.dx,
                    y: positionRef.current.y + gesture.dy,
                });
            },
            onPanResponderRelease: (_, gesture) => {
                setZIndex(1);
                const finalX = positionRef.current.x + gesture.dx;
                const finalY = positionRef.current.y + gesture.dy;
                onSnapCheck(piece, finalX, finalY);
            },
        }), [piece.isLocked, piece.id]
    );

    // Use actual image with cropping
    const PUZZLE_IMAGE = require('@/assets/images/logo.png');
    const imageOffset = {
        x: -piece.col * pieceSize,
        y: -piece.row * pieceSize,
    };

    return (
        <Animated.View
            {...panResponder.panHandlers}
            style={[
                styles.piece,
                {
                    width: pieceSize,
                    height: pieceSize,
                    zIndex,
                    transform: pan.getTranslateTransform(),
                },
            ]}
        >
            <Image
                source={PUZZLE_IMAGE}
                style={{
                    width: pieceSize * 4, // Full image size (4x4 grid)
                    height: pieceSize * 4,
                    position: 'absolute',
                    left: imageOffset.x,
                    top: imageOffset.y,
                }}
                resizeMode="cover"
            />

            {/* Piece number overlay for testing */}
            <View style={styles.pieceOverlay}>
                <Text style={styles.pieceNumber}>{piece.id + 1}</Text>
            </View>

            {piece.isLocked && (
                <View style={styles.lockedIndicator}>
                    <Text style={styles.lockIcon}>✓</Text>
                </View>
            )}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F4F8',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 20,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#2D3748',
        marginBottom: 4,
    },
    progress: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.primary,
    },
    restartButton: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
    },
    restartButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '700',
    },
    gameArea: {
        flex: 1,
        position: 'relative',
    },
    targetBoard: {
        position: 'absolute',
        backgroundColor: '#FFF',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#CBD5E0',
    },
    gridCell: {
        position: 'absolute',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    piece: {
        position: 'absolute',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#FFF',
    },
    pieceOverlay: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    pieceContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pieceNumber: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FFF',
    },
    pieceLabel: {
        fontSize: 12,
        color: '#FFF',
        opacity: 0.8,
    },
    lockedIndicator: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: '#48BB78',
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lockIcon: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '700',
    },
    controls: {
        padding: 20,
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
    },
    button: {
        backgroundColor: Colors.primary,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
    },
    modal: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 32,
        alignItems: 'center',
        width: SCREEN_WIDTH - 60,
    },
    modalTitle: {
        fontSize: 32,
        fontWeight: '800',
        marginBottom: 16,
    },
    modalText: {
        fontSize: 18,
        color: '#666',
        marginBottom: 24,
    },
    modalButton: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 8,
    },
    modalButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
    checkContainer: {
        padding: 16,
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
    },
    checkButton: {
        backgroundColor: '#48BB78',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
    },
    checkButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
    },
    feedbackOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    feedbackBox: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        width: SCREEN_WIDTH - 80,
    },
    feedbackText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#E53E3E',
        marginBottom: 8,
    },
    feedbackSubtext: {
        fontSize: 16,
        color: '#666',
    },
});
