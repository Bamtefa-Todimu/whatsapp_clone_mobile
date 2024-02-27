import { ActivityIndicator, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'expo-router';

const login = () => {
    const router = useRouter()
    const {logout, login, isLoading, error, user, token } = useAuth();
  const [email,setEmail] = useState<string>("")
  const [password,setPassword] = useState<string>("")

  const handleLogin = async() =>
  {
    await login(email,password)
  }

  useEffect(() =>{
    if(token)
    {
        console.log(token);
        
        console.log(
            'pushed back to tabs ------------------'

        );
        setTimeout( () => router.push("/(tabs)/"),10 )
    }
    else
    {

    }
    
  },[token])

//   useEffect(() => {
//     if(!isLoading)
//   },[isLoading])
    
  return (
    <View style={styles.container}>
        <View style={styles.wrapper}>
            <Text style={styles.title}>Login</Text>

            <View style={styles.inputContainer}>
                <View style={styles.textInputContainer}>
                    <Text>Email:</Text>
                    <TextInput placeholder="Email" style={styles.textInput} onChangeText={(text) => setEmail(text)} />
                </View>
                <View style={styles.textInputContainer}>
                    <Text>Password:</Text>
                    <TextInput placeholder="Password" style={styles.textInput} onChangeText={(text) => setPassword(text)}  />
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

            <Button title="Sign Up" onPress={()=>logout()}/>

            <Text style={styles.errorMessage}>{error?error:''}</Text>
        </View>
    </View>
  )
}

export default login

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
        paddingVertical:15,
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
    }

})