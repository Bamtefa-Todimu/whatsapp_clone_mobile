import { Button, FlatList, Image, ScrollView, StyleSheet, TextInput, TouchableOpacity, useColorScheme } from 'react-native';

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
import { EvilIcons, Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import {echo} from '../../echo'


// const echo = new Echo({
//   broadcaster: 'pusher',
//   Pusher,
//   cluster:'mt1',
//   key:"Laravel",
//   forceTLS: false,
//   wsHost: '192.168.100.42',
//     wsPort: 6001,
//     encrypted: false,
//     enabledTransports: ['ws','wss']
// });





export default function TabOneScreen() {
const theme = useColorScheme() ?? "light"

  const router = useRouter()
  const [chats,setChats] = useState<Array<any>>([])
  const [userToken,setUserToken] = useState<string>("")
  const {user,logout,token} = useAuth()
  const [messageList,setMessageList] = useState<Array<String>>(['message1','message2'])
  const [latestMessages,setLatestMessages] = useState<Array<Object>>([])

  const [text,setText] = useState<string>("")
  const [message,setMessage] = useState<string>()

  useEffect(()=>{
    
    const getToken = async() => {
      const authtoken =await AsyncStorage.getItem('token')
      
      const userId =await AsyncStorage.getItem('user_id')
      // console.log('FROM LOCAL STORAGE .......................',authtoken);
      
      if(!authtoken)
    {
      setTimeout( () => router.replace('/login'),5)
    }
    else
    {
      // console.log(authtoken);

      try
      {
        console.log("userIDDDDDDDDDDDDDD . .. . . . ",userId);
        
          echo
        .channel(`testing.${userId?.toString()}`)
        .listen('SendChatMessage', 
          (e:any) => {
            // console.log('chats ======================>',chats);
            
            // console.log("New message received", e);
            // chats.forEach((ch) => console.log("valuasdfasdfasdfasdfa  == = = ",ch)
            //  )
            // const chatt = chats.filter((ch) => ch.id !== e.chat.id ).concat(e.chat).reverse()
            // console.log(chatt);
            
            // setChats(chatt)
            // setMessageList((state) => state.concat(e.message))
          }
        );

        const response  = await axios.get(`${base_url}/api/chats`,{
          headers:{
            "content-type":"application/json",
            "accept":"application/json",
            "authorization":`Bearer ${token}`
          }
        })
        setChats(response.data.active_chats)
            console.log('chats ======================>',response.data.active_chats);

        setLatestMessages(response.data.latestMessages)

        // console.log(response.data.active_chats[0])
        

      }
      catch(err)
      {
        console.log('websocket error',err);
        
      }
    }
    }

    getToken()
  },[token])

  const handleLogout = async () =>{
    await logout()
  }

  useEffect(() => {
    // console.log(messageList);
    
  },[messageList])


  const sendMessage = async() =>{
      const response = await axios.post(`${base_url}/test`,{message:text})
      console.log(response.data);
  }

  const formatChatArray = (arr:any) => {
    const newArr = arr.filter((ar:any) => JSON.stringify(ar).length>2 &&  ar != undefined )
    return newArr
  }

  const getDate  = (date:Date) => {
    if(!date) return ""
    const dateObject  = new Date(date)
    return dateObject.toLocaleDateString('en-US') 

  }
  
  return (

    <View style={styles.container}>
      <ScrollView style={{flex:1}}>
        <Text style={styles.title}>
          Chats
        </Text>
        <View style={styles.searchContainer}>
          <View style={styles.inputWrapper}>
            <TextInput placeholder='Search' style={[styles.searchInput,{color:theme === "light"?"#000":"#fff",backgroundColor:theme === "light"?Colors.grey:"#111"}]}/>
            <EvilIcons name='search' size={30} color={theme === "light"?'rgba(0,0,0,0.50)':Colors.primartBlue} style={styles.searchIcon}/>
          </View>
          <TouchableOpacity>
            <Ionicons name='filter' size={20} color={Colors.primartBlue} />
          </TouchableOpacity>
        </View>

        <View>
          {
            chats? 

            formatChatArray(chats).map((chat:any,index:number) => {
              return (

                <TouchableOpacity key={index} style={styles.chatContainer} onPress={() => router.push({pathname:`/room/${chat.pivot.chat_id}`,params:{recipientId:chat?.id}})}>
                  <View style={styles.chatInfoContainer}>
                  <Image resizeMode='cover' style={styles.chatImage}  source={{uri:chat?.avatar || "https://th.bing.com/th/id/OIP.VORoQXOzfnrc1yOV4anzxQHaHa?rs=1&pid=ImgDetMain"}} />
                    <View style={{gap:3}}>
                      <Text style={styles.chatName}>{chat?.name}</Text>
                      <Text numberOfLines={2} style={styles.chatMessage}>{chat.message}</Text>
                    </View>
                  </View>
                  <View>
                    <Text key={index}>{getDate(chat?.updated_at)}</Text>

                  </View>
                  </TouchableOpacity>


              )}
           
                )
            :
            null
          }
        </View>
      </ScrollView>
      <Button title='Logout' onPress={async () => handleLogout()} />
    </View>
    



  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  title: {
    fontSize: 37,
    fontWeight: 'bold',
    marginVertical:10,
    marginHorizontal:20
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  searchContainer:{
    flexDirection:'row',
    paddingHorizontal:20,
    alignItems:'center',
    justifyContent:'space-between',
    marginBottom:20

  },
  inputWrapper:{
    width:'90%',
    // height:50,
    justifyContent:'center'
  },
  searchInput:{
        paddingHorizontal:10,
        paddingLeft:40,
        fontSize:17,
        paddingVertical:8,
        backgroundColor:Colors.grey,
        borderRadius:10,
    },
    searchIcon:{
      position:'absolute',
      left:5,
      top:6
    },
    chatContainer:{
      paddingHorizontal:20,
      paddingVertical:10,
      flexDirection:'row',
      // alignItems:'center',
      justifyContent:'space-between',
      borderTopWidth:StyleSheet.hairlineWidth,
      borderTopColor:'rgba(0,0,0,0.3)'
    },
    chatInfoContainer:{
      flexDirection:'row',
      gap:15

    },
    chatImage:{
      width:55,
      height:55,
      borderRadius:100,
      backgroundColor:'#fff'
    },
    chatName:{
      fontWeight:'500',
      fontSize:17,
      textTransform:'capitalize'
    },
    chatMessage:{
      opacity:0.7
    },
});
