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
  Image,
  FlatList
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import axios from 'axios';
import Confetti from 'react-native-confetti';
import MakeItRain from "react-native-make-it-rain";
import SwipeCards from 'react-native-swipe-cards';
import { Icon } from 'react-native-elements'
import { ImagePicker } from 'expo';



const { Permissions } = Expo;

class CameraRoll extends React.Component {
 constructor(props) {
   super(props);
   this.state = {
     image: null,
     hasCameraPermission: null,
     hasRollPermission: null,
   };
 }

render() {
  let { image } = this.state;

  return (
    <View style={{alignItems: 'space-between', justifyContent: 'flex-start'}}>
      <TouchableOpacity style={[styles.button, {backgroundColor: '#A9A9A9', padding: 5, width: '80%', borderRadius: 20}]} onPress={()=>this._pickImage()}>
        <Text style={styles.buttonLabel}>Upload a Picture of your Resume!</Text>
      </TouchableOpacity>
      {/* {image &&
        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />} */}
    </View>
  );
}

_pickImage = async () => {

const { status } = await Permissions.askAsync(Permissions.CAMERA);
const { status_roll } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

console.log('camera: '+status);
console.log('roll: '+status_roll);
this.setState({ hasCameraPermission: status === 'granted' });
this.setState({ hasRollPermission: status_roll === 'granted' });

  let result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true,
    aspect: [4, 3],
  });

  console.log(result);

  if (!result.cancelled) {
    this.setState({ image: result.uri });
  }
  this.props.updateResume(result.uri);
};
}







class EmployerRegisterScreen extends React.Component {
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
      title: '',
      company: '',
      description: '',
      logo: ''
    }
  }
  register(){
    fetch('https://hinder.herokuapp.com/register/recruiter',{
      method:'POST',
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
        title: this.state.title,
        company: this.state.company,
        description: this.state.description,
        logo: this.state.logo
      })
    })
    .then((response)=>response.json())
    .then((responseJson) =>{
      if (responseJson.success){
        //<Text>{responseJson}</Text>
        this.props.navigation.navigate('EmployerLogin');
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
      <View style={{flex: 1,
          justifyContent: 'flex-start',
          alignItems: 'center',
          backgroundColor: '#696969'}}>
        <Text style={[styles.textBig, {marginBottom: 20}]}>Employer Registration</Text>
        <TextInput
          style={{height:30, width:250,backgroundColor:'white', margin:5, textAlign:'center', borderRadius: 15}}
          placeholder='Enter your username'
          onChangeText={(text)=>this.setState({username:text})}
        />
        <TextInput
          style={{height:30, width:250,backgroundColor:'white', margin:5, marginBottom: 20, textAlign:'center', borderRadius: 15}}
          secureTextEntry={true}
          placeholder='Enter your password'
          onChangeText={(text)=>this.setState({password:text})}
        />
        <TextInput
          style={{height:30, width:250,backgroundColor:'white', margin:5, textAlign:'center', borderRadius: 15}}
          placeholder='Enter the job title'
          onChangeText={(text)=>this.setState({title:text})}
        />
        <TextInput
          style={{height:30, width:250,backgroundColor:'white', margin:5, textAlign:'center', borderRadius: 15}}
          placeholder='Enter the company'
          onChangeText={(text)=>this.setState({company:text})}
        />
        <TextInput
          style={{height:60, width:250,backgroundColor:'white', margin:5, textAlign:'center', borderRadius: 15}}
          placeholder='Enter the job description'
          onChangeText={(text)=>this.setState({description:text})}
        />
        <TextInput
          style={{height:30, width:250,backgroundColor:'white', margin:5, textAlign:'center', borderRadius: 15}}
          placeholder='Enter a logo image URL'
          onChangeText={(text)=>this.setState({logo:text})}
        />
        <TouchableOpacity onPress={this.register.bind(this)} style={styles.button, {height: 35, alignItems: 'center', justifyContent: 'center', padding: 4, marginTop: 17, backgroundColor: '#FB6567', width: '40%', borderRadius: 360}}>
          <Text style={styles.buttonLabel}>Submit</Text>
        </TouchableOpacity>
      </View>
    )
  }
}








class UserRegisterScreen extends React.Component {
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
    console.log("resume is " ,this.state.resume);
    fetch('https://hinder.herokuapp.com/register/user',{
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
        this.props.navigation.navigate('UserLogin');
      } else{
        console.log(responseJson);
      }
    })
    .catch((err)=>{
      console.log('err',err);
    });
  }

  updateResume(url) {
     this.setState({
       resume: url
     });
   }

  render() {
    return (
      <View style={styles.container}>

        <Text style={[styles.textBig, {marginBottom: 20}]}>Job Seeker Registration</Text>
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
        <CameraRoll updateResume={(url)=>this.updateResume(url)}/>
        <TouchableOpacity onPress={this.register.bind(this)} style={styles.button, {height: 35, alignItems: 'center', justifyContent: 'center', padding: 4, marginTop: 17, backgroundColor: '#FB6567', width: '40%', borderRadius: 360}}>
          <Text style={styles.buttonLabel}>Submit</Text>
        </TouchableOpacity>
      </View>
    )
  }
}


class EmployerLoginScreen extends React.Component {
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
    return fetch('https://hinder.herokuapp.com/login/recruiter',{
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
      AsyncStorage.setItem('recruiter',JSON.stringify({
        username:this.state.username,
        password:this.state.password
      }))
      this.props.navigation.navigate('EmployerSwipe');
    } else{
      console.log(resp);
    }
  }

  componentDidMount(){
    AsyncStorage.getItem('recruiter')
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
    this.props.navigation.navigate('EmployerRegister');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={[styles.textBig, {marginBottom: 20}]}>Employer Login</Text>
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









class UserLoginScreen extends React.Component {
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
    return fetch('https://hinder.herokuapp.com/login/user',{
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
      this.props.navigation.navigate('UserSwipe');
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
    this.props.navigation.navigate('UserRegister');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={[styles.textBig, {marginBottom: 20}]}>Job Seeker Login</Text>
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
       <Text style={styles.noMoreCardsText}>No more searches. Check back later!</Text>
     </View>
   )
 }
}






class UserSwipeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
    };
  }

  static navigationOptions  = (props) => ({
    headerStyle: {
     backgroundColor: '#DCDCDC',
    },
    headerRight:
      <TouchableOpacity onPress={()=>{
        AsyncStorage.setItem('user',JSON.stringify({
          username:'',
          password:''
        }))
        props.navigation.navigate('Home');
      }}>
        <Text style={{marginRight: 10}}>Logout</Text>
      </TouchableOpacity>
  });

  logout() {
    AsyncStorage.setItem('user',JSON.stringify({
      username:'',
      password:''
    }))
    this.props.navigation.navigate('Home');
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
   AsyncStorage.getItem('user')
     .then(result => {
       var parsedResult = JSON.parse(result);
       var username = parsedResult.username;
       return username;
     }).then((user) => {
       fetch('https://hinder.herokuapp.com/newfollow',{
         method:'POST',
         headers:{
           "Content-Type":"application/json"
         },
         body: JSON.stringify({
           user: user,
           job: card.username
         })
       })
     })
     .catch(err=>{console.log(err)})
 }

 handleNope (card) {
   console.log(`Nope for ${card.text}`)
 }


 handleMaybe (card) {
   AsyncStorage.getItem('user')
     .then(result => {
       var parsedResult = JSON.parse(result);
       var username = parsedResult.username;
       return username;
     }).then((user) => {
       fetch('https://hinder.herokuapp.com/newapply',{
         method:'POST',
         headers:{
           "Content-Type":"application/json"
         },
         body: JSON.stringify({
           user: user,
           job: card.username
         })
       })
     })
     .catch(err=>{console.log(err)})
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
       maybeText={'Apply'}
       handleYup={this.handleYup}
       handleNope={this.handleNope}
       handleMaybe={this.handleMaybe}
       hasMaybeAction
     />
     <TouchableOpacity style={{alignItems:"flex-end", paddingRight: 10, paddingBottom: 10}}>
       <Icon name='arrow-forward' size={30} onPress={ () => {this.props.navigation.navigate('FeedScreen')} }>Feed</Icon>
     </TouchableOpacity>,
   </View>
   )
 }
}



class UserCard extends React.Component {
 constructor(props) {
   super(props);
 }

 render() {
   console.log(this.props.resume)
   return (
     <View style={[styles.card, {backgroundColor: 'white', alignItems: 'flex-start'}]}>
       <Text style={{marginLeft: 20, marginTop: 20, marginBottom: 7, fontSize: 35}}>Applicant</Text>
       <View
         style={{
           borderBottomColor: 'black',
           borderBottomWidth: 1,
           width: 325,
         }}
       />
       <View style={{flex: 1, height: "70%", alignSelf: 'center', padding: 20}}>
         <Image style={{width: 300, height: '100%', resizeMode: 'contain'}} source={{uri:this.props.resume}}/>
       </View>
    </View>
   )
 }
}



class EmployerSwipeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
    };
  }

  static navigationOptions  = (props) => ({
    headerStyle: {
     backgroundColor: '#DCDCDC',
    },
    headerRight:
      <TouchableOpacity onPress={()=>{
        AsyncStorage.setItem('recruiter',JSON.stringify({
          username:'',
          password:''
        }))
        props.navigation.navigate('Home');
      }}>
        <Text style={{marginRight: 10}}>Logout</Text>
      </TouchableOpacity>
  });

 componentDidMount() {
    AsyncStorage.getItem('recruiter')
     .then(result => {
       var parsedResult = JSON.parse(result);
       var username = parsedResult.username;
       return username;
     }).then((user) => {
       console.log(user);
       fetch('https://hinder.herokuapp.com/allusers', {
         method: 'POST',
         headers:{
           "Content-Type":"application/json"
         },
         body: JSON.stringify({
           job: user
         })
         })
       .then((response) => response.json())
       .then((responseJson) => {
           if (responseJson) {
             console.log(responseJson);
             this.setState({cards: responseJson})
           } else {
             alert("Login failed, try again")
             this.props.navigation.navigate('Home')
           }
        })
       .catch((err) => {
        console.log(err)
        });
     })


}

handleYup (card) {
  AsyncStorage.getItem('recruiter')
    .then(result => {
      var parsedResult = JSON.parse(result);
      var username = parsedResult.username;
      return username;
    }).then((user) => {
      fetch('https://hinder.herokuapp.com/match',{
        method:'POST',
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify({
          user: card.username,
          job: user
        })
      })
    })
    .catch(err=>{console.log(err)})
}

 handleNope (card) {
   console.log(`Nope for ${card.text}`)
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
       renderCard={(cardData) => <UserCard {...cardData} />}
       renderNoMoreCards={() => <NoMoreCards />}

       handleYup={this.handleYup}
       handleNope={this.handleNope}
       handleMaybe={this.handleMaybe}
       yupText={'Interested'}
       hasMaybeAction
     />
   </View>
   )
 }
}












class Home extends React.Component {
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

  componentDidMount(){
    if (this._confettiView) {
      this._confettiView.startConfetti();
    }
  }

  componentWillUnmount () {
    if (this._confettiView)
    {
        this._confettiView.stopConfetti();
    }
  }


  employer() {
    this.props.navigation.navigate('EmployerLogin');
  }

  seeker() {
    this.props.navigation.navigate('UserLogin');
  }

  render() {
    return (
      <View style={styles.container}>
        <Confetti confettiCount={10000000} untilStopped={true} ref={(node)=> this._confettiView = node}/>
        <MakeItRain numMoneys={20} moneyDimensions={{width: 100, height: 50}}/>
        <Text style={[styles.textBig, {marginBottom: 20}]}>Hinder!</Text>
        <Text style={{textAlign: 'center', color:'white', fontSize: 16}}>I am a...</Text>
        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
        <TouchableOpacity onPress={ () => {this.employer()} } style={[styles.button, {backgroundColor: "#A9A9A9", width: '35%', borderRadius: 360}]}>
          <Text style={styles.buttonLabel}>Employer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, {backgroundColor: '#FB6567', width: '35%', borderRadius: 360}]} onPress={ () => {this.seeker()} }>
          <Text style={styles.buttonLabel}>Job Seeker</Text>
        </TouchableOpacity>
        </View>
      </View>
    )
  }
}



class FeedScreen extends React.Component {
 constructor(props){
   super(props);
   this.state={
     follows:[],
     matches: []
   }
 }

 static navigationOptions = (props) => ({
   headerLeft: <TouchableOpacity>
     <Icon name="arrow-back" size={30} onPress={ () => {props.navigation.navigate('UserSwipe')} }></Icon>
   </TouchableOpacity>,
   headerStyle: {
      backgroundColor: "#DCDCDC",
    },
 });

getFollows() {
  var self = this;
  AsyncStorage.getItem('user')
    .then(result => {
      var parsedResult = JSON.parse(result);
      var username = parsedResult.username;
      return username;
    }).then((user) => {
      console.log('user is ', user)
      fetch('https://hinder.herokuapp.com/follow', {
        method: 'POST',
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify({
          user:user
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
          self.setState({
            follows: responseJson
          })
       })
      .catch((err) => {
       console.log(err)
       });
    })
    .catch(err=>{console.log(err)})

}

getMatches() {
  var self = this;
  AsyncStorage.getItem('user')
    .then(result => {
      var parsedResult = JSON.parse(result);
      var username = parsedResult.username;
      return username;
    }).then((user) => {
      console.log('user is ', user)
      fetch('https://hinder.herokuapp.com/apply', {
        method: 'POST',
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify({
          user:user
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
          self.setState({
            follows: responseJson.job,
            matches: responseJson.bool
          })
       })
      .catch((err) => {
       console.log(err)
       });
    })
    .catch(err=>{console.log(err)})
}

// componentDidMount() {
//   if (this._confettiView) {
//     this._confettiView.startConfetti();
//   }
// }

 render(){
   for (var i = 0; i < this.state.matches.length; i++) {
     this.state.follows[i].match = this.state.matches[i];
   }
   console.log(this.state.follows);
   return(
     <View style={{paddingRight: 5, paddingLeft:5, flex: 1, backgroundColor:"#DCDCDC", alignItems:"center", justifyContent:"center"}}>
       <Confetti untilStopped={true} confettiCount={100000000000000000} ref={(node)=> this._confettiView = node}/>
     <Text
       style={{
         fontSize: 25,
         width:"100%",
         color: "#696969",
         margin: 10,
         textAlign: 'center'
       }}>
       Jobs
       </Text>
       <View style={{display:'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10}}>
         <View style={{backgroundColor: '#708090', padding: 5, margin: 5, borderRadius: 5, alignSelf: 'stretch'}}>
           <TouchableOpacity onPress={()=>this.getFollows()}>
             <Text style={{fontSize: 20}}>Interested</Text>
           </TouchableOpacity>
         </View>
         <View style={{width: 40}}></View>
         <View style={{backgroundColor: '#708090', padding: 5, margin: 5, borderRadius: 5, alignSelf: 'stretch'}}>
           <TouchableOpacity  onPress={()=>this.getMatches()}>
             <Text style={{fontSize: 20}}>Applied</Text>
           </TouchableOpacity>
         </View>

       </View>

     <FlatList
       data={this.state.follows}
         renderItem={({item}) =>
         <View
           style=
           {[item.match ? {backgroundColor: '#FFD700'} : {backgroundColor: 'white'}, {
           flex:1,
           width:"100%",
           width:350,
           // height: 200,
           // shadowColor: 'black', // IOS
           // shadowOffset: { height: 1, width: 1 }, // IOS
           // shadowOpacity: 1, // IOS
           // shadowRadius: 1, //IOS
           borderRadius:15,
           alignItems: "flex-start",
           flexDirection:"column",
           justifyContent:"flex-start",
           borderWidth: .5,

           // backgroundColor: {{item.match} ? "yellow" : "white"},
           marginTop: 5,
           marginBottom: 5,
         }]}>

         <View style={{
           justifyContent:"center",
           alignItems: "flex-start",
           width: 350,
           borderRadius:10,
           padding: 10,
           marginRight: 10,
           borderBottomWidth: .5,
         }}>
         <Text style={{
             fontWeight: "bold",
             textAlign: 'left',
             marginBottom: 5,
             fontSize: 20,
           }}>{item.title}</Text>
           <Text style={{
               textAlign: 'left',
               fontSize: 15,
             }}>
             {item.description}
           </Text>
         </View>

         <View style={{height: 120, alignItems:"flex-start", borderRadius:10, padding: 10}}>
           <Image style={{width: 350, height:120, flex:1, borderRadius:10, resizeMode: 'contain'}} source={{uri:item.logo}}/>
         </View>


         </View>
       }
     />

   </View>
   )
 }
 }







export default StackNavigator({
  Home: {
    screen: Home
  },
  UserLogin: {
    screen: UserLoginScreen,
  },
  UserRegister: {
    screen: UserRegisterScreen,
  },
  EmployerRegister: {
    screen: EmployerRegisterScreen
  },
  UserSwipe: {
    screen: UserSwipeScreen,
  },
  EmployerSwipe: {
    screen: EmployerSwipeScreen
  },
  EmployerLogin: {
    screen: EmployerLoginScreen
  },
  FeedScreen: {
    screen: FeedScreen
  }
}, {initialRouteName: 'Home'})

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
    textAlign: 'center',
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
