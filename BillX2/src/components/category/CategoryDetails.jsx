// src/components/category/CategoryDetails.jsx
import React, { useContext, useState } from 'react';
import { Modal, View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { GlobalContext } from '../../context/GlobalContext';
import ExpenseCard from '../dashboard/ExpenseCard';
import ExpenseDetailModal from '../dashboard/ExpenseDetailModal';
import EditExpense from '../dashboard/EditExpense';

const CategoryDetails = ({ isVisible, onClose, category }) => {
    const { thisMonthExpense, lastMonthExpense, allCategories, allAccounts } = useContext(GlobalContext);
    const [selectedExpenseForDetail, setSelectedExpenseForDetail] = useState(null);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [selectedExpenseForEdit, setSelectedExpenseForEdit] = useState(null);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);

    const filterExpensesByCategory = (expenses, categoryId) => {
        return expenses.filter(expense => expense.categoryId === categoryId);
    };

    const thisMonthCategoryExpenses = filterExpensesByCategory(thisMonthExpense, category.id);
    const lastMonthCategoryExpenses = filterExpensesByCategory(lastMonthExpense, category.id);

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
                <Text style={styles.title}>{category.categoryName} Details</Text>
                
                <ScrollView>
                    {/* This Month's Expenses */}
                    <Text style={styles.sectionTitle}>This Month's Expenses</Text>
                    {thisMonthCategoryExpenses.length > 0 ?
                        thisMonthCategoryExpenses.map(expense => (
                            <ExpenseCard 
                                key={expense.id} 
                                expense={expense}
                                onEdit={() => handleExpenseLongPress(expense)}
                                onDetails={() => handleExpensePress(expense)}
                            />
                        )) : <Text style={styles.noDataText}>No expenses this month.</Text>
                    }

                    {/* Last Month's Expenses */}
                    <Text style={styles.sectionTitle}>Last Month's Expenses</Text>
                    {lastMonthCategoryExpenses.length > 0 ?
                        lastMonthCategoryExpenses.map(expense => (
                            <ExpenseCard 
                                key={expense.id} 
                                expense={expense}
                                onEdit={() => handleExpenseLongPress(expense)}
                                onDetails={() => handleExpensePress(expense)}
                            />
                        )) : <Text style={styles.noDataText}>No expenses last month.</Text>
                    }
                </ScrollView>

                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>

                {/* Expense Detail Modal */}
                {selectedExpenseForDetail && (
                    <ExpenseDetailModal
                        isVisible={isDetailModalVisible}
                        onClose={() => setIsDetailModalVisible(false)}
                        expense={selectedExpenseForDetail}
                    />
                )}

                {/* Edit Expense Modal */}
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
        marginBottom: 10,
        color: '#DDF2FD',
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 15,
        color: '#DDF2FD',
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

export default CategoryDetails;
