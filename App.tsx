import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RegisterScreen from './src/screens/RegisterScreen';
import LoginScreen from './src/screens/LoginScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import TwoFactorScreen from './src/screens/TwoFactorScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import ProfileSetupScreen from './src/screens/ProfileSetupScreen';
import HomeScreen from './src/screens/HomeScreen';
import AuthorGalleryScreen from './src/screens/AuthorGalleryScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SearchScreen from './src/screens/SearchScreen';
import MessagesScreen from './src/screens/MessagesScreen';
import ChatScreen from './src/screens/ChatScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import CreatePostScreen from './src/screens/CreatePostScreen';
import CollectionsScreen from './src/screens/CollectionsScreen';
import CommentsScreen from './src/screens/CommentsScreen';
import MapScreen from './src/screens/MapScreen';
import { colors } from './src/lib/theme';

export type RootStackParamList = {
  Register: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  TwoFactor: undefined;
  Onboarding: undefined;
  ProfileSetup: undefined;
  Home: undefined;
  AuthorGallery: { authorId: string; authorName: string; initialId: string };
  Profile: { userId: string };
  Search: undefined;
  Messages: undefined;
  Chat: { authorId: string; authorName: string };
  Notifications: undefined;
  CreatePost: undefined;
  Collections: { userId?: string };
  Comments: { postId: string; postTitle: string };
  Map: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor={colors.background} />
      <Stack.Navigator
        initialRouteName="Register"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="TwoFactor" component={TwoFactorScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Messages" component={MessagesScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="CreatePost" component={CreatePostScreen} />
        <Stack.Screen name="Collections" component={CollectionsScreen} />
        <Stack.Screen name="Comments" component={CommentsScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen
          name="AuthorGallery"
          component={AuthorGalleryScreen}
          options={{
            presentation: 'transparentModal',
            animation: 'fade',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
