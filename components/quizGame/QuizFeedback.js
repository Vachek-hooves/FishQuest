import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const QuizFeedback = ({ score, totalQuestions, onRetry, onExit }) => {
  const percentage = (score / totalQuestions) * 100;

  const getFeedbackMessage = () => {
    if (percentage === 100) return "Perfect! You're a fishing expert!";
    if (percentage >= 80) return "Great job! You know your stuff!";
    if (percentage >= 60) return "Good effort! Keep practicing!";
    return "Don't give up! Try again to improve your score.";
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quiz Completed!</Text>
      <Text style={styles.score}>Your Score: {score}/{totalQuestions}</Text>
      <Text style={styles.percentage}>{percentage.toFixed(0)}%</Text>
      <Text style={styles.message}>{getFeedbackMessage()}</Text>
      <TouchableOpacity style={styles.button} onPress={onRetry}>
        <Text style={styles.buttonText}>Retry Quiz</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.exitButton]} onPress={onExit}>
        <Text style={styles.buttonText}>Exit to Quiz Menu</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },
  score: {
    fontSize: 20,
    color: '#ffffff',
    marginBottom: 10,
  },
  percentage: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#00A86B',
    marginBottom: 20,
  },
  message: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#00A86B',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  exitButton: {
    backgroundColor: '#4a4a4a',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default QuizFeedback;