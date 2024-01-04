// src/screens/Accounts.jsx

import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { GlobalContext } from '../context/GlobalContext';
import AccountCard from '../components/account/AccountCard';
import AccountService from '../services/AccountService';
import AddAccount from '../components/account/AddAccount';
import EditAccount from '../components/account/EditAccount';
import AccountDetails from '../components/account/AccountDetails';

const Accounts = () => {
    const { user, refreshPage, setRefreshPage, thisMonthExpense } = useContext(GlobalContext);
    const [accounts, setAccounts] = useState([]);

    useEffect(() => {
        const fetchAccounts = async () => {
            if (user && user.uid) {
                const fetchedAccounts = await AccountService.getAccounts(user.uid);
                setAccounts(fetchedAccounts);
            }
        };

        fetchAccounts();
    }, [user, refreshPage]);

    // Logic to add a new account
    const [isAddAccountModalVisible, setIsAddAccountModalVisible] = useState(false);

    const handleOpenAddAccountModal = () => {
        setIsAddAccountModalVisible(true);
    };

    const handleCloseAddAccountModal = () => {
        setIsAddAccountModalVisible(false);
    };

    // Logic to edit an account
    const [isEditAccountModalVisible, setIsEditAccountModalVisible] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);

    const handleEditAccount = (account) => {
        setSelectedAccount(account);
        setIsEditAccountModalVisible(true);
    };

    const handleCloseEditAccountModal = () => {
        setIsEditAccountModalVisible(false);
        setSelectedAccount(null);
    };

    // Logic to view account details
    const [isAccountDetailsVisible, setIsAccountDetailsVisible] = useState(false);
    const [selectedAccountForDetails, setSelectedAccountForDetails] = useState(null);

    const handleAccountPress = (account) => {
        setSelectedAccountForDetails(account);
        setIsAccountDetailsVisible(true);
    };

    const handleCloseAccountDetails = () => {
        setIsAccountDetailsVisible(false);
        setSelectedAccountForDetails(null);
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Accounts</Text>
            {accounts.map(account => (
                <AccountCard 
                    key={account.id} 
                    account={account} 
                    thisMonthExpense={thisMonthExpense} 
                    onEdit={handleEditAccount}
                    onPress={handleAccountPress}
                />
            ))}
            <TouchableOpacity style={styles.addButton} onPress={handleOpenAddAccountModal}>
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>

            <AddAccount
                isVisible={isAddAccountModalVisible}
                onClose={handleCloseAddAccountModal}
            />

            {selectedAccount && (
                <EditAccount
                    isVisible={isEditAccountModalVisible}
                    onClose={handleCloseEditAccountModal}
                    accountData={selectedAccount}
                />
            )}

            {selectedAccountForDetails && (
                <AccountDetails
                    isVisible={isAccountDetailsVisible}
                    onClose={handleCloseAccountDetails}
                    account={selectedAccountForDetails}
                />
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#164863',
    },
    addButton: {
        backgroundColor: '#427D9D',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 10,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    addButtonText: {
        fontSize: 24,
        color: '#DDF2FD',
        fontWeight: 'bold',
    },
    title: {
        color: '#DDF2FD',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 10,
    },
    // ... other styles
});

export default Accounts;
