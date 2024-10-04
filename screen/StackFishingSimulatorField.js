import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Dimensions, ImageBackground, Text, ScrollView, Animated } from 'react-native';
import { fishData } from '../data/fishData';

const ANIMATION_DURATION = 500;
const MAX_FISH = 6;

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
    
    const newFishes = seasonFishRef.current.slice(0, MAX_FISH).map(fish => createFish(fish));
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
    if (fishes.length < MAX_FISH && seasonFishRef.current.length > 0) {
      const availableFish = seasonFishRef.current.filter(fish => !fishes.some(f => f.id === fish.id));
      if (availableFish.length > 0) {
        const newFish = createFish(availableFish[Math.floor(Math.random() * availableFish.length)]);
        setFishes(prevFishes => [...prevFishes, newFish]);
        Animated.timing(newFish.opacity, {
          toValue: 1,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }).start();
      }
    }
  }, [fishes, createFish]);

  const queueFishRegeneration = useCallback(() => {
    const timerId = setTimeout(() => {
      respawnFish();
      regenerationQueueRef.current = regenerationQueueRef.current.filter(id => id !== timerId);
    }, 2000);
    regenerationQueueRef.current.push(timerId);
  }, [respawnFish]);

  const catchFish = useCallback((index) => {
    const caughtFish = fishes[index];
    console.log(`Caught fish: ${caughtFish.name}`);
    setCaughtFish(prev => [...prev, caughtFish]);
    
    Animated.timing(caughtFish.opacity, {
      toValue: 0,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
    }).start(() => {
      setFishes(prevFishes => prevFishes.filter((_, i) => i !== index));
      if (fishes.length <= 3) {
        respawnFish();
      }
      queueFishRegeneration();
    });
  }, [fishes, respawnFish, queueFishRegeneration]);

  const CaughtFishDisplay = useMemo(() => {
    return () => (
      <View style={styles.caughtFishContainer}>
        <Text style={styles.caughtFishTitle}>Caught Fish:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {caughtFish.map((fish, index) => (
            <View key={index} style={styles.caughtFishItem}>
              <Image source={fish.image} style={styles.caughtFishImage} />
              <Text style={styles.caughtFishName}>{fish.name}</Text>
            </View>
          ))}
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
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  caughtFishTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  caughtFishItem: {
    alignItems: 'center',
    marginRight: 10,
  },
  caughtFishImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  caughtFishName: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default StackFishingSimulatorField;