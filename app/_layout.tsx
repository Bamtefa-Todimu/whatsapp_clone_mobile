import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import {AuthProvider} from '../context/auth-context';
import { useColorScheme } from '@/components/useColorScheme';
import { TouchableOpacity } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>

    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        <Stack.Screen name="room/[id]" options={{
           headerTitle:'',
           title:"",
           headerShadowVisible:false,
           headerLeft:() => (
               <TouchableOpacity style={{paddingRight:20}} onPress={() => router.back()} >
                <AntDesign name='arrowleft' size={25} color={Colors.primartBlue} />
               </TouchableOpacity>
           )
           }} />


        <Stack.Screen name="(modals)/login" options={{ presentation: 'modal',
        animation:'fade',
          headerTitle:'',
          headerTintColor:'',
          headerShadowVisible:false,
          headerBackVisible:false
          
      }} />
        <Stack.Screen name="(modals)/register" options={{ presentation: 'modal',
        animation:'slide_from_bottom',
        
          headerTitle:'',
          headerTintColor:'',
          headerShadowVisible:false,
          
      }} />
      </Stack>
    </ThemeProvider>
    </AuthProvider>

  );
}
