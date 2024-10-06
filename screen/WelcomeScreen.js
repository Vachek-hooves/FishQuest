import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated, Dimensions, Easing } from 'react-native';
import { IntroLayout } from '../components/Layout';

const { height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(height)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Start wave animation after initial animation completes
      Animated.sequence([
        Animated.timing(waveAnim, {
          toValue: -20,
          duration: 500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(waveAnim, {
          toValue: 20,
          duration: 1000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(waveAnim, {
          toValue: -20,
          duration: 1000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(waveAnim, {
          toValue: 0,
          duration: 500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Navigate to TabNavigation after all animations complete
        setTimeout(() => navigation.navigate('TabNavigation'), 500);
      });
    });
  }, [fadeAnim, slideAnim, scaleAnim, waveAnim, navigation]);

  const combinedYTranslation = Animated.add(slideAnim, waveAnim);

  return (
    <IntroLayout>
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: combinedYTranslation },
                { scale: scaleAnim },
              ],
            },
          ]}
        >
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.gameNameText}>Fish Quest</Text>
          <Text style={styles.subtitleText}>The Ultimate Challenge</Text>
        </Animated.View>
      </View>
    </IntroLayout>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 56,
    // color: '#ffffff',
    marginBottom: 10,
    color: 'rgba(116,204,244,0.9)',
    fontWeight: 'bold',
  },
  gameNameText: {
    fontSize: 48,
    fontWeight: 'bold',
    // color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    color: 'rgba(116,204,244,0.9)',
  },
  subtitleText: {
    fontSize: 28,
    color: '#ffffff',
    marginTop: 10,
    color: 'rgba(116,204,244,0.9)',
  },
});
