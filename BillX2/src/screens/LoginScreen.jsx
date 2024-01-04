import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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
            <Text style={styles.welcomeText}>Welcome to BillX Online</Text>
            <Text style={styles.welcomeTextSlim}>Your everyday's financial assistance</Text>
            <Text style={styles.welcomeTextSlim}>Sign in to continue</Text>
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
        marginBottom: 10,
    },
    welcomeTextSlim: {
        fontSize: 20,
        color: '#DDF2FD', // Light text color for contrast
        marginBottom: 10,
    },
    googleSignInButton: {
        backgroundColor: '#427D9D', // Deep blue button
        padding: 15,
        borderRadius: 5,
        width: '60%',
        alignItems: 'center',
        marginTop: 200,
    },
    buttonText: {
        color: '#DDF2FD', // Light text color for readability
        fontSize: 16,
    },
});

export default LoginScreen;
