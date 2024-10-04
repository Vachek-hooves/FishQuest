import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Dimensions, ImageBackground, Text, ScrollView } from 'react-native';
import { fishData } from '../data/fishData';

const StackFishingSimulatorField = ({ route }) => {
  const { season } = route.params;
  const IMAGE = season.image;
  const [fishes, setFishes] = useState([]);
  const [caughtFish, setCaughtFish] = useState([]);
  const animationRef = useRef();

  useEffect(() => {
    generateFishes();
    return () => cancelAnimation();
  }, []);

  const generateFishes = () => {
    const seasonFish = fishData.filter(fish => season.fish.includes(fish.id.toString()));
    
    const newFishes = seasonFish.map(fish => ({
      ...fish,
      x: Math.random() * (Dimensions.get('window').width - fish.width),
      y: Math.random() * (Dimensions.get('window').height / 2 - fish.height) + Dimensions.get('window').height / 2,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5,
    }));
    setFishes(newFishes);
    startAnimation();
  };

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

  const catchFish = useCallback((index) => {
    const caughtFish = fishes[index];
    console.log(`Caught fish: ${caughtFish.name}`);
    setCaughtFish(prev => [...prev, caughtFish]);
    setFishes(prevFishes => {
      const updatedFishes = [...prevFishes];
      updatedFishes.splice(index, 1);
      return updatedFishes;
    });
  }, [fishes]);

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
          <TouchableOpacity
            key={fish.id}
            style={[styles.fish, { left: fish.x, top: fish.y }]}
            onPress={() => catchFish(index)}
          >
            <Image source={fish.image} style={{ width: fish.width, height: fish.height }} />
          </TouchableOpacity>
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
