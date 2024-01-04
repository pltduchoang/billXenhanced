// components/dashboard/ExpenseCard.jsx
import React, {useState, useEffect, useContext} from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { GlobalContext } from '../../context/GlobalContext';

const ExpenseCard = ({ expense, onEdit, onDetails }) => {
    const { amount, type, description, time } = expense;
    const backgroundColor = type === 'spend' ? '#427D9D' : '#9BBEC8';
    const { user, allCategories, allAccounts } = useContext(GlobalContext);

    const handleLongPress = () => {
        onEdit(expense);
    };

    const handlePress = () => {
        onDetails(expense);
    };

    // Find the category and account names based on their IDs
    const [categoryName, setCategoryName] = useState('');
    const [accountName, setAccountName] = useState('');

    useEffect(() => {
        if (expense && allCategories && allAccounts) {

            const foundCategory = allCategories.find(category => category.id === expense.categoryId);
            const foundAccount = allAccounts.find(account => account.id === expense.accountId);
            setCategoryName(foundCategory?.categoryName || 'No Category');
            setAccountName(foundAccount?.accountName || 'No Account');
        }
    }, [expense, allCategories, allAccounts]);

    return (
        <TouchableOpacity style={[styles.card, { backgroundColor }]}
        onLongPress={handleLongPress}
        onPress={handlePress}>
            <Text style={styles.amountText}>${amount.toFixed(2)}</Text>
            <Text style={styles.typeText}>{type.toUpperCase()}</Text>
            <Text style={styles.descriptionText}>{description}</Text>
            <Text style={styles.infoText}>Category: {categoryName}</Text>
            <Text style={styles.infoText}>Account: {accountName}</Text>
            <Text style={styles.timeText}>{new Date(time).toLocaleDateString()}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: 15,
        borderRadius: 10,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    amountText: {
        color: '#DDF2FD',
        fontSize: 18,
        fontWeight: 'bold',
    },
    typeText: {
        color: '#DDF2FD',
        fontSize: 14,
        marginTop: 5,
    },
    descriptionText: {
        color: '#DDF2FD',
        fontSize: 14,
        marginTop: 5,
    },
    infoText: {
        color: '#DDF2FD',
        fontSize: 12,
        marginTop: 5,
    },
    timeText: {
        color: '#DDF2FD',
        fontSize: 12,
        marginTop: 5,
    },
});

export default ExpenseCard;
