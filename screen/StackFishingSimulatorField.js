import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Dimensions, ImageBackground, Text, ScrollView, Animated, SafeAreaView } from 'react-native';
import { useContextProvider } from '../store/context';

const ANIMATION_DURATION = 500;
const MAX_FISH = 6;
const MIN_FISH = 3;

const StackFishingSimulatorField = ({ route }) => {
  const { season } = route.params;
  const { fishData } = useContextProvider();
  const IMAGE = season.image;
  const [fishes, setFishes] = useState([]);
  const [caughtFish, setCaughtFish] = useState([]);
  const [score, setScore] = useState(0);
  const animationRef = useRef();
  const seasonFishRef = useRef([]);
  const regenerationQueueRef = useRef([]);
  const fishIdCounterRef = useRef(0);

  useEffect(() => {
    generateFishes();
    return () => {
      cancelAnimation();
      regenerationQueueRef.current.forEach(clearTimeout);
    };
  }, []);

  const getNextFishId = useCallback(() => {
    fishIdCounterRef.current += 1;
    return `fish_${fishIdCounterRef.current}`;
  }, []);

  const createFish = useCallback((baseFish) => {
    return {
      ...baseFish,
      uniqueId: getNextFishId(),
      x: Math.random() * (Dimensions.get('window').width - baseFish.width),
      y: Math.random() * (Dimensions.get('window').height / 2 - baseFish.height) + Dimensions.get('window').height / 2,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5,
      opacity: new Animated.Value(0),
    };
  }, [getNextFishId]);

  const generateFishes = useCallback(() => {
    seasonFishRef.current = fishData.filter(fish => season.fish.includes(fish.id.toString()));
    
    const newFishes = Array(MAX_FISH).fill().map(() => {
      const randomFish = seasonFishRef.current[Math.floor(Math.random() * seasonFishRef.current.length)];
      return createFish(randomFish);
    });

    setFishes(newFishes);
    newFishes.forEach(fish => {
      Animated.timing(fish.opacity, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }).start();
    });
    startAnimation();
  }, [season, createFish]);

  const startAnimation = useCallback(() => {
    const animate = () => {
      setFishes(prevFishes => prevFishes.map(fish => {
        let newX = fish.x + fish.dx;
        let newY = fish.y + fish.dy;

        // Bounce off the edges
        if (newX <= 0 || newX >= Dimensions.get('window').width - fish.width) {
          fish.dx *= -1;
          newX = fish.x + fish.dx;
        }
        if (newY <= Dimensions.get('window').height / 2 || newY >= Dimensions.get('window').height - fish.height) {
          fish.dy *= -1;
          newY = fish.y + fish.dy;
        }

        return { ...fish, x: newX, y: newY };
      }));
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();
  }, []);

  const cancelAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, []);

  const respawnFish = useCallback(() => {
    setFishes(prevFishes => {
      if (prevFishes.length >= MAX_FISH) return prevFishes;

      const numToAdd = Math.min(MAX_FISH - prevFishes.length, seasonFishRef.current.length);
      const newFishes = Array(numToAdd).fill().map(() => {
        const randomFish = seasonFishRef.current[Math.floor(Math.random() * seasonFishRef.current.length)];
        return createFish(randomFish);
      });

      newFishes.forEach(fish => {
        Animated.timing(fish.opacity, {
          toValue: 1,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }).start();
      });

      return [...prevFishes, ...newFishes];
    });
  }, [createFish]);

  const queueFishRegeneration = useCallback(() => {
    const timerId = setTimeout(() => {
      respawnFish();
      regenerationQueueRef.current = regenerationQueueRef.current.filter(id => id !== timerId);
    }, 4000);
    regenerationQueueRef.current.push(timerId);
  }, [respawnFish]);

  const catchFish = useCallback((index) => {
    setFishes(prevFishes => {
      if (index >= prevFishes.length) {
        console.log("Fish no longer exists");
        return prevFishes;
      }
  
      const caughtFish = prevFishes[index];
      const originalFish = fishData.find(f => f.id === caughtFish.id);
      
      if (!originalFish) {
        console.log("Original fish data not found");
        return prevFishes;
      }
  
      console.log(`Caught fish: ${originalFish.name}`);
      
      setCaughtFish(prev => [...prev, originalFish]);
  
      setScore(prevScore => {
        let newScore = prevScore;
        if (season.task === 'predator') {
          newScore += originalFish.type === 'predator' ? 20 : -10;
        } else if (season.task === 'prey') {
          newScore += originalFish.type === 'prey' ? 20 : -10;
        }
        return Math.max(newScore, 0); // Ensure score doesn't go below 0
      });
  
      Animated.timing(caughtFish.opacity, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }).start();
  
      const updatedFishes = prevFishes.filter((_, i) => i !== index);
      
      if (updatedFishes.length < MIN_FISH) {
        respawnFish();
      }
      
      queueFishRegeneration();
  
      return updatedFishes;
    });
  }, [respawnFish, queueFishRegeneration, season.task]);

  const CaughtFishDisplay = useMemo(() => {
    const groupedFish = caughtFish.reduce((acc, fish) => {
      if (!acc[fish.id]) {
        acc[fish.id] = { ...fish, count: 0 };
      }
      acc[fish.id].count += 1;
      return acc;
    }, {});

    return () => (
      <View style={styles.caughtFishContainer}>
        <SafeAreaView>
          <Text style={styles.scoreText}>Score: {score}</Text>
          <Text style={styles.taskText}>Task: Catch {season.task}</Text>
        </SafeAreaView>
        <Text style={styles.caughtFishTitle}>Caught Fish:</Text>
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, styles.imageCell]}>Fish</Text>
          <Text style={[styles.headerCell, styles.nameCell]}>Name</Text>
          <Text style={[styles.headerCell, styles.countCell]}>Count</Text>
        </View>
        <ScrollView style={styles.tableBody}>
          {Object.values(groupedFish).map((fish) => (
            <View key={fish.id} style={styles.tableRow}>
              <View style={styles.imageCell}>
                <Image source={fish.image} style={styles.caughtFishImage} />
              </View>
              <Text style={styles.nameCell}>{fish.name}</Text>
              <Text style={styles.countCell}>{fish.count}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }, [caughtFish, score, season.task]);

  return (
    <View style={styles.container}>
      <ImageBackground source={IMAGE} style={styles.lake}>
        <CaughtFishDisplay />
        {fishes.map((fish, index) => (
          <Animated.View
            key={fish.uniqueId}
            style={[
              styles.fish,
              {
                left: fish.x,
                top: fish.y,
                opacity: fish.opacity,
              },
            ]}
          >
            <TouchableOpacity onPress={() => catchFish(index)}>
              <Image source={fish.image} style={{ width: fish.width, height: fish.height }} />
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lake: {
    flex: 1,
    backgroundColor: '#87CEEB',
    position: 'relative',
  },
  fish: {
    position: 'absolute',
  },
  caughtFishContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    maxHeight: '40%', // Adjust this value as needed
  },
  caughtFishTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 5,
    marginBottom: 5,
  },
  headerCell: {
    fontWeight: 'bold',
  },
  tableBody: {
    flexGrow: 0,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  imageCell: {
    width: '25%',
    alignItems: 'center',
  },
  nameCell: {
    width: '50%',
  },
  countCell: {
    width: '25%',
    textAlign: 'center',
  },
  caughtFishImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  taskText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default StackFishingSimulatorField;