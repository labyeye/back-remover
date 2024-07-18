import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Alert,
  Linking,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  ImageBackground,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import axios from 'axios';
import {SafeAreaView} from 'react-native-safe-area-context';

const {width, height} = Dimensions.get('window');

const App = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);

  const selectImage = () => {
    launchImageLibrary({}, response => {
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
      const response = await axios.post(
        'https://back-remover.onrender.com/remove-bg',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

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

    Linking.openURL(processedImage).catch(err => {
      console.error(err);
      Alert.alert('Error', 'Failed to open the image in browser');
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={require('./src/assets/back.png')}
        style={styles.background}
        blurRadius={Platform.OS === 'ios' ? 8 : 3}>
        <ScrollView contentContainerStyle={styles.container}>
          <TouchableOpacity style={styles.select} onPress={selectImage}>
            <Text style={styles.buttonText}>Select Image</Text>
          </TouchableOpacity>
          {selectedImage && (
            <Image source={{uri: selectedImage.uri}} style={styles.image} />
          )}
          <TouchableOpacity style={styles.select} onPress={removeBackground}>
            <Text style={styles.buttonText}>Remove Background</Text>
          </TouchableOpacity>
          {processedImage && (
            <View style={styles.imageContainer}>
              <Image source={{uri: processedImage}} style={styles.image} />
              <TouchableOpacity
                style={styles.downloadButton}
                onPress={openImageInBrowser}>
                <Text style={styles.buttonText}>Download Image</Text>
              </TouchableOpacity>
            </View>
          )}
          
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#071952',
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
  },
  select: {
    height: 50,
    width: width * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    marginVertical: 10,
    shadowOffset: {width:0,height:5},
    shadowOpacity: 100,
    shadowColor: '#DEE0E5',
    shadowRadius: 4,
  },
  background: {
    flex: 1,
  },
  
  buttonText: {
    color: '#093086',
    fontSize: 18,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  image: {
    width: width * 0.8,
    height: width * 0.8,
    marginVertical: 20,
    borderRadius:20,
  },
  downloadButton: {
    height: 50,
    width: width * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    marginVertical: 10,
    shadowOffset: {width:0,height:5},
    shadowOpacity: 100,
    shadowColor: '#DEE0E5',
    shadowRadius: 4,
  },
});

export default App;
