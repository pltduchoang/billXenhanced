import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { GlobalContext } from '../context/GlobalContext';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { auth } from '../services/Firebase'; // Import auth from your Firebase.js
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

GoogleSignin.configure({
  // Specify your web client ID here
  webClientId: '92547576670-3ke4rteef0vpbhagkf8aoth3mi2v785v.apps.googleusercontent.com',
});

const LoginScreen = () => {
    const { updateUser } = useContext(GlobalContext);

    const signInWithGoogle = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const { idToken } = await GoogleSignin.signIn();

            const googleCredential = GoogleAuthProvider.credential(idToken);

            const userCredential = await signInWithCredential(auth, googleCredential);
            updateUser(userCredential.user);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.welcomeText}>BillX - Pill for your Xpain</Text>
            <Text style={styles.welcomeTextSlim}>Track your spending like a PRO</Text>
            <Text style={styles.welcomeTextSlim}>Anywhere, anytime</Text>
            
            
            <Image
                source={require('../assets/AppIcon.png')} // Adjust the path as needed
                style={styles.logo}
            />
            
            
            <TouchableOpacity style={styles.googleSignInButton} onPress={signInWithGoogle}>
                <Text style={styles.buttonText}>Sign In with Google</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#164863', // Dark shade for industrial look
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#DDF2FD', // Light text color for contrast
        marginBottom: 30,
    },
    welcomeTextSlim: {
        fontSize: 20,
        color: '#DDF2FD', // Light text color for contrast
        marginVertical: 10,
        fontStyle: 'italic',
    },
    googleSignInButton: {
        backgroundColor: '#427D9D', // Deep blue button
        padding: 15,
        borderRadius: 5,
        width: '60%',
        alignItems: 'center',
        marginTop: 50,
    },
    buttonText: {
        color: '#DDF2FD', // Light text color for readability
        fontSize: 16,
    },
    logo: {
        width: 300, // Adjust size as needed
        height: 300, // Adjust size as needed
        marginVertical: 100,
        borderRadius: 30,
    },
});

export default LoginScreen;
