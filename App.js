import React, { useState } from 'react';
import { View, Button, Image, StyleSheet, Alert, Linking } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';

const App = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);

  const selectImage = () => {
    launchImageLibrary({}, (response) => {
      if (response.assets && response.assets.length > 0) {
        setSelectedImage(response.assets[0]);
      }
    });
  };

  const removeBackground = async () => {
    if (!selectedImage) {
      Alert.alert('No image selected', 'Please select an image first');
      return;
    }

    const formData = new FormData();
    formData.append('image_file', {
      uri: selectedImage.uri,
      type: selectedImage.type,
      name: selectedImage.fileName,
    });

    try {
      const response = await axios.post('http://localhost:5001/remove-bg', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setProcessedImage(response.data.image_url);

    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to remove background');
    }
  };

  const openImageInBrowser = () => {
    if (!processedImage) {
      Alert.alert('No processed image', 'Please process an image first');
      return;
    }

    Linking.openURL(processedImage).catch((err) => {
      console.error(err);
      Alert.alert('Error', 'Failed to open the image in browser');
    });
  };

  return (
    <View style={styles.container}>
      <Button title="Select Image" onPress={selectImage} />
      {selectedImage && (
        <Image source={{ uri: selectedImage.uri }} style={styles.image} />
      )}
      <Button title="Remove Background" onPress={removeBackground} />
      {processedImage && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: processedImage }} style={styles.image} />
          <Button title="Download Image" onPress={openImageInBrowser} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
});

export default App;