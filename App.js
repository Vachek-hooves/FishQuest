import {Platform, AppState,View,Animated} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {ContextProvider} from './store/context';
import WelcomeScreen from './screen/WelcomeScreen';
import {
  StackFishingSimulatorField,
  TabFishingIntroScreen,
  StackSeasonFishing,
  TanFishingToolsScreen,
  TabQuizScreen,
  StackQuizGame,
  StackHandBookDetail,
  TabFishingMan,
} from './screen';
import FishingTabIcon from './components/Icons/FishingTabIcon';
import {FishingManIcon, QuizTabIcon, ToolsTabIcon} from './components/Icons';
import {
  playBackgroundMusic,
  resetPlayer,
} from './components/soundSystem/setupPlayer';
import {useEffect, useState,useRef} from 'react';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const loaders = [
  require('./assets/image/loaders/slide1.png'),
  require('./assets/image/loaders/slide2.jpg'),
];

const TabNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(116,204,244,0.9)',
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: -5},
          shadowOpacity: 0.1,
          shadowRadius: 10,
          borderRadius: 15,
          height: 70,
          position: 'absolute',
          bottom: 20,
          left: 10,
          right: 10,
          paddingBottom: Platform.OS === 'ios' ? 20 : 0,
          paddingTop: 30,
        },
        tabBarItemStyle: {
          paddingTop: 5,
        },
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.6)',
        title: '',
      }}>
      <Tab.Screen
        name="TabFishingMan"
        component={TabFishingMan}
        options={{
          title: '',
          tabBarIcon: ({focused}) => <FishingManIcon focused={focused} />,
        }}
      />
      <Tab.Screen
        name="TabFishingIntroScreen"
        component={TabFishingIntroScreen}
        options={{
          title: '',
          tabBarIcon: ({color, size, focused}) => (
            <FishingTabIcon focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="FishingTools"
        component={TanFishingToolsScreen}
        options={{
          title: '',
          tabBarIcon: ({focused}) => <ToolsTabIcon focused={focused} />,
        }}
      />
      <Tab.Screen
        name="QuizScreen"
        component={TabQuizScreen}
        options={{
          title: '',
          tabBarIcon: ({focused}) => <QuizTabIcon focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
};

function App() {
  const [id, setItem] = useState(0);
  const anime = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const initializePlayer = async () => {
      try {
        await playBackgroundMusic();
      } catch (error) {
        console.error('Error initializing player:', error);
      }
    };

    initializePlayer();

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        resetPlayer();
      } else if (nextAppState === 'active') {
        playBackgroundMusic();
      }
    });

    return () => {
      subscription.remove();
      resetPlayer();
    };
  }, []);

  useEffect(() => {
    fadeStart();
    const timeOut = setTimeout(() => {
      navigateToMenu();
    }, 6000);
    return () => clearTimeout(timeOut);
  }, []);
  
  const fadeStart = () => {
    Animated.timing(anime, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start(() => fadeFinish());
  };

  const fadeFinish = () => {
    Animated.timing(anime, {
      toValue: 0,
      duration: 1500,
      useNativeDriver: true,
    }).start(() => {
      setItem(prevState => prevState + 1);
      fadeStart();
    });
  };
  const navigateToMenu = () => {
    setItem(2);
  };


  return (
    <ContextProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
        {
              id < 2 ? (
                <Stack.Screen name="Welcome" options={{headerShown: false}}>
                  {() => (
                    <View style={{flex: 1}}>
                      <Animated.Image
                        source={loaders[id]}
                        style={[
                          {width: '100%', flex: 1},
                          {opacity: anime},
                        ]}></Animated.Image>
                    </View>
                  )}
                </Stack.Screen>
              ) : (
                <Stack.Screen
                  name="WelcomeScreen"
                  component={WelcomeScreen}
                />
              )
            }
          {/* <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} /> */}
          <Stack.Screen
            name="TabNavigation"
            component={TabNavigation}
            options={{
              gestureEnabled: false,
              headerLeft: () => null,
            }}
          />
          <Stack.Screen
            name="StackFishingSimulatorField"
            component={StackFishingSimulatorField}
          />
          <Stack.Screen
            name="StackSeasonFishing"
            component={StackSeasonFishing}
          />
          <Stack.Screen name="StackQuizGame" component={StackQuizGame} />
          <Stack.Screen
            name="StackHandBookDetails"
            component={StackHandBookDetail}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ContextProvider>
  );
}

export default App;
