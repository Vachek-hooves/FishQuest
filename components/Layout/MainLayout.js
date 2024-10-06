import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  SafeAreaView,
} from 'react-native';

const MainLayout = ({children, blur}) => {
  return (
    <ImageBackground
      blurRadius={blur}
      source={require('../../assets/image/bg/lakeForest.jpg')}
      style={{flex: 1}}>
      <SafeAreaView />
      {children}
    </ImageBackground>
  );
};

export default MainLayout;

const styles = StyleSheet.create({});
