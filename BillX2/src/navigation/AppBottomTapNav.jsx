// src/navigation/AppBottomTapNav.jsx


import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Dashboard from '../screens/Dashboard';
import Settings from '../screens/Settings';
import Categories from '../screens/Categories';
import Accounts from '../screens/Accounts';
import Savings from '../screens/Savings';



const Tab = createMaterialBottomTabNavigator();

export default function AppBottomTapNav() {
    return (
        <Tab.Navigator
        initialRouteName='Dashboard'
        activeColor='#DDF2FD'
        inactiveColor='#164863'
        barStyle={{ 
            backgroundColor: '#427D9D',
            height: 70,
        }}>
            <Tab.Screen name="Categories" component={Categories}
                options={{
                    tabBarLabel: 'Categories',
                    tabBarIcon: ({ color }) => (
                        <Icon name="format-list-bulleted" color={color} size={26} />
                    ),
                }} 
            />
            <Tab.Screen name="Accounts" component={Accounts} 
                options={{
                    tabBarLabel: 'Accounts',
                    tabBarIcon: ({ color }) => (
                        <Icon name="bank" color={color} size={26} />
                    ),
                }}
            />
            <Tab.Screen name="Dashboard" component={Dashboard} 
                options={{
                    tabBarLabel: 'Dashboard',
                    tabBarIcon: ({ color }) => (
                        <Icon name="view-dashboard" color={color} size={26} />
                    ),
                }}
            />
            <Tab.Screen name="Savings" component={Savings} 
                options={{
                    tabBarLabel: 'Savings',
                    tabBarIcon: ({ color }) => (
                        <Icon name="piggy-bank" color={color} size={26} />
                    ),
                }}
            />
            <Tab.Screen name="Settings" component={Settings} 
                options={{
                    tabBarLabel: 'Settings',
                    tabBarIcon: ({ color }) => (
                        <Icon name="cogs" color={color} size={26} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}
