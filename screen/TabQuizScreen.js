import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {MainLayout} from '../components/Layout';
import {useContextProvider} from '../store/context';
import {useNavigation} from '@react-navigation/native';

const seasonalColors = [
  '#87CEEB', // Spring: Sky Blue
  '#32CD32', // Summer: Lime Green
  '#D2691E', // Autumn: Chocolate
  '#4169E1', // Winter: Royal Blue
];

const QuizCard = ({title, description, onPress}) => (
  <TouchableOpacity onPress={onPress}>
    <LinearGradient
      colors={seasonalColors}
      start={{x: 0, y: 0}}
      end={{x: 2, y: 2}}
      style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

const TabQuizScreen = () => {
  const {beginnerQuiz, expertQuiz} = useContextProvider();
  const navigation = useNavigation();

  const handleQuizPress = (quizType, level) => {
    navigation.navigate('StackQuizGame', {quizType, level});
  };

  return (
    <MainLayout blur={40}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Quiz Levels</Text>
        <Text style={styles.sectionTitle}>Beginner Quizzes</Text>
        {beginnerQuiz &&
          beginnerQuiz.map((quiz, index) => (
            <QuizCard
              key={`beginner-${index}`}
              title={quiz.topic || `Beginner Quiz ${index + 1}`}
              description={`Test your knowledge on ${quiz.topic || 'fishing'}!`}
              onPress={() => handleQuizPress('beginner', index)}
            />
          ))}
        <Text style={styles.sectionTitle}>Expert Quizzes</Text>
        {expertQuiz &&
          expertQuiz.map((quiz, index) => (
            <QuizCard
              key={`expert-${index}`}
              title={quiz.topic || `Expert Quiz ${index + 1}`}
              description={`Challenge your skills on ${
                quiz.topic || 'advanced fishing'
              }!`}
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
    // color: '#ffffff',
    marginTop: 15,
    marginBottom: 10,
    color: '#4169E1',
  },
  card: {
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    // color: '#ffffff',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
    color: '#D2691E',
  },
  cardDescription: {
    fontSize: 14,
    color: '#D2691E',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
});

export default TabQuizScreen;
