import React, {useEffect, useRef} from 'react';
import {StyleSheet, View, Image, Animated} from 'react-native';

const MelodyIcon = ({active}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let animation;
    if (!active) {
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      );
      animation.start();
    } else {
      scaleAnim.setValue(1);
    }

    return () => {
      if (animation) {
        animation.stop();
      }
    };
  }, [active, scaleAnim]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          borderColor: active ? 'grey' : 'rgba(116,204,244,0.9)',
          transform: [{scale: scaleAnim}],
        },
      ]}>
      <Image
        source={require('../../assets/image/icons/musica.png')}
        style={[styles.image, {tintColor: !active ? 'green' : 'grey'}]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 4,
    position: 'absolute',
    
  },
  image: {
    width: 40,
    height: 40,
    transform: [{scale: 1.3}],
  },
});

export default MelodyIcon;
