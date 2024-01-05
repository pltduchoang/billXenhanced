// components/category/CategoryCard.jsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const CategoryCard = ({ category, allMonthlyExpense, currentMonth, onEdit, onPress }) => {
    const calculateExpensesForCategory = (expenses) => {
        return expenses.reduce((sum, expense) => {
            // Check if the expense is associated with this category
            if (expense.categoryId === category.id) {
                // Adjust sum based on expense type
                return expense.type === 'spend' ? sum + expense.amount : sum - expense.amount;
            }
            return sum;
        }, 0);
    };

    // Calculate total expenses for the current month
    const currentMonthExpenses = Object.values(allMonthlyExpense)[currentMonth];
    const currentMonthTotal = calculateExpensesForCategory(currentMonthExpenses);

    // Calculate year-to-date expenses
    const yearToDateTotal = Object.values(allMonthlyExpense)
                                   .slice(0, currentMonth + 1)
                                   .reduce((total, monthlyExpenses) => total + calculateExpensesForCategory(monthlyExpenses), 0);

    const handleLongPress = () => {
        onEdit(category);
    };

    const handlePress = () => {
        onPress(category);
    };

    return (
        <TouchableOpacity style={styles.card} onLongPress={handleLongPress} onPress={handlePress}>
            <Text style={styles.categoryName}>{category.categoryName}</Text>
            <Text style={styles.categoryDescription}>{category.categoryDescription}</Text>
            <Text style={styles.sumText}>This Month: ${currentMonthTotal.toFixed(2)}</Text>
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
    categoryName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#DDF2FD',
    },
    categoryDescription: {
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

export default CategoryCard;
