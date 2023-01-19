import React from 'react';
import {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, Input, Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import RealmContext from './RealmContext';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';

const {useRealm, useQuery} = RealmContext;
Icon.loadFont(); // load FontFamily font

export function CreateToDoPrompt(props) {
  const {onSubmit} = props;
  const [summary, setSummary] = useState(null);
  const [price, setPrice] = useState(null);
  const [quantity, setQuantity] = useState(null);
  const [category, setCategory] = useState("Misc.");

  // autocomplete data

  const items = useQuery('Item');

  let temp = [...new Set(items.map(item => item.category))];
  let categories = [];
  for(let i = 0; i < temp.length; i+=1){
    categories.push({"id": i+1, "title": temp[i]});
  }
  const data = categories;

  return (
    <View style={styles.modalWrapper}>
      <Text style={styles.Title}> Add Item </Text>
      <Input placeholder="Item name" onChangeText={setSummary} style={{fontFamily:'Avenir Next'}}/>
      <Input placeholder="Price (per unit)" onChangeText={setPrice} style={{fontFamily:'Avenir Next'}}/>
      <Input placeholder="Quantity" onChangeText={setQuantity} style={{fontFamily:'Avenir Next'}}/>
      <AutocompleteDropdown
      position="absolute"
      clearOnFocus={false}
      closeOnBlur={true}
      closeOnSubmit={true}
      onChangeText={setCategory}
      onSelectItem={item => {
            item && setCategory(item.title)
          }}
      emptyResultText="Enter New Category"
      dataSet={data} 
      textInputProps={{
            placeholder: 'Add or Select Category',
            autoCorrect: true,
            autoCapitalize: 'true',
            style: {
              borderRadius: 25,
              color: "Black",
              paddingLeft: 25,
              fontFamily:'Avenir Next'
              }
      }}
      rightButtonsContainerStyle={{
            right: 8,
            height: 30,
            alignSelf: 'center',
          }}
          inputContainerStyle={{
            borderRadius: 10,
            width: 275
          }}
          suggestionsListContainerStyle={{
          }}
          containerStyle={{ flexGrow: 1, flexShrink: 1 }}
      />
      <Button
        title="Add to Cart"
        titleStyle={{
            fontFamily: "Avenir Next"
        }}
        buttonStyle={styles.saveButton}
        suggestionsListMaxHeight="200"
        onPress={() => onSubmit({summary, price, quantity, category})}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  modalWrapper: {
    width: 300,
    minHeight: 300,
    borderRadius: 10,
    alignItems: 'center',
  },
  addItemTitle: {
    margin: 20,
  },
  saveButton: {
    marginTop: 20,
    marginBottom: 10,
    width: 280,
    backgroundColor:'#023020',
  },
  Title: {
    margin: 20,
    fontSize: 20,
    fontFamily: 'Avenir Next',
  },
});
