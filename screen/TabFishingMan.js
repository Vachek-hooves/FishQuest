import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfileLayout from '../components/Layout/ProfileLayout';
import ControlSound from '../components/soundSystem/ControlSound';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const TabFishingMan = () => {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const storedName = await AsyncStorage.getItem('userName');
      const storedImage = await AsyncStorage.getItem('userImage');
      if (storedName) {
        setName(storedName);
        setHasProfile(true);
      }
      if (storedImage) setImage(storedImage);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const saveProfile = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name.');
      return;
    }
    try {
      await AsyncStorage.setItem('userName', name);
      if (image) await AsyncStorage.setItem('userImage', image);
      setHasProfile(true);
      setIsEditing(false);
      Alert.alert('Success', 'Profile saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    }
  };

  const updateProfile = async () => {
    if (isEditing) {
      await saveProfile();
    } else {
      setIsEditing(true);
    }
  };

  const deleteProfile = async () => {
    Alert.alert(
      'Delete Profile',
      'Are you sure you want to delete your profile?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('userName');
              await AsyncStorage.removeItem('userImage');
              setName('');
              setImage(null);
              setHasProfile(false);
              setIsEditing(false);
              Alert.alert('Success', 'Profile deleted successfully!');
            } catch (error) {
              console.error('Error deleting profile:', error);
              Alert.alert(
                'Error',
                'Failed to delete profile. Please try again.',
              );
            }
          },
          style: 'destructive',
        },
      ],
      {cancelable: false},
    );
  };

  const selectImage = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: true,
      maxHeight: 200,
      maxWidth: 200,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = {
          uri: 'data:image/jpeg;base64,' + response.assets[0].base64,
        };
        setImage(source.uri);
      }
    });
  };

  return (
    <ProfileLayout>
      <ControlSound />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <TouchableOpacity onPress={selectImage} style={styles.imageContainer}>
            {image ? (
              <Image source={{uri: image}} style={styles.profileImage} />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>Add Photo</Text>
              </View>
            )}
          </TouchableOpacity>
          {hasProfile && !isEditing ? (
            <Text style={styles.nameDisplay}>{name}</Text>
          ) : (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor="#999"
                value={name}
                onChangeText={setName}
              />
            </View>
          )}
          {!hasProfile ? (
            <TouchableOpacity style={styles.button} onPress={saveProfile}>
              <Text style={styles.buttonText}>Create Profile</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={updateProfile}>
                <Text style={styles.buttonText}>
                  {isEditing ? 'Save Changes' : 'Update Profile'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.deleteButton]}
                onPress={deleteProfile}>
                <Text style={styles.buttonText}>Delete Profile</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </ProfileLayout>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    minHeight: SCREEN_HEIGHT * 0.8,
    marginTop: 60, // Added top margin
  },
  imageContainer: {
    marginBottom: 30,
  },
  profileImage: {
    width: SCREEN_WIDTH * 0.5,
    height: SCREEN_WIDTH * 0.5,
    borderRadius: SCREEN_WIDTH * 0.25,
    borderWidth: 3,
    borderColor: '#3498db',
  },
  placeholderImage: {
    width: SCREEN_WIDTH * 0.5,
    height: SCREEN_WIDTH * 0.5,
    borderRadius: SCREEN_WIDTH * 0.25,
    backgroundColor: '#34495e',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#3498db',
  },
  placeholderText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  input: {
    height: 50,
    color: '#00008B', // Changed to dark blue
    fontSize: 28,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    backgroundColor: '#2ecc71',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
  },
  nameDisplay: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 30,
  },
});

export default TabFishingMan;