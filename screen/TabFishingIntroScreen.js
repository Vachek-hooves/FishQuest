import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';

const TabFishingIntroScreen = ({navigation}) => {
  return (
    <View>
      {/* <Text>TabFishingIntroScreen</Text> */}
      <TouchableOpacity
        onPress={() => navigation.navigate('StackFishingSimulatorField')}>
        <Text>Go Fishing</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TabFishingIntroScreen;

const styles = StyleSheet.create({});
