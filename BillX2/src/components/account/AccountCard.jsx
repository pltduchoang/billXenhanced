// src/components/account/AccountCard.jsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const AccountCard = ({ account, thisMonthExpense, onEdit, onPress }) => {
    // Calculate the sum of expenses associated with this account for the current month
    const sumOfExpenses = thisMonthExpense
        .filter(expense => expense.accountId === account.id) // Filter expenses based on the account ID
        .reduce((sum, expense) => sum + expense.amount, 0);

    const handleLongPress = () => {
        onEdit(account);
    };

    const handlePress = () => {
        onPress(account);
    };

    return (
        <TouchableOpacity style={styles.card} onLongPress={handleLongPress} onPress={handlePress}>
            <Text style={styles.accountName}>{account.accountName}</Text>
            <Text style={styles.accountDescription}>{account.accountDescription}</Text>
            <Text style={styles.sumText}>This Month: ${sumOfExpenses.toFixed(2)}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#427D9D', // Adjust the color as needed
        padding: 15,
        borderRadius: 10,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    accountName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#DDF2FD',
    },
    accountDescription: {
        fontSize: 14,
        color: '#DDF2FD',
        marginTop: 5,
    },
    sumText: {
        fontSize: 14,
        color: '#DDF2FD',
        marginTop: 5,
    },
    // ... other styles
});

export default AccountCard;
