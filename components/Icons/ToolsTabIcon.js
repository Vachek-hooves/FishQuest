import { View, ImageBackground} from 'react-native';

const ToolsTabIcon = ({focused}) => {
  return (
    <View
      style={{
        borderWidth: 4,
        borderRadius: 20,
        borderColor: focused ? 'green' : 'transparent',
        backgroundColor: focused ? 'transparent' : 'rgba(255,255,255,0.7)',
      }}>
      <ImageBackground
        source={require('../../assets/image/tabIcon/fishingTools.png')}
        style={{
          width: 60,
          height: 60,
          borderRadius: 20,
          overflow: 'hidden',
        }}></ImageBackground>
    </View>
  );
};

export default ToolsTabIcon;
