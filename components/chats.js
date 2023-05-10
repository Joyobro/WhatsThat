import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

class ChatsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chats: [],
    };
  }

  componentDidMount = async () => {
    const authId = await AsyncStorage.getItem('auth_id');
    console.log(authId);
    fetch('http://localhost:3333/api/1.0.0/chat', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Authorization': authId,
      },
    })
      .then(async (response) => {
        const json = await response.json();
        console.log(json);
        return { response, json };
      })
      .then(({ response, json }) => {
        if (response.ok) {
          this.setState({ chats: json });
        } else {
          throw new Error('Network response was not ok');
        }
      })
      .catch((error) => console.error(error));
  };

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.chats}
          renderItem={({ item }) => (
            <View style={styles.chatContainer}>
              <TouchableOpacity onPress={() => {
                this.props.navigation.navigate('Chat', { chat_id: item.chat_id });
              }}>
                <Text style={styles.chatTitle}>{item.name}</Text>
                <Text style={styles.chatLastMessage}>
                  <Text style={{ fontWeight: 'bold' }}>{item.last_message.author.first_name} {item.last_message.author.last_name}</Text>: {item.last_message.message}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item.chat_id.toString()}
        />
        <View style={styles.newChatContainer}>
          <TouchableOpacity style={styles.newChatButton} onPress={this.props.navigation.navigate('NewChat')}>
            <Text style={styles.newChatText}>New Chat</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  chatContainer: {
    padding: 22,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  chatTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  chatLastMessage: {
    fontSize: 18,
  },
  newChatContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  newChatButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 20,
  },
  newChatText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ChatsScreen;
