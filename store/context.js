import {createContext, useEffect, useState, useContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { quizBeginner, quizExpert } from '../data/quizData';

export const Context = createContext();

export const ContextProvider = ({children}) => {
  const [beginnerQuiz, setBeginnerQuiz] = useState(null);
  const [expertQuiz, setExpertQuiz] = useState(null);

  useEffect(() => {
    const initQuizData = async () => {
      try {
        // Initialize beginner quiz
        const storedBeginnerQuiz = await AsyncStorage.getItem('quizBeginner');
        if (storedBeginnerQuiz) {
          setBeginnerQuiz(JSON.parse(storedBeginnerQuiz));
        } else {
          await AsyncStorage.setItem('quizBeginner', JSON.stringify(quizBeginner));
          setBeginnerQuiz(quizBeginner);
        }

        // Initialize expert quiz
        const storedExpertQuiz = await AsyncStorage.getItem('quizExpert');
        if (storedExpertQuiz) {
          setExpertQuiz(JSON.parse(storedExpertQuiz));
        } else {
          await AsyncStorage.setItem('quizExpert', JSON.stringify(quizExpert));
          setExpertQuiz(quizExpert);
        }
      } catch (error) {
        console.error('Error initializing quiz data:', error);
      }
    };

    initQuizData();
  }, []);

  const value = {
    beginnerQuiz,
    setBeginnerQuiz,
    expertQuiz,
    setExpertQuiz,
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
