import React, {useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  ScrollView,
  Alert,
} from 'react-native';
import {useContextProvider} from '../store/context';
import {MainLayout} from '../components/Layout';

const TabFishingIntroScreen = ({navigation}) => {
  const {fishSeason, totalScore, getTotalScore, unlockSeason} =
    useContextProvider();

  useEffect(() => {
    const fetchTotalScore = async () => {
      await getTotalScore();
    };
    fetchTotalScore();
  }, []);

  const handleSeasonPress = (season, index) => {
    if (season.locked) {
      Alert.alert(
        'Locked Season',
        'This season is locked. Would you like to unlock it for 300 points?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Unlock',
            onPress: async () => {
              const success = await unlockSeason(index);
              if (success) {
                Alert.alert('Success', 'Season unlocked!');
              } else {
                Alert.alert(
                  'Error',
                  'Not enough points to unlock this season.',
                );
              }
            },
          },
        ],
      );
    } else {
      navigation.navigate('StackFishingSimulatorField', {season});
    }
  };

  return (
    <MainLayout blur={30}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Total Score: {totalScore}</Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}>
        {fishSeason &&
          fishSeason.map((season, index) => (
            <TouchableOpacity
              onPress={() => handleSeasonPress(season, index)}
              key={index}
              style={styles.seasonButton}>
              <ImageBackground source={season.image} style={styles.seasonImage}>
                <Text style={styles.seasonText}>{season.season.toUpperCase()}</Text>
                {season.locked && (
                  <View style={styles.lockedOverlay}>
                    <Text style={styles.lockedText}>LOCKED</Text>
                  </View>
                )}
              </ImageBackground>
            </TouchableOpacity>
          ))}
      </ScrollView>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#4a90e2',
    padding: 15,
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollView: {
    marginHorizontal: 20,
  },
  seasonButton: {
    width: '100%',
    height: 200,
    marginVertical: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  seasonImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  seasonText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  lockedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockedText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default TabFishingIntroScreen;
