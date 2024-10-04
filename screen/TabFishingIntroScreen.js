import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  ScrollView,
} from 'react-native';
import {fishSeason} from '../data/season';
import {SafeAreaView} from 'react-native-safe-area-context';

const TabFishingIntroScreen = ({navigation}) => {

  const handleSeasonPress = (season) => {
    navigation.navigate('StackFishingSimulatorField', {season});
  };
  return (
    <View style={{flex: 1}}>
      
      <SafeAreaView></SafeAreaView>
      
      <View style={{marginHorizontal: 20}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {fishSeason.map((season, index) => (
            <TouchableOpacity
              onPress={() => handleSeasonPress(season)}
              key={index}
              style={{
                width: '100%',
                height: 200,
                marginVertical: 20,
                borderRadius: 10,
                overflow: 'hidden',
                // marginHorizontal: 20,
              }}>
              <ImageBackground source={season.image} style={{flex: 1}}>
                <Text>{season.season}</Text>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default TabFishingIntroScreen;

const styles = StyleSheet.create({});
