import React from 'react';
import { View, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { ContextProvider } from './store/context';
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
    <Tab.Navigator
      screenOptions={{
        
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(116,204,244,0.9)',
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -5 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          borderRadius: 15,
          height: 60,
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          paddingBottom: Platform.OS === 'ios' ? 20 : 0,
        },
        tabBarItemStyle: {
          paddingTop: 5,
        },
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.6)',
        title: '',
      }}
    >
      <Tab.Screen
        name="TabFishingIntroScreen"
        component={TabFishingIntroScreen}
        options={{
          title: '',
          // tabBarLabel: 'Fishing',
          tabBarIcon: ({ color, size }) => (

            <View style={{

              backgroundColor: color,
              borderRadius: size / 2,
              padding: 5,
            }}>
              {/* Replace with your custom icon component or image */}
              <View style={{ width: size, height: size, backgroundColor: 'transparent' }} />
            </View>
          ),
        }}
      />
      {/* Add more Tab.Screen components here for additional tabs */}
    </Tab.Navigator>
  );
};

function App() {
  return (
    <ContextProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
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
        </Stack.Navigator>
      </NavigationContainer>
    </ContextProvider>
  );
}

export default App;
