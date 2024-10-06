import {StyleSheet, Text, View} from 'react-native';
import {fishSeason} from '../data/season';

const StackSeasonFishing = () => {
  return (
    <View>
      {fishSeason.map((season, index) => (
        <TouchableOpacity key={index}>
          <Image source={season.image} styles={styles.image}/>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default StackSeasonFishing;

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
});
