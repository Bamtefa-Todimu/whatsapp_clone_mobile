import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs, router } from 'expo-router';
import { Pressable, TouchableOpacity, View } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { AntDesign, Feather, Ionicons, SimpleLineIcons } from '@expo/vector-icons';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        // tabBarActiveTintColor: Colors[colorScheme ?? 'light'],
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'chats',
          headerTitle:'',
          headerShadowVisible:false,
          tabBarIcon: ({ color }) => <Ionicons name="chatbubbles-outline" color={color} size={25} />,
          headerLeft: () => (
              <Pressable style={{flexShrink:0,padding:1.5,borderRadius:15,borderWidth:1.5,borderColor:Colors.primartBlue,marginLeft:20}}>
                {({ pressed }) => (
                  <Feather
                    name="more-horizontal"
                    size={20}
                    color={Colors.primartBlue}
                    style={{opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
          ),
          headerRight: () => (
            <View style={{flexDirection:'row',alignItems:'center',gap:32,marginRight:20}}>
              <SimpleLineIcons name="camera" size={25} color={Colors.primartBlue}/>
              <TouchableOpacity onPress={() => router.push('/(modals)/addUser')}>
                <Ionicons name="add-circle" size={35} color={Colors.primartBlue}/>
              </TouchableOpacity>
            </View>

          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Settings',
          headerStyle:{
            backgroundColor:'rgba(0,0,0,0.001)'
          },
          tabBarIcon: ({ color }) => <AntDesign name="setting" color={color} size={25} />,
        }}
      />
    </Tabs>
  );
}
