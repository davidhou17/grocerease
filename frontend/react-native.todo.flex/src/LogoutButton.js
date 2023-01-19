import * as React from 'react';
import {Button, Alert} from 'react-native';
import {useUser} from '@realm/react';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont(); // load FontFamily font

export function LogoutButton() {
  const user = useUser();
  // The signOut function calls the logOut function on the currently
  // logged in user and then navigates to the welcome screen
  const signOut = () => {
    if (user) {
      user.logOut();
    }
  };

  return (
    <Button
      title="Log Out"
      titleStyle = {{
        fontFamily: "Avenir Next",
      }}
      onPress={() => {
        Alert.alert('Log Out', null, [
          {
            text: 'Yes, Log Out',
            style: 'destructive',
            onPress: () => signOut(),
          },
          {text: 'Cancel', style: 'cancel'},
        ]);
      }}
    />
  );
}
