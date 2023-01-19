import React, { useState } from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StyleSheet, Text, View, ActivityIndicator, ScrollView, SafeAreaView} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {AppProvider, UserProvider, useUser} from '@realm/react';
import {Button, Overlay, ListItem, Card} from 'react-native-elements';
import {appId, baseUrl} from '../realm';
import {LogoutButton} from './LogoutButton';
import {WelcomeView} from './WelcomeView';
import {ItemListView} from './ItemListView';
import {ReceiptView} from './ReceiptView';
import RealmContext from './RealmContext';

const {RealmProvider} = RealmContext;

const Stack = createStackNavigator();

const AppWrapper = () => {
  return (
    <AppProvider id={appId} baseUrl={baseUrl}>
      <UserProvider fallback={WelcomeView}>
        <App />
      </UserProvider>
    </AppProvider>
  );
};

const App = () => {

  const [showReceiptOverlay, setShowReceiptOverlay] = useState(false);

  return (
    <>
      {/* After login, user will be automatically populated in realm configuration */}
      <RealmProvider
        sync={{
          flexible: true,
          initialSubscriptions: {
            update: (subs, realm) => {
              // subscribe to all of the logged in user's to-do items
              subs.add(realm.objects('Item'), {name: 'ownItems'});
              subs.add(realm.objects('Receipt'), {name: 'ownReceipts'});
            },
         }
        }}
        fallback={() => (
          <View style={styles.activityContainer}>
            <ActivityIndicator size="large" />
          </View>
        )}>
        <SafeAreaProvider>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen style={styles.text}
                name="Your Cart"
                component={ItemListView}
                options={{
                  headerLeft: () => {
                    return <LogoutButton />;
                  },
                  headerRight: () => {
                    return (
                      <SafeAreaView>
                      <Button
                      type="clear"
                      title="Receipts"
                      onPress={() => setShowReceiptOverlay(true)}
                      />
                      <Overlay
                       isVisible={showReceiptOverlay}
                       onBackdropPress={() => setShowReceiptOverlay(false)}>
                       <ReceiptView />
                       </Overlay>
                       </SafeAreaView>
                    );
                  },
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </RealmProvider>
    </>
  );
};

const styles = StyleSheet.create({

  viewWrapper: {
    flex: 1,
    flexDirection: 'row',
    width: 300,
    minHeight: 300,
    borderRadius: 4,
    alignItems: 'center',    
  },
  
  footerText: {
    fontSize: 10,
    textAlign: 'center',
  },
  footer: {
    margin: 40,
  },
  activityContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});

export default AppWrapper;
