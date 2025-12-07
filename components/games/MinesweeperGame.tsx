import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Vibration } from 'react-native';
import { Flag, Bomb, RefreshCw } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

interface MinesweeperGameProps {
    onComplete: (score: number) => void;
    ageGroup: string;
}

interface Cell {
    row: number;
    col: number;
    isMine: boolean;
    isRevealed: boolean;
    isFlagged: boolean;
    neighborCount: number;
}

interface GameConfig {
    rows: number;
    cols: number;
    mines: number;
}

const CONFIGS: Record<string, GameConfig> = {
    '5-7': { rows: 6, cols: 5, mines: 4 }, // Simplified for kids
    '8-10': { rows: 8, cols: 7, mines: 8 },
    '11-13': { rows: 10, cols: 9, mines: 12 },
    '14+': { rows: 12, cols: 10, mines: 20 },
};

export default function MinesweeperGame({ onComplete, ageGroup }: MinesweeperGameProps) {
    const config = CONFIGS[ageGroup] || CONFIGS['8-10'];
    const [grid, setGrid] = useState<Cell[][]>([]);
    const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
    const [mineCount, setMineCount] = useState(config.mines);
    const [timer, setTimer] = useState(0);
    const [isFirstMove, setIsFirstMove] = useState(true);

    useEffect(() => {
        startNewGame();
    }, [ageGroup]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (gameState === 'playing') {
            interval = setInterval(() => {
                setTimer((t) => t + 1);
            }, 1000) as unknown as NodeJS.Timeout;
        }
        return () => clearInterval(interval);
    }, [gameState]);

    const startNewGame = () => {
        const newGrid = createEmptyGrid(config.rows, config.cols);
        setGrid(newGrid);
        setGameState('playing');
        setMineCount(config.mines);
        setTimer(0);
        setIsFirstMove(true);
    };

    const createEmptyGrid = (rows: number, cols: number): Cell[][] => {
        const grid: Cell[][] = [];
        for (let r = 0; r < rows; r++) {
            const row: Cell[] = [];
            for (let c = 0; c < cols; c++) {
                row.push({
                    row: r,
                    col: c,
                    isMine: false,
                    isRevealed: false,
                    isFlagged: false,
                    neighborCount: 0,
                });
            }
            grid.push(row);
        }
        return grid;
    };

    const placeMines = (grid: Cell[][], firstRow: number, firstCol: number) => {
        let minesPlaced = 0;
        while (minesPlaced < config.mines) {
            const r = Math.floor(Math.random() * config.rows);
            const c = Math.floor(Math.random() * config.cols);

            // Don't place mine on first click or neighbors
            if (
                !grid[r][c].isMine &&
                Math.abs(r - firstRow) > 1 &&
                Math.abs(c - firstCol) > 1
            ) {
                grid[r][c].isMine = true;
                minesPlaced++;
            }
        }

        // Calculate numbers
        for (let r = 0; r < config.rows; r++) {
            for (let c = 0; c < config.cols; c++) {
                if (!grid[r][c].isMine) {
                    let count = 0;
                    for (let dr = -1; dr <= 1; dr++) {
                        for (let dc = -1; dc <= 1; dc++) {
                            if (dr === 0 && dc === 0) continue;
                            const nr = r + dr;
                            const nc = c + dc;
                            if (
                                nr >= 0 &&
                                nr < config.rows &&
                                nc >= 0 &&
                                nc < config.cols &&
                                grid[nr][nc].isMine
                            ) {
                                count++;
                            }
                        }
                    }
                    grid[r][c].neighborCount = count;
                }
            }
        }
    };

    const handleCellPress = (row: number, col: number) => {
        if (gameState !== 'playing' || grid[row][col].isFlagged) return;

        const newGrid = [...grid];

        if (isFirstMove) {
            placeMines(newGrid, row, col);
            setIsFirstMove(false);
        }

        if (newGrid[row][col].isMine) {
            revealAllMines(newGrid);
            setGameState('lost');
            Vibration.vibrate();
            Alert.alert('Oyun Bitti', 'Mayına bastın!', [
                { text: 'Tekrar Dene', onPress: startNewGame }
            ]);
        } else {
            revealCell(newGrid, row, col);
            checkWin(newGrid);
        }
        setGrid(newGrid);
    };

    const handleLongPress = (row: number, col: number) => {
        if (gameState !== 'playing' || grid[row][col].isRevealed) return;

        const newGrid = [...grid];
        const cell = newGrid[row][col];

        if (!cell.isFlagged && mineCount > 0) {
            cell.isFlagged = true;
            setMineCount(m => m - 1);
            Vibration.vibrate(50);
        } else if (cell.isFlagged) {
            cell.isFlagged = false;
            setMineCount(m => m + 1);
            Vibration.vibrate(50);
        }

        setGrid(newGrid);
    };

    const revealCell = (grid: Cell[][], row: number, col: number) => {
        if (
            row < 0 ||
            row >= config.rows ||
            col < 0 ||
            col >= config.cols ||
            grid[row][col].isRevealed ||
            grid[row][col].isFlagged
        ) {
            return;
        }

        grid[row][col].isRevealed = true;

        if (grid[row][col].neighborCount === 0) {
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    revealCell(grid, row + dr, col + dc);
                }
            }
        }
    };

    const revealAllMines = (grid: Cell[][]) => {
        grid.forEach(row => {
            row.forEach(cell => {
                if (cell.isMine) {
                    cell.isRevealed = true;
                }
            });
        });
    };

    const checkWin = (grid: Cell[][]) => {
        let unrevealedSafeCells = 0;
        grid.forEach(row => {
            row.forEach(cell => {
                if (!cell.isMine && !cell.isRevealed) {
                    unrevealedSafeCells++;
                }
            });
        });

        if (unrevealedSafeCells === 0) {
            setGameState('won');
            const baseScore = 100;
            const timeBonus = Math.max(0, 100 - timer); // Simple time bonus
            const finalScore = baseScore + timeBonus;
            setTimeout(() => {
                onComplete(finalScore);
            }, 500);
        }
    };

    const getCellColor = (cell: Cell) => {
        if (cell.isRevealed) {
            if (cell.isMine) return '#EF4444';
            return '#F3F4F6';
        }
        return '#60A5FA';
    };

    const getNumberColor = (count: number) => {
        const colors = [
            '',
            '#3B82F6', // 1: Blue
            '#10B981', // 2: Green
            '#EF4444', // 3: Red
            '#8B5CF6', // 4: Purple
            '#F59E0B', // 5: Amber
            '#EC4899', // 6: Pink
            '#374151', // 7: Gray
            '#111827', // 8: Black
        ];
        return colors[count] || '#374151';
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.statBox}>
                    <Flag size={20} color={Colors.energyOrange} />
                    <Text style={styles.statText}>{mineCount}</Text>
                </View>
                <TouchableOpacity onPress={startNewGame} style={styles.resetButton}>
                    <RefreshCw size={24} color="white" />
                </TouchableOpacity>
                <View style={styles.statBox}>
                    <Text style={styles.timerText}>{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</Text>
                </View>
            </View>

            <View style={styles.gridContainer}>
                {grid.map((row, r) => (
                    <View key={r} style={styles.row}>
                        {row.map((cell, c) => (
                            <TouchableOpacity
                                key={`${r}-${c}`}
                                style={[
                                    styles.cell,
                                    {
                                        backgroundColor: getCellColor(cell),
                                        width: 300 / config.cols,
                                        height: 300 / config.cols,
                                    },
                                ]}
                                onPress={() => handleCellPress(r, c)}
                                onLongPress={() => handleLongPress(r, c)}
                                delayLongPress={200}
                                activeOpacity={0.7}
                            >
                                {cell.isRevealed && !cell.isMine && cell.neighborCount > 0 && (
                                    <Text style={[styles.cellText, { color: getNumberColor(cell.neighborCount) }]}>
                                        {cell.neighborCount}
                                    </Text>
                                )}
                                {cell.isRevealed && cell.isMine && (
                                    <Bomb size={20} color="white" />
                                )}
                                {!cell.isRevealed && cell.isFlagged && (
                                    <Flag size={20} color="#FCD34D" fill="#FCD34D" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
            </View>

            <Text style={styles.instruction}>
                Açmak için dokun, bayrak koymak için basılı tut
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 24,
        paddingHorizontal: 16,
    },
    statBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        minWidth: 80,
        justifyContent: 'center',
    },
    statText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#374151',
    },
    timerText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#374151',
        fontVariant: ['tabular-nums'],
    },
    resetButton: {
        backgroundColor: Colors.primary,
        padding: 12,
        borderRadius: 50,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    gridContainer: {
        backgroundColor: '#E5E7EB',
        padding: 8,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    row: {
        flexDirection: 'row',
    },
    cell: {
        margin: 2,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 1,
    },
    cellText: {
        fontSize: 18,
        fontWeight: '800',
    },
    instruction: {
        marginTop: 24,
        color: '#6B7280',
        fontSize: 14,
        fontWeight: '500',
    },
});
