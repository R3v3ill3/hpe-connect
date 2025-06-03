import React from 'react';
import { Tabs } from 'expo-router';
import { Image, View, Text } from 'react-native';
import { Chrome as Home, BookOpen, User, Users } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Inter-Medium',
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: '#2563EB',
        },
        headerTitleStyle: {
          color: 'white',
          fontFamily: 'Inter-Bold',
        },
        headerTintColor: 'white',
        headerTitle: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={require('../../assets/images/Gemini_Generated_Image_vgqxgzvgqxgzvgqx.png')}
              style={{ width: 30, height: 30, marginRight: 8 }}
              resizeMode="contain"
            />
            <Text style={{ color: 'white', fontSize: 18, fontFamily: 'Inter-Bold' }}>
              WA HPE Connect
            </Text>
          </View>
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="lessons"
        options={{
          title: 'Lessons',
          tabBarIcon: ({ color, size }) => <BookOpen color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="students"
        options={{
          title: 'Students',
          tabBarIcon: ({ color, size }) => <Users color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}