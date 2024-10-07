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
  const [unlockedSeasons, setUnlockedSeasons] = useState(1); // Start with 1 as spring is unlocked by default

  useEffect(() => {
    const initData = async () => {
      try {
        // Initialize quizzes
        const storedBeginnerQuiz = await AsyncStorage.getItem('beginnerQuiz');
        const storedExpertQuiz = await AsyncStorage.getItem('expertQuiz');

        if (storedBeginnerQuiz) {
          setBeginnerQuiz(JSON.parse(storedBeginnerQuiz));
        } else {
          await AsyncStorage.setItem('beginnerQuiz', JSON.stringify(quizBeginner));
          setBeginnerQuiz(quizBeginner);
        }

        if (storedExpertQuiz) {
          setExpertQuiz(JSON.parse(storedExpertQuiz));
        } else {
          await AsyncStorage.setItem('expertQuiz', JSON.stringify(quizExpert));
          setExpertQuiz(quizExpert);
        }

        // Initialize total score
        const storedTotalScore = await AsyncStorage.getItem('totalScore');
        if (storedTotalScore) {
          setTotalScore(parseInt(storedTotalScore, 10));
        } else {
          await AsyncStorage.setItem('totalScore', '0');
          setTotalScore(0);
        }

        // Initialize fish season data
        const storedFishSeason = await AsyncStorage.getItem('fishSeason');
        if (storedFishSeason) {
          setFishSeason(JSON.parse(storedFishSeason));
        } else {
          await AsyncStorage.setItem('fishSeason', JSON.stringify(initialFishSeason));
          setFishSeason(initialFishSeason);
        }

        const storedUnlockedSeasons = await AsyncStorage.getItem('unlockedSeasons');
        if (storedUnlockedSeasons) {
          setUnlockedSeasons(parseInt(storedUnlockedSeasons, 10));
        } else {
          await AsyncStorage.setItem('unlockedSeasons', '1');
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

  const unlockSeason = async (seasonIndex) => {
    try {
      const currentScore = await getTotalScore();
      if (currentScore >= 300) {
        const updatedFishSeason = [...fishSeason];
        updatedFishSeason[seasonIndex].locked = false;
        setFishSeason(updatedFishSeason);
        await AsyncStorage.setItem('fishSeason', JSON.stringify(updatedFishSeason));
        await updateTotalScore(-300);
        setUnlockedSeasons(prev => prev + 1);
        await AsyncStorage.setItem('unlockedSeasons', (unlockedSeasons + 1).toString());
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error unlocking season:', error);
      return false;
    }
  };

  const unlockNextQuizLevel = async (currentLevel, score, totalQuestions) => {
    try {
      const percentage = (score / totalQuestions) * 100;
      if (percentage >= 80 && currentLevel < expertQuiz.length - 1) {
        const updatedExpertQuiz = [...expertQuiz];
        updatedExpertQuiz[currentLevel + 1].locked = false;
        setExpertQuiz(updatedExpertQuiz);
        await AsyncStorage.setItem('expertQuiz', JSON.stringify(updatedExpertQuiz));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error unlocking next quiz level:', error);
      return false;
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
    unlockSeason,
    unlockNextQuizLevel,
    unlockedSeasons,
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
