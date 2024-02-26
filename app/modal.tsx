import { StatusBar } from 'expo-status-bar';
import { Button, Platform, StyleSheet, TextInput } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { useAuth } from '@/context/auth-context';
import { useState } from 'react';

export default function ModalScreen() {

  const { login, isLoading, error, user } = useAuth();
  const [email,setEmail] = useState<string>("")
  const [password,setPassword] = useState<string>("")

  const handleLogin = async() =>
  {
    await login(email,password)
  }
  return (
    <View style={styles.container}>

      <TextInput
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
        style={{padding:10,color:'#000', width: 200, borderWidth:StyleSheet.hairlineWidth,borderColor:'#000', marginBottom:10 }}
      />
      <TextInput
        placeholder="Password"
        onChangeText={(text) => setPassword(text)}

        style={{padding:10,color:'#000', width: 200, borderWidth:StyleSheet.hairlineWidth,borderColor:'#000' }}
      />

      <Button
        onPress={handleLogin}
        title="Login"
      />
      {/* <Text style={styles.title}>Modal</Text> */}
      {/* <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" /> */}
      {/* <EditScreenInfo path="app/modal.tsx" /> */}

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
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
