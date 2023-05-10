import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ManageChatScreen extends Component {
  state = {
    chatName: '',
    members: [],
  };

  componentDidMount = async() => {
    // Fetch the chat name and user list from the server
    const { route } = this.props;
    const { chat_id } = route.params;
    const authId = await AsyncStorage.getItem("auth_id");
    fetch(`http://localhost:3333/api/1.0.0/chat/${chat_id}`, {
      method: 'GET',
      'X-Authorization': authId,
    })
      .then(response => response.text())
      .then(data => {
        this.setState({
          chatName: data.chatName,
          members: data.members,
        });
      })
      .catch(error => {
        console.error(error);
      });
  };

  handleChangeChatName = () => {
    // Update the chat name on the server and in the state
    // ...
  };

  handleAddUser = () => {
    // Add a user to the chat on the server and in the state
    // ...
  };

  handleRemoveUser = () => {
    // Remove a user from the chat on the server and in the state
    // ...
  };

  render() {
    const { chatName, members } = this.state;
  
    return (
      <View>
        <Text>Chat Name: {chatName}</Text>
        <Button title="Change Chat Name" onPress={this.handleChangeChatName} />
        <Button title="Add User" onPress={this.handleAddUser} />
        <Button title="Remove User" onPress={this.handleRemoveUser} />
        {members && members.length > 0 && (
          <View>
            <Text>Members:</Text>
            {members.map(member => (
              <View key={member.user_id} style={{ flexDirection: 'row' }}>
                <Text>{member.first_name} {member.last_name}</Text>
                <Text style={{ marginLeft: 10 }}>({member.user_id})</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  }
  
}

export default ManageChatScreen;
