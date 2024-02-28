import { ActivityIndicator, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/context/auth-context';
import { Link, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const register = () => {
    const router = useRouter()
    const {register, isLoading, error, token } = useAuth();
  const [name,setName] = useState<string>("")
  const [email,setEmail] = useState<string>("")
  const [password,setPassword] = useState<string>("")
  const [confirmPassword,setConfirmPassword] = useState<string>("")

  const handleRegister = async() =>
  {
    await register(name,email,password,confirmPassword)
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

//   useEffect(() => {
//     if(!isLoading)
//   },[isLoading])
    
  return (
    <View style={styles.container}>
        <View style={styles.wrapper}>
            <Text style={styles.title}>Register</Text>

            <View style={styles.inputContainer}>
                <View style={styles.textInputContainer}>
                    <Text>Name:</Text>
                    <TextInput placeholder="Name" style={styles.textInput} onChangeText={(text) => setName(text)} />
                </View>
                <View style={styles.textInputContainer}>
                    <Text>Email:</Text>
                    <TextInput placeholder="Email" style={styles.textInput} onChangeText={(text) => setEmail(text)} />
                </View>
                <View style={styles.textInputContainer}>
                    <Text>Password:</Text>
                    <TextInput placeholder="Pasword" style={styles.textInput} onChangeText={(text) => setPassword(text)} />
                </View>
                <View style={styles.textInputContainer}>
                    <Text>Confirm Password:</Text>
                    <TextInput placeholder="Confirm Password" style={styles.textInput} onChangeText={(text) => setConfirmPassword(text)}  />
                </View>
            </View>

            <TouchableOpacity style={styles.btn} onPress={handleRegister}>
                {
                    isLoading?
                    <ActivityIndicator size={'small'} color={'white'} />
                    :
                    <Text style={styles.btnText}>Continue</Text>
                }
            </TouchableOpacity>
            
            <View style={styles.existingLink}>
              <Text>Already Have an Account?</Text>
              <Link style={styles.link} href={'/(modals)/login'}>Login</Link>
            </View>
            {/* <Button title="Sign Up" onPress={()=>logout()}/> */}

            <Text style={styles.errorMessage}>{error?error:''}</Text>
        </View>
    </View>
  )
}

export default register

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#fff'
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
      color:'#34C759'
    }

})