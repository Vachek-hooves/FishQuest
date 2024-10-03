import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Dimensions } from 'react-native';

const FISH_TYPES = [
  { name: 'Trout',width:60, size: 30, image: require('../assets/image/fish/trout.png') ,type:'predator'},
  { name: 'Bass',width:60, size: 40, image: require('../assets/image/fish/bass.png') ,type:'predator'},
  { name: 'Salmon',width:60, size: 50, image: require('../assets/image/fish/salmon.png') ,type:'predator'},
  { name: 'Catfish',width:60, size: 45, image: require('../assets/image/fish/catfish.png') ,type:'prey'},
  { name: 'Perch',width:60, size: 25, image: require('../assets/image/fish/perch.png') ,type:'prey'},
  { name: 'Pike',width:60, size: 45, image: require('../assets/image/fish/pike.png') ,type:'prey'},
];

const StackFishingSimulatorField = () => {
  const [fishes, setFishes] = useState([]);
  const animationRef = useRef();

  useEffect(() => {
    generateFishes();
    return () => cancelAnimation();
  }, []);

  const generateFishes = () => {
    const newFishes = FISH_TYPES.map(fish => ({
      ...fish,
      x: Math.random() * (Dimensions.get('window').width - fish.width),
      y: Math.random() * (Dimensions.get('window').height / 2 - fish.size) + Dimensions.get('window').height / 2,
      dx: (Math.random() - 0.5) * 0.5, // Random speed between -0.25 and 0.25
      dy: (Math.random() - 0.5) * 0.5,
    }));
    setFishes(newFishes);
    startAnimation();
  };

  const startAnimation = () => {
    const animate = () => {
      setFishes(prevFishes => prevFishes.map(fish => {
        let newX = fish.x + fish.dx;
        let newY = fish.y + fish.dy;

        // Bounce off the edges
        if (newX <= 0 || newX >= Dimensions.get('window').width - fish.width) {
          fish.dx *= -1;
          newX = fish.x + fish.dx;
        }
        if (newY <= Dimensions.get('window').height / 2 || newY >= Dimensions.get('window').height - fish.size) {
          fish.dy *= -1;
          newY = fish.y + fish.dy;
        }

        return { ...fish, x: newX, y: newY };
      }));
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();
  };

  const cancelAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const catchFish = (index) => {
    // Implement fish catching logic here
    console.log(`Caught fish: ${fishes[index].name}`);
    const updatedFishes = [...fishes];
    updatedFishes.splice(index, 1);
    setFishes(updatedFishes);
  };

  return (
    <View style={styles.container}>
      <View style={styles.lake}>
        {fishes.map((fish, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.fish, { left: fish.x, top: fish.y }]}
            onPress={() => catchFish(index)}
          >
            <Image source={fish.image} style={{ width: fish.width, height: fish.size }} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default StackFishingSimulatorField;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lake: {
    height: Dimensions.get('window').height / 2,
    backgroundColor: '#87CEEB',
    position: 'relative',
  },
  fish: {
    position: 'absolute',
  },
});
