import {View, ImageBackground, SafeAreaView} from 'react-native';

const MainLayout = ({children, blur}) => {
  return (
    <ImageBackground
      blurRadius={blur}
      source={require('../../assets/image/bg/lakeForest.jpg')}
      style={{flex: 1}}>
      <SafeAreaView />
      {children}
      <View style={{height: 100}}></View>
    </ImageBackground>
  );
};

export default MainLayout;
