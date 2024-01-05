// src/components/account/AccountCard.jsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

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
            <Text style={styles.accountName}>{account.accountName}</Text>
            <Text style={styles.accountDescription}>{account.accountDescription}</Text>
            <Text style={styles.sumText}>This Month total: ${currentMonthTotal.toFixed(2)}</Text>
            <Text style={styles.sumText}>Year to Date: ${yearToDateTotal.toFixed(2)}</Text>
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