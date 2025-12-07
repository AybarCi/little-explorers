import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Rocket, Sparkles, RefreshCw } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

interface TicTacToeGameProps {
    onComplete: (score: number) => void;
    ageGroup: string;
}

type Player = 'X' | 'O' | null;

interface GameConfig {
    gridSize: number;
    winCount: number;
    difficulty: 'easy' | 'medium' | 'hard';
}

const CONFIGS: Record<string, GameConfig> = {
    '5-7': { gridSize: 3, winCount: 3, difficulty: 'easy' },
    '8-10': { gridSize: 3, winCount: 3, difficulty: 'medium' },
    '11-13': { gridSize: 3, winCount: 3, difficulty: 'hard' },
    '14+': { gridSize: 4, winCount: 4, difficulty: 'hard' },
};

export default function TicTacToeGame({ onComplete, ageGroup }: TicTacToeGameProps) {
    const config = CONFIGS[ageGroup] || CONFIGS['8-10'];
    const [board, setBoard] = useState<Player[]>(Array(config.gridSize * config.gridSize).fill(null));
    const [isPlayerTurn, setIsPlayerTurn] = useState(true); // Player is X (Rocket)
    const [winner, setWinner] = useState<Player | 'draw' | null>(null);
    const [winningLine, setWinningLine] = useState<number[] | null>(null);

    useEffect(() => {
        startNewGame();
    }, [ageGroup]);

    useEffect(() => {
        if (!isPlayerTurn && !winner) {
            const timer = setTimeout(() => {
                makeAiMove();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isPlayerTurn, winner]);

    const startNewGame = () => {
        setBoard(Array(config.gridSize * config.gridSize).fill(null));
        setIsPlayerTurn(true);
        setWinner(null);
        setWinningLine(null);
    };

    const checkWinner = (squares: Player[]): { winner: Player | 'draw' | null; line: number[] | null } => {
        const size = config.gridSize;
        const winCount = config.winCount;

        // Check rows, columns, and diagonals
        const lines: number[][] = [];

        // Rows
        for (let r = 0; r < size; r++) {
            for (let c = 0; c <= size - winCount; c++) {
                const line = [];
                for (let k = 0; k < winCount; k++) line.push(r * size + c + k);
                lines.push(line);
            }
        }

        // Columns
        for (let c = 0; c < size; c++) {
            for (let r = 0; r <= size - winCount; r++) {
                const line = [];
                for (let k = 0; k < winCount; k++) line.push((r + k) * size + c);
                lines.push(line);
            }
        }

        // Diagonals (Top-left to bottom-right)
        for (let r = 0; r <= size - winCount; r++) {
            for (let c = 0; c <= size - winCount; c++) {
                const line = [];
                for (let k = 0; k < winCount; k++) line.push((r + k) * size + c + k);
                lines.push(line);
            }
        }

        // Diagonals (Top-right to bottom-left)
        for (let r = 0; r <= size - winCount; r++) {
            for (let c = winCount - 1; c < size; c++) {
                const line = [];
                for (let k = 0; k < winCount; k++) line.push((r + k) * size + c - k);
                lines.push(line);
            }
        }

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const first = squares[line[0]];
            if (first && line.every(index => squares[index] === first)) {
                return { winner: first, line };
            }
        }

        if (squares.every(square => square !== null)) {
            return { winner: 'draw', line: null };
        }

        return { winner: null, line: null };
    };

    const handlePress = (index: number) => {
        if (board[index] || winner || !isPlayerTurn) return;

        const newBoard = [...board];
        newBoard[index] = 'X';
        setBoard(newBoard);

        const result = checkWinner(newBoard);
        if (result.winner) {
            finishGame(result);
        } else {
            setIsPlayerTurn(false);
        }
    };

    const makeAiMove = () => {
        const bestMove = getBestMove(board, config.difficulty);
        if (bestMove !== -1) {
            const newBoard = [...board];
            newBoard[bestMove] = 'O';
            setBoard(newBoard);

            const result = checkWinner(newBoard);
            if (result.winner) {
                finishGame(result);
            } else {
                setIsPlayerTurn(true);
            }
        }
    };

    const finishGame = (result: { winner: Player | 'draw' | null; line: number[] | null }) => {
        setWinner(result.winner);
        setWinningLine(result.line);

        if (result.winner === 'X') {
            setTimeout(() => {
                onComplete(100); // Win score
            }, 1000);
        } else if (result.winner === 'draw') {
            // Optional: Give partial points for draw?
            // For now, just show alert or let them retry
        }
    };

    // AI Logic
    const getBestMove = (squares: Player[], difficulty: string): number => {
        const availableMoves = squares.map((val, idx) => val === null ? idx : -1).filter(val => val !== -1);

        if (availableMoves.length === 0) return -1;

        // Easy: Random move
        if (difficulty === 'easy') {
            return availableMoves[Math.floor(Math.random() * availableMoves.length)];
        }

        // Medium: Block winning moves, otherwise random
        if (difficulty === 'medium') {
            // Check if AI can win
            for (let move of availableMoves) {
                const temp = [...squares];
                temp[move] = 'O';
                if (checkWinner(temp).winner === 'O') return move;
            }
            // Check if Player can win and block
            for (let move of availableMoves) {
                const temp = [...squares];
                temp[move] = 'X';
                if (checkWinner(temp).winner === 'X') return move;
            }
            return availableMoves[Math.floor(Math.random() * availableMoves.length)];
        }

        // Hard: Minimax (for 3x3) or Heuristic (for larger)
        if (difficulty === 'hard') {
            if (config.gridSize > 3) {
                // For 4x4, full minimax is too slow. Use depth-limited or just medium+ logic.
                // Let's use Medium logic + Center preference for 4x4 to keep it responsive but decent.
                // Check win/block first (Medium logic)
                for (let move of availableMoves) {
                    const temp = [...squares];
                    temp[move] = 'O';
                    if (checkWinner(temp).winner === 'O') return move;
                }
                for (let move of availableMoves) {
                    const temp = [...squares];
                    temp[move] = 'X';
                    if (checkWinner(temp).winner === 'X') return move;
                }
                // Prefer center/corners
                const center = [5, 6, 9, 10]; // 4x4 center indices
                const corners = [0, 3, 12, 15];
                const bestPos = [...center, ...corners].filter(p => availableMoves.includes(p));
                if (bestPos.length > 0) return bestPos[Math.floor(Math.random() * bestPos.length)];

                return availableMoves[Math.floor(Math.random() * availableMoves.length)];
            }

            // Minimax for 3x3
            let bestScore = -Infinity;
            let move = -1;

            for (let i of availableMoves) {
                squares[i] = 'O';
                let score = minimax(squares, 0, false);
                squares[i] = null;
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
            return move;
        }

        return availableMoves[0];
    };

    const minimax = (squares: Player[], depth: number, isMaximizing: boolean): number => {
        const result = checkWinner(squares);
        if (result.winner === 'O') return 10 - depth;
        if (result.winner === 'X') return depth - 10;
        if (result.winner === 'draw') return 0;

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < squares.length; i++) {
                if (squares[i] === null) {
                    squares[i] = 'O';
                    let score = minimax(squares, depth + 1, false);
                    squares[i] = null;
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < squares.length; i++) {
                if (squares[i] === null) {
                    squares[i] = 'X';
                    let score = minimax(squares, depth + 1, true);
                    squares[i] = null;
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    };

    const renderSquare = (i: number) => {
        const isWinningSquare = winningLine?.includes(i);
        return (
            <TouchableOpacity
                key={i}
                style={[
                    styles.square,
                    {
                        width: 300 / config.gridSize - 8,
                        height: 300 / config.gridSize - 8,
                        backgroundColor: isWinningSquare ? '#D1FAE5' : 'white'
                    }
                ]}
                onPress={() => handlePress(i)}
                activeOpacity={0.7}
            >
                {board[i] === 'X' && <Rocket size={40} color={Colors.primary} />}
                {board[i] === 'O' && <Sparkles size={40} color={Colors.spacePurple} />}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={[styles.playerBadge, isPlayerTurn && styles.activeBadge]}>
                    <Rocket size={24} color={Colors.primary} />
                    <Text style={styles.playerText}>Sen</Text>
                </View>
                <TouchableOpacity onPress={startNewGame} style={styles.resetButton}>
                    <RefreshCw size={24} color="white" />
                </TouchableOpacity>
                <View style={[styles.playerBadge, !isPlayerTurn && styles.activeBadge]}>
                    <Sparkles size={24} color={Colors.spacePurple} />
                    <Text style={styles.playerText}>Rakip</Text>
                </View>
            </View>

            <View style={styles.board}>
                {Array(config.gridSize).fill(0).map((_, row) => (
                    <View key={row} style={styles.row}>
                        {Array(config.gridSize).fill(0).map((_, col) => renderSquare(row * config.gridSize + col))}
                    </View>
                ))}
            </View>

            <View style={styles.statusContainer}>
                {winner === 'X' && <Text style={[styles.statusText, { color: Colors.primary }]}>Kazandın! 🎉</Text>}
                {winner === 'O' && <Text style={[styles.statusText, { color: Colors.spacePurple }]}>Kaybettin 😔</Text>}
                {winner === 'draw' && <Text style={[styles.statusText, { color: '#6B7280' }]}>Berabere 🤝</Text>}
                {!winner && (
                    <Text style={styles.turnText}>
                        {isPlayerTurn ? 'Sıra Sende' : 'Rakip Düşünüyor...'}
                    </Text>
                )}
            </View>
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
        marginBottom: 32,
        paddingHorizontal: 16,
    },
    playerBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderRadius: 12,
        gap: 8,
        opacity: 0.5,
    },
    activeBadge: {
        backgroundColor: 'white',
        opacity: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    playerText: {
        fontWeight: '700',
        color: '#374151',
    },
    resetButton: {
        backgroundColor: Colors.energyOrange,
        padding: 12,
        borderRadius: 50,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    board: {
        backgroundColor: '#E5E7EB',
        padding: 12,
        borderRadius: 16,
        gap: 8,
    },
    row: {
        flexDirection: 'row',
        gap: 8,
    },
    square: {
        backgroundColor: 'white',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 1,
    },
    statusContainer: {
        marginTop: 32,
        alignItems: 'center',
    },
    statusText: {
        fontSize: 32,
        fontWeight: '800',
    },
    turnText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#6B7280',
    },
});
