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

const OptionButton = ({ option, onPress, disabled, isSelected, isCorrect, showFeedback }) => (
  <TouchableOpacity onPress={onPress} disabled={disabled}>
    <LinearGradient
      colors={
        showFeedback && (isCorrect || isSelected)
          ? isCorrect
            ? ['#4CAF50', '#45a049']
            : ['#F44336', '#d32f2f']
          : ['#2c3e50', '#34495e']
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[
        styles.optionButton,
        showFeedback && isCorrect && styles.correctOption,
        showFeedback && isSelected && !isCorrect && styles.incorrectOption,
      ]}
    >
      <Text style={styles.optionText}>{option}</Text>
    </LinearGradient>
  </TouchableOpacity>
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
      <MainLayout blur={40}>
        <QuizFeedback
          score={score}
          totalQuestions={currentQuiz.questions.length}
          onRetry={handleRetryQuiz}
          onExit={handleExitQuiz}
        />
      </MainLayout>
    );
  }

  return (
    <MainLayout blur={40}>
      <SafeAreaView style={styles.container}>
        <ProgressBar progress={progress} />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.quizContainer}>
            <Text style={styles.title}>{currentQuiz.topic}</Text>
            <Text style={styles.questionCount}>Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}</Text>
            <Text style={styles.question}>{currentQuestion.question}</Text>
            {currentQuestion.options.map((option, index) => (
              <OptionButton
                key={index}
                option={option}
                onPress={() => handleAnswerSelect(option)}
                disabled={showFeedback}
                isSelected={selectedAnswer === option}
                isCorrect={option === currentQuestion.correctAnswer}
                showFeedback={showFeedback}
              />
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
          </View>
        </ScrollView>
      </SafeAreaView>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  quizContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark, slightly transparent black
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  questionCount: {
    fontSize: 16,
    color: '#cccccc',
    marginBottom: 10,
    textAlign: 'center',
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionButton: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth: 2,
    borderColor: '#3498db',
  },
  correctOption: {
    borderColor: '#2ecc71',
    borderWidth: 3,
  },
  incorrectOption: {
    borderColor: '#e74c3c',
    borderWidth: 3,
  },
  optionText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
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