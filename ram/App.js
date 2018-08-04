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
//import LinearGradient from 'react-native-linear-gradient';



class RegisterScreen extends React.Component {
  static navigationOptions = {
    headerStyle: {
      backgroundColor: '#696969',
    }
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
    fetch('https://hinder.herokuapp.com/register',{
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
          style={{height:35, width:250,backgroundColor:'white', margin:5, textAlign:'center', borderRadius: 15}}
          placeholder='Enter your username'
          onChangeText={(text)=>this.setState({username:text})}
        />
        <TextInput
          style={{height:35, width:250,backgroundColor:'white', margin:5, textAlign:'center', borderRadius: 15}}
          secureTextEntry={true}
          placeholder='Enter your password'
          onChangeText={(text)=>this.setState({password:text})}
        />
        <TextInput
          style={{height:35, width:250,backgroundColor:'white', margin:5, textAlign:'center', borderRadius: 15}}
          placeholder='Enter link to your resume'
          onChangeText={(text)=>this.setState({resume:text})}
        />
        <TouchableOpacity onPress={this.register.bind(this)} style={styles.button, {height: 35, alignItems: 'center', justifyContent: 'center', padding: 4, marginTop: 17, backgroundColor: '#FB6567', width: '40%', borderRadius: 360}}>
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
    headerStyle: {
      backgroundColor: '#696969',
    }
  };

  login(username,password){
    return fetch('https://hinder.herokuapp.com/login',{
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

  componentWillUnmount () {
    if (this._confettiView)
    {
        this._confettiView.stopConfetti();
    }
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
        <MakeItRain numMoneys={20} moneyDimensions={{width: 100, height: 50}}/>
        <Text style={[styles.textBig, {marginBottom: 20}]}>Hinder!</Text>
        <TextInput
          style={{height:35, width:250,backgroundColor:'white', margin:5, textAlign:'center', borderRadius: 15}}
          placeholder='Enter your username'
          onChangeText={(text)=>this.setState({username:text})}
        />
        <TextInput
          style={{height:35, width:250,backgroundColor:'white' , margin:5, textAlign:'center', borderRadius: 15}}
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
     <View style={[styles.card, {backgroundColor: 'white', alignItems: 'flex-start'}]}>
       <Text style={{marginLeft: 20, marginTop: 20, marginBottom: 7, fontSize: 35}}>{this.props.company}</Text>
       <View
         style={{
           borderBottomColor: 'black',
           borderBottomWidth: 1,
           width: 325,
         }}
       />
       <View style={{height: "30%", alignSelf: 'center', padding: 20}}>
         <Image style={{flex: 1, width: 300, height: '50%', resizeMode: 'contain'}} source={{uri:this.props.logo}}/>
       </View>
       <View
         style={{
           borderBottomColor: 'black',
           borderBottomWidth: 1,
           width: 325
         }}
       />
       <View>
         <Text style={{marginLeft: 15, fontSize: 25, marginTop: 10}}>{this.props.title}</Text>
         <Text style={{marginBottom: 15, marginLeft: 15, marginRight: 15, fontSize: 14}}>{this.props.description}</Text>
       </View>
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
   fetch('https://hinder.herokuapp.com/alljobs', {
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
     <View style={{flex:1, backgroundColor:"#DCDCDC"}}>
     {/* //   <Text>This is above SwipeCards</Text> */}
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
    backgroundColor: '#696969',
    //backgroundColor: 'linear-gradient(to bottom, #33ccff 0%, #ff99cc 100%)'
    //backgroundColor: '#F5FCFF',
  },
  containerFull: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
  },
  card: {
    // justifyContent: 'space-between',
    alignItems: 'center',
    width: 325,
    height: "90%",
    borderRadius: 20
  },
  noMoreCardsText: {
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 40,
    // width: 300,
    // height: 700,
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
    color:'white'
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
