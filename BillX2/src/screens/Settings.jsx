// src/screens/Settings.jsx
import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { auth } from '../services/Firebase';
import { signOut } from 'firebase/auth';
import { GlobalContext } from '../context/GlobalContext';
import { useNavigation } from '@react-navigation/native';

const Settings = () => {
    const { user , updateUser } = useContext(GlobalContext);
    const navigation = useNavigation();

    const handleLogout = async () => {
        try {
            user ? await signOut(auth) : console.log('No user signed in')

            updateUser(null); // Set user to null to trigger navigation
            navigation.navigate('LoginScreen');
        } catch (error) {
            console.error("Logout failed: ", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text>Settings Screen</Text>
            <Button title="Logout" onPress={handleLogout} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Settings;
