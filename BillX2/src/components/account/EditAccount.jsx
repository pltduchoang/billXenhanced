// components/account/EditAccount.jsx

import React, { useState, useContext } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { GlobalContext } from '../../context/GlobalContext';
import AccountService from '../../services/AccountService';
import AccountIconPicker from './AccountIconPicker'; // Adjust the import path as necessary

const EditAccount = ({ isVisible, onClose, accountData }) => {
    const { user, setRefreshPage } = useContext(GlobalContext);
    const [accountName, setAccountName] = useState(accountData.accountName);
    const [accountDescription, setAccountDescription] = useState(accountData.accountDescription);
    const [accountIcon, setAccountIcon] = useState(accountData.accountIcon || '');

    const handleSaveAccount = async () => {
        if (user && user.uid && accountName.trim()) {
            const updatedAccount = {
                accountName,
                accountDescription,
                accountIcon,
            };
            await AccountService.updateAccount(user.uid, accountData.id, updatedAccount);
            setRefreshPage(prev => prev + 1);
            onClose();
        }
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            "Delete Account",
            "Are you sure you want to delete this account?",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "OK", 
                    onPress: async () => {
                        if (user && user.uid) {
                            await AccountService.deleteAccount(user.uid, accountData.id);
                            setRefreshPage(prev => prev + 1);
                            onClose();
                        }
                    }
                }
            ]
        );
    };

    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalView}>
                <Text style={styles.title}>Edit Account</Text>
                
                <TextInput
                    style={styles.input}
                    placeholder="Account Name"
                    value={accountName}
                    onChangeText={setAccountName}
                />
                
                <TextInput
                    style={styles.input}
                    placeholder="Account Description"
                    value={accountDescription}
                    onChangeText={setAccountDescription}
                />

                <AccountIconPicker onSelect={setAccountIcon} currentIcon={accountIcon} />

                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleSaveAccount}
                    >
                        <Text style={styles.buttonText}>Save Changes</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={styles.button}
                        onPress={onClose}
                    >
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={[styles.button, styles.deleteButton]}
                    onPress={handleDeleteAccount}
                >
                    <Text style={styles.buttonText}>Delete Account</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#164863',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#DDF2FD',
        marginBottom: 20,
    },
    input: {
        width: '80%',
        padding: 10,
        margin: 10,
        backgroundColor: '#DDF2FD',
        borderRadius: 5,
    },
    button: {
        backgroundColor: '#427D9D',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        width: '40%',
        alignItems: 'center',
    },
    deleteButton: {
        backgroundColor: '#D9534F',
        opacity: 0.8,
        width: '72%',
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '80%',
        marginBottom: 20,
    },
    // ... other styles
});

export default EditAccount;
