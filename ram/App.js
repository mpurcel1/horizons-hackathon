import React from 'react';
import {
  AsyncStorage,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ListView,
  Alert,
  Button
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import axios from 'axios';



class RegisterScreen extends React.Component {
  static navigationOptions = {
    title: 'Register'
  };
  constructor(){
    super();
    this.state = {
      username:'',
      password:'',
      resume:''
    }
  }
  register(){
    fetch('http://localhost:1337/register',{
      method:'POST',
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
        resume: this.state.resume
      })
    })
    .then((response)=>response.json())
    .then((responseJson) =>{
      if (responseJson.success){
        //<Text>{responseJson}</Text>
        this.props.navigation.navigate('Login');
      } else{
        console.log(responseJson);
      }
    })
    .catch((err)=>{
      console.log('err',err);
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={{height:40,width:100}}
          placeholder='Enter your username'
          onChangeText={(text)=>this.setState({username:text})}
        />
        <TextInput
          style={{height:40, width:100}}
          secureTextEntry={true}
          placeholder='Enter your password'
          onChangeText={(text)=>this.setState({password:text})}
        />
        <TextInput
          style={{height:40, width:100}}
          secureTextEntry={true}
          placeholder='Enter link to your resume'
          onChangeText={(text)=>this.setState({resume:text})}
        />
        <TouchableOpacity onPress={this.register.bind(this)} style={styles.button, styles.buttonRed}>
          <Text style={styles.textBig}>Submit</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class LoginScreen extends React.Component {
  constructor(){
    super();
    this.state={
      username:'',
      password:'',
    }
  }
  static navigationOptions = {
    title: 'Login'
  };

  login(username,password){
    return fetch('http://localhost:1337/login',{
      method:'POST',
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        username:username,
        password:password
      })
    })
  }

  checkResponseAndGoToMainScreen(resp){
    if (resp.success){
      AsyncStorage.setItem('user',JSON.stringify({
        username:this.state.username,
        password:this.state.password
      }))
      this.props.navigation.navigate('User');
    } else{
      console.log(resp);
    }
  }

  componentDidMount(){
    AsyncStorage.getItem('user')
      .then(result => {
        var parsedResult = JSON.parse(result);
        var username = parsedResult.username;
        var password = parsedResult.password;
        if (username && password) {
          return this.login(username, password)
            .then(resp => resp.json())
            .then((respJson)=>this.checkResponseAndGoToMainScreen(respJson));
        }
      })
      .catch(err=>{console.log(err)})
  }

  press() {
    return this.login(this.state.username, this.state.password)
      .then(resp => resp.json())
      .then((respJson)=>this.checkResponseAndGoToMainScreen(respJson))
      .catch(err=>{console.log(err)})
  }

  register() {
    this.props.navigation.navigate('Register');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login to Hinder!</Text>
        <TextInput
          style={{height:40, width:200}}
          placeholder='Enter your username'
          onChangeText={(text)=>this.setState({username:text})}
        />
        <TextInput
          style={{height:40, width:200}}
          secureTextEntry={true}
          placeholder='Enter your password'
          onChangeText={(text)=>this.setState({password:text})}
        />
        <TouchableOpacity onPress={ () => {this.press()} } style={[styles.button, styles.buttonGreen]}>
          <Text style={styles.buttonLabel}>Tap to Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={ () => {this.register()} }>
          <Text style={styles.buttonLabel}>Tap to Register</Text>
        </TouchableOpacity>
      </View>
    )
  }
}
class UserScreen extends React.Component {
  render(){
    return (
      <View></View>
    )
  }
}



export default StackNavigator({
  Login: {
    screen: LoginScreen,
  },
  Register: {
    screen: RegisterScreen,
  },
  User: {
  screen:UserScreen,
},
}, {initialRouteName: 'Login'})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  containerFull: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  textBig: {
    fontSize: 36,
    textAlign: 'center',
    margin: 10,
  },
  button: {
    alignSelf: 'stretch',
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 5
  },
  buttonRed: {
    backgroundColor: '#FF585B',
  },
  buttonBlue: {
    backgroundColor: '#0074D9',
  },
  buttonGreen: {
    backgroundColor: '#2ECC40'
  },
  buttonLabel: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white'
  }
});


// export default StackNavigator({
//   Home: {
//     screen: HomeScreen,
//   },
//   Login: {
//     screen: LoginScreen,
//   },
//   Register: {
//     screen: RegisterScreen,
//   },
//   Swipe: {
//     screen: SwipeScreen,
//   },
//   Feed: {
//     screen: FeedScreen
//   }
// }, {initialRouteName: 'Home'});
