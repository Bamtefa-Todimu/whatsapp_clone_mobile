import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, } from 'react-native'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useGlobalSearchParams, useNavigation } from 'expo-router'
import { Text , View} from '@/components/Themed'
import { useAuth } from '@/context/auth-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { echo } from '@/echo'
import { base_url } from '@/constants/server'
import axios from 'axios'
import Colors from '@/constants/Colors'
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { useNavigationBuilder } from '@react-navigation/native'


const room = () => {

  const navigation = useNavigation()
        

  const scrollRef = useRef<ScrollView>(null)
  const {id,recipientId} = useGlobalSearchParams();
  const [userId,setUserId] = useState<string>("")
  const [text,setText] = useState<string>()
  const [recipient,setRecipient] = useState<any>({})
  const [messages,setMessages] = useState<Array<any>>([])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: recipient.name,
      // headerTransparent: true,

      
    });
  }, [recipient]);

  useEffect(() => {
    const getUser = async() => {

      try
      {
          const user = await AsyncStorage.getItem('user_id');
          const token = await AsyncStorage.getItem('token');
          setUserId(user!)

          echo
          .channel(`testing.${user?.toString()}`)
          .listen('SendChatMessage', 
            (e:any) => {
              console.log(e);
              setMessages((state) => state.concat(e.chat))
              scrollRef.current?.scrollToEnd()
            }
          );

          const response  = await axios.get(`${base_url}/api/chat/${id}/message`,{
          headers:{
            "content-type":"application/json",
            "accept":"application/json",
            "authorization":`Bearer ${token}`
          }
        })
        setMessages(response.data.data)
              scrollRef.current?.scrollToEnd()

              const recipientResponse  = await axios.get(`${base_url}/api/user/${recipientId}`,{
          headers:{
            "content-type":"application/json",
            "accept":"application/json",
            "authorization":`Bearer ${token}`
          }
        })

        // console.log('RECIPIENENSNTTT ===>',recipientResponse.data.data);
        
        setRecipient(recipientResponse.data.data)

            // console.log('chats ======================>',response.data.data);

      }
      catch(Err)
      {
        console.log("ROOM ERROR ==>", Err);
        
      }
      
    }
    getUser()
              scrollRef.current?.scrollToEnd()

  },[])

  useEffect(() => {
      setTimeout( () =>  scrollRef.current?.scrollToEnd({animated:Platform.OS === "ios"?false:true,}))
      
  },[messages])


  const handleSendMessage = async() => {
          const token = await AsyncStorage.getItem('token');
    setMessages((state) => state.concat({message:text,user_id:userId}) )
    const response  = await axios.post(`${base_url}/api/chat/${recipientId}`,{message:text},{
          headers:{
            "content-type":"application/json",
            "accept":"application/json",
            "authorization":`Bearer ${token}`
          }
        })
  }

  return (
    <View style={styles.container}>
      {/* <Text>Room ID: {id}</Text> */}
      {/* <Text>RECIPIENT ID : {recipientId}</Text> */}
      <Image source={require('../../assets/images/whatsapp_background.png')} resizeMode='contain' style={{position:'absolute',width:'100%',height:'100%',opacity:0.4}} />
      <ScrollView   ref={scrollRef} showsVerticalScrollIndicator={false} contentContainerStyle={{
        paddingBottom:20
      }} style={styles.messageBox}>
        {
          messages?
            messages.map((msg,index) => 
      
              (
                msg.user_id != userId ?
                
                  <View key={index} style={[styles.messageBubble]}>
                    <Text style={styles.msgText} >{msg.message}</Text>
                  </View>
                
                :
                <View key={index} style={[styles.messageBubbleUser]}>
                    <Text style={styles.msgText} >{msg.message}</Text>
                  </View>
                

              )
            
            )

          :
          null
        }
      </ScrollView>
      <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.select({ios: 70, android: 0})}
      >

      <View style={[styles.messageInputBox]}>
        <TextInput placeholder='' style={styles.messageInput} onChangeText={(text) => setText(text) }/>
        <TouchableOpacity onPress={() => handleSendMessage()}>
          <MaterialCommunityIcons name='send-circle' size={40} color={Colors.primartBlue} />
        </TouchableOpacity>
      </View>
      </KeyboardAvoidingView>

      {/* <Text>{id}</Text> */}
    </View>
  )
}

export default room

const styles = StyleSheet.create({
  container:{
    flex:1,
    paddingBottom:0
  }
  ,messageBox:{
    paddingHorizontal:20,
    gap:50,
    backgroundColor:'rgba(0,0,0,0.05)',
    paddingBottom:20
  },
  messageBubble:{
    borderRadius:14,
    // maxWidth:"70%",
    marginVertical:5,
    padding:5,
    paddingHorizontal:20,
    paddingVertical:10,
    alignSelf:'flex-start'
  },
  messageBubbleUser:{
    borderRadius:14,
    maxWidth:"70%",
    marginVertical:5,
    padding:5,
    paddingHorizontal:20,
    paddingVertical:10,
    backgroundColor:'#dcf7c5',
    alignSelf:'flex-end'
  },
  msgText:{
    fontSize:17,
    fontWeight:'500'
  },
  messageInputBox:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    paddingHorizontal:20,
    paddingVertical:30,
    paddingTop:10,
    backgroundColor:'#ececec'
  },
  messageInput:{
    backgroundColor:"#fff",
    borderColor:'#000',
    borderWidth:StyleSheet.hairlineWidth,
    width:'80%',
    borderRadius:10,
    fontSize:16,
    padding:8
  },
})