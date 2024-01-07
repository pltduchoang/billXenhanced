// src/navigation/AppBottomTapNav.jsx


import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Dashboard from '../screens/Dashboard';
import Settings from '../screens/Settings';
import Categories from '../screens/Categories';
import Accounts from '../screens/Accounts';
import Savings from '../screens/Savings';

import AccountIcon from '../icons/bank-check.svg'
import CategoryIcon from '../icons/format-list-bulleted-type.svg'
import DashboardIcon from '../icons/view-dashboard-variant-outline.svg'
import SavingsIcon from '../icons/piggy-bank-outline.svg'
import SettingsIcon from '../icons/cog.svg'

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
        }}
        shifting={false}>
            <Tab.Screen 
                name="Categories" 
                component={Categories}
                options={{
                    tabBarLabel: 'Categories',
                    tabBarIcon: ({ color}) => ( // Destructure size from argument
                        <CategoryIcon width={26} height={26} fill={color} />
                    ),
                }} 
            />

            <Tab.Screen 
                name="Accounts" 
                component={Accounts}
                options={{
                    tabBarLabel: 'Accounts',
                    tabBarIcon: ({ color, size }) => ( // Destructure size from argument
                        <AccountIcon width={26} height={26} fill={color} />                    ),
                }}
            />

            <Tab.Screen 
                name="Dashboard" 
                component={Dashboard}
                options={{
                    tabBarLabel: 'Dashboard',
                    tabBarIcon: ({ color, size }) => ( // Destructure size from argument
                        <DashboardIcon width={26} height={26} fill={color} />                    ),
                }}
            />

            <Tab.Screen 
                name="Savings" 
                component={Savings}
                options={{
                    tabBarLabel: 'Savings',
                    tabBarIcon: ({ color, size }) => ( // Destructure size from argument
                        <SavingsIcon width={26} height={26} fill={color}/>
                    ),
                }}
            />

            <Tab.Screen 
                name="Settings" 
                component={Settings}
                options={{
                    tabBarLabel: 'Settings',
                    tabBarIcon: ({ color, size }) => ( // Destructure size from argument
                        <SettingsIcon width={26} height={26} fill={color} />                    ),
                }}
            />
        </Tab.Navigator>
    );
}
