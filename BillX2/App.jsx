// root/app.jsx

// root/app.jsx
import React, { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AppBottomTapNav from './src/navigation/AppBottomTapNav';
import LoginScreen from './src/screens/LoginScreen';
import { ContextProvider, GlobalContext } from './src/context/GlobalContext';

const Stack = createStackNavigator();

const AppContent = () => {
    const { user } = useContext(GlobalContext);

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {user ? (
                    // If the user is logged in, show the main app
                    <Stack.Screen name="AppBottomTapNav" component={AppBottomTapNav} />
                ) : (
                    // If not, show the login screen
                    <Stack.Screen name="LoginScreen" component={LoginScreen} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const App = () => {
    return (
        <ContextProvider>
            <AppContent />
        </ContextProvider>     
    );
};

export default App;

