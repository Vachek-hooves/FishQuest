import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {ContextProvider} from './store/context';
import WelcomeScreen from './screen/WelcomeScreen';
import {
  StackFishingSimulatorField,
  TabFishingIntroScreen,
  StackSeasonFishing,
} from './screen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen
        name="TabFishingIntroScreen"
        component={TabFishingIntroScreen}
      />
    </Tab.Navigator>
  );
};

function App() {
  return (
    <ContextProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          {/* <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} /> */}
          <Stack.Screen name="TabNavigation" component={TabNavigation} />
          <Stack.Screen
            name="StackFishingSimulatorField"
            component={StackFishingSimulatorField}
          />
          <Stack.Screen
            name="StackSeasonFishing"
            component={StackSeasonFishing}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ContextProvider>
  );
}

export default App;
