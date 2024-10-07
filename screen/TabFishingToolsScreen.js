import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { MainLayout } from '../components/Layout';
import { FisherHandbook } from '../data/handbook';
import { useNavigation } from '@react-navigation/native';

const seasonalAccents = [
  '#00A86B', // Spring: Jade Green
  '#FFA500', // Summer: Orange
  '#8B4513', // Autumn: Saddle Brown
  '#4682B4', // Winter: Steel Blue
];

const HandbookCard = ({ item, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <LinearGradient
      colors={['#1a1a1a', '#2a2a2a', '#3a3a3a']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.card}
    >
      <LinearGradient
        colors={seasonalAccents}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.accentBar}
      />
      <View style={styles.cardContent}>
        <Image source={item.image} style={styles.cardImage} />
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDescription}>
          Tap to learn more about {item.title.toLowerCase()}
        </Text>
      </View>
    </LinearGradient>
  </TouchableOpacity>
);

const TabFishingToolsScreen = () => {
  const navigation = useNavigation();

  const handleCardPress = (item) => {
    navigation.navigate('StackHandBookDetails', { item });
  };

  return (
    <MainLayout blur={40}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.screenTitle}>Fishing Handbook</Text>
        {FisherHandbook.map((item) => (
          <HandbookCard
            key={item.id}
            item={item}
            onPress={() => handleCardPress(item)}
          />
        ))}
      </ScrollView>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
  },
  accentBar: {
    height: 10,
    width: '100%',
  },
  cardContent: {
    padding: 20,
  },
  cardImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    borderRadius: 8,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: '#cccccc',
  },
});

export default TabFishingToolsScreen;
