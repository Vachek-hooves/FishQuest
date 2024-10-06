import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';

const MelodyIcon = ({active}) => {
  return (
    <View
      style={{
        padding: 10,
        // backgroundColor: !active ? 'pink' : 'white',
        borderRadius: 22,
        // position: 'absolute',
        // top: 60,
        // left: 60,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        borderWidth: 2,
        borderColor:active?'green':'white'
      }}>
      <Image
        source={require('../../assets/image/icons/musica.png')}
        style={{
          width: 40,
          height: 40,
          tintColor: !active ? 'green' : 'red',
          transform: [{scale: 1.4}],
        }}
      />
    </View>
  );
};

export default MelodyIcon;

const styles = StyleSheet.create({});
