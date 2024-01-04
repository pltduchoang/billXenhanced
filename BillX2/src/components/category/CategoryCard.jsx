// components/category/CategoryCard.jsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const CategoryCard = ({ category, thisMonthExpense, onEdit, onPress }) => {
    const sumOfExpenses = thisMonthExpense
        .filter(expense => expense.categoryId === category.id)
        .reduce((sum, expense) => sum + expense.amount, 0);

    const handleLongPress = () => {
        onEdit(category);
    };

    return (
        <TouchableOpacity 
            style={styles.card} 
            onLongPress={handleLongPress}
            onPress={() => onPress(category)} // Trigger the onPress function passed from parent
        >
            <Text style={styles.categoryName}>{category.categoryName}</Text>
            <Text style={styles.categoryDescription}>{category.categoryDescription}</Text>
            <Text style={styles.sumText}>This Month: ${sumOfExpenses.toFixed(2)}</Text>
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
