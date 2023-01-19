import React from 'react';
import {StyleSheet, View, ScrollView, SafeAreaView} from 'react-native';
import {Text, Input, Button} from 'react-native-elements';
import {ListItem, Card} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import RealmContext from './RealmContext';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const {useRealm, useQuery} = RealmContext;
Icon.loadFont(); // load FontFamily font


export function ReceiptView() {
  const receipts = useQuery('Receipt');
  const realm = useRealm();
  const deleteReceipt = _id => {
    // if the realm exists, get the Item with a particular _id and delete it
    if (realm) {
      const receipt = realm.objectForPrimaryKey('Receipt', _id); // search for a realm object with a primary key that is an objectId
      realm.write(() => {
        realm.delete(receipt);
      });
    }
  };

  const truncateString = (str, num) => {
    // If the length of str is less than or equal to num
    // just return str--don't truncate it.
    if (str.length <= num) {
      return str
    }
    // Return str truncated with '...' concatenated to the end of str.
    return str.slice(0, num)
  }

  return (
    <ScrollView style={styles.viewWrapper}>
    <Text style={styles.Title}>Receipts</Text>
        {receipts.map(receipt => (
          <ListItem key={`${receipt._id}`} bottomDivider topDivider>
          <Button style={styles.button}
              type="clear"
              onPress={() => deleteReceipt(receipt._id)}
              icon={<Icon name="times" size={12} color="#979797" />}
            />
            <Text style={styles.paragraph}>{receipt.title} 
            {'\n'}
            Cost: ${receipt.price.toFixed(2)}
            {'\n'}
            Date: {truncateString(receipt.date,15)}
            {'\n'}
            Items Purchased: {receipt.itemList}</Text>
          </ListItem>
        ))}
      </ScrollView>
  );
}


const styles = StyleSheet.create({
    viewWrapper: {
      flexDirection:'column',
      width: 350,
      maxHeight: 400,
    },
    Title: {
        margin: 20,
        fontSize: 20,
        textAlign: 'center',
        fontFamily: 'Avenir Next',
    },
    sectionContainer: {
      marginTop: 32,
      backgroundColor: '#F5F8F2',
      paddingHorizontal: 24,
    },
    footerText: {
      fontSize: 16,
      textAlign: 'center',
      fontFamily: 'Avenir Next',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: 30,
        backgroundColor: '#ecf0f1',
        padding: 8,
      },
      paragraph: {
        fontSize: 12,
        paddingLeft: 8,
        textAlign: 'left',
        flexWrap: 'wrap',
        flexShrink: 1,
        fontFamily: 'Avenir Next',

      },
    button: {
        align: "right",
    }
  });
  