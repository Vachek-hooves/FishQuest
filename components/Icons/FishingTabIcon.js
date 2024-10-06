import { View, ImageBackground,} from 'react-native';

const FishingTabIcon = ({focused}) => {
  return (
    <View
      style={{
        borderWidth: 4,
        borderRadius: 20,
        borderColor: focused ? 'green' : 'transparent',
        
      }}>
      <ImageBackground
        source={require('../../assets/image/tabIcon/fishingIcon.png')}
        style={{
          width: 60,
          height: 60,
          borderRadius: 20,
          overflow: 'hidden',
        }}></ImageBackground>
    </View>
  );
};

export default FishingTabIcon;


