import { Button, ScrollView, StyleSheet, TextInput } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

import Echo from 'laravel-echo';
import socketio from 'socket.io-client';
import Pusher from 'pusher-js/react-native'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { base_url } from '@/constants/server';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/auth-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const echo = new Echo({
  broadcaster: 'pusher',
  Pusher,
  cluster:'mt1',
  key:"Laravel",
  forceTLS: false,
  wsHost: '192.168.100.42',
    wsPort: 6001,
    encrypted: false,
    enabledTransports: ['ws','wss']
});





export default function TabOneScreen() {

  const router = useRouter()
  const {user,logout,token} = useAuth()
  const [messageList,setMessageList] = useState<Array<String>>(['message1','message2'])
  const [text,setText] = useState<string>("")
  const [message,setMessage] = useState<string>()

  useEffect(()=>{
    
    const getToken = async() => {
      // await AsyncStorage.clear()
      const authtoken =await AsyncStorage.getItem('token')
      console.log('FROM LOCAL STORAGE .......................',authtoken);
      
      if(!authtoken)
    {

      setTimeout( () => router.push('/login'),500)
      
      // router.replace('/(modals)/login')

    }
    else
    {
      console.log(authtoken);
      
      echo
      .channel('testing')
      .listen('SendChatMessage', 
      (e) => {
        setMessageList((state) => state.concat(e.message))
      }
      );
    }
    }

    getToken()
    // var authtoken
    // getToken().then((response ) => {authtoken = response})
    // console.log("LOGGING AUTH TOKEN ------------>" ,authtoken);
    
    
    
  },[])

  const handleLogout = async () =>{
    await logout()
    router.replace('/(modals)/login')
  }

  useEffect(() => {
    console.log(messageList);
    
  },[messageList])

  // useEffect(() => {
  //   console.log("token ===> ",token);
  //   if(!token)
  //   {

  //           setTimeout( () => router.push('/login'),500)

  //   }
  // },[token])

  const sendMessage = async() =>{
      const response = await axios.post(`${base_url}/test`,{message:text})
      console.log(response.data);

  }
  
  return (
    <ScrollView>

    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/index.tsx" />

      <View>
        {
          messageList.map((message,index) => {
            return (
              <Text key={index}>{message}</Text>
            )
          })
        }
      </View>

      <TextInput placeholder='message...' style={{padding:10,width:200,margin:10,borderWidth:StyleSheet.hairlineWidth,borderColor:'#000',borderRadius:8}} onChangeText={(text) => setText(text)}/>
      <Button title='Send Message' onPress={sendMessage} />
      <Button title='Logout' onPress={async () => handleLogout()} />


    </View>
    </ScrollView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
});
