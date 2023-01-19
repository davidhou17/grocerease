import React, {useEffect, useState } from 'react';
import Realm from 'realm';
import {BSON} from 'realm';
import {useUser} from '@realm/react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StyleSheet, Text, View, ScrollView, SafeAreaView} from 'react-native';
import {Button, Overlay, ListItem, Card} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {CreateToDoPrompt} from './CreateToDoPrompt';
import {CreateReceiptPrompt} from './CreateReceiptPrompt';
import RealmContext from './RealmContext';

const {useRealm, useQuery} = RealmContext;

Icon.loadFont(); // load FontAwesome font

export function ItemListView() {
  const realm = useRealm();
  const items = useQuery('Item');
  const receipts = useQuery('Receipt');
  const user = useUser();
  const [showNewItemOverlay, setShowNewItemOverlay] = useState(false);
  const [showReceiptOverlay, setShowReceiptOverlay] = useState(false);

  useEffect(() => {
    // initialize the subscriptions
    const updateSubscriptions = async () => {
      await realm.subscriptions.update(mutableSubs => {
        // subscribe to all of the logged in user's items
        let ownItems = realm
          .objects("Item")
          .filtered(`owner_id == "${user.id}"`);
        let ownReceipts = realm
        .objects("Receipt")
        .filtered(`owner_id == "${user.id}"`);
        // use the same name as the initial subscription to update it
        mutableSubs.add(ownItems, {name: "ownItems"});
        mutableSubs.add(ownReceipts, {name: "ownReceipts"});
      });
    };
    updateSubscriptions();
  }, [realm, user]);
  

  // createItem() takes in various fields and then creates an Item object
  const createItem = ({summary, price, quantity, category}) => {
    // if the realm exists, create an Item
    if (realm) {
      realm.write(() => {
        realm.create('Item', {
          _id: new BSON.ObjectID(),
          owner_id: user.id,
          summary: summary,
          price: Number(price),
          quantity: Number(quantity),
          category: String(category),
        });
      });
    }
  };

  // createReceipt() takes in your cart then creates a Receipt object with that summary
  const createReceipt = ({title, price, date, itemList}) => {
    // if the realm exists, create a Receipt
    if (realm) {
      realm.write(() => {
        realm.create('Receipt', {
          _id: new BSON.ObjectID(),
          owner_id: user.id,
          title: title,
          price: Number(price),
          date: String(date),
          itemList: String(itemList),
        });
      });
    }
  };

  // deleteItem() deletes an Item with a particular _id
  const deleteItem = _id => {
    // if the realm exists, get the Item with a particular _id and delete it
    if (realm) {
      const item = realm.objectForPrimaryKey('Item', _id); // search for a realm object with a primary key that is an objectId
      realm.write(() => {
        realm.delete(item);
      });
    }
  };

  const getItemsTotal = () => {
    return items.map(({ price, quantity }) => price * quantity).reduce((partialSum, a) => partialSum + a, 0).toFixed(2);
  };

  const getCategories = () => {
    return [...new Set(items.map(item => item.category))];
  }

  return (
    <SafeAreaProvider style={{backgroundColor: '#F5F8F2'}}>
      <ScrollView style={styles.viewWrapper}>
        <Button
          title="+ ADD ITEM"
          buttonStyle={styles.addToDoButton}
          titleStyle={{
            fontFamily: "Avenir Next"
          }}
          onPress={() => setShowNewItemOverlay(true)}
        />
        <Overlay
          isVisible={showNewItemOverlay}
          onBackdropPress={() => setShowNewItemOverlay(false)}>
          <CreateToDoPrompt
            onSubmit={({summary, price, quantity, category}) => {
              setShowNewItemOverlay(false);
              createItem({summary, price, quantity, category});
            }}
          />
        </Overlay>
        {getCategories().map(category => {
          return (
            <SafeAreaView>
              <Text style={styles.header}> {category}</Text>
              {
                items.filter(i => i.category === category).map(item => { return (
                  <ListItem key={`${item._id}`} bottomDivider topDivider>
                  <Text style={styles.grayText}>{parseFloat(item.quantity.toFixed(1))}</Text>
                  <ListItem.Title style={styles.itemTitle}>
                   {item.summary}
                  </ListItem.Title>
                  <Text style={styles.text}>${(item.price * item.quantity).toFixed(2)}</Text>
                  <Button
                    type="clear"
                    onPress={() => deleteItem(item._id)}
                    icon={<Icon name="times" size={12} color="#979797" />}
                  />
                </ListItem>
                )})
              }
            </SafeAreaView>
          )
        })}
      </ScrollView>
      <View style={styles.footer}>
            <Text style={styles.footerText}>
              Total cost (pre-tax): ${getItemsTotal()}
            </Text>
          </View>
          <Button
          title="CHECKOUT"
          buttonStyle={styles.saveButton}
          titleStyle={{
            fontFamily: "Avenir Next"
          }}
          onPress={() => setShowReceiptOverlay(true)}
          />
          <Overlay
          isVisible={showReceiptOverlay}
          onBackdropPress={() => setShowReceiptOverlay(false)}>
          <CreateReceiptPrompt
            onSubmit={({title, price, date, itemList}) => {
              setShowReceiptOverlay(false);
              createReceipt({title, price, date, itemList});
            }}
          />
          </Overlay>
          
    </SafeAreaProvider>
  );
}


const styles = StyleSheet.create({
  viewWrapper: {
    flex: 1,
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
  footer: {
    margin: 15,
  },
  addToDoButton: {
    backgroundColor: '#8CDA93',
    borderRadius: 4,
    margin: 5,
  },
  saveButton: {
    backgroundColor: '#8CDA93',
    borderRadius: 5,
    textAlign: 'center',
    margin: 0,
  },

  itemTitle: {
    flex: 1,
    fontFamily: 'Avenir Next',
    
  },
  header: {
    fontSize: 18,
    fontFamily: 'Avenir Next',
    paddingLeft: 5,
    color: "#023020",
    backgroundColor: '#F5F8F2',
    marginTop: 5,
    marginBottom: 5,
  },
  grayText: {
    color: "#5A5A5A",
    fontFamily: 'Avenir Next',
    fontSize: 12
  },
  text: {
    fontFamily: 'Avenir Next',
  },
});
