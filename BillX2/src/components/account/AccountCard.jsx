// src/components/account/AccountCard.jsx

import React, {useEffect , useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {getAccountIcon} from '../iconLibrary/AccountIconLibrary'; // Import the icon library


const AccountCard = ({ account, allMonthlyExpense, onEdit, onPress, currentMonth }) => {
    // Helper function to calculate total expenses for a given month
    const calculateExpensesForMonth = (expenses) => {
        return expenses.reduce((sum, expense) => {
            // Check if the expense is associated with this account
            if (expense.accountId === account.id) {
                // Adjust sum based on expense type
                return expense.type === 'spend' ? sum + expense.amount : sum - expense.amount;
            }
            return sum;
        }, 0);
    };

    // Calculate total expenses for the current month
    const currentMonthExpenses = Object.values(allMonthlyExpense)[currentMonth];
    const currentMonthTotal = calculateExpensesForMonth(currentMonthExpenses);

    // Calculate year-to-date expenses
    const yearToDateTotal = Object.values(allMonthlyExpense).reduce((total, monthlyExpenses) => {
        return total + calculateExpensesForMonth(monthlyExpenses);
    }, 0);

    const handleLongPress = () => {
        onEdit(account);
    };

    const handlePress = () => {
        onPress(account);
    };



    return (
        <TouchableOpacity style={styles.card} onLongPress={handleLongPress} onPress={handlePress}>
            <View style={styles.contentWrapper}>
                <View style={styles.textWrapper}>
                    <Text style={styles.accountName}>{account.accountName}</Text>
                    <Text style={styles.accountDescription}>{account.accountDescription}</Text>
                    <Text style={styles.sumText}>This Month total: ${currentMonthTotal.toFixed(2)}</Text>
                    <Text style={styles.sumText}>Year to Date: ${yearToDateTotal.toFixed(2)}</Text>
                </View>
                <View style={styles.iconWrapper}>
                    {getAccountIcon(account.accountIcon, 70, '#DDF2FD')}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#427D9D',
        padding: 15,
        borderRadius: 10,
        marginVertical: 8,
        marginHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    contentWrapper: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    textWrapper: {
        flex: 8, // Adjust as needed for text space
    },
    iconWrapper: {
        flex: 2, // Adjust as needed for icon space
        justifyContent: 'center',
        alignItems: 'center',
    },
    accountName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#DDF2FD',
    },
    accountDescription: {
        fontSize: 12,
        color: '#DDF2FD',
        marginTop: 5,
        fontStyle: 'italic',
    },
    sumText: {
        fontSize: 14,
        color: '#DDF2FD',
        marginTop: 5,
    },

    // ... other styles ...
});


export default AccountCard;