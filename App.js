import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoginScreen from './components/login.js';
import SignupScreen from './components/signup.js';
import ContactsScreen from './components/contacts.js';
import ChatsScreen from './components/chats.js';
import ChatScreen from './components/chat.js';
import SettingsScreen from './components/settings.js';
import ContactScreen from './components/contact.js';
import AddContactScreen from './components/addContact.js';
import ManageChatScreen from './components/manageChat.js';
import CreateChatScreen from './components/createChat.js';
import CameraScreen from './components/camera.js';

const MainStack = createNativeStackNavigator();
const ChatStack = createNativeStackNavigator();
const ContactStack = createNativeStackNavigator();
const SettingsStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function ChatStackNavigator() {
  return (
    <ChatStack.Navigator>
      <ChatStack.Screen name="Chats" component={ChatsScreen} options={{ headerShown: false }} />
      <ChatStack.Screen name="Chat" component={ChatScreen} options={{ headerShown: true }} />
      <ChatStack.Screen name="ManageChat" component={ManageChatScreen} options={{ headerShown: false }} />
    </ChatStack.Navigator>
  );
}

function ContactStackNavigator() {
  return (
    <ContactStack.Navigator>
      <ContactStack.Screen name="Contacts" component={ContactsScreen} options={{ headerShown: false}} />
      <ContactStack.Screen name="Contact" component={ContactScreen} options={{ headerShown: true }} />
      <ContactStack.Screen name="AddContact" component={AddContactScreen} options={{ headerShown: true }} />
    </ContactStack.Navigator>
  );
}

function SettingsStackNavigator(){
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen name="Settings" component={SettingsScreen} />
      <SettingsStack.Screen name="Camera" component={CameraScreen} />
    </SettingsStack.Navigator>
  )
}

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4CAF50',
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          color: '#FFFFFF',
        },
      }}
    >
      <Tab.Screen name="Contacts" component={ContactStackNavigator} />
      <Tab.Screen name="Chats" component={ChatStackNavigator} />
      <Tab.Screen name="Settings" component={SettingsStackNavigator} />
    </Tab.Navigator>
  );
}

class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <MainStack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#4CAF50',
            },
            headerTitleStyle: {
              fontWeight: 'bold',
              color: '#FFFFFF',
            },
          }}
        >
          <MainStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <MainStack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
          <MainStack.Screen name="WhatsThat" component={MainTabNavigator} options={{ headerShown: false }} />
        </MainStack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;
