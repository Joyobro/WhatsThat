import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Camera, CameraType } from 'expo-camera';
import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

function CameraScreen({ route }) {
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [permission, setPermission] = useState(null);
  const cameraRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    async function getPermission() {
      const { status } = await Camera.requestPermissionsAsync();
      setPermission(status === 'granted');
    }

    getPermission();
  }, []);

  function toggleCameraType() {
    setType(
      type === Camera.Constants.Type.back
      ? Camera.Constants.Type.front
      : Camera.Constants.Type.back
    );
    console.log("Camera: ", type)
  }

  async function takePhoto() {
    const userId = await AsyncStorage.getItem('user_id');
    const authId = await AsyncStorage.getItem('auth_id');
  
    if(cameraRef.current) {
      const options = { quality: 0.5, base64: true };
      const photo = await cameraRef.current.takePictureAsync(options);
      if(photo) {
        const blob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = function() {
            resolve(xhr.response);
          };
          xhr.onerror = function(e) {
            console.log(e);
            reject(new TypeError('Network request failed'));
          };
          xhr.responseType = 'blob';
          xhr.open('GET', photo.uri, true);
          xhr.send(null);
        });
  
        fetch(`http://localhost:3333/api/1.0.0/user/${userId}/photo`, {
          method: 'POST',
          headers: {
            'Content-Type': "image/png",
            'X-Authorization': authId,
          },
          body: blob
        })
        .then((response) => {
          console.log("Picture added", response);
        })
        .catch((err) => {
          console.log(err);
        });
      }
      navigation.goBack();
      navigation.reset({
        index: 0,
        routes: [{name: 'Settings'}]
      })
    }
  }

  if(permission === null) {
    return <View />;
  } else if (permission === false) {
    return <Text>No access to camera.</Text>
  } else {
    return (
      <View style={styles.container}>
        <Camera
          style={styles.camera}
          type={type}
          ref={(ref) => {
            cameraRef.current = ref;
          }}
        >

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={toggleCameraType}
          >
          <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePhoto}>
              <Text style={styles.text}>Take Photo</Text>
          </TouchableOpacity>
        </View>
        </Camera>
      </View>
    )
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    buttonContainer: {
        alignSelf: 'flex-end',
        padding: 5,
        margin: 5,
        backgroundColor: '#4CAF50'
    },
    button: {
        width: '100%',
        height: '100%'
    },
    text: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#ddd'
    }
})

export default CameraScreen;