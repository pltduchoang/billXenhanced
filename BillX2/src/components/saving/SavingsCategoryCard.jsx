import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { GlobalContext } from '../../context/GlobalContext'; // Adjust the path as necessary

const SavingsCategoryCard = ({ category, type, onLongPress }) => {
    const { thisMonthExpense } = useContext(GlobalContext);

    // Calculate the total spending for this category
    const totalSpending = thisMonthExpense
        .filter(expense => expense.categoryId === category.id)
        .reduce((sum, expense) => sum + expense.amount, 0);

    // Calculate spending percentage
    const spendingPercentage = category.categoryLimit 
        ? Math.min((totalSpending / category.categoryLimit) * 100, 100)
        : 0;

    // Set the background color based on spending percentage
    const backgroundColor = spendingPercentage >= 100 ? ['#D9534F', '#D9534F'] : ['#9BBEC8', '#427D9D'];

    return (
        <TouchableOpacity  onLongPress={() => onLongPress(category)}>
            <LinearGradient 
                colors={backgroundColor}
                start={{ x: 0, y: 0 }}
                end={{ x: spendingPercentage / 100, y: 0 }}
                style={styles.card}>
                <Text style={styles.categoryName}>{category.categoryName}</Text>
                <Text style={styles.infoText}>
                    {type === 'saving' ? 'Saved: ' : 'Spent: '} {spendingPercentage.toFixed(2)}%
                </Text>
            </LinearGradient>
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
    categoryName: {
        fontSize: 18,
        color: '#DDF2FD',
    },
    infoText: {
        fontSize: 18,
        color: '#DDF2FD',
        marginTop: 5,
        fontWeight: 'bold',
    },
    // ... other styles
});

export default SavingsCategoryCard;
