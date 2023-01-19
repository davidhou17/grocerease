import React from 'react';
import {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, Input, Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import RealmContext from './RealmContext';

const {useRealm, useQuery} = RealmContext;
Icon.loadFont(); // load FontFamily font

export function CreateReceiptPrompt(props) {
  const realm = useRealm();
  const {onSubmit} = props;
  const [title, setTitle] = useState(null);
  const date = new Date().toString();
  const [price, setPrice] = useState(null);
  const items = useQuery('Item');
  const receipts = useQuery('Receipt');

  let tester = receipts.map(receipt => receipt.date)

  console.log(tester)

  let name = [(items.map(item => item.summary))][0];
  let num = [(items.map(item => item.quantity))][0];

  let data = [];
  for(let j = 0; j < name.length; j+=1){
    data.push(parseFloat(num[j].toFixed(1)) + " " + name[j])
  }

  const itemList = data.join(", ");

  // console.log(itemList)

  const emptyCart = () => {
    // if the realm exists, get the Item with a particular _id and delete it
    if (realm) {
      const items = realm.objects('Item'); // search for a realm object with a primary key that is an objectId
      console.log(items)
      realm.write(() => {
        realm.delete(items);
      });
    }
  };

  return (
    <View style={styles.modalWrapper}>
      <Text style={styles.Title}> Add Receipt </Text>
      <Input placeholder="Title" onChangeText={setTitle} style={{fontFamily:'Avenir Next'}}/>
      <Input placeholder="Actual Price" onChangeText={setPrice} style={{fontFamily:'Avenir Next'}}/>
      <Button style={styles.button}
        title="Save Receipt and Clear Cart"
        titleStyle={{
            fontFamily: "Avenir Next"
        }}
        buttonStyle={styles.button}
        suggestionsListMaxHeight="200"
        onPress={() => 
        {
          onSubmit({title, price, date, itemList});
          emptyCart();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  modalWrapper: {
    width: 300,
    minHeight: 250,
    borderRadius: 4,
    alignItems: 'center',
  },
  Title: {
    margin: 20,
    fontSize: 20,
    fontFamily: 'Avenir Next',
  },
  button: {
    marginTop: 0,
    width: 280,
    backgroundColor:'#023020',
  },
});
