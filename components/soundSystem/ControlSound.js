import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {State, usePlaybackState} from 'react-native-track-player';
import {toggleBackgroundMusic} from './setupPlayer';
import {MelodyIcon} from '../Icons';

const ControlSound = () => {
  const [melody, setMelody] = useState(false);
  const playbackState = usePlaybackState();
  const isPlaying = playbackState === State.Playing;

  const handleToggleSound = async () => {
    await toggleBackgroundMusic();
    setMelody(prev => !prev);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleToggleSound}>
        {melody ? (
          <MelodyIcon active={melody} />
        ) : (
          <MelodyIcon active={melody} />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ControlSound;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    position: 'absolute',
    top: 60,
    left: 60,
  },
});
