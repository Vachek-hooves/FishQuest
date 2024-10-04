import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useContextProvider } from '../store/context';

const TabFishingIntroScreen = ({ navigation }) => {
  const { fishSeason } = useContextProvider();

  const handleSeasonPress = (season) => {
    navigation.navigate('StackFishingSimulatorField', { season });
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView></SafeAreaView>
      <View style={{ marginHorizontal: 20 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {fishSeason && fishSeason.map((season, index) => (
            <TouchableOpacity
              onPress={() => handleSeasonPress(season)}
              key={index}
              style={{
                width: '100%',
                height: 200,
                marginVertical: 20,
                borderRadius: 10,
                overflow: 'hidden',
              }}>
              <ImageBackground source={season.image} style={{ flex: 1 }}>
                <Text>{season.season}</Text>
              </ImageBackground>
            </TouchableOpacity>
          ))}
          <View style={{ height: 100 }}></View>
        </ScrollView>
      </View>
    </View>
  );
};

export default TabFishingIntroScreen;

const styles = StyleSheet.create({});
