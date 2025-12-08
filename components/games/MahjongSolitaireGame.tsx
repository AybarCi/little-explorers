import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { RotateCcw, Lightbulb, RefreshCw } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

interface MahjongSolitaireGameProps {
    onComplete: (score: number) => void;
    ageGroup: string;
}

// --- Data Structures ---

interface Tile {
    id: string;
    x: number;        // 0-14 (width)
    y: number;        // 0-8 (height)
    z: number;        // 0-4 (depth/layer)
    symbol: string;   // Unicode Mahjong character
    matched: boolean;
}

interface GameConfig {
    layoutName: string;
    tileCount: number;
    symbolCount: number;
    hints: number;
    undos: number;
}

interface GameState {
    tiles: Tile[];
    selectedTiles: string[];
    moves: number;
    score: number;
    hintsRemaining: number;
    undosRemaining: number;
    gameOver: boolean;
    won: boolean;
}

// --- Mahjong Symbols ---
const SYMBOLS = {
    winds: ['🀀', '🀁', '🀂', '🀃'], // East, South, West, North
    dragons: ['🀄', '🀅', '🀆'],     // Red, Green, White
    characters: ['🀇', '🀈', '🀉', '🀊', '🀋', '🀌', '🀍', '🀎', '🀏'], // 1-9
    bamboo: ['🀐', '🀑', '🀒', '🀓', '🀔', '🀕', '🀖', '🀗', '🀘'],      // 1-9
    circles: ['🀙', '🀚', '🀛', '🀜', '🀝', '🀞', '🀟', '🀠', '🀡'],     // 1-9
    flowers: ['🀢', '🀣', '🀤', '🀥'],  // Plum, Orchid, Chrysanthemum, Bamboo
    seasons: ['🀦', '🀧', '🀨', '🀩'],  // Spring, Summer, Autumn, Winter
};

// --- Age Group Configurations ---
const CONFIGS: Record<string, GameConfig> = {
    '5-7': {
        layoutName: 'simple',
        tileCount: 12,
        symbolCount: 6,
        hints: 5,
        undos: 5,
    },
    '8-10': {
        layoutName: 'medium',
        tileCount: 24,
        symbolCount: 12,
        hints: 3,
        undos: 3,
    },
    '11-13': {
        layoutName: 'complex',
        tileCount: 36,
        symbolCount: 18,
        hints: 2,
        undos: 2,
    },
    '14+': {
        layoutName: 'turtle',
        tileCount: 72,
        symbolCount: 36,
        hints: 1,
        undos: 1,
    },
};

// --- Layout Patterns ---
// Each layout is an array of {x, y, z} coordinates
const LAYOUTS: Record<string, { x: number; y: number; z: number }[]> = {
    simple: [
        // 3x4 flat layout (12 tiles)
        { x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }, { x: 2, y: 0, z: 0 },
        { x: 0, y: 1, z: 0 }, { x: 1, y: 1, z: 0 }, { x: 2, y: 1, z: 0 },
        { x: 0, y: 2, z: 0 }, { x: 1, y: 2, z: 0 }, { x: 2, y: 2, z: 0 },
        { x: 0, y: 3, z: 0 }, { x: 1, y: 3, z: 0 }, { x: 2, y: 3, z: 0 },
    ],
    medium: [
        // 4x6 flat layout (24 tiles)
        { x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }, { x: 2, y: 0, z: 0 }, { x: 3, y: 0, z: 0 },
        { x: 0, y: 1, z: 0 }, { x: 1, y: 1, z: 0 }, { x: 2, y: 1, z: 0 }, { x: 3, y: 1, z: 0 },
        { x: 0, y: 2, z: 0 }, { x: 1, y: 2, z: 0 }, { x: 2, y: 2, z: 0 }, { x: 3, y: 2, z: 0 },
        { x: 0, y: 3, z: 0 }, { x: 1, y: 3, z: 0 }, { x: 2, y: 3, z: 0 }, { x: 3, y: 3, z: 0 },
        { x: 0, y: 4, z: 0 }, { x: 1, y: 4, z: 0 }, { x: 2, y: 4, z: 0 }, { x: 3, y: 4, z: 0 },
        { x: 0, y: 5, z: 0 }, { x: 1, y: 5, z: 0 }, { x: 2, y: 5, z: 0 }, { x: 3, y: 5, z: 0 },
    ],
    complex: [
        // Small pyramid (36 tiles)
        // Layer 0 (bottom) - 6x6
        { x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }, { x: 2, y: 0, z: 0 }, { x: 3, y: 0, z: 0 }, { x: 4, y: 0, z: 0 }, { x: 5, y: 0, z: 0 },
        { x: 0, y: 1, z: 0 }, { x: 1, y: 1, z: 0 }, { x: 2, y: 1, z: 0 }, { x: 3, y: 1, z: 0 }, { x: 4, y: 1, z: 0 }, { x: 5, y: 1, z: 0 },
        { x: 0, y: 2, z: 0 }, { x: 1, y: 2, z: 0 }, { x: 2, y: 2, z: 0 }, { x: 3, y: 2, z: 0 }, { x: 4, y: 2, z: 0 }, { x: 5, y: 2, z: 0 },
        { x: 0, y: 3, z: 0 }, { x: 1, y: 3, z: 0 }, { x: 2, y: 3, z: 0 }, { x: 3, y: 3, z: 0 }, { x: 4, y: 3, z: 0 }, { x: 5, y: 3, z: 0 },
        { x: 0, y: 4, z: 0 }, { x: 1, y: 4, z: 0 }, { x: 2, y: 4, z: 0 }, { x: 3, y: 4, z: 0 }, { x: 4, y: 4, z: 0 }, { x: 5, y: 4, z: 0 },
        { x: 0, y: 5, z: 0 }, { x: 1, y: 5, z: 0 }, { x: 2, y: 5, z: 0 }, { x: 3, y: 5, z: 0 }, { x: 4, y: 5, z: 0 }, { x: 5, y: 5, z: 0 },
    ],
    turtle: [
        // Classic Turtle layout (72 tiles) - simplified version
        // Layer 0 - Base
        { x: 2, y: 1, z: 0 }, { x: 3, y: 1, z: 0 }, { x: 4, y: 1, z: 0 }, { x: 5, y: 1, z: 0 }, { x: 6, y: 1, z: 0 }, { x: 7, y: 1, z: 0 }, { x: 8, y: 1, z: 0 }, { x: 9, y: 1, z: 0 }, { x: 10, y: 1, z: 0 },
        { x: 2, y: 2, z: 0 }, { x: 3, y: 2, z: 0 }, { x: 4, y: 2, z: 0 }, { x: 5, y: 2, z: 0 }, { x: 6, y: 2, z: 0 }, { x: 7, y: 2, z: 0 }, { x: 8, y: 2, z: 0 }, { x: 9, y: 2, z: 0 }, { x: 10, y: 2, z: 0 },
        { x: 0, y: 3, z: 0 }, { x: 1, y: 3, z: 0 }, { x: 2, y: 3, z: 0 }, { x: 3, y: 3, z: 0 }, { x: 4, y: 3, z: 0 }, { x: 5, y: 3, z: 0 }, { x: 6, y: 3, z: 0 }, { x: 7, y: 3, z: 0 }, { x: 8, y: 3, z: 0 }, { x: 9, y: 3, z: 0 }, { x: 10, y: 3, z: 0 }, { x: 11, y: 3, z: 0 },
        { x: 0, y: 4, z: 0 }, { x: 1, y: 4, z: 0 }, { x: 2, y: 4, z: 0 }, { x: 3, y: 4, z: 0 }, { x: 4, y: 4, z: 0 }, { x: 5, y: 4, z: 0 }, { x: 6, y: 4, z: 0 }, { x: 7, y: 4, z: 0 }, { x: 8, y: 4, z: 0 }, { x: 9, y: 4, z: 0 }, { x: 10, y: 4, z: 0 }, { x: 11, y: 4, z: 0 },
        { x: 2, y: 5, z: 0 }, { x: 3, y: 5, z: 0 }, { x: 4, y: 5, z: 0 }, { x: 5, y: 5, z: 0 }, { x: 6, y: 5, z: 0 }, { x: 7, y: 5, z: 0 }, { x: 8, y: 5, z: 0 }, { x: 9, y: 5, z: 0 }, { x: 10, y: 5, z: 0 },
        { x: 2, y: 6, z: 0 }, { x: 3, y: 6, z: 0 }, { x: 4, y: 6, z: 0 }, { x: 5, y: 6, z: 0 }, { x: 6, y: 6, z: 0 }, { x: 7, y: 6, z: 0 }, { x: 8, y: 6, z: 0 }, { x: 9, y: 6, z: 0 }, { x: 10, y: 6, z: 0 },
        // Layer 1 - Middle (16 tiles)
        { x: 3, y: 2, z: 1 }, { x: 4, y: 2, z: 1 }, { x: 5, y: 2, z: 1 }, { x: 6, y: 2, z: 1 },
        { x: 3, y: 3, z: 1 }, { x: 4, y: 3, z: 1 }, { x: 5, y: 3, z: 1 }, { x: 6, y: 3, z: 1 },
        { x: 3, y: 4, z: 1 }, { x: 4, y: 4, z: 1 }, { x: 5, y: 4, z: 1 }, { x: 6, y: 4, z: 1 },
        { x: 3, y: 5, z: 1 }, { x: 4, y: 5, z: 1 }, { x: 5, y: 5, z: 1 }, { x: 6, y: 5, z: 1 },
        // Layer 2 - Top (2 tiles)
        { x: 4, y: 3, z: 2 }, { x: 5, y: 3, z: 2 },
    ],
};

// --- Helper Functions ---

function getSymbolsForAge(symbolCount: number): string[] {
    const allSymbols = [
        ...SYMBOLS.winds,
        ...SYMBOLS.dragons,
        ...SYMBOLS.characters.slice(0, 3),
        ...SYMBOLS.bamboo.slice(0, 3),
        ...SYMBOLS.circles.slice(0, 3),
    ];

    return allSymbols.slice(0, symbolCount);
}

function generateTiles(config: GameConfig): Tile[] {
    const layout = LAYOUTS[config.layoutName];
    const symbols = getSymbolsForAge(config.symbolCount);

    // Create pairs of symbols
    const tilePairs: string[] = [];
    for (let i = 0; i < config.tileCount / 2; i++) {
        const symbol = symbols[i % symbols.length];
        tilePairs.push(symbol, symbol);
    }

    // Shuffle
    for (let i = tilePairs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tilePairs[i], tilePairs[j]] = [tilePairs[j], tilePairs[i]];
    }

    // Assign to layout positions
    return layout.slice(0, config.tileCount).map((pos, idx) => ({
        id: `tile_${idx}`,
        x: pos.x,
        y: pos.y,
        z: pos.z,
        symbol: tilePairs[idx],
        matched: false,
    }));
}

function isTilePlayable(tile: Tile, allTiles: Tile[]): boolean {
    // 1. Check if there's a tile above
    const hasAbove = allTiles.some(
        (t) => t.x === tile.x && t.y === tile.y && t.z === tile.z + 1 && !t.matched
    );
    if (hasAbove) return false;

    // 2. Check if both left and right are blocked
    const leftBlocked = allTiles.some(
        (t) => t.x === tile.x - 1 && t.y === tile.y && t.z === tile.z && !t.matched
    );
    const rightBlocked = allTiles.some(
        (t) => t.x === tile.x + 1 && t.y === tile.y && t.z === tile.z && !t.matched
    );

    return !(leftBlocked && rightBlocked);
}

function canMatch(tile1: Tile, tile2: Tile): boolean {
    // Same exact symbol
    if (tile1.symbol === tile2.symbol) return true;

    // Flowers can match with any other flower
    if (SYMBOLS.flowers.includes(tile1.symbol) && SYMBOLS.flowers.includes(tile2.symbol)) {
        return true;
    }

    // Seasons can match with any other season
    if (SYMBOLS.seasons.includes(tile1.symbol) && SYMBOLS.seasons.includes(tile2.symbol)) {
        return true;
    }

    return false;
}

function hasValidMoves(tiles: Tile[]): boolean {
    const playableTiles = tiles.filter((t) => !t.matched && isTilePlayable(t, tiles));

    for (let i = 0; i < playableTiles.length; i++) {
        for (let j = i + 1; j < playableTiles.length; j++) {
            if (canMatch(playableTiles[i], playableTiles[j])) {
                return true;
            }
        }
    }
    return false;
}

function getSymbolColor(symbol: string): string {
    // Dragons
    if (symbol === '🀄') return '#DC2626'; // Red dragon - red
    if (symbol === '🀅') return '#16A34A'; // Green dragon - green
    if (symbol === '🀆') return '#1E40AF'; // White dragon - blue

    // Winds
    if (SYMBOLS.winds.includes(symbol)) return '#0891B2'; // Cyan for winds

    // Characters (black)
    if (SYMBOLS.characters.includes(symbol)) return '#1F2937'; // Dark gray

    // Bamboo (green)
    if (SYMBOLS.bamboo.includes(symbol)) return '#059669'; // Emerald green

    // Circles (red/orange)
    if (SYMBOLS.circles.includes(symbol)) return '#EA580C'; // Orange-red

    // Flowers (colorful)
    if (symbol === '🀢') return '#EC4899'; // Pink
    if (symbol === '🀣') return '#8B5CF6'; // Purple
    if (symbol === '🀤') return '#EAB308'; // Yellow
    if (symbol === '🀥') return '#10B981'; // Mint green

    // Seasons (seasonal colors)
    if (symbol === '🀦') return '#22C55E'; // Spring - green
    if (symbol === '🀧') return '#F59E0B'; // Summer - amber
    if (symbol === '🀨') return '#F97316'; // Autumn - orange
    if (symbol === '🀩') return '#3B82F6'; // Winter - blue

    return '#1F2937'; // Default dark gray
}

// --- Main Component ---

export default function MahjongSolitaireGame({ onComplete, ageGroup }: MahjongSolitaireGameProps) {
    const config = CONFIGS[ageGroup] || CONFIGS['8-10'];

    const [gameState, setGameState] = useState<GameState>(() => ({
        tiles: generateTiles(config),
        selectedTiles: [],
        moves: 0,
        score: 0,
        hintsRemaining: config.hints,
        undosRemaining: config.undos,
        gameOver: false,
        won: false,
    }));

    const [undoStack, setUndoStack] = useState<Tile[][]>([]);
    const [gameKey, setGameKey] = useState(0); // Force re-render on restart

    // Check for win/lose conditions
    useEffect(() => {
        const activeTiles = gameState.tiles.filter((t) => !t.matched);

        if (activeTiles.length === 0 && !gameState.gameOver) {
            setGameState((prev) => ({ ...prev, won: true, gameOver: true }));
            onComplete(gameState.score);
        } else if (activeTiles.length > 0 && !gameState.gameOver && !hasValidMoves(gameState.tiles)) {
            // Deadlock detected - game is lost
            setGameState((prev) => ({ ...prev, gameOver: true, won: false }));
            // Save score as a loss (half points)
            onComplete(Math.floor(gameState.score / 2));
        }
    }, [gameState.tiles, gameState.score, gameState.gameOver, onComplete]);

    const handleTilePress = (tileId: string) => {
        const tile = gameState.tiles.find((t) => t.id === tileId);
        if (!tile || tile.matched || !isTilePlayable(tile, gameState.tiles)) {
            return;
        }

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        if (gameState.selectedTiles.length === 0) {
            // First selection
            setGameState((prev) => ({ ...prev, selectedTiles: [tileId] }));
        } else if (gameState.selectedTiles.length === 1) {
            const [firstId] = gameState.selectedTiles;

            // Check if clicking the same tile again (deselect)
            if (firstId === tileId) {
                setGameState((prev) => ({ ...prev, selectedTiles: [] }));
                return;
            }

            const firstTile = gameState.tiles.find((t) => t.id === firstId);

            if (firstTile && canMatch(firstTile, tile)) {
                // Match found!
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

                // Save state for undo
                setUndoStack((prev) => [...prev, gameState.tiles]);

                setGameState((prev) => ({
                    ...prev,
                    tiles: prev.tiles.map((t) =>
                        t.id === firstId || t.id === tileId ? { ...t, matched: true } : t
                    ),
                    selectedTiles: [],
                    moves: prev.moves + 1,
                    score: prev.score + 10,
                }));
            } else {
                // No match, clear selection
                setGameState((prev) => ({ ...prev, selectedTiles: [] }));
            }
        }
    };

    const handleUndo = () => {
        if (undoStack.length === 0 || gameState.undosRemaining === 0) return;

        const previousState = undoStack[undoStack.length - 1];
        setUndoStack((prev) => prev.slice(0, -1));
        setGameState((prev) => ({
            ...prev,
            tiles: previousState,
            selectedTiles: [],
            undosRemaining: prev.undosRemaining - 1,
            moves: Math.max(0, prev.moves - 1),
        }));
    };

    const handleHint = () => {
        if (gameState.hintsRemaining === 0) return;

        // Find a playable pair
        const playableTiles = gameState.tiles.filter(
            (t) => !t.matched && isTilePlayable(t, gameState.tiles)
        );

        for (let i = 0; i < playableTiles.length; i++) {
            for (let j = i + 1; j < playableTiles.length; j++) {
                if (canMatch(playableTiles[i], playableTiles[j])) {
                    setGameState((prev) => ({
                        ...prev,
                        selectedTiles: [playableTiles[i].id],
                        hintsRemaining: prev.hintsRemaining - 1,
                    }));
                    return;
                }
            }
        }
    };

    const handleRestart = () => {
        const newTiles = generateTiles(config);
        setGameState({
            tiles: newTiles,
            selectedTiles: [],
            moves: 0,
            score: 0,
            hintsRemaining: config.hints,
            undosRemaining: config.undos,
            gameOver: false,
            won: false,
        });
        setUndoStack([]);
        setGameKey(prev => prev + 1); // Force component remount
    };

    // Sort tiles by z-index for proper rendering
    const sortedTiles = [...gameState.tiles].sort((a, b) => a.z - b.z);

    // Calculate board offset to center layout
    const maxX = Math.max(...gameState.tiles.map(t => t.x));
    const maxY = Math.max(...gameState.tiles.map(t => t.y));
    const TILE_WIDTH = 70;
    const TILE_HEIGHT = 90;
    const SPACING_X = 8;
    const SPACING_Y = 10;
    const boardWidth = (maxX + 1) * (TILE_WIDTH - SPACING_X);
    const boardOffset = (SCREEN_WIDTH - 40 - boardWidth) / 2;

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Hamle</Text>
                    <Text style={styles.statValue}>{gameState.moves}</Text>
                </View>

                <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Skor</Text>
                    <Text style={styles.statValue}>{gameState.score}</Text>
                </View>
            </View>

            {/* Game Board */}
            <ScrollView
                style={styles.boardContainer}
                contentContainerStyle={styles.boardContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.board} key={gameKey}>
                    {sortedTiles.map((tile) => (
                        <TileRenderer
                            key={tile.id}
                            tile={tile}
                            isSelected={gameState.selectedTiles.includes(tile.id)}
                            isPlayable={isTilePlayable(tile, gameState.tiles)}
                            onPress={() => handleTilePress(tile.id)}
                            boardOffset={boardOffset}
                        />
                    ))}
                </View>
            </ScrollView>

            {/* Controls */}
            <View style={styles.controls}>
                <TouchableOpacity
                    style={[styles.controlBtn, gameState.undosRemaining === 0 && styles.controlBtnDisabled]}
                    onPress={handleUndo}
                    disabled={gameState.undosRemaining === 0 || undoStack.length === 0}
                >
                    <RotateCcw size={20} color={gameState.undosRemaining === 0 ? '#999' : Colors.primary} />
                    <Text style={styles.controlText}>Geri ({gameState.undosRemaining})</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.controlBtn, gameState.hintsRemaining === 0 && styles.controlBtnDisabled]}
                    onPress={handleHint}
                    disabled={gameState.hintsRemaining === 0}
                >
                    <Lightbulb size={20} color={gameState.hintsRemaining === 0 ? '#999' : Colors.energyOrange} />
                    <Text style={styles.controlText}>İpucu ({gameState.hintsRemaining})</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.controlBtn} onPress={handleRestart}>
                    <RefreshCw size={20} color={Colors.secondary} />
                    <Text style={styles.controlText}>Yeniden</Text>
                </TouchableOpacity>
            </View>

            {/* Win Modal */}
            {gameState.won && (
                <View style={styles.modal}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>🎉 Tebrikler!</Text>
                        <Text style={styles.modalText}>Tüm taşları eşleştirdin!</Text>
                        <Text style={styles.modalScore}>Skor: {gameState.score}</Text>
                        <Text style={styles.modalMoves}>Hamle: {gameState.moves}</Text>
                        <TouchableOpacity style={styles.modalBtn} onPress={() => onComplete(gameState.score)}>
                            <Text style={styles.modalBtnText}>Devam Et</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Game Over (Deadlock) Modal */}
            {gameState.gameOver && !gameState.won && (
                <View style={styles.modal}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>😞 Oyun Bitti!</Text>
                        <Text style={styles.modalText}>Daha fazla hamle kalmadı.</Text>
                        <Text style={styles.modalScore}>Skor: {gameState.score}</Text>
                        <Text style={styles.modalMoves}>Hamle: {gameState.moves}</Text>
                        <TouchableOpacity style={styles.modalBtn} onPress={() => onComplete(Math.floor(gameState.score / 2))}>
                            <Text style={styles.modalBtnText}>Çık</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
}

// --- Tile Renderer Component ---

interface TileRendererProps {
    tile: Tile;
    isSelected: boolean;
    isPlayable: boolean;
    onPress: () => void;
    boardOffset: number;
}

const TileRenderer: React.FC<TileRendererProps> = ({ tile, isSelected, isPlayable, onPress, boardOffset }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const opacityAnim = useRef(new Animated.Value(1)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isSelected) {
            Animated.spring(scaleAnim, {
                toValue: 1.05,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.spring(scaleAnim, {
                toValue: 1,
                useNativeDriver: true,
            }).start();
        }
    }, [isSelected, scaleAnim]);

    // Match animation
    useEffect(() => {
        if (tile.matched) {
            Animated.parallel([
                Animated.spring(scaleAnim, { toValue: 1.4, useNativeDriver: true }),
                Animated.timing(opacityAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
                Animated.timing(rotateAnim, { toValue: 15, duration: 500, useNativeDriver: true }),
            ]).start();
        }
    }, [tile.matched, scaleAnim, opacityAnim, rotateAnim]);

    const TILE_WIDTH = 70;
    const TILE_HEIGHT = 90;
    const SPACING_X = 8;
    const SPACING_Y = 10;
    const Z_OFFSET_X = 4;
    const Z_OFFSET_Y = -4;

    // Dynamic shadow based on Z layer
    const layerStyle = {
        shadowOffset: { width: 2 + tile.z * 1.5, height: 3 + tile.z * 1.5 },
        shadowOpacity: 0.3 + (tile.z * 0.08),
        shadowRadius: 4 + (tile.z * 2),
        elevation: 5 + (tile.z * 3),
    };

    // Depth-based color adjustment (back tiles darker)
    const depthOpacity = 1 - (tile.z * 0.15); // Back tiles slightly darker
    const gradientColors = tile.z === 0
        ? ['#FFFFFF', '#F5F5F5'] as const // Front layer: bright
        : tile.z === 1
            ? ['#F5F5F5', '#E8E8E8'] as const // Middle layer: slightly darker
            : ['#E8E8E8', '#D8D8D8'] as const; // Back layers: darker

    const rotation = rotateAnim.interpolate({
        inputRange: [0, 15],
        outputRange: ['0deg', '15deg'],
    });

    return (
        <Animated.View
            style={[
                styles.tile,
                layerStyle,
                {
                    width: TILE_WIDTH,
                    height: TILE_HEIGHT,
                    left: boardOffset + tile.x * (TILE_WIDTH - SPACING_X) + tile.z * Z_OFFSET_X,
                    top: tile.y * (TILE_HEIGHT - SPACING_Y) + tile.z * Z_OFFSET_Y,
                    zIndex: tile.z * 100 + tile.y * 10 + tile.x,
                    transform: [{ scale: scaleAnim }, { rotate: rotation }],
                    opacity: tile.matched ? opacityAnim : (isPlayable ? depthOpacity : depthOpacity * 0.5),
                    borderColor: isSelected ? '#FFA500' : '#999999',
                    borderWidth: isSelected ? 4 : 2,
                },
                isSelected && styles.tileSelectedGlow,
            ]}
        >
            <LinearGradient
                colors={gradientColors}
                style={styles.tileGradient}
            >
                <TouchableOpacity
                    style={styles.tileInner}
                    onPress={onPress}
                    disabled={!isPlayable || tile.matched}
                    activeOpacity={0.7}
                >
                    <Text style={[
                        styles.tileSymbol,
                        { color: getSymbolColor(tile.symbol) },
                        !isPlayable && styles.tileSymbolDisabled
                    ]}>
                        {tile.symbol}
                    </Text>
                </TouchableOpacity>
            </LinearGradient>
        </Animated.View>
    );
};

// --- Styles ---

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 16,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#DDD',
    },
    statBox: {
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        fontWeight: '600',
    },
    statValue: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.primary,
    },
    boardContainer: {
        flex: 1,
    },
    boardContent: {
        padding: 20,
        alignItems: 'center',
    },
    board: {
        position: 'relative',
        width: SCREEN_WIDTH - 40,
        minHeight: 700,
        alignSelf: 'center',
    },
    tile: {
        position: 'absolute',
        borderRadius: 12,
        shadowColor: '#000',
        overflow: 'hidden',
        backgroundColor: 'transparent',
    },
    tileGradient: {
        flex: 1,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tileSelectedGlow: {
        shadowColor: '#FFA500',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 12,
    },
    tileInner: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tileSymbol: {
        fontSize: 40,
    },
    tileSymbolDisabled: {
        opacity: 0.5,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 16,
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#DDD',
    },
    controlBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#F0F0F0',
    },
    controlBtnDisabled: {
        opacity: 0.4,
    },
    controlText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#333',
    },
    modal: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderRadius: 16,
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
    modalScore: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.primary,
        marginBottom: 8,
    },
    modalMoves: {
        fontSize: 16,
        color: '#666',
        marginBottom: 24,
    },
    modalBtn: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 8,
    },
    modalBtnText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    secondaryModalBtn: {
        backgroundColor: '#FFF',
        borderWidth: 2,
        borderColor: '#E2E8F0',
    },
    secondaryModalBtnText: {
        color: '#2D3748',
        fontSize: 16,
        fontWeight: '700',
    },
});
