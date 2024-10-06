import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  SafeAreaView,
} from 'react-native';

const IntroLayout = ({children}) => {
  return (
    <ImageBackground
      source={require('../../assets/image/bg/lakeForest.jpg')}
      style={{flex: 1}}>
      <SafeAreaView />
      {children}
    </ImageBackground>
  );
};

export default IntroLayout;

const styles = StyleSheet.create({});
