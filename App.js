import {useEffect, useState} from 'react';
import {Platform, View, TouchableOpacity, Image, AppState} from 'react-native';
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
  cleanupPlayer,
  setupPlayer,
  playBackgroundMusic,
  toggleBackgroundMusic,
} from './components/soundSystem/setupPlayer';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  const [isPlayMusic, setIsPlayMusic] = useState(false);

  useEffect(() => {
    const initSound = async () => {
      await setupPlayer();
      playBackgroundMusic();
      setIsPlayMusic(true);
    };

    initSound();

    return () => {
      cleanupPlayer();
    };
  }, []);

  const handlePlayMusicToggle = () => {
    const newState = toggleBackgroundMusic();
    setIsPlayMusic(newState);
    // setIsPlayMusic(prev => !prev);
  };

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
          height: 95,
          position: 'absolute',
          bottom: 5,
          left: 5,
          right: 5,
          paddingBottom: Platform.OS === 'ios' ? 20 : 0,
          paddingTop: 5,
          paddingLeft: 3,
          paddingRight: 3,
        },
        tabBarItemStyle: {
          paddingTop: 5,
        },
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.6)',
        title: '',
        tabBarHideOnKeyboard: true,
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
      <Tab.Screen
        name="Sound"
        component={NoComponent}
        options={{
          // tabBarLabel: 'Sound',
          tabBarIcon: ({}) => (
            <View
              style={{
                backgroundColor: isPlayMusic
                  ? 'rgba(116,204,24,0.5)'
                  : 'rgba(116,204,244,0.1)',
                  // : 'rgba(116,204,24,0.5)',
                padding: 5,
                borderRadius: 10,
              }}>
              <TouchableOpacity onPress={handlePlayMusicToggle}>
                <Image
                  source={require('./assets/image/icons/musica.png')}
                  style={{width: 70, height: 70}}
                />
              </TouchableOpacity>
            </View>
          ),
        }}
        listeners={{tabPress: e => e.preventDefault()}}
      />
    </Tab.Navigator>
  );
};

const NoComponent = () => null;

function App() {
  // useEffect(() => {
  //   const initializePlayer = async () => {
  //     try {
  //       await playBackgroundMusic();
  //     } catch (error) {
  //       console.error('Error initializing player:', error);
  //     }
  //   };

  //   initializePlayer();

  //   const subscription = AppState.addEventListener('change', nextAppState => {
  //     if (nextAppState === 'background' || nextAppState === 'inactive') {
  //       resetPlayer();
  //     } else if (nextAppState === 'active') {
  //       playBackgroundMusic();
  //     }
  //   });

  //   return () => {
  //     subscription.remove();
  //     resetPlayer();
  //   };
  // }, []);
  return (
    <ContextProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
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
