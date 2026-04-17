import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileMenuScreen from '../screens/ProfileMenuScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MyAccountScreen from '../screens/MyAccountScreen';
import SelectRegionScreen from '../screens/SelectRegionScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import TermsScreen from '../screens/TermsScreen';
import AppLanguagesScreen from '../screens/AppLanguagesScreen';

const Stack = createNativeStackNavigator();

export default function ProfileNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMenu" component={ProfileMenuScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="MyAccount" component={MyAccountScreen} />
      <Stack.Screen name="SelectRegion" component={SelectRegionScreen} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
      <Stack.Screen name="Terms" component={TermsScreen} />
      <Stack.Screen name="AppLanguages" component={AppLanguagesScreen} />
    </Stack.Navigator>
  );
}
