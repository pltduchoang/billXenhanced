// src/screens/Dashboard.jsx
import React, { useEffect, useState, useContext } from 'react';
import { ScrollView ,View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { GlobalContext } from '../context/GlobalContext';
import ExpenseService from '../services/ExpenseService';
import ExpenseCard from '../components/dashboard/ExpenseCard'; // Adjust the path as necessary
import CategoryService from '../services/CategoryService'; // Import CategoryService
import AccountService from '../services/AccountService'; // Import AccountService
import AddExpense from '../components/dashboard/AddExpense'
import EditExpense from '../components/dashboard/EditExpense';
import ExpenseDetailModal from '../components/dashboard/ExpenseDetailModal';

const Dashboard = () => {
    const [allExpenses, setAllExpenses] = useState([]);
    const [thisMonthExpenses, setThisMonthExpenses] = useState([]);
    const [lastMonthExpenses, setLastMonthExpenses] = useState([]);


    const [isLoading, setIsLoading] = useState(true);
    const [showThisMonth, setShowThisMonth] = useState(false);
    const [showLastMonth, setShowLastMonth] = useState(false);
    // Access global context
    const { 
        user, refreshPage, 
        allCategories, setAllCategories,
        allAccounts, setAllAccounts,
        updateThisMonthExpense, updateLastMonthExpense
    } = useContext(GlobalContext);

    useEffect(() => {
        const fetchExpensesAndCategories = async () => {
            setIsLoading(true);
    
            if (user && user.uid) {
                try {
                    // Fetch expenses
                    const expenses = await ExpenseService.getExpenses(user.uid);
                    setAllExpenses(expenses);

                    //check and create default category
                    await checkAndCreateDefaultCategory(user.uid);

                    //check and create default account
                    await checkAndCreateDefaultAccount(user.uid);

                    // Fetch and set categories and accounts
                    const fetchedCategories = await CategoryService.getCategories(user.uid);
                    setAllCategories(fetchedCategories.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
                    
                    const fetchedAccounts = await AccountService.getAccounts(user.uid);
                    setAllAccounts(fetchedAccounts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
                } catch (error) {
                    console.error("Error fetching data: ", error);
                }
                setIsLoading(false);
            }
        };
    
        fetchExpensesAndCategories();
    }, [user, refreshPage]);

    // Function to create a default category if none exist
    const checkAndCreateDefaultCategory = async (userId) => {
        const categories = await CategoryService.getCategories(userId);
        if (categories.length === 0) {
            await CategoryService.createCategory(userId, {
                categoryName: "General",
                categoryDescription: "Default category for uncategorized expenses",
                categoryType: "spend",
                categoryLimit: null,
            });
        }
    };

    // Function to create a default account if none exist
    const checkAndCreateDefaultAccount = async (userId) => {
        const accounts = await AccountService.getAccounts(userId);
        if (accounts.length === 0) {
            await AccountService.createAccount(userId, {
                accountName: "General Account",
                accountDescription: "Default account for general expenses",
            });
        }
    };
    

    useEffect(() => {
        const now = new Date();
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    
        const filterExpensesForThisMonth = allExpenses.filter(expense => {
            const expenseDate = new Date(expense.time);
            return expenseDate >= thisMonthStart && expenseDate < nextMonthStart;
        });
    
        const filterExpensesForLastMonth = allExpenses.filter(expense => {
            const expenseDate = new Date(expense.time);
            return expenseDate >= lastMonthStart && expenseDate < thisMonthStart;
        });
    
        setThisMonthExpenses(filterExpensesForThisMonth);
        setLastMonthExpenses(filterExpensesForLastMonth);
        updateThisMonthExpense(filterExpensesForThisMonth);
        updateLastMonthExpense(filterExpensesForLastMonth);
        setIsLoading(false);
    }, [allExpenses]);



    const [isAddExpenseModalVisible, setIsAddExpenseModalVisible] = useState(false);
    const handleAddButtonPress = () => {
        setIsAddExpenseModalVisible(true); // Open the AddExpense modal
    };

    const handleCloseModal = () => {
        setIsAddExpenseModalVisible(false); // Close the AddExpense modal
        setIsEditExpenseModalVisible(false); // Close the EditExpense modal
    };

    //handle edit expense
    const [isEditExpenseModalVisible, setIsEditExpenseModalVisible] = useState(false);
    const [expenseDataEdit, setExpenseDataEdit] = useState(null); // [1]

    const handleEditExpense = (expense) => {
        setExpenseDataEdit(expense); // [2]
        setIsEditExpenseModalVisible(true);
    };

    //handle detail expense
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [selectedExpenseForDetail, setSelectedExpenseForDetail] = useState(null);

    const handleDetail = (expense) => {
        setSelectedExpenseForDetail(expense);
        setIsDetailModalVisible(true);
    };



    return (
        isLoading ? (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <ActivityIndicator size="large" color="#DDF2FD" />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        ) : (
        <SafeAreaView style={styles.container}>
            <ScrollView >
                <Text style={styles.title}>Dashboard</Text>

                {/* This Month's Expenses */}
                <TouchableOpacity style={styles.sectionTitle} onPress={() => setShowThisMonth(!showThisMonth)}>
                    <Text style={styles.sectionText}>This Month's Expenses</Text>
                </TouchableOpacity>
                {showThisMonth ? (
                    <View>
                        {thisMonthExpenses.length > 0 ? (
                            thisMonthExpenses.map(expense => (
                                <ExpenseCard 
                                    key={expense.id} 
                                    expense={expense} 
                                    categoryList={allCategories}
                                    accountList={allAccounts}
                                    onEdit={handleEditExpense} 
                                    onDetails={handleDetail}
                                />
                            ))
                        ) : (
                            <Text style={styles.noDataText}>No expenses this month.</Text>
                        )}
                    </View>
                ) : (
                    <></>
                )}

                {/* Last Month's Expenses */}
                <TouchableOpacity style={styles.sectionTitle} onPress={() => setShowLastMonth(!showLastMonth)}>
                    <Text style={styles.sectionText}>Last Month's Expenses</Text>
                </TouchableOpacity>
                {showLastMonth ? (
                    <View>
                        {lastMonthExpenses.length > 0 ? (
                            lastMonthExpenses.map(expense => (
                                <ExpenseCard 
                                    key={expense.id} 
                                    expense={expense} 
                                    categoryList={allCategories}
                                    accountList={allAccounts}
                                    onEdit={handleEditExpense} 
                                    onDetails={handleDetail}
                                />
                            ))
                        ) : (
                            <Text style={styles.noDataText}>No expenses last month.</Text>
                        )}
                    </View>
                ) : (
                    <></>
                )}

                {/* Add Expense Modal */}

                <AddExpense
                    isVisible={isAddExpenseModalVisible}
                    onClose={handleCloseModal}
                    allCategory={allCategories}
                    allAccount={allAccounts}
                />

                <EditExpense
                    isVisible={isEditExpenseModalVisible}
                    onClose={handleCloseModal}
                    expenseData={expenseDataEdit}
                    allCategory={allCategories}
                    allAccount={allAccounts}
                />


                <ExpenseDetailModal
                    isVisible={isDetailModalVisible}
                    onClose={() => setIsDetailModalVisible(false)}
                    expense={selectedExpenseForDetail}
                />

            </ScrollView>
            <TouchableOpacity 
                style={styles.addButton} 
                onPress={handleAddButtonPress}
                activeOpacity={0.7}
            >
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
        </SafeAreaView>
        )
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#164863",
    },
    title: {
        color: '#DDF2FD',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        margin : 10,
    },
    sectionTitle: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#427D9D',
    },
    sectionText: {
        color: '#DDF2FD',
        fontSize: 20,
        fontWeight: 'bold',
    },
    noDataText: {
        color: '#DDF2FD',
        fontSize: 16,
        textAlign: 'center',
    },
    loadingText: {
        color: '#DDF2FD',
        fontSize: 18,
        textAlign: 'center',
    },
    addButton: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#427D9D',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8, // For Android shadow
        shadowColor: '#000', // For iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    addButtonText: {
        color: '#9BBEC8',
        fontSize: 30,
        fontWeight: 'bold',
    },
});

export default Dashboard;
