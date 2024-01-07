// components/category/CategoryCard.jsx
import React , {useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { getCategoryIcon } from '../iconLibrary/CategoryIconLibrary';

const CategoryCard = ({ category, allMonthlyExpense, currentMonth, onEdit, onPress }) => {
    // Helper function to calculate total expenses for a category in a given month
    const calculateExpensesForMonth = (expenses) => {
        return expenses.reduce((sum, expense) => {
            if (expense.categoryId === category.id) {
                const updatedSum = expense.type === 'spend' ? sum + expense.amount : sum - expense.amount;
                return updatedSum;
            }
            return sum;
        }, 0);
    };

    // Calculate total expenses for the current month
    const currentMonthExpenses = Object.values(allMonthlyExpense)[currentMonth];
    const currentMonthTotal = calculateExpensesForMonth(currentMonthExpenses);


    const yearToDateTotal = Object.values(allMonthlyExpense)
                                .reduce((total, monthlyExpenses) => {
                                    return total + calculateExpensesForMonth(monthlyExpenses);
                                }, 0);


    const handleLongPress = () => {
        onEdit(category);
    };

    const handlePress = () => {
        onPress(category);
    };


    return (
        <TouchableOpacity style={styles.card} onLongPress={handleLongPress} onPress={handlePress}>
            <View style={styles.textContainer}>
                <Text style={styles.categoryName}>{category.categoryName}</Text>
                <Text style={styles.categoryDescription}>{category.categoryDescription}</Text>
                <Text style={styles.sumText}>This Month: ${currentMonthTotal.toFixed(2)}</Text>
                <Text style={styles.sumText}>Year to Date: ${yearToDateTotal.toFixed(2)}</Text>
            </View>
            <View style={styles.iconContainer}>
                {getCategoryIcon(category.categoryIcon, 60, '#DDF2FD')}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#427D9D',
        padding: 15,
        borderRadius: 10,
        marginVertical: 8,
        marginHorizontal: 16,
        alignItems: 'center', // Align items vertically
    },
    textContainer: {
        flex: 8, // Take 60% of the space
    },
    categoryName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#DDF2FD',
    },
    categoryDescription: {
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
    iconContainer: {
        flex: 2, // Take 40% of the space
        justifyContent: 'center',
        alignItems: 'center', // Center the icon horizontally and vertically
    },
    // ... other styles ...
});

export default CategoryCard;

