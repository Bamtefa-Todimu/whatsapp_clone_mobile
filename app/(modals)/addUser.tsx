import { Image, ScrollView, StyleSheet, TextInput, TouchableOpacity, useColorScheme, } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Text,View } from '@/components/Themed'
import { EvilIcons, Ionicons } from '@expo/vector-icons'
import Colors from '@/constants/Colors'
import { base_url } from '@/constants/server'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'

const TestUsers = [
    {
        id:1,
        image:"https://th.bing.com/th/id/OIP.VORoQXOzfnrc1yOV4anzxQHaHa?rs=1&pid=ImgDetMain",
        name:"Micheal"
    },
    {
        id:2,
        image:"https://th.bing.com/th/id/OIP.VORoQXOzfnrc1yOV4anzxQHaHa?rs=1&pid=ImgDetMain",
        name:"Gabriel"
    }
]

const addUser = () => {
const theme = useColorScheme() ?? "light"

    const [users,setUsers] = useState<Array<any>>([])

    const fetchUsers = async() => {
      const authtoken =await AsyncStorage.getItem('token')

        const response  = await axios.get(`${base_url}/api/users`,{
          headers:{
            "content-type":"application/json",
            "accept":"application/json",
            "authorization":`Bearer ${authtoken}`
          }
        })
        // console.log(response.data.data);
        
        setUsers(response.data.data)
    }


    useEffect(() => {
        fetchUsers()
    },[])

  return (
    <View style={styles.container}>
    
      <View style={styles.searchContainer}>
          <View style={styles.inputWrapper}>
            <TextInput placeholder='Search' style={[styles.searchInput,{color:theme === "light"?"#000":"#fff",backgroundColor:theme === "light"?Colors.grey:"#111"}]}/>
            <EvilIcons name='search' size={30} color={theme === "light"?'rgba(0,0,0,0.50)':Colors.primartBlue} style={styles.searchIcon}/>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>

        <View>
            <Text style={styles.header}>Available Users</Text>

            <View style={[styles.userList,{backgroundColor:theme === "light"?'rgba(0,0,0,0.03)':"#111"}]}>
                {
                    users && users.length > 0 ? 
                    users?.map((tu) => (
                        <TouchableOpacity style={styles.chatInfoContainer} key={tu.id} onPress={() => router.replace({pathname:`/room/${0}`,params:{recipientId:tu.id}})}>
                            <Image resizeMode='cover' style={styles.chatImage}  source={{uri:tu?.image}} />
                            <Text style={styles.name}>{tu.name}</Text>
                        </TouchableOpacity>
                    ))

                    :null
                }
            </View>
        </View>
        </ScrollView>

    </View>
  )
}

export default addUser

const styles = StyleSheet.create({
    container:{
        flex:1,
        
    },
    searchContainer:{
    flexDirection:'row',
    paddingHorizontal:20,
    alignItems:'center',
    justifyContent:'space-between',
    // marginBottom:20,
    marginVertical:20

  },
  inputWrapper:{
    width:'100%',
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
    header:{
        fontSize:16,
        fontWeight:'500',
        marginLeft:40,
    },
    userList:{
        marginHorizontal:20,
        backgroundColor:'#111',
        borderRadius:8,
        overflow:'hidden',
        marginTop:5,
    },
    chatInfoContainer:{
        gap:20,
        alignItems:'center',
        padding:20,
        paddingVertical:5,
        flexDirection:'row'
        
        // borderRadius:8

    },
    chatImage:{
      width:55,
      height:55,
      borderRadius:100,
      backgroundColor:'#fff'
    },
    name:{
      fontWeight:'500',
      fontSize:17,
      textTransform:'capitalize'
    },
})