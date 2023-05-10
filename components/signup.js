import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TextInput, Button, StyleSheet } from 'react-native';
import LoginScreen from './login.js';

class SignupScreen extends Component {
  state = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  };

  handleLogin = () => {
    this.props.navigation.navigate('Login');
  }
  handleSignup = () => {
    fetch('http://localhost:3333/api/1.0.0/user', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    })
      .then((response) => {
        if(response.status === 200){
            return response.json;
        }
        else if (response.status === 400){
          throw 'Failed Validation';
        }
        else {
          throw 'Something went wrong.';
        }
        // Do something with the data
        console.log(data);
      })
      .then (rJson => {
        console.log("user created. ID:", rJson)
        this.props.navigation.navigate("Login");
      })
      .catch (error => {
        // Handle any errors
        console.error(error);
      })

  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Create Account</Text>
        <TextInput
          value={this.state.first_name}
          onChangeText={(first_name) => this.setState({ first_name })}
          style={styles.input}
          placeholder="First Name"
        />
        <TextInput
          value={this.state.last_name}
          onChangeText={(last_name) => this.setState({ last_name })}
          style={styles.input}
          placeholder="Last Name"
        />
        <TextInput
          value={this.state.email}
          onChangeText={(email) => this.setState({ email })}
          style={styles.input}
          placeholder="Email"
        />
        <TextInput
          value={this.state.password}
          onChangeText={(password) => this.setState({ password })}
          style={styles.input}
          secureTextEntry={true}
          placeholder="Password"
        />
        <Button title="Signup" onPress={this.handleSignup} style={styles.button} />
        <TouchableOpacity onPress={this.handleLogin}>
          <Text style={styles.text}>
            Already have an account? <Text style={styles.link}>Login here</Text>
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 50,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4CAF50'
  },
  input: {
    width: '80%',
    height: 50,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingLeft: 10,
    marginBottom: 20,
  },
  button: {
    width: '80%',
    height: 50,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  text: {
    marginTop: 20,
    fontSize: 16,
  },
  link: {
    color: '#4CAF50',
  },
});

export default SignupScreen;

