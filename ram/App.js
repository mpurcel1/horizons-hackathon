import React from 'react';
import { StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ListView,
  Alert,
  Button,
  RefreshControl } from 'react-native';
import { StackNavigator } from 'react-navigation';  
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <Text>Changes you make will automatically reload.</Text>
        <Text>Shake your phone to open the developer menu.</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default StackNavigator({
  Home: {
    screen: HomeScreen,
  },
  Login: {
    screen: LoginScreen,
  },
  Register: {
    screen: RegisterScreen,
  },
  Swipe: {
    screen: SwipeScreen,
  },
  Feed: {
    screen: FeedScreen
  }
}, {initialRouteName: 'Home'});
