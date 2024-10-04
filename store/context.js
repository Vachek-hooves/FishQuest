import {createContext, useEffect, useState, useContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { quizBeginner, quizExpert } from '../data/quizData';
import { fishData as initialFishData } from '../data/fishData';
import { fishSeason as initialFishSeason } from '../data/season';

export const Context = createContext();

export const ContextProvider = ({children}) => {
  const [beginnerQuiz, setBeginnerQuiz] = useState(null);
  const [expertQuiz, setExpertQuiz] = useState(null);
  const [fishData, setFishData] = useState(null);
  const [fishSeason, setFishSeason] = useState(null);

  useEffect(() => {
    const initData = async () => {
      try {
        // Initialize quizzes (as before)
        // ... (keep the existing quiz initialization code)

        // Initialize fish data
        const storedFishData = await AsyncStorage.getItem('fishData');
        if (storedFishData) {
          setFishData(JSON.parse(storedFishData));
        } else {
          await AsyncStorage.setItem('fishData', JSON.stringify(initialFishData));
          setFishData(initialFishData);
        }

        // Initialize fish season data
        const storedFishSeason = await AsyncStorage.getItem('fishSeason');
        if (storedFishSeason) {
          setFishSeason(JSON.parse(storedFishSeason));
        } else {
          await AsyncStorage.setItem('fishSeason', JSON.stringify(initialFishSeason));
          setFishSeason(initialFishSeason);
        }
      } catch (error) {
        console.error('Error initializing data:', error);
      }
    };

    initData();
  }, []);

  const value = {
    beginnerQuiz,
    setBeginnerQuiz,
    expertQuiz,
    setExpertQuiz,
    fishData,
    setFishData,
    fishSeason,
    setFishSeason,
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
