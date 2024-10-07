import { StyleSheet, Text, View,ImageBackground} from "react-native";

const FishingManIcon = ({focused}) => {
  return (
    <View
      style={{
        borderWidth: 4,
        borderRadius: 20,
        borderColor: focused ? 'green' : 'transparent',
        backgroundColor: focused ? 'transparent' : 'rgba(255,255,255,0.7)',
      }}>
      <ImageBackground
        source={require('../../assets/image/tabIcon/fishingManProfile.png')}
        style={{
          width: 70,
          height: 60,
          borderRadius: 20,
          overflow: 'hidden',
         transform: [{scale: 1.1}],
        }}></ImageBackground>
    </View>
  );
};

export default FishingManIcon;

const styles = StyleSheet.create({});
