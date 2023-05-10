import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


class LoginScreen extends Component {
  state = {
    email: "",
    password: "",
  };

  handleSignup = () => {
    this.props.navigation.navigate("Signup");
  };

  handleLogin = () => {
    fetch('http://localhost:3333/api/1.0.0/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    })
      .then((response) => response.json())

      .then(async (data) => {
        // Do something with the data
       await AsyncStorage.setItem("auth_id", data.token)
       await AsyncStorage.setItem("user_id", data.id)
        this.props.navigation.navigate("WhatsThat")
        console.log(data);
      })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>WhatsThat</Text>
        <TextInput
          value={this.state.email}
          onChangeText={(text) => this.setState({ email: text })}
          style={styles.input}
          placeholder="Email"
        />
        <TextInput
          value={this.state.password}
          onChangeText={(text) => this.setState({ password: text })}
          style={styles.input}
          secureTextEntry={true}
          placeholder="Password"
        />
        <Button title="Login" onPress={this.handleLogin} style={styles.button} />
        <TouchableOpacity onPress={this.handleSignup}>
          <Text style={styles.text}>
            Don't have an account? <Text style={styles.link}>Sign up here</Text>
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
    color: '#4CAF50',
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

export default LoginScreen;
