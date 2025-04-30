import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  Platform,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons'; // install via `npm i react-native-vector-icons`

const MAX_PHOTOS = 5;

const PhotoPicker = () => {
  const [photos, setPhotos] = useState([]);

  const getPermission = async () => {
    const permissionType =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;

    const result = await check(permissionType);
    if (result === RESULTS.GRANTED) return true;

    if (result === RESULTS.DENIED || result === RESULTS.LIMITED) {
      const requestResult = await request(permissionType);
      return requestResult === RESULTS.GRANTED;
    }

    Alert.alert('Permission denied');
    return false;
  };

  const handleAddPhoto = async () => {
    const granted = await getPermission();
    if (!granted) return;

    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel || response.errorCode) return;

      const selectedUri = response.assets[0].uri;
      if (photos.length < MAX_PHOTOS) {
        setPhotos(prev => [...prev, selectedUri]);
      } else {
        Alert.alert('Max photo limit reached');
      }
    });
  };

  const handleDeletePhoto = index => {
    const updatedPhotos = [...photos];
    updatedPhotos.splice(index, 1);
    setPhotos(updatedPhotos);
  };

  const renderPhotoSlot = (uri, index) => (
    <View key={index} style={styles.photoBox}>
      <Image source={{uri}} style={styles.imageStyle} />
      <TouchableOpacity
        style={styles.deleteIcon}
        onPress={() => handleDeletePhoto(index)}>
        <Icon name="close-circle" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  const renderAddSlot = index => (
    <TouchableOpacity
      key={`add-${index}`}
      style={styles.addBox}
      onPress={handleAddPhoto}>
      <Icon name="add" size={30} color="#555" />
    </TouchableOpacity>
  );

  const renderGrid = () => {
    const slots = [...photos.map(renderPhotoSlot)];

    for (let i = photos.length; i < MAX_PHOTOS; i++) {
      slots.push(renderAddSlot(i));
    }

    return <View style={styles.gridContainer}>{slots}</View>;
  };

  return (
      <View style={styles.viewDesign}>
        <Text style={styles.text}>
          Please add the Gibli art photos for the better and blind date.
        </Text>
        {renderGrid()}
      </View>
  );
};

const styles = StyleSheet.create({
  viewDesign: {
    padding: 20,
    borderWidth: 1,
    borderColor: '#ffff',
    borderRadius: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  text: {
    width: '100%',
    textAlign: 'center',
    color: '#ffff',
    fontSize: 16,
    marginBottom: 10,
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  photoBox: {
    position: 'relative',
    width: 104,
    height: 110,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'solid',
  },
  addBox: {
    width: 104,
    height: 110,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#bbb',
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
  },
  imageStyle: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  deleteIcon: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#000',
    borderRadius: 10,
  },
});

export default PhotoPicker;
