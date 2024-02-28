import { Button, Image, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { base_url } from '@/constants/server';
import axios from 'axios';

export default function TabTwoScreen() {

  const [user,setUser] = useState<any>({})
  const [newUserName,setNewUserName] = useState<string>("")
  const [newUserImage,setNewUserImage] = useState<any>("")
  const [authtoken,setToken] = useState<string>("")
  const {logout,token} = useAuth()


  const getUser = async() => {
    const user = await AsyncStorage.getItem('user')
    const token = await AsyncStorage.getItem('token')
    console.log("USERRRRR --> ",JSON.parse(user!));
    setUser(JSON.parse(user!))
    setToken(token!)
    setNewUserName(JSON.parse(user!).user_name)

  }

  const handleLogout = async () =>{
    await logout()
  }

  const getToken = async() => {
      const authtoken =await AsyncStorage.getItem('token')

    if(!authtoken)
    {
      setTimeout( () => router.replace('/login'),5)
    }
  }

  const handleUpdate = async() => {
    const response  = await axios.put(`${base_url}/api/users/update`,{
      "email":user.user_email,
      "name":newUserName,
      "image":"https://i.iheart.com/v3/catalog/artist/458793?ops=fit(720%2C720)"
    },
    {
          headers:{
            "content-type":"application/json",
            "accept":"application/json",
            "authorization":`Bearer ${authtoken}`
          }
        })
        console.log(response.data.data);
        setNewUserName(response.data.data.user_name)
        setUser(response.data.data)


  }
  
  useEffect(() => {
    

    getToken()
    getUser()
    
  },[token])



  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <View style={styles.imageSection}>
          <View style={styles.imageContainer}>
            <Image source={{uri:user?.user_image}}style={styles.image}/>
            <Text style={styles.edit}>Edit</Text>
          </View>
          <TouchableOpacity style={{flexShrink:1}}> 
            <Text style={styles.text}>Enter your name and add an optional profile picture</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.nameContainer}>
          <TextInput style={styles.name} value={newUserName} onChangeText={(text) => setNewUserName(text)}/>
          {/* <Text style={styles.name}>{user?.user_name}</Text> */}
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.update} onPress={() => handleUpdate()}>
          <Text style={styles.updateText}>Update</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={async () => handleLogout()} style={styles.logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:20,
    backgroundColor: 'rgba(0,0,0,0.001)'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  infoContainer:{
    backgroundColor:'#fff',
    borderRadius:8,
    overflow:'hidden',
    padding:20,
    gap:10,
    marginBottom:50
  },
  imageSection:{
    flexDirection:'row',
    alignItems:'center',
    gap:20
  },
  imageContainer:{
    gap:7,
    alignItems:'center'
  },
  image:{
    width:50,
    height:50,
    borderRadius:50
  },
  edit:{
    color:Colors.primartBlue,
    fontSize:14,
    fontWeight:'500'
  },
  text:{
    color:'rgba(0,0,0,0.3)',
    fontSize:13,
    marginTop:-30
  },
  nameContainer:{
    paddingVertical:10,
    borderTopWidth:StyleSheet.hairlineWidth,
    borderBottomWidth:StyleSheet.hairlineWidth,
    borderTopColor:'rgba(0,0,0,0.3)',
    borderBottomColor:'rgba(0,0,0,0.3)',
  },
  name:{
    fontSize:18,
    fontWeight:'300'
  },
  actions:{
    backgroundColor:'transparent',
    gap:20
  },
  update:{
    paddingVertical:10,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:8,
    backgroundColor:'#fff',
    opacity:0.8
  },
  updateText:{
    color:Colors.primartBlue,
    fontWeight:'500',
    fontSize:17
  },
  logout:{
    paddingVertical:10,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:8,
    backgroundColor:'#fff',
    opacity:0.8
  },
  logoutText:{
    color:Colors.primartBlue,
    fontWeight:'500',
    fontSize:17
  }
});
