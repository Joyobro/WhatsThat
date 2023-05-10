import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfilePicScreen from './profilePic.js';

class SettingsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blockedUsers: [],
      userId: null,
      username: null,
    };
  }
  

 async componentDidMount() {
    const userId = await AsyncStorage.getItem('user_id');
    const authId = await AsyncStorage.getItem('auth_id');

    this.setState({userId});
    this.getBlockedUsers();
    fetch(`http://localhost:3333/api/1.0.0/user/${userId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Authorization': authId,
      },
    })
    .then((response) => response.json())
      .then(data => {
        this.setState({ username: data.first_name + ' ' + data.last_name });
      })
      .catch(error => console.error(error));
  }

 handleUnblock = async(userId) => {
    const authId = await AsyncStorage.getItem('auth_id');
  console.log(userId);
    fetch(`http://localhost:3333/api/1.0.0/user/${userId}/block`, {
        method: 'DELETE',
        headers: {
          'X-Authorization': authId,
        },
    })
      .then(response => {
        if (response.status === 200) {
          console.log('Contact unblocked successfully');
          this.props.navigation.reset({
            index: 0,
            routes: [{name: 'Settings'}]
          })
        }   
        else {
          console.log('Failed to unblock contact.');
        }
      })
      .catch(error => console.error(error));
}

  async getBlockedUsers() {
    const authId = await AsyncStorage.getItem('auth_id');
    const response = await fetch('http://localhost:3333/api/1.0.0/blocked', {
      headers: {
        'X-Authorization': authId,
      },
    });
    const data = await response.json();
    this.setState({ blockedUsers: data });
  }

  render() {
    const { userId } = this.state;
    const { username } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.blockedUsersTitle}>Logged in as: {username} </Text>
        {userId && <ProfilePicScreen userId={this.state.userId}/>}
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.props.navigation.navigate('Camera')}
        >
          <Text style={styles.buttonText}>Change Profile Picture</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            AsyncStorage.removeItem('auth_id');
            AsyncStorage.removeItem('user_id');
            this.props.navigation.replace('Login');
          }}
        >
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
        <View style={styles.blockedUsersContainer}>
          <Text style={styles.blockedUsersTitle}>Blocked Users:</Text>
          {this.state.blockedUsers.map((user) => (
            <View key={user.user_id} style={styles.blockedUserContainer}>
              <Text style={styles.blockedUserName}>
                {`${user.first_name} ${user.last_name}`}
              </Text>
              <TouchableOpacity
                style={styles.unblockButton}
                onPress={() => this.handleUnblock(user.user_id)}
              >
                <Text style={styles.unblockButtonText}>Unblock</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  blockedUsersContainer: {
    marginTop: 20,
  },
  blockedUsersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  blockedUserContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  blockedUserName: {
    flex: 1,
    fontSize: 16,
  },
  unblockButton: {
    backgroundColor: '#DB4437',
    borderRadius: 5,
    padding: 10,
   marginLeft: 10,
  },
  unblockButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SettingsScreen;
