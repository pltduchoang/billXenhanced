import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { GlobalContext } from '../../context/GlobalContext'; // Adjust the path as necessary
import { getCategoryIcon } from '../iconLibrary/CategoryIconLibrary';

const SavingsCategoryCard = ({ category, type, onLongPress }) => {
    const {
        janExpenses, febExpenses, marExpenses, aprExpenses, mayExpenses, junExpenses,
        julExpenses, augExpenses, sepExpenses, octExpenses, novExpenses, decExpenses
    } = useContext(GlobalContext);

    // Calculate the total spending for this category based on type
    const calculateSpending = (expenses) => {
        return expenses
            .filter(expense => expense.categoryId === category.id)
            .reduce((sum, expense) => {
                return expense.type === 'spend' ? sum + expense.amount : sum - expense.amount;
            }, 0);
    };

    let totalSpending;
    if (type === 'budget') {
        // Calculate for this month only
        const currentMonthExpenses = new Date().getMonth(); // Assuming months are 0 indexed (0-11)
        totalSpending = calculateSpending(Object.values({
            janExpenses, febExpenses, marExpenses, aprExpenses, mayExpenses, junExpenses,
            julExpenses, augExpenses, sepExpenses, octExpenses, novExpenses, decExpenses
        })[currentMonthExpenses]);
    } else {
        // Calculate for the whole year for 'saving' type
        totalSpending = [
            janExpenses, febExpenses, marExpenses, aprExpenses, mayExpenses, junExpenses,
            julExpenses, augExpenses, sepExpenses, octExpenses, novExpenses, decExpenses
        ].reduce((yearlySum, monthExpenses) => yearlySum + calculateSpending(monthExpenses), 0);
    }

    // Calculate spending percentage
    const spendingPercentage = category.categoryLimit 
        ? Math.min((totalSpending / category.categoryLimit) * 100, 100)
        : 0;

    // Set the background color based on spending percentage
    const backgroundColor = spendingPercentage >= 100 ? ['#D9534F', '#D9534F'] : ['#9BBEC8', '#427D9D'];

    return (
        <TouchableOpacity onLongPress={() => onLongPress(category)}>
            <LinearGradient 
                colors={backgroundColor}
                start={{ x: 0, y: 0 }}
                end={{ x: spendingPercentage / 100, y: 0 }}
                style={styles.card}>
                <View style={styles.textContainer}>
                    <Text style={styles.categoryName}>{category.categoryName}</Text>
                    <Text style={styles.infoText}>
                        {type === 'saving' ? 'Saved: ' : 'Spent: '} {spendingPercentage.toFixed(2)}%
                    </Text>
                </View>
                <View style={styles.iconContainer}>
                    {getCategoryIcon(category.categoryIcon, 50, '#DDF2FD')}
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        padding: 15,
        borderRadius: 10,
        marginVertical: 8,
        marginHorizontal: 16,
        alignItems: 'center',
    },
    textContainer: {
        flex: 8,
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
    iconContainer: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // ... other styles ...
});

export default SavingsCategoryCard;
