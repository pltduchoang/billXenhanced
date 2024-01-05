import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { auth } from '../services/Firebase';
import { signOut } from 'firebase/auth';
import { GlobalContext } from '../context/GlobalContext';
import { useNavigation } from '@react-navigation/native';

const Settings = () => {
    const { user, updateUser } = useContext(GlobalContext);
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
            <Text style={styles.title}>Settings</Text>
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#164863', // Use the background color consistent with your app
        height: 800, 
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#DDF2FD', // Text color used in your app
        marginBottom: 400,
    },
    button: {
        backgroundColor: '#427D9D', // Button color used in your app
        padding: 15,
        borderRadius: 10,
    },
    buttonText: {
        color: '#DDF2FD', // Button text color
        fontSize: 18,
    },
});

export default Settings;
