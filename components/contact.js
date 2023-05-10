import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ProfilePicScreen from './profilePic';

class ContactScreen extends Component {
  constructor(props) {
    super(props);
  this.state = {
    contact: {},
  }
}
  componentDidMount = async () => {
    const authId = await AsyncStorage.getItem("auth_id");
    const userId = this.props.route.params.userId;

    fetch(`http://localhost:3333/api/1.0.0/user/${userId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Authorization': authId,
      },
    })
      .then(async (response) => response.json())
      .then(data => {
        this.setState({ contact: data });
      })
      .catch(error => console.error(error));
  }

  handleBlock = async () => {
    const authId = await AsyncStorage.getItem("auth_id");
    const userId = this.props.route.params.userId;
    console.log(authId);
    console.log(userId);

    //Block the contact
    fetch(`http://localhost:3333/api/1.0.0/user/${userId}/block`, {
      method: 'POST',
      headers: {
        'X-Authorization': authId,
      },
    })
    .then(response => {
      if (response.status === 200) {
        console.log("Contact blocked");
        this.props.route.params.handleContactChange();
        console.log(this.props.navigation);
        this.props.navigation.goBack();
      }
      else if (response.status === 400) {
        console.log("You can't block yourself.");
      }
      else if (response.status === 401) {
        console.log("Unauthorized");
      }
      else if (response.status === 404) {
        console.log("Not Found");
      }
      else if (response.status === 500) {
        console.log("Server Error");
      }
    })
  }

  handleDelete = async () => {
    const authId = await AsyncStorage.getItem("auth_id");
    const userId = this.props.route.params.userId;
    console.log(authId);
    console.log(userId);

    // Delete the contact
    fetch(`http://localhost:3333/api/1.0.0/user/${userId}/contact`, {
      method: 'DELETE',
      headers: {
        'X-Authorization': authId,
      },
    })
    .then(response => {
      if (response.status === 200) {
        console.log('Contact deleted successfully');
        this.props.route.params.handleContactChange(); // Use the function passed as a parameter
        this.props.navigation.goBack(); // Use this.props.navigation to go to ContactsScreen
      }    
      else if (response.status === 400) {
        console.log("You can't remove yourself as a contact");
      }
      else if (response.status === 401) {
        console.log("Unauthorised action.");
      }
      else if (response.status === 404) {
        console.log("Not Found");
      }
      else if (response.status === 500) {
        console.log("Server Error");
      } else {
        console.log('Failed to delete contact.');
      }
    })
    .catch(error => console.error(error));
  }

  render() {
    const { contact } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>{contact.first_name} {contact.last_name}</Text>

        {contact.user_id && <ProfilePicScreen userId={contact.user_id}/>}
       
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.detail}>{contact.email}</Text>
        <TouchableOpacity style={styles.delete_btn} onPress={this.handleBlock}>
          <Text style={styles.delete_btn_text}>Block Contact</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.delete_btn} onPress={this.handleDelete}>
          <Text style={styles.delete_btn_text}>Delete Contact</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  detail: {
    fontSize: 20,
    marginBottom: 20,
  },
  delete_btn: {
    backgroundColour: 'red',
    borderRadius: 10,
  },
  delete_btn_text: {
    color: 'red',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default ContactScreen;
