// Game type to emoji mapping for visual representation
export const getGameEmoji = (gameType: string, category?: string): string => {
    // First check by game type
    const typeMap: Record<string, string> = {
        // Math games - using text symbols for white color
        'addition': '+',
        'subtraction': '−',
        'multiplication': '×',
        'division': '÷',

        // Memory games
        'memory_match': '🃏',
        'memory_cards': '🃏',
        'picture_memory': '🖼️',
        'image_memory': '📸',
        'minesweeper': '💣',

        // Word/Language games
        'word_hunt': '🔍',
        'letter_sort': '🔤',
        'hangman': '👻',
        'picture_word': '🏷️',
        'emoji_word': '😀',

        // Logic games
        'logic_puzzle': '🧠',
        'pattern': '🔷',
        'pattern_complete': '🔷',
        'tic_tac_toe': '⭕',

        // Science games
        'science_quiz': '🔬',
        'experiments': '⚗️',
        'color_lab': '🧪',

        // Fun games
        'color_tube': '🧪',
        'bubble_shooter': '🎈',
        'mahjong': '🀄',
        'mahjong-solitaire': '🀄',
        'jigsaw': '🧩',
        'jigsaw-puzzle': '🧩',
    };

    if (gameType && typeMap[gameType]) {
        return typeMap[gameType];
    }

    // Fallback to category
    const categoryMap: Record<string, string> = {
        'math': '🔢',
        'memory': '🧠',
        'language': '📚',
        'logic': '💡',
        'science': '🔬',
        'fun': '🫧',
    };

    if (category && categoryMap[category]) {
        return categoryMap[category];
    }

    // Default fallback
    return '🎯';
};

// Get background color based on category
export const getCategoryColor = (category: string): string => {
    const colorMap: Record<string, string> = {
        'math': '#4299E1',    // Blue
        'memory': '#9F7AEA',  // Purple
        'language': '#48BB78', // Green
        'logic': '#ED8936',   // Orange
        'science': '#38B2AC', // Teal
        'fun': '#E53E3E',     // Red
    };

    return colorMap[category] || '#718096';
};
