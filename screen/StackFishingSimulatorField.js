import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Dimensions, ImageBackground, Text, ScrollView, Animated } from 'react-native';
import { fishData } from '../data/fishData';

const ANIMATION_DURATION = 500;
const MAX_FISH = 6;
const MIN_FISH = 3;

const StackFishingSimulatorField = ({ route }) => {
  const { season } = route.params;
  const IMAGE = season.image;
  const [fishes, setFishes] = useState([]);
  const [caughtFish, setCaughtFish] = useState([]);
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
    }, 2000);
    regenerationQueueRef.current.push(timerId);
  }, [respawnFish]);

  const catchFish = useCallback((index) => {
    const caughtFish = fishes[index];
    const originalFish = fishData.find(f => f.id === caughtFish.id);
    console.log(`Caught fish: ${originalFish.name}`);
    setCaughtFish(prev => [...prev, originalFish]);
    
    Animated.timing(caughtFish.opacity, {
      toValue: 0,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
    }).start(() => {
      setFishes(prevFishes => {
        const updatedFishes = prevFishes.filter((_, i) => i !== index);
        if (updatedFishes.length < MIN_FISH) {
          respawnFish();
        }
        return updatedFishes;
      });
      queueFishRegeneration();
    });
  }, [respawnFish, queueFishRegeneration]);

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
        <Text style={styles.caughtFishTitle}>Caught Fish:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.caughtFishTable}>
            {Object.values(groupedFish).map((fish) => (
              <View key={fish.id} style={styles.caughtFishRow}>
                <Image source={fish.image} style={styles.caughtFishImage} />
                <View style={styles.caughtFishInfo}>
                  <Text style={styles.caughtFishName}>{fish.name}</Text>
                  <Text style={styles.caughtFishCount}>x{fish.count}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }, [caughtFish]);

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
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  caughtFishTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  caughtFishTable: {
    flexDirection: 'row',
  },
  caughtFishRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 10,
    padding: 5,
  },
  caughtFishImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  caughtFishInfo: {
    marginLeft: 5,
  },
  caughtFishName: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  caughtFishCount: {
    fontSize: 12,
  },
});

export default StackFishingSimulatorField;