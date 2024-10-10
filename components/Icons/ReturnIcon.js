import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const ReturnIcon = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={styles.iconContainer}>
      <Image
        source={require('../../assets/image/icons/back.png')}
        style={styles.icon}
      />
    </TouchableOpacity>
  );
};

export default ReturnIcon;

const styles = StyleSheet.create({
  icon: {
    width: 40,
    height: 40,
    tintColor: '#FFFFFF',
  },
  iconContainer: {
    position: 'absolute',
    bottom: 50,
    right: 70,
    zIndex: 10,
    
  },
});
