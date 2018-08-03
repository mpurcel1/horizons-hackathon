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
  Button,
  Image
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import axios from 'axios';
import Confetti from 'react-native-confetti';
import MakeItRain from "react-native-make-it-rain";
import SwipeCards from 'react-native-swipe-cards';



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
        <Text style={[styles.textBig, {marginBottom: 20}]}>Register</Text>
        <TextInput
          style={{height:30, width:250,backgroundColor:'white', margin:5, textAlign:'center', borderRadius: 15}}
          placeholder='Enter your username'
          onChangeText={(text)=>this.setState({username:text})}
        />
        <TextInput
          style={{height:30, width:250,backgroundColor:'white', margin:5, textAlign:'center', borderRadius: 15}}
          secureTextEntry={true}
          placeholder='Enter your password'
          onChangeText={(text)=>this.setState({password:text})}
        />
        <TextInput
          style={{height:30, width:250,backgroundColor:'white', margin:5, textAlign:'center', borderRadius: 15}}
          secureTextEntry={true}
          placeholder='Enter link to your resume'
          onChangeText={(text)=>this.setState({resume:text})}
        />
        <TouchableOpacity onPress={this.register.bind(this)} style={styles.button, {padding: 4, marginTop: 17, backgroundColor: '#FB6567', width: '40%', borderRadius: 360}}>
          <Text style={styles.buttonLabel}>Submit</Text>
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
    title: 'Hinder'
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
    if (this._confettiView) {
      this._confettiView.startConfetti();
    }
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
        <Confetti untilStopped={true} ref={(node)=> this._confettiView = node}/>
        <MakeItRain numMoneys={30} moneyDimensions={{width: 100, height: 50}}/>
        <Text style={[styles.textBig, {marginBottom: 20}]}>Hinder!</Text>
        <TextInput
          style={{height:30, width:250,backgroundColor:'white', margin:5, textAlign:'center', borderRadius: 15}}
          placeholder='Enter your username'
          onChangeText={(text)=>this.setState({username:text})}
        />
        <TextInput
          style={{height:30, width:250,backgroundColor:'white' , margin:5, textAlign:'center', borderRadius: 15}}
          secureTextEntry={true}
          placeholder='Enter your password'
          onChangeText={(text)=>this.setState({password:text})}
        />
        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
        <TouchableOpacity onPress={ () => {this.press()} } style={[styles.button, {backgroundColor: "#A9A9A9", width: '35%', borderRadius: 360}]}>
          <Text style={styles.buttonLabel}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, {backgroundColor: '#FB6567', width: '35%', borderRadius: 360}]} onPress={ () => {this.register()} }>
          <Text style={styles.buttonLabel}>Register</Text>
        </TouchableOpacity>
        </View>
      </View>
    )
  }
}

class Card extends React.Component {
 constructor(props) {
   super(props);
 }

 render() {
   return (
     <View style={[styles.card, {backgroundColor: 'blue'}]}>
       <Text>{this.props.company}</Text>
       <Text>{this.props.title}</Text>
       <Text>{this.props.description}</Text>
       <Image source={{uri:this.props.logo}} style={{width:70,height:70}}/>
     </View>
   )
 }
}

class NoMoreCards extends React.Component {
 constructor(props) {
   super(props);
 }

 render() {
   return (
     <View>
       <Text style={styles.noMoreCardsText}>No more cards</Text>
     </View>
   )
 }
}

class SwipeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
    };
  }

 componentDidMount() {
   fetch('http://localhost:1337/alljobs', {
     method: 'GET',
     })
   .then((response) => response.json())
   .then((responseJson) => {
       if (responseJson) {
         this.setState({cards: responseJson})
       } else {
         alert("Login failed, try again")
         this.props.navigation.navigate('Login')
       }
    })
   .catch((err) => {
    console.log(err)
    });
}

 handleYup (card) {
   console.log(`Yup for ${card.text}`)
 }
 handleNope (card) {
   console.log(`Nope for ${card.text}`)
 }
 handleMaybe (card) {
   console.log(`Maybe for ${card.text}`)
 }
 render() {
   // If you want a stack of cards instead of one-per-one view, activate stack mode
   // stack={true}
   return (
     <View style={{flex:1, backgroundColor:"green"}}>
     //   <Text>This is above SwipeCards</Text>
     <SwipeCards
       containerStyle={{flex:1}}
       cards={this.state.cards}
       renderCard={(cardData) => <Card {...cardData} />}
       renderNoMoreCards={() => <NoMoreCards />}

       handleYup={this.handleYup}
       handleNope={this.handleNope}
       handleMaybe={this.handleMaybe}
       hasMaybeAction
     />
   </View>
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
  screen: SwipeScreen,
},
}, {initialRouteName: 'Login'})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    //backgroundColor: '#F5FCFF',
  },
  containerFull: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
  },
  card: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    height: 700,
  },
  noMoreCardsText: {
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 40,
    // width: 300,
    // height: 700,
    backgroundColor: "black",
    color:"white"
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
    color:'#D3D3D3'
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
