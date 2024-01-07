//src/components/account/AddAccount.jsx

import React, { useState, useContext } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { GlobalContext } from '../../context/GlobalContext';
import AccountService from '../../services/AccountService';
import AccountIconPicker from './AccountIconPicker'; // Adjust the import path as necessary

const AddAccount = ({ isVisible, onClose }) => {
    const { user, setRefreshPage } = useContext(GlobalContext);
    const [accountName, setAccountName] = useState('');
    const [accountDescription, setAccountDescription] = useState('');
    const [accountIcon, setAccountIcon] = useState('');

    const handleAddAccount = async () => {
        if (user && user.uid && accountName.trim()) {
            const newAccount = {
                accountName,
                accountDescription,
                accountIcon,
            };
            await AccountService.createAccount(user.uid, newAccount);
            setAccountName('');
            setAccountDescription('');
            setAccountIcon('');
            setRefreshPage(prev => prev + 1);
            onClose();
        }
    };

    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalView}>
                <Text style={styles.title}>Add New Account</Text>

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

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleAddAccount}
                >
                    <Text style={styles.buttonText}>Add Account</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={onClose}
                >
                    <Text style={styles.buttonText}>Cancel</Text>
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
        width: '60%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    // ... other styles
});

export default AddAccount;
