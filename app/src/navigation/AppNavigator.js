import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/theme';
import { useAuth } from '../utils/auth';

import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ShipperHomeScreen from '../screens/ShipperHomeScreen';
import CarrierHomeScreen from '../screens/CarrierHomeScreen';
import CreateJobScreen from '../screens/CreateJobScreen';
import MyJobsScreen from '../screens/MyJobsScreen';
import BrowseJobsScreen from '../screens/BrowseJobsScreen';
import JobDetailScreen from '../screens/JobDetailScreen';
import JobOffersScreen from '../screens/JobOffersScreen';
import CarrierOffersScreen from '../screens/CarrierOffersScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function ShipperTabs() {
  const { colors } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.bgSecondary, borderTopColor: colors.border, paddingBottom: 8, paddingTop: 8, height: 60 },
        tabBarActiveTintColor: colors.primaryLight,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
      }}
    >
      <Tab.Screen name="ShipperHome" component={ShipperHomeScreen}
        options={{ tabBarLabel: 'Ana Sayfa', tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} /> }}
      />
      <Tab.Screen name="CreateJob" component={CreateJobScreen}
        options={{ tabBarLabel: 'İlan Oluştur', tabBarIcon: ({ color, size }) => <Ionicons name="add-circle-outline" size={size} color={color} /> }}
      />
      <Tab.Screen name="MyJobs" component={MyJobsScreen}
        options={{ tabBarLabel: 'İlanlarım', tabBarIcon: ({ color, size }) => <Ionicons name="list-outline" size={size} color={color} /> }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen}
        options={{ tabBarLabel: 'Profil', tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} /> }}
      />
    </Tab.Navigator>
  );
}

function CarrierTabs() {
  const { colors } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.bgSecondary, borderTopColor: colors.border, paddingBottom: 8, paddingTop: 8, height: 60 },
        tabBarActiveTintColor: colors.primaryLight,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
      }}
    >
      <Tab.Screen name="CarrierHome" component={CarrierHomeScreen}
        options={{ tabBarLabel: 'Ana Sayfa', tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} /> }}
      />
      <Tab.Screen name="BrowseJobs" component={BrowseJobsScreen}
        options={{ tabBarLabel: 'İlanlar', tabBarIcon: ({ color, size }) => <Ionicons name="search-outline" size={size} color={color} /> }}
      />
      <Tab.Screen name="CarrierOffers" component={CarrierOffersScreen}
        options={{ tabBarLabel: 'Tekliflerim', tabBarIcon: ({ color, size }) => <Ionicons name="document-text-outline" size={size} color={color} /> }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen}
        options={{ tabBarLabel: 'Profil', tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} /> }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : user.role === 'shipper' ? (
        <>
          <Stack.Screen name="ShipperTabs" component={ShipperTabs} />
          <Stack.Screen name="JobDetail" component={JobDetailScreen} />
          <Stack.Screen name="JobOffers" component={JobOffersScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="CarrierTabs" component={CarrierTabs} />
          <Stack.Screen name="JobDetail" component={JobDetailScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
