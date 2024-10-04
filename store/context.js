import {createContext, useEffect, useState, useContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { quizBeginner, quizExpert } from '../data/quizData';
import { fishData as initialFishData } from '../data/fishData';
import { fishSeason as initialFishSeason } from '../data/season';

export const Context = createContext();

export const ContextProvider = ({children}) => {
  const [beginnerQuiz, setBeginnerQuiz] = useState(null);
  const [expertQuiz, setExpertQuiz] = useState(null);
  const [fishData, setFishData] = useState(initialFishData);
  const [fishSeason, setFishSeason] = useState(initialFishSeason);
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    const initData = async () => {
      try {
        // Initialize quizzes (as before)
        // ... (keep the existing quiz initialization code)

        // Initialize total score
        const storedTotalScore = await AsyncStorage.getItem('totalScore');
        if (storedTotalScore) {
          setTotalScore(parseInt(storedTotalScore, 10));
        } else {
          await AsyncStorage.setItem('totalScore', '0');
          setTotalScore(0);
        }
      } catch (error) {
        console.error('Error initializing data:', error);
      }
    };

    initData();
  }, []);

  const getTotalScore = async () => {
    try {
      const storedTotalScore = await AsyncStorage.getItem('totalScore');
      return storedTotalScore ? parseInt(storedTotalScore, 10) : 0;
    } catch (error) {
      console.error('Error getting total score:', error);
      return 0;
    }
  };

  const setTotalScoreAsync = async (score) => {
    try {
      await AsyncStorage.setItem('totalScore', score.toString());
      setTotalScore(score);
    } catch (error) {
      console.error('Error setting total score:', error);
    }
  };

  const updateTotalScore = async (increment) => {
    try {
      const currentScore = await getTotalScore();
      const newScore = Math.max(currentScore + increment, 0); // Ensure score doesn't go below 0
      await setTotalScoreAsync(newScore);
      return newScore;
    } catch (error) {
      console.error('Error updating total score:', error);
    }
  };

  const value = {
    beginnerQuiz,
    setBeginnerQuiz,
    expertQuiz,
    setExpertQuiz,
    fishData,
    setFishData,
    fishSeason,
    setFishSeason,
    totalScore,
    getTotalScore,
    setTotalScore: setTotalScoreAsync,
    updateTotalScore,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useContextProvider = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useContextProvider must be used within a ContextProvider');
  }
  return context;
};
