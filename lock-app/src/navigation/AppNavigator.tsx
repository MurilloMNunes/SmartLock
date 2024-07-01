import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MyLocksScreen from '../screens/MyLocksScreen';
import AddLockScreen from '../screens/AddLockScreen';
import { TabBarIcon } from '@/src/components/navigation/TabBarIcon';

const AppTab = createBottomTabNavigator();

const AppNavigator: React.FC = () => {
  return (
    <AppTab.Navigator screenOptions={{ headerShown: false }}>
        <AppTab.Screen name="MyLocks" component={MyLocksScreen} 
            options={{
            title: 'My Locks',
            tabBarIcon: ({ color, focused }) => (
                <TabBarIcon name={focused ? 'house-lock' : 'house-lock'} color={color} />
            ),
            }}
        />
        <AppTab.Screen name="AddLock" component={AddLockScreen} 
            options={{
            title: 'Add Lock',
            tabBarIcon: ({ color, focused }) => (
                <TabBarIcon name={focused ? 'add' : 'add'} color={color} />
            ),
            }}
        />
    </AppTab.Navigator>
  );
};

export default AppNavigator;
