import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { View, Image, ActivityIndicator } from 'react-native';

class ProfilePicScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profilePicUrl: null,
    };
  }

  async componentDidMount() {
    console.log("CDM");
    const { userId } = this.props;
    const authId = await AsyncStorage.getItem('auth_id');

    fetch(`http://localhost:3333/api/1.0.0/user/${userId}/photo`, {
      method: 'GET',
      headers: {
        'X-Authorization': authId,
      },
    })
    .then(res => {
      if (res.status === 200) {
        return res.blob();
      }
      else{
        console.log(res.status + 'Failed to fetch profile picture.');
        return null;
      }
    })
      .then(response => {
        if (response instanceof Blob) {
          let data = URL.createObjectURL(response);
          this.setState({ profilePicUrl: data, isLoading: false });
        } else {
          console.log('Response is not a valid blob:', response);
        }
      })
      .catch(error => console.error(error));
  }

  render() {
    console.log("RENDER");
    const { profilePicUrl } = this.state;
    console.log(profilePicUrl);

    if (!profilePicUrl) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }

    return (
      <View>
        <Image source={{ uri: profilePicUrl }} style={{ width: 150, height: 150, alignSelf: 'center' }}/>
      </View>
    );
  }
}

export default ProfilePicScreen;
