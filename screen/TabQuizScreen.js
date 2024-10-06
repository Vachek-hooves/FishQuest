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

const QuizCard = ({ title, description, onPress }) => (
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
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
      </View>
    </LinearGradient>
  </TouchableOpacity>
);

const TabQuizScreen = () => {
  const { beginnerQuiz, expertQuiz } = useContextProvider();
  const navigation = useNavigation();

  const handleQuizPress = (quizType, level) => {
    navigation.navigate('StackQuizGame', { quizType, level });
  };

  return (
    <MainLayout blur={40}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Quiz Levels</Text>
        <Text style={styles.sectionTitle}>Beginner Quizzes</Text>
        {beginnerQuiz && beginnerQuiz.map((quiz, index) => (
          <QuizCard
            key={`beginner-${index}`}
            title={quiz.topic || `Beginner Quiz ${index + 1}`}
            description={`Test your knowledge on ${quiz.topic || 'fishing'}!`}
            onPress={() => handleQuizPress('beginner', index)}
          />
        ))}
        <Text style={styles.sectionTitle}>Expert Quizzes</Text>
        {expertQuiz && expertQuiz.map((quiz, index) => (
          <QuizCard
            key={`expert-${index}`}
            title={quiz.topic || `Expert Quiz ${index + 1}`}
            description={`Challenge your skills on ${quiz.topic || 'advanced fishing'}!`}
            onPress={() => handleQuizPress('expert', index)}
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 15,
    marginBottom: 10,
  },
  card: {
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
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
});

export default TabQuizScreen;
