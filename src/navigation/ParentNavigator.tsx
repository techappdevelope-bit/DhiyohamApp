import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import ParentDashboardScreen from '../screens/parent/ParentDashboardScreen';
import ManageKidsScreen from '../screens/parent/ManageKidsScreen';
import AddKidScreen from '../screens/parent/AddKidScreen';
import KidDetailScreen from '../screens/parent/KidDetailScreen';
import EditKidProfileScreen from '../screens/parent/EditKidProfileScreen';
import ViewKidTasksScreen from '../screens/parent/ViewKidTasksScreen';
import ViewKidAchievementsScreen from '../screens/parent/ViewKidAchievementsScreen';
import ResetKidPINScreen from '../screens/parent/ResetKidPINScreen';
import ChoresManagementScreen from '../screens/parent/ChoresManagementScreen';
import CreateChoreScreen from '../screens/parent/CreateChoreScreen';
import RewardsManagementScreen from '../screens/parent/RewardsManagementScreen';
import CreateRewardScreen from '../screens/parent/CreateRewardScreen';
import PendingApprovalsScreen from '../screens/parent/PendingApprovalsScreen';
import ParentProfileScreen from '../screens/parent/ParentProfileScreen';
import NotificationsScreen from '../screens/parent/NotificationsScreen';
import AllowanceSettingsScreen from '../screens/parent/AllowanceSettingsScreen';
import AppThemeScreen from '../screens/parent/AppThemeScreen';
import HelpSupportScreen from '../screens/parent/HelpSupportScreen';
import AboutAppScreen from '../screens/parent/AboutAppScreen';

const Tab = createBottomTabNavigator();
const DashStack = createStackNavigator();
const ChoresStack = createStackNavigator();
const RewardsStack = createStackNavigator();
const ProfileStack = createStackNavigator();

const DashboardNavigator = () => (
  <DashStack.Navigator screenOptions={{ headerShown: false }}>
    <DashStack.Screen name="ParentDashboard" component={ParentDashboardScreen} />
    <DashStack.Screen name="PendingApprovals" component={PendingApprovalsScreen} />
    <DashStack.Screen name="ManageKids" component={ManageKidsScreen} />
    <DashStack.Screen name="AddKid" component={AddKidScreen} />
    <DashStack.Screen name="KidDetail" component={KidDetailScreen} />
    <DashStack.Screen name="EditKidProfile" component={EditKidProfileScreen} />
    <DashStack.Screen name="ViewKidTasks" component={ViewKidTasksScreen} />
    <DashStack.Screen name="ViewKidAchievements" component={ViewKidAchievementsScreen} />
    <DashStack.Screen name="ResetKidPIN" component={ResetKidPINScreen} />
  </DashStack.Navigator>
);

const ChoresNavigator = () => (
  <ChoresStack.Navigator screenOptions={{ headerShown: false }}>
    <ChoresStack.Screen name="ChoresManagement" component={ChoresManagementScreen} />
    <ChoresStack.Screen name="CreateChore" component={CreateChoreScreen} />
  </ChoresStack.Navigator>
);

const RewardsNavigator = () => (
  <RewardsStack.Navigator screenOptions={{ headerShown: false }}>
    <RewardsStack.Screen name="RewardsManagement" component={RewardsManagementScreen} />
    <RewardsStack.Screen name="CreateReward" component={CreateRewardScreen} />
  </RewardsStack.Navigator>
);

const ProfileNavigator = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen name="ParentProfile" component={ParentProfileScreen} />
    <ProfileStack.Screen name="Notifications" component={NotificationsScreen} />
    <ProfileStack.Screen name="AllowanceSettings" component={AllowanceSettingsScreen} />
    <ProfileStack.Screen name="AppTheme" component={AppThemeScreen} />
    <ProfileStack.Screen name="HelpSupport" component={HelpSupportScreen} />
    <ProfileStack.Screen name="AboutApp" component={AboutAppScreen} />
    {/* Kid management screens also available from Profile */}
    <ProfileStack.Screen name="ManageKids" component={ManageKidsScreen} />
    <ProfileStack.Screen name="AddKid" component={AddKidScreen} />
    <ProfileStack.Screen name="KidDetail" component={KidDetailScreen} />
    <ProfileStack.Screen name="EditKidProfile" component={EditKidProfileScreen} />
    <ProfileStack.Screen name="ViewKidTasks" component={ViewKidTasksScreen} />
    <ProfileStack.Screen name="ViewKidAchievements" component={ViewKidAchievementsScreen} />
    <ProfileStack.Screen name="ResetKidPIN" component={ResetKidPINScreen} />
  </ProfileStack.Navigator>
);

const ParentNavigator = () => (
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
      name="Dashboard"
      component={DashboardNavigator}
      options={{ tabBarIcon: ({ color, size }) => <Icon name="view-dashboard" size={size} color={color} /> }}
    />
    <Tab.Screen
      name="Chores"
      component={ChoresNavigator}
      options={{ tabBarIcon: ({ color, size }) => <Icon name="clipboard-list" size={size} color={color} /> }}
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

export default ParentNavigator;
