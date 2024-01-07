// src/components/account/AccountDetails.jsx
import React, { useContext, useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { GlobalContext } from '../../context/GlobalContext';
import ExpenseCard from '../dashboard/ExpenseCard';
import ExpenseDetailModal from '../dashboard/ExpenseDetailModal';
import EditExpense from '../dashboard/EditExpense';

const AccountDetails = ({ isVisible, onClose, account }) => {
    useEffect(() => {
        // Set only the current month to be expanded by default
        setCollapsedMonths(prev => ({ ...prev, [monthKeys[currentMonth]]: false }));
    }, [currentMonth]);
    
    const { 
        janExpenses, febExpenses, marExpenses, aprExpenses, mayExpenses, junExpenses, 
        julExpenses, augExpenses, sepExpenses, octExpenses, novExpenses, decExpenses, 
        currentMonth, allCategories, allAccounts 
    } = useContext(GlobalContext);

    const [collapsedMonths, setCollapsedMonths] = useState({
        jan: true, feb: true, mar: true, apr: true, may: true, jun: true,
        jul: true, aug: true, sep: true, oct: true, nov: true, dec: true,
    });

    const [selectedExpenseForDetail, setSelectedExpenseForDetail] = useState(null);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [selectedExpenseForEdit, setSelectedExpenseForEdit] = useState(null);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December'];
    const monthKeys = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    const monthlyExpenses = [janExpenses, febExpenses, marExpenses, aprExpenses, mayExpenses, junExpenses, 
                             julExpenses, augExpenses, sepExpenses, octExpenses, novExpenses, decExpenses];

    // Reverse the order of months
    const reversedMonthNames = [...monthNames].reverse();
    const reversedMonthlyExpenses = [...monthlyExpenses].reverse();
    const reversedMonthKeys = [...monthKeys].reverse();


    const renderExpensesForMonth = (expenses, monthName, monthKey) => {
        const currentMonthIndex = 11 - currentMonth; // Adjust index for reversed order
        const isCurrentMonth = reversedMonthKeys[currentMonthIndex] === monthKey;
        const monthDisplayName = isCurrentMonth ? `${monthName} (Current Month)` : monthName;
        
        const monthAccountExpenses = expenses.filter(expense => expense.accountId === account.id);
        const totalSpending = monthAccountExpenses.reduce((total, expense) => {
            return expense.type === 'spend' ? total + expense.amount : total - expense.amount;
        }, 0);

        const toggleCollapse = () => {
            setCollapsedMonths(prev => ({ ...prev, [monthKey]: !prev[monthKey] }));
        };

        return (
            <View key={monthKey}>
                <TouchableOpacity style={styles.monthHeader} onPress={toggleCollapse}>
                    <Text style={styles.monthName}>{monthDisplayName}</Text>
                    <Text style={styles.totalSpending}>${totalSpending.toFixed(2)}</Text>
                </TouchableOpacity>
                {!collapsedMonths[monthKey] && (
                    monthAccountExpenses.length > 0 ? (
                        monthAccountExpenses.map(expense => (
                            <ExpenseCard 
                                key={expense.id} 
                                expense={expense}
                                onEdit={() => handleExpenseLongPress(expense)}
                                onDetails={() => handleExpensePress(expense)}
                            />
                        ))
                    ) : (
                        <Text style={styles.noDataText}>No expenses in {monthName}.</Text>
                    )
                )}
            </View>
        );
    };

    const handleExpensePress = (expense) => {
        setSelectedExpenseForDetail(expense);
        setIsDetailModalVisible(true);
    };

    const handleExpenseLongPress = (expense) => {
        setSelectedExpenseForEdit(expense);
        setIsEditModalVisible(true);
    };

    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalView}>
                <Text style={styles.title}>{account.accountName} Details</Text>
                <ScrollView>
                    {reversedMonthNames.map((monthName, index) => renderExpensesForMonth(reversedMonthlyExpenses[index], monthName, reversedMonthKeys[index]))}
                </ScrollView>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
                {selectedExpenseForDetail && (
                    <ExpenseDetailModal
                        isVisible={isDetailModalVisible}
                        onClose={() => setIsDetailModalVisible(false)}
                        expense={selectedExpenseForDetail}
                    />
                )}
                {selectedExpenseForEdit && (
                    <EditExpense
                        isVisible={isEditModalVisible}
                        onClose={() => setIsEditModalVisible(false)}
                        expenseData={selectedExpenseForEdit}
                        allCategory={allCategories}
                        allAccount={allAccounts}
                    />
                )}
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalView: {
        flex: 1,
        padding: 20,
        backgroundColor: '#164863',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#DDF2FD',
        textAlign: 'center',
    },
    monthHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
    },
    monthName: {
        color: '#DDF2FD',
        fontSize: 18,
        fontStyle: 'italic',
    },
    totalSpending: {
        color: '#DDF2FD',
        fontSize: 16,
        fontWeight: 'bold',
    },
    noDataText: {
        fontSize: 16,
        fontStyle: 'italic',
        marginVertical: 10,
        color: '#DDF2FD',
    },
    closeButton: {
        backgroundColor: '#427D9D',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
    },
    // ... other styles
});

export default AccountDetails;
