import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const TUBE_CAPACITY = 4;
const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#E74C3C', '#3498DB'];

interface ColorTubeGameProps {
  onComplete: (score: number) => void;
}

type Tube = string[];

const generatePuzzle = (difficulty: number): Tube[] => {
  const numColors = Math.min(difficulty + 3, 8);
  const colorPool = COLORS.slice(0, numColors);
  const tubes: Tube[] = [];

  const allColors: string[] = [];
  colorPool.forEach(color => {
    for (let i = 0; i < TUBE_CAPACITY; i++) {
      allColors.push(color);
    }
  });

  for (let i = allColors.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allColors[i], allColors[j]] = [allColors[j], allColors[i]];
  }

  for (let i = 0; i < numColors; i++) {
    tubes.push(allColors.slice(i * TUBE_CAPACITY, (i + 1) * TUBE_CAPACITY));
  }

  tubes.push([]);
  if (difficulty <= 2) {
    tubes.push([]);
  }

  return tubes;
};

const ColorTubeGame: React.FC<ColorTubeGameProps> = ({ onComplete }) => {
  const [tubes, setTubes] = useState<Tube[]>([]);
  const [selectedTube, setSelectedTube] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [level, setLevel] = useState(1);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    initializeGame();
  }, [level]);

  const initializeGame = () => {
    setTubes(generatePuzzle(level));
    setSelectedTube(null);
    setMoves(0);
    setIsComplete(false);
  };

  const getTopColor = (tube: Tube): string | null => {
    return tube.length > 0 ? tube[tube.length - 1] : null;
  };

  const getColorCount = (tube: Tube, color: string): number => {
    let count = 0;
    for (let i = tube.length - 1; i >= 0; i--) {
      if (tube[i] === color) {
        count++;
      } else {
        break;
      }
    }
    return count;
  };

  const canPour = (fromTube: Tube, toTube: Tube): boolean => {
    if (fromTube.length === 0) return false;
    if (toTube.length >= TUBE_CAPACITY) return false;

    const topColor = getTopColor(fromTube);
    if (!topColor) return false;

    if (toTube.length === 0) return true;

    return getTopColor(toTube) === topColor;
  };

  const isTubeComplete = (tube: Tube): boolean => {
    if (tube.length === 0) return true;
    if (tube.length !== TUBE_CAPACITY) return false;
    return tube.every(color => color === tube[0]);
  };

  const checkWin = (currentTubes: Tube[]): boolean => {
    return currentTubes.every(tube => isTubeComplete(tube));
  };

  const handleTubePress = (index: number) => {
    if (isComplete) return;

    if (selectedTube === null) {
      if (tubes[index].length > 0) {
        setSelectedTube(index);
      }
    } else {
      if (selectedTube === index) {
        setSelectedTube(null);
        return;
      }

      const fromTube = tubes[selectedTube];
      const toTube = tubes[index];

      if (canPour(fromTube, toTube)) {
        const newTubes = [...tubes];
        const topColor = getTopColor(fromTube)!;
        const count = getColorCount(fromTube, topColor);
        const spaceInTarget = TUBE_CAPACITY - toTube.length;
        const pourCount = Math.min(count, spaceInTarget);

        for (let i = 0; i < pourCount; i++) {
          newTubes[index].push(newTubes[selectedTube].pop()!);
        }

        setTubes(newTubes);
        setMoves(moves + 1);
        setSelectedTube(null);

        if (checkWin(newTubes)) {
          setIsComplete(true);
          const score = Math.max(1000 - moves * 10, 100);
          setTimeout(() => onComplete(score), 500);
        }
      } else {
        setSelectedTube(null);
      }
    }
  };

  const handleReset = () => {
    initializeGame();
  };

  const handleNextLevel = () => {
    setLevel(level + 1);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Renk Laboratuvarı</Text>
        <Text style={styles.level}>Seviye: {level}</Text>
        <Text style={styles.moves}>Hamle: {moves}</Text>
        {isComplete && <Text style={styles.complete}>Tebrikler! 🎉</Text>}
      </View>

      <View style={styles.tubesContainer}>
        {tubes.map((tube, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.tubeWrapper,
              selectedTube === index && styles.selectedTube,
            ]}
            onPress={() => handleTubePress(index)}
          >
            <View style={styles.tube}>
              {Array.from({ length: TUBE_CAPACITY }).map((_, layerIndex) => {
                const colorIndex = layerIndex;
                const color = tube[colorIndex];
                return (
                  <View
                    key={layerIndex}
                    style={[
                      styles.layer,
                      { backgroundColor: color || 'transparent' },
                    ]}
                  />
                );
              })}
            </View>
            <View style={styles.tubeBase} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleReset}>
          <Text style={styles.buttonText}>Yeniden Başlat</Text>
        </TouchableOpacity>
        {isComplete && (
          <TouchableOpacity style={styles.button} onPress={handleNextLevel}>
            <Text style={styles.buttonText}>Sonraki Seviye</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.instructions}>
        <Text style={styles.instructionText}>
          🧪 Tüpleri tıklayarak sıvıları dökin
        </Text>
        <Text style={styles.instructionText}>
          🎯 Her rengi bir tüpte toplayın
        </Text>
        <Text style={styles.instructionText}>
          ⚗️ Sadece aynı renge veya boş tüpe dökülebilir
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  contentContainer: {
    padding: 16,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  level: {
    fontSize: 18,
    color: '#34495E',
    marginBottom: 4,
  },
  moves: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  complete: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#27AE60',
    marginTop: 8,
  },
  tubesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
    maxWidth: SCREEN_WIDTH - 32,
  },
  tubeWrapper: {
    alignItems: 'center',
    padding: 4,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedTube: {
    borderColor: '#3498DB',
    backgroundColor: '#EBF5FB',
  },
  tube: {
    width: 50,
    height: 160,
    borderWidth: 3,
    borderColor: '#34495E',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomWidth: 0,
    overflow: 'hidden',
    flexDirection: 'column-reverse',
  },
  layer: {
    flex: 1,
    width: '100%',
  },
  tubeBase: {
    width: 60,
    height: 6,
    backgroundColor: '#34495E',
    borderRadius: 3,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3498DB',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  instructions: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
  },
  instructionText: {
    fontSize: 14,
    color: '#34495E',
    marginBottom: 8,
  },
});

export default ColorTubeGame;
