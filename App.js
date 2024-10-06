import {View, Platform} from 'react-native';
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
} from './screen';
import FishingTabIcon from './components/Icons/FishingTabIcon';
import {QuizTabIcon, ToolsTabIcon} from './components/Icons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

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
          left: 20,
          right: 20,
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
  return (
    <ContextProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
          <Stack.Screen name="TabNavigation" component={TabNavigation} />
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
