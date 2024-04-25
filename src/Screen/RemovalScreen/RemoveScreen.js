import React, { useState } from 'react';
import { View, Text, Button, Image, TouchableOpacity } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

const Remove = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [resultUrl, setResultUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiKey = 'K4NDvHm8K9x9s3jRL1UvwDnfY';

  const handleChooseImage = () => {
    let options = {
      storageOptions: {
        path: "image"
      }
    }
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        console.log(response);
        setImageUrl(response.uri);
        handleRemoveBackground(response.uri);
      }
    })
  };

  const handleRemoveBackground = async (uri) => {
    setLoading(true);
    setError(null);
  
    try {
      const formData = new FormData();
      formData.append('image_file', {
        uri: uri,
        name: 'image.jpg',
        type: 'image/jpeg',
      });
  
      const response = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
          'X-Api-Key': apiKey,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`Failed to remove background: ${response.status} ${response.statusText}`);
      }
  
      const result = await response.json();
      if (result.errors) {
        throw new Error(`Remove.bg API error: ${result.errors[0].title}`);
      }
  
      setResultUrl(result.data.result_url);
    } catch (error) {
      console.error('Background removal error:', error);
      setError('Failed to remove background. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  const handleDownload = () => {
    // You can implement image download functionality here
    // For simplicity, let's just log a message for now
    console.log('Image download functionality to be implemented');
  };

  return (
    <View style={{ flex: 1, padding: 20, marginTop: 100 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Background Removal App</Text>
      <Button title="Choose Image" onPress={handleChooseImage} />
      {error && <Text style={{ color: 'red', marginBottom: 20 }}>{error}</Text>}
      {imageUrl ? (
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 18, marginBottom: 10 }}>Selected Image:</Text>
          <Image source={{ uri: imageUrl }} style={{ width: '100%', height: 300, resizeMode: 'contain', marginBottom: 20 }} />
          <Button title={loading ? 'Processing...' : 'Remove Background'} onPress={handleRemoveBackground} disabled={loading} />
        </View>
      ) : null}
      {resultUrl ? (
        <View>
          <Text style={{ fontSize: 20, marginBottom: 10 }}>Result:</Text>
          <Image source={{ uri: resultUrl }} style={{ width: '100%', height: 300, resizeMode: 'contain', marginBottom: 20 }} />
          <TouchableOpacity onPress={handleDownload} disabled={!resultUrl}>
            <Text style={{ fontSize: 18, color: resultUrl ? 'blue' : 'gray', textDecorationLine: resultUrl ? 'underline' : 'none' }}>Download Image</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};

export default Remove;
