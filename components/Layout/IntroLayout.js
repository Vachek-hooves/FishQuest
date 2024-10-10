import {ImageBackground, SafeAreaView} from 'react-native';

const IntroLayout = ({children}) => {
  return (
    <ImageBackground
      source={require('../../assets/image/bg/bg.png')}
      style={{flex: 1}}>
      <SafeAreaView />
      {children}
    </ImageBackground>
  );
};

export default IntroLayout;
