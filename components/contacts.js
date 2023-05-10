import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, SectionList, ScrollView, TouchableWithoutFeedback } from 'react-native';
import getItemLayout from 'react-native-section-list-get-item-layout';


class ContactsScreen extends Component {
  constructor(props) {
    super(props);
    this.handleContactChange = this.handleContactChange.bind(this);
  }
  state = {
    contacts: [],
    searchQuery: "",
  }

  componentDidMount = async () => {
    this.fetchContacts();
  }

  fetchContacts = async () => {
    const authId = await AsyncStorage.getItem("auth_id");
    fetch('http://localhost:3333/api/1.0.0/contacts', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Authorization': authId,
      },
    })
      .then(async (response) => response.json())
      .then(data => {
        // Do something with the data
        const returnedContacts = data.map(contact => {
          // Check if the "id" property is defined before calling "toString()"
          const key = contact.user_id ? contact.user_id.toString() : '';
          console.log("Contacts Fetched");
          return { ...contact, key };
        })
        this.setState({ contacts: returnedContacts });
      })
      .catch(error => console.error(error));
  }
  /*this function is called when a contact is deleted in order to maintain 
  consistency in the UI when a user is deleted */

  handleContactChange = () => {
    this.fetchContacts(); // fetch updated contact data
  }

  handleSearch = (text) => {
    this.setState({ searchQuery: text });
  };

  renderSectionHeader = ({ section }) => {
    return (
      <Text style={styles.sectionHeader}>{section.title}</Text>
    );
  }

  renderItem = ({ item }) => {
    return (
      <TouchableOpacity key={item.key}
        onPress={() => {
          this.props.navigation.navigate('Contact', {
            userId: item.user_id,
            handleContactDeleted: this.handleContactDeleted, //pass the function as a parameter
            handleContactChange: this.handleContactChange,
          });
        }}
      >
        <View>
          <Text style={styles.contact_name}>{item.first_name} {item.last_name}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const { searchQuery, contacts } = this.state;

    // Filter the contacts list based on the search query
    const filteredContacts = contacts.filter(contact => {
      const fullName = `${contact.first_name} ${contact.last_name}`;
      return fullName.toLowerCase().includes(searchQuery.toLowerCase());
    });

    // Sort the filtered contacts by full name
    filteredContacts.sort((a, b) => {
      const fullNameA = `${a.first_name} ${a.last_name}`;
      const fullNameB = `${b.first_name} ${b.last_name}`;
      return fullNameA.localeCompare(fullNameB);
    });
    const sections = [];
    let currentLetter = '';
    let sectionIndex = -1;

    filteredContacts.forEach((contact) => {
      const firstLetter = contact.first_name.charAt(0).toUpperCase();
      //sorts the alphabetic 'sections' into order
      if (firstLetter !== currentLetter) {
        sectionIndex += 1;
        currentLetter = firstLetter;
        sections.push({
          title: currentLetter,
          data: [contact],
        });
      } else {
        sections[sectionIndex].data.push(contact);
      }
    });

    return (
      <View style={styles.container}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search Contacts"
          value={searchQuery}
          onChangeText={this.handleSearch}
        />
        <ScrollView style={styles.scrollContainer}>
          <SectionList
            sections={sections}
            renderItem={this.renderItem}
            renderSectionHeader={this.renderSectionHeader}
            getItemLayout={getItemLayout({
              getItemHeight: (rowData, sectionIndex, rowIndex) => 50,
              getSectionHeaderHeight: () => 30,
              getSectionFooterHeight: () => 0,
              listHeaderHeight: 0,
              listFooterHeight: 0,
            })}
            keyExtractor={(item, index) => item.key + index}
          />
        </ScrollView>
        <TouchableWithoutFeedback
          onPress={() => {
            this.props.navigation.navigate('AddContact');
          }}
        >
          <View style={styles.floatingButton}>
            <Text style={styles.floatingButtonText}>Add</Text>
          </View>
        </TouchableWithoutFeedback>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: 20,
    backgroundColor: '#eee',
    color: '#4CAF50',
    paddingLeft: 10,
    fontWeight: 'bold',
  },
  contact_name: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingLeft: 10,
    marginBottom: 20,
    color: '#000',
  },
  searchBar: {
    fontSize: 20,
    width: 200,
  },
  scrollContainer: {
    flex: 1,
    overflow: 'scroll',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20, // adjust the value to set the desired bottom margin
    right: 20, // adjust the value to set the desired right margin
    backgroundColor: '#4CAF50',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ContactsScreen;
