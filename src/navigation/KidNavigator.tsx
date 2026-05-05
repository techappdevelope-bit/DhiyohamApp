import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import KidDashboardScreen from '../screens/kid/KidDashboardScreen';
import MyChoresScreen from '../screens/kid/MyChoresScreen';
import TaskDetailScreen from '../screens/kid/TaskDetailScreen';
import RewardsListScreen from '../screens/kid/RewardsListScreen';
import KidProfileScreen from '../screens/kid/KidProfileScreen';
import AchievementsScreen from '../screens/kid/AchievementsScreen';
import MyGoalsScreen from '../screens/kid/MyGoalsScreen';
import RewardHistoryScreen from '../screens/kid/RewardHistoryScreen';
import CustomizeProfileScreen from '../screens/kid/CustomizeProfileScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const ChoresStack = createStackNavigator();
const RewardsStack = createStackNavigator();
const ProfileStack = createStackNavigator();

const HomeNavigator = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="KidDashboard" component={KidDashboardScreen} />
  </HomeStack.Navigator>
);

const ChoresNavigator = () => (
  <ChoresStack.Navigator screenOptions={{ headerShown: false }}>
    <ChoresStack.Screen name="MyChores" component={MyChoresScreen} />
    <ChoresStack.Screen name="TaskDetail" component={TaskDetailScreen} />
  </ChoresStack.Navigator>
);

const RewardsNavigator = () => (
  <RewardsStack.Navigator screenOptions={{ headerShown: false }}>
    <RewardsStack.Screen name="RewardsList" component={RewardsListScreen} />
  </RewardsStack.Navigator>
);

const ProfileNavigator = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen name="KidProfile" component={KidProfileScreen} />
    <ProfileStack.Screen name="Achievements" component={AchievementsScreen} />
    <ProfileStack.Screen name="MyGoals" component={MyGoalsScreen} />
    <ProfileStack.Screen name="RewardHistory" component={RewardHistoryScreen} />
    <ProfileStack.Screen name="CustomizeProfile" component={CustomizeProfileScreen} />
  </ProfileStack.Navigator>
);

const KidNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#667eea',
      tabBarInactiveTintColor: '#9CA3AF',
      tabBarStyle: { backgroundColor: '#FFFFFF', borderTopColor: '#E5E7EB', paddingBottom: 4, height: 60 },
      tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeNavigator}
      options={{ tabBarIcon: ({ color, size }) => <Icon name="home" size={size} color={color} /> }}
    />
    <Tab.Screen
      name="MyChores"
      component={ChoresNavigator}
      options={{
        tabBarLabel: 'Chores',
        tabBarIcon: ({ color, size }) => <Icon name="clipboard-check" size={size} color={color} />,
      }}
    />
    <Tab.Screen
      name="Rewards"
      component={RewardsNavigator}
      options={{ tabBarIcon: ({ color, size }) => <Icon name="gift" size={size} color={color} /> }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileNavigator}
      options={{ tabBarIcon: ({ color, size }) => <Icon name="account" size={size} color={color} /> }}
    />
  </Tab.Navigator>
);

export default KidNavigator;
