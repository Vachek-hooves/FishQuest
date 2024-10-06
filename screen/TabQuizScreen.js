import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { MainLayout } from '../components/Layout';
import { useContextProvider } from '../store/context';
import { useNavigation } from '@react-navigation/native';

const seasonalAccents = [
  '#00A86B', // Spring: Jade Green
  '#FFA500', // Summer: Orange
  '#8B4513', // Autumn: Saddle Brown
  '#4682B4', // Winter: Steel Blue
];

const QuizCard = ({ title, description, onPress, locked }) => (
  <TouchableOpacity onPress={onPress} disabled={locked}>
    <LinearGradient
      colors={locked ? ['#4a4a4a', '#3a3a3a', '#2a2a2a'] : ['#1a1a1a', '#2a2a2a', '#3a3a3a']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={[styles.card, locked && styles.lockedCard]}
    >
      <LinearGradient
        colors={locked ? ['#808080', '#A9A9A9'] : seasonalAccents}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.accentBar}
      />
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, locked && styles.lockedText]}>{title}</Text>
        <Text style={[styles.cardDescription, locked && styles.lockedText]}>
          {locked ? 'This quiz is locked. Complete previous quizzes to unlock.' : description}
        </Text>
        {locked && (
          <View style={styles.lockIconContainer}>
            <Text style={styles.lockIcon}>🔒</Text>
          </View>
        )}
      </View>
    </LinearGradient>
  </TouchableOpacity>
);

const TabQuizScreen = () => {
  const { expertQuiz } = useContextProvider();
  const navigation = useNavigation();

  const handleQuizPress = (level) => {
    if (!expertQuiz[level].locked) {
      navigation.navigate('StackQuizGame', { quizType: 'expert', level });
    }
  };

  return (
    <MainLayout blur={40}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Expert Quiz Levels</Text>
        {expertQuiz && expertQuiz.map((quiz, index) => (
          <QuizCard
            key={`expert-${index}`}
            title={quiz.topic || `Expert Quiz ${index + 1}`}
            description={`Challenge your skills on ${quiz.topic || 'advanced fishing'}!`}
            onPress={() => handleQuizPress(index)}
            locked={quiz.locked}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },
  card: {
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
  },
  lockedCard: {
    opacity: 0.7,
  },
  accentBar: {
    height: 5,
    width: '100%',
  },
  cardContent: {
    padding: 20,
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
  lockedText: {
    color: '#808080',
  },
  lockIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  lockIcon: {
    fontSize: 20,
  },
});

export default TabQuizScreen;
