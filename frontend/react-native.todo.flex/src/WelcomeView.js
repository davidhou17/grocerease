import React, {useState} from 'react';
import Realm from 'realm';
import {useApp} from '@realm/react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StyleSheet, Text, View, Alert} from 'react-native';
import {Input, Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

Icon.loadFont(); // load FontAwesome font

export function WelcomeView({navigation, route}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // state values for toggable visibility of features in the UI
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [isInSignUpMode, setIsInSignUpMode] = useState(true);

  const app = useApp();

  // signIn() uses the emailPassword authentication provider to log in
  const signIn = async () => {
    const creds = Realm.Credentials.emailPassword(email, password);
    await app.logIn(creds);
  };

  // onPressSignIn() uses the emailPassword authentication provider to log in
  const onPressSignIn = async () => {
    try {
      await signIn(email, password);
    } catch (error) {
      Alert.alert(`Failed to sign in: ${error.message}`);
    }
  };

  // onPressSignUp() registers the user and then calls signIn to log the user in
  const onPressSignUp = async () => {
    try {
      await app.emailPasswordAuth.registerUser({email, password});
      signIn(email, password);
    } catch (error) {
      Alert.alert(`Failed to sign up: ${error.message}`);
    }
  };

  return (
    <SafeAreaProvider style={{backgroundColor: '#F5F8F2'}}>
      <View style={styles.viewWrapper}>
        <Text style={styles.title}>Grocerease</Text>
        <Input
          placeholder="Email"
          onChangeText={setEmail}
          autoCapitalize="none"
          style={{fontFamily:'Avenir Next'}}/>
        <Input
          placeholder="Password"
          onChangeText={setPassword}
          style={{fontFamily:'Avenir Next'}}
          secureTextEntry={passwordHidden}
          rightIcon={
            <Icon
              name={passwordHidden ? 'eye-slash' : 'eye'}
              size={12}
              color="black"
              onPress={() => setPasswordHidden(!passwordHidden)}
            />
          }
        />
        {isInSignUpMode ? (
          <>
            <Button
              title="Create Account"
              titleStyle={{
                  fontFamily: "Avenir Next"
              }}
              buttonStyle={styles.mainButton}
              onPress={onPressSignUp}
            />
            <Button
              title="Already have a cart? Log In"
              type="clear"
              titleStyle={{
                  fontFamily: "Avenir Next"
              }}
              onPress={() => setIsInSignUpMode(!isInSignUpMode)}
            />
          </>
        ) : (
          <>
            <Button
              title="Log In"
              buttonStyle={styles.mainButton}
              onPress={onPressSignIn}
              titleStyle={{
                  fontFamily: "Avenir Next"
              }}
            />
            <Button
              title="Don't have a cart? Create account"
              type="clear"
              titleStyle={{
                  fontFamily: "Avenir Next"
              }}
              onPress={() => setIsInSignUpMode(!isInSignUpMode)}
            />
          </>
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  viewWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 32,

  },
  title: {
    fontSize: 32,
    color: '#023020',
    fontFamily: 'Avenir Next',

  },
  mainButton: {
    width: 350,
    backgroundColor: '#8CDA93'
  },
});
