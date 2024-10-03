import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Dimensions } from 'react-native';

const FISH_TYPES = [
  { name: 'Trout',width:60, size: 30, image: require('../assets/image/fish/trout.png') },
  { name: 'Bass',width:60, size: 40, image: require('../assets/image/fish/bass.png') },
  { name: 'Salmon',width:60, size: 50, image: require('../assets/image/fish/salmon.png') },
  { name: 'Catfish',width:60, size: 45, image: require('../assets/image/fish/catfish.png') },
  { name: 'Perch',width:60, size: 25, image: require('../assets/image/fish/perch.png') },
  { name: 'Pike',width:60, size: 45, image: require('../assets/image/fish/pike.png') },
];

const StackFishingSimulatorField = () => {
  const [fishes, setFishes] = useState([]);

  useEffect(() => {
    generateFishes();
  }, []);

  const generateFishes = () => {
    const newFishes = FISH_TYPES.map(fish => ({
      ...fish,
      x: Math.random() * (Dimensions.get('window').width - fish.width),
      y: Math.random() * (Dimensions.get('window').height / 2 - fish.size) + Dimensions.get('window').height / 2,
    }));
    setFishes(newFishes);
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
