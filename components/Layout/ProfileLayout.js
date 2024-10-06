import {View, Text, ImageBackground} from 'react-native';

const ProfileLayout = ({children, blur}) => {
  return (
    <ImageBackground
      blurRadius={blur}
      source={require('../../assets/image/bg/Profilebg.png')}
      style={{flex: 1}}>
      {children}
    </ImageBackground>
  );
};

export default ProfileLayout;
