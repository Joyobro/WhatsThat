import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AddUserScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: '',
            error: null,
        };
    }

    handleAddContact = async () => {
        const { userId } = this.state;

        if (!userId) {
            Alert.alert('Error', 'Please enter a user ID');
            return;
        }

        if (!Number.isInteger(Number(userId))) {
            Alert.alert('Error', 'User ID must be an integer');
            return;
        }

        const authId = await AsyncStorage.getItem('auth_id');

        // Perform POST request to /user/${user_id}/contact
        fetch(`http://localhost:3333/api/1.0.0/user/${userId}/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': authId,
            }

        })
            .then(async (response) => {
                const text = await response.text();
                console.log(text);
                if (response.status === 200) {
                    this.props.route.params.fetchContacts();
                    this.props.navigation.goBack();
                }
                else if (response.status === 400) {
                    console.log("You can't add yourself as a contact");
                }
                else if (response.status === 401) {
                    console.log("Unauthorized.");
                }
                else if (response.status === 404) {
                    console.log("Not Found.");
                }
                else if (response.status === 500) {
                    console.log("Server Error");
                }
                this.setState({error: text});
            })
            
            .catch(error => {
               this.setState({ error: 'An error occurred while adding the contact.' });
            });
    };

    render() {
        const { userId } = this.state;
        const { error } = this.state;
        return (
            <View style={styles.container}>
                {error && <Text style={{color: 'red' }}>{error}</Text>}
                <Text style={styles.label}>User ID:</Text>
                <TextInput
                    style={styles.input}
                    value={userId}
                    onChangeText={text => this.setState({ userId: text })}
                    keyboardType="numeric"
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={this.handleAddContact}
                >
                    <Text style={styles.buttonText}>Add User</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = {
    container: {
        padding: 16,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#4CAF50', // Updated color
        padding: 8,
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#4CAF50', // Updated color
        padding: 16,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
};


export default AddUserScreen;
