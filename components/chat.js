import React from 'react';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ChatScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chatData: null,
      userId: null
    };
  }

  async componentDidMount() {
    const { chat_id } = this.props.route.params;
    const authId = await AsyncStorage.getItem('auth_id');
    const userId = await AsyncStorage.getItem('user_id');

    const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chat_id}`, {
      headers: {
        'X-Authorization': authId,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch chat data');
    }
    else{
      const data = await response.json();
      console.log(data);
      this.setState({ chatData: data, userId });
    }
    
  }

  onSend = async (messages = []) => {
    const { chatData } = this.state;
    const { chat_id } = this.props.route.params;
    const authId = await AsyncStorage.getItem('auth_id');
  
    const newMessage = {
      message: messages[0].text,
    };
    console.log(newMessage);
    fetch(`http://localhost:3333/api/1.0.0/chat/${chat_id}/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': authId,
      },
      body: JSON.stringify(newMessage),
    })
      .then((response) => response.text())
      .then((data) => {
        // Add the new message to the chatData state
        this.setState((prevState) => ({
          chatData: {
            ...prevState.chatData,
            messages: [
              ...prevState.chatData.messages,
              {
                message_id: data.message_id,
                message: newMessage.message,
                author: {
                  user_id: this.state.userId,
                  first_name: chatData.creator.first_name,
                  last_name: chatData.creator.last_name,
                },
                timestamp: Date.now(),
              },
            ],
          },
        }));
  
        // Reset the navigation stack to go back to the Chat screen
        this.props.navigation.reset({
          index: 0,
          routes: [{ name: 'Chat', params: { chat_id: chat_id } }],
        });
      })
      .catch((error) => console.error(error));
  };
  

  render() {
    const { chatData, userId } = this.state;
    const { chat_id } = this.props.route.params;

    if (!chatData) {
      return null;
    }

    return (
      <>
        <GiftedChat
          messages={chatData.messages.map((message) => ({
            _id: message.message_id.toString(),
            text: message.message,
            createdAt: new Date(message.timestamp),
            user: {
              _id: message.author.user_id,
              name: `${message.author.first_name} ${message.author.last_name}`,
            },
          }))}
          onSend={this.onSend}
          user={{
            _id: userId, // Add the logged-in user's ID here
            name: `${chatData.creator.first_name} ${chatData.creator.last_name}`,
          }}
          renderBubble={(props) => {
            return (
              <Bubble
                {...props}
                wrapperStyle={{
                  right: {
                    backgroundColor: '#4CAF50', // Set background color to green for messages sent by the logged-in user
                  },
                }}
              />
            );
          }}
        />
      </>
    );
  }
}

export default ChatScreen;
