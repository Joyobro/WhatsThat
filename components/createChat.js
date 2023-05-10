import React from 'react';
import { StyleSheet, View, TextInput, Text } from 'react-native';
import { IconButton, Button } from 'react-native-paper';

/* This class should have allowed a user to create a new chat. However,
it wasn't working properly and i have omitted it from the App.js file
as a result. */

class CreateChatScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      channelName: ''
    };
  }

  handleChatCreation = () => {
    const { navigation } = this.props;
    const { channelName } = this.state;
    if (channelName.length > 0) {
      fetch(`http://localhost:3333/api/1.0.0/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': authId,
        },
        body: JSON.stringify(newMessage),
      })
        .then(() => navigation.navigate('Chats'));
    }
  }

  render() {
    const { channelName } = this.state;
    const { navigation } = this.props;

    return (
      <View style={styles.rootContainer}>
        <View style={styles.closeButtonContainer}>
          <IconButton
            icon='close-circle'
            size={36}
            iconColor='#5b3a70'
            onPress={() => navigation.goBack()}
          />
        </View>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Create Account</Text>
          <TextInput
            value={channelName}
            onChangeText={(channelName) => this.setState({ channelName })}
            style={styles.input}
            placeholder="Chat Name"
          />
          <Button
            title='Create'
            modeValue='contained'
            labelStyle={styles.buttonLabel}
            onPress={this.handleChatCreation}
            disabled={channelName.length === 0}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 30,
    right: 0,
    zIndex: 1
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    marginBottom: 10
  },
  buttonLabel: {
    fontSize: 22
  }
});

export default CreateChatScreen;
