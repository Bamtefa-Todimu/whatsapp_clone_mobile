import { ActivityIndicator, Button, StyleSheet,  TextInput, TouchableOpacity, useColorScheme } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/context/auth-context';
import { Text,View } from '@/components/Themed';
import { Link, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const login = () => {
const theme = useColorScheme() ?? "light"

    const router = useRouter()
    const {login, isLoading, error,user, token } = useAuth();
  const [email,setEmail] = useState<string>("")
  const [password,setPassword] = useState<string>("")

  const handleLogin = async() =>
  {
    await login(email,password)
  }

  useEffect(() =>{

    const getToken = async() => {
      // await AsyncStorage.clear()
      const authtoken =await AsyncStorage.getItem('token')
      console.log('FROM LOCAL STORAGE .......................',authtoken);
      
      if(authtoken)

      {
        setTimeout( () => router.replace("/(tabs)/"),10 )
    }
    else
    {
      console.log(authtoken);
    }
}



    getToken()
    
  },[token])


  return (
    <View style={styles.container}>
        <View style={styles.wrapper}>
            <Text style={styles.title}>Login</Text>

            <View style={styles.inputContainer}>
                <View style={styles.textInputContainer}>
                    <Text>Email:</Text>
                    <TextInput placeholder="Email" style={[styles.textInput,{color:theme === "light"?"#000":"#fff",backgroundColor:theme === "light"?Colors.grey:"#111"}]} onChangeText={(text) => setEmail(text)} />
                </View>
                <View style={styles.textInputContainer}>
                    <Text>Password:</Text>
                    <TextInput placeholder="Password" style={[styles.textInput,{color:theme === "light"?"#000":"#fff",backgroundColor:theme === "light"?Colors.grey:"#111"}]} onChangeText={(text) => setPassword(text)}  />
                </View>
            </View>

            <TouchableOpacity style={styles.btn} onPress={handleLogin}>
                {
                    isLoading?
                    <ActivityIndicator size={'small'} color={'white'} />
                    :
                    <Text style={styles.btnText}>Continue</Text>
                }
            </TouchableOpacity>

            <View style={styles.existingLink}>
              <Text>Dont Have an Account?</Text>
              <Link style={styles.link} href={'/(modals)/register'}>Register</Link>
            </View>

            <Text style={styles.errorMessage}>{error?error:''}</Text>
        </View>
    </View>
  )
}

export default login

const styles = StyleSheet.create({
    container:{
        flex:1,
        // backgroundColor:'#fff'
    },
    wrapper:{
        padding:20
    },
    title:{
        fontSize:35,
        fontWeight:'600',
        marginBottom:70
    },
    inputContainer:{
        gap:20,
        marginBottom:50

    },
    textInputContainer:{
        gap:5
    },
    textInput:{
        paddingHorizontal:10,
        paddingVertical:10,
        borderWidth:1,
        borderColor:'rgba(0,0,0,0.10)',
        borderRadius:5
    },
    btn:{
        justifyContent:'center',
        alignItems:'center',
        paddingVertical:10,
        borderRadius:5,
        backgroundColor: '#34C759'
    },
    btnText:{
        color:'#fff',

    },
    errorMessage:{
        color:'red'
    },
    existingLink:{
      flexDirection:'row',
      gap:5,
      alignItems:'center',
      justifyContent:'center',
      marginVertical:20

    },
    link:{
      color:'#34C759',
      
    }

})