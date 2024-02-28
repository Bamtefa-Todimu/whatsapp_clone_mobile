import { Button, FlatList, Image, ScrollView, StyleSheet, TextInput, TouchableOpacity, useColorScheme } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { useIsFocused } from '@react-navigation/native';
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
import moment from 'moment';


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
  const isFocused=useIsFocused();
  const router = useRouter()
  const [chats,setChats] = useState<Array<any>>([])
  const [userToken,setUserToken] = useState<string>("")
  const {user,logout,token} = useAuth()
  const [messageList,setMessageList] = useState<Array<String>>([])
  const [latestMessages,setLatestMessages] = useState<Array<Object>>([])

  const [text,setText] = useState<string>("")
  const [message,setMessage] = useState<string>()

  useEffect(()=>{
    const getToken = async() => {
    // router.push('/(modals)/addUser')

      const authtoken =await AsyncStorage.getItem('token')

      
      const userId =await AsyncStorage.getItem('user_id')
      console.log('FROM LOCAL STORAGE .......................',userId);
      
      if(!authtoken)
    {
      setTimeout( () => router.replace('/login'),5)
    }
    else
    {
      // console.log(authtoken);

      try
      {

        // console.log("userIDDDDDDDDDDDDDD . .. . . . ",userId);
        
          echo
        .channel(`testing.${userId?.toString()}`)
        .listen('SendChatMessage', 
          (e:any) => {
            // console.log('chats ======================>',e.chat.user.id);
            // console.log(chats);
            
            // console.log("New message received", e);
            // chats.forEach((ch) => console.log("valuasdfasdfasdfasdfa  == = = ",ch)
            //  )
            // const chatt = chats.filter((ch) => ch.user?.id !== e.chat.user.id ).concat(e.chat).reverse()
            // console.log(chatt);
            
            setChats((state) => state.filter((ch) => ch.user?.id !== e.chat.user.id ).concat({...e.chat,isNew:true}).reverse())
            // setChats(chatt)
          }
        );

        const response  = await axios.get(`${base_url}/api/users/messages`,{
          headers:{
            "content-type":"application/json",
            "accept":"application/json",
            "authorization":`Bearer ${token}`
          }
        })
        console.log("we focused");
        setChats(response.data.data)
            // console.log('chats ======================>',response.data.data);
        
        // setLatestMessages(response.data.latestMessages)

        // console.log(response.data.active_chats[0])
        

      }
      catch(err)
      {
        console.log('websocket error',err);
        
      }
    }
    }

    if(isFocused)
    {
      getToken()
      console.log("JUST FOCUSING HERE");
      
    }
  },[token,isFocused])

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

            chats.map((chat:any,index:number) => {
              return (

                <TouchableOpacity key={index} style={styles.chatContainer} onPress={() => router.push({pathname:`/room/${chat.chat_id}`,params:{recipientId:chat?.user.id}})}>
                  <View style={styles.chatInfoContainer}>
                  <Image resizeMode='cover' style={styles.chatImage}  source={{uri:chat?.user.image}} />
                    <View style={{gap:3,flexShrink:1,flexGrow:0}}>
                      <Text style={styles.chatName}>{chat?.user?.name}</Text>
                      <Text numberOfLines={2} style={styles.chatMessage}>{chat.message}</Text>
                    </View>
                  </View>
                  <View style={{flexShrink:0}}>
                    <Text key={index} style={{color:chat?.isNew?Colors.primartBlue:'gray'}}>{moment(chat?.created_at).fromNow()}</Text>

                  </View>
                    {
                      chat && chat?.isNew && 
                  <View style={{position:'absolute',right:20,bottom:20,width:10,height:10,borderRadius:10,backgroundColor:Colors.primartBlue}}></View>
                    }
                  </TouchableOpacity>


              )}
           
                )
            :
            null
          }
        </View>
      </ScrollView>
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
      gap:15,
      flexShrink:1

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
      opacity:0.7,
      flexShrink:1,
      flexGrow:0
    },
});
