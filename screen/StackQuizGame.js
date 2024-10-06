import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useContextProvider } from '../store/context';
import LinearGradient from 'react-native-linear-gradient';
import QuizFeedback from '../components/quizGame/QuizFeedback';
import { MainLayout } from '../components/Layout';
const { width } = Dimensions.get('window');

const ProgressBar = ({ progress }) => (
  <View style={styles.progressBarContainer}>
    <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
  </View>
);

const StackQuizGame = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { quizType, level } = route.params;
  const { expertQuiz, updateTotalScore } = useContextProvider();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQuiz = expertQuiz[level];
  const currentQuestion = currentQuiz.questions[currentQuestionIndex];
  const progress = (currentQuestionIndex + 1) / currentQuiz.questions.length;

  const handleAnswerSelect = (answer) => {
    if (!showFeedback) {
      setSelectedAnswer(answer);
      setShowFeedback(true);
      if (answer === currentQuestion.correctAnswer) {
        setScore(score + 1);
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setQuizCompleted(true);
      updateTotalScore(score); // Update the total score in the context
    }
  };

  const handleRetryQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
    setQuizCompleted(false);
  };

  const handleExitQuiz = () => {
    navigation.goBack();
  };

  const getOptionStyle = (option) => {
    if (!showFeedback) return styles.optionButton;
    if (option === currentQuestion.correctAnswer) {
      return [styles.optionButton, styles.correctOption];
    }
    if (option === selectedAnswer && option !== currentQuestion.correctAnswer) {
      return [styles.optionButton, styles.incorrectOption];
    }
    return styles.optionButton;
  };

  if (quizCompleted) {
    return (
      <QuizFeedback
        score={score}
        totalQuestions={currentQuiz.questions.length}
        onRetry={handleRetryQuiz}
        onExit={handleExitQuiz}
      />
    );
  }

  return (
    <MainLayout blur={40}>
    <SafeAreaView style={styles.container}>
      <ProgressBar progress={progress} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{currentQuiz.topic}</Text>
        <Text style={styles.questionCount}>Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}</Text>
        <Text style={styles.question}>{currentQuestion.question}</Text>
        {currentQuestion.options.map((option, index) => (
          <TouchableOpacity
          key={index}
          style={getOptionStyle(option)}
          onPress={() => handleAnswerSelect(option)}
          disabled={showFeedback}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
        <View style={styles.feedbackContainer}>
          {showFeedback && (
            <Text style={styles.feedbackText}>
              {selectedAnswer === currentQuestion.correctAnswer 
                ? "Correct! Well done!" 
                : `Incorrect. The correct answer is: ${currentQuestion.correctAnswer}`}
            </Text>
          )}
        </View>
        <TouchableOpacity
          style={[styles.nextButton, !showFeedback && styles.disabledButton]}
          onPress={handleNextQuestion}
          disabled={!showFeedback}
          >
          <Text style={styles.nextButtonText}>
            {currentQuestionIndex === currentQuiz.questions.length - 1 ? 'Finish' : 'Next'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
            </MainLayout>
    
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: '#1a1a1a',
  },
  progressBarContainer: {
    width: '100%',
    height: 10,
    backgroundColor: '#2a2a2a',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#00A86B',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40, // Add extra padding at the bottom
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },
  questionCount: {
    fontSize: 16,
    color: '#cccccc',
    marginBottom: 10,
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#2a2a2a',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  correctOption: {
    backgroundColor: '#4CAF50',
  },
  incorrectOption: {
    backgroundColor: '#F44336',
  },
  optionText: {
    color: '#ffffff',
    fontSize: 16,
  },
  feedbackContainer: {
    minHeight: 60, // Set a minimum height to prevent jumping
    justifyContent: 'center',
  },
  feedbackText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: '#00A86B',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#4a4a4a',
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default StackQuizGame;