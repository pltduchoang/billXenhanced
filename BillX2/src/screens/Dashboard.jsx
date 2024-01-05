// src/screens/Dashboard.jsx
import React, { useEffect, useState, useContext } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { GlobalContext } from '../context/GlobalContext';
import ExpenseService from '../services/ExpenseService';
import ExpenseCard from '../components/dashboard/ExpenseCard';
import CategoryService from '../services/CategoryService';
import AccountService from '../services/AccountService';
import AddExpense from '../components/dashboard/AddExpense';
import EditExpense from '../components/dashboard/EditExpense';
import ExpenseDetailModal from '../components/dashboard/ExpenseDetailModal';

import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';


const Dashboard = () => {
    const { user, updateUser, 
        refreshPage, setRefreshPage,
        allCategories, setAllCategories,
        allAccounts, setAllAccounts,
        currentYear, setCurrentYear,
        currentMonth, setCurrentMonth,
        janExpenses, 
        febExpenses, 
        marExpenses, 
        aprExpenses, 
        mayExpenses, 
        junExpenses, 
        julExpenses, 
        augExpenses, 
        sepExpenses, 
        octExpenses, 
        novExpenses,
        decExpenses,
        updateMonthlyExpenses } = useContext(GlobalContext);

    const [showExpenseLog, setShowExpenseLog] = useState(false);

    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        const fetchExpensesAndCategories = async () => {
            setIsLoading(true);

            if (user && user.uid) {
                try {
                    // Fetch expenses for the current year
                    const yearExpenses = await ExpenseService.getExpenses(user.uid, currentYear);
    
                    // Initialize an object to hold expenses for each month
                    const monthlyExpenses = {
                        0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: []
                    };

                    // Group expenses by month
                    yearExpenses.forEach(expense => {
                        const expenseMonth = new Date(expense.time).getMonth();
                        monthlyExpenses[expenseMonth].push(expense);
                    });
    
                    // Update state for each month
                    Object.entries(monthlyExpenses).forEach(([month, expenses]) => {
                        updateMonthlyExpenses(parseInt(month), expenses);
                    });

                    // check and create default category
                    await checkAndCreateDefaultCategory(user.uid);

                    // check and create default account
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
    }, [user, refreshPage, currentYear]);


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


    // State to track collapsed months
    const initialCollapsedMonthsState = {
        jan: true, feb: true, mar: true, apr: true, may: true, jun: true,
        jul: true, aug: true, sep: true, oct: true, nov: true, dec: true,
    };
    

    const getMonthKey = (monthNumber) => {
        const monthKeys = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
        return monthKeys[monthNumber];
    };
    const currentMonthKey = getMonthKey(currentMonth); // Convert to 'jan', 'feb', etc.
    initialCollapsedMonthsState[currentMonthKey] = false;

    const [collapsedMonths, setCollapsedMonths] = useState(initialCollapsedMonthsState);

    //CHART
    const screenWidth = Dimensions.get("window").width;

    // Example data and labels (replace with actual data)
    const data = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
            {
                data: [janExpenses, febExpenses, marExpenses, aprExpenses, mayExpenses, junExpenses, julExpenses, augExpenses, sepExpenses, octExpenses, novExpenses, decExpenses].map(expenseArray => expenseArray.reduce((total, expense) => {
                    return expense.type === 'spend' ? total + expense.amount : total - expense.amount;
                    }, 0)),
                color: (opacity = 1) => `rgba(221, 242, 253, ${opacity})`, // optional
                strokeWidth: 2 // optional
            }
        ],
        legend: ["Monthly Expenses"] // optional
    };

    const chartConfig = {
        backgroundColor: '#427D9D',
        backgroundGradientFrom: '#427D9D',
        backgroundGradientTo: '#427D9D',
        decimalPlaces: 2, // optional, defaults to 2dp
        color: (opacity = 1) => `rgba(221, 242, 253, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(221, 242, 253, ${opacity})`,
        style: {
            borderRadius: 16
        },
        propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#ffa726"
        }
    };

    const renderExpensesForMonth = (expenses, monthName, monthKey) => {
        // Sort expenses in descending order based on the date
        const sortedExpenses = expenses.slice().sort((a, b) => new Date(b.time) - new Date(a.time));
        const isCurrentMonth = getMonthKey(currentMonth) === monthKey;
        const monthDisplayName = isCurrentMonth ? `${monthName} (Current month)` : monthName;
        const totalSpending = sortedExpenses.reduce((total, expense) => {
            return expense.type === 'spend' ? total + expense.amount : total - expense.amount;
        }, 0);
        const toggleCollapse = () => {
            setCollapsedMonths(prev => {
                const newCollapsedMonths = { ...prev, [monthKey]: !prev[monthKey] };
                return newCollapsedMonths;
            });
        };
    
        return (
            <View key={monthKey}>
                
                <TouchableOpacity style={styles.monthHeader} onPress={toggleCollapse}>
                    <Text style={styles.monthName}>{monthDisplayName}</Text>
                    <Text style={styles.totalSpending}>${totalSpending.toFixed(2)}</Text>
                </TouchableOpacity>
                {!collapsedMonths[monthKey] && (
                    sortedExpenses.length > 0 ? (
                        sortedExpenses.map(expense => (
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
                        <Text style={styles.noDataText}>No expenses in {monthName}.</Text>
                    )
                )}
            </View>
        );
    };


    //CHART




    return (
        isLoading ? (
            <View style={[styles.container, {justifyContent:'center'}]}>
                <ActivityIndicator size="large" color="#DDF2FD" />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        ) : (
            <SafeAreaView style={styles.container}>
                <ScrollView >
                    <View style={styles.chartContainer}>
                        {/* chart */}
                
                        <LineChart
                            data={data}
                            width={screenWidth}
                            height={220}
                            chartConfig={chartConfig}
                            bezier // This prop makes the line chart curved
                            style={{
                                marginVertical: 8,
                                borderRadius: 16
                            }}
                        />
                    </View>
                    <Text style={styles.title}>Dashboard</Text>
                   
                    <TouchableOpacity onPress={() => setShowExpenseLog(!showExpenseLog)}>
                        <Text style={styles.sectionText}>Expense Log</Text>
                    </TouchableOpacity>
                    {showExpenseLog && (
                        <View>
                            {renderExpensesForMonth(decExpenses, 'December', 'dec')}
                            {renderExpensesForMonth(novExpenses, 'November', 'nov')}
                            {renderExpensesForMonth(octExpenses, 'October', 'oct')}
                            {renderExpensesForMonth(sepExpenses, 'September', 'sep')}
                            {renderExpensesForMonth(augExpenses, 'August', 'aug')}
                            {renderExpensesForMonth(julExpenses, 'July', 'jul')}
                            {renderExpensesForMonth(junExpenses, 'June', 'jun')}
                            {renderExpensesForMonth(mayExpenses, 'May', 'may')}
                            {renderExpensesForMonth(aprExpenses, 'April', 'apr')}
                            {renderExpensesForMonth(marExpenses, 'March', 'mar')}
                            {renderExpensesForMonth(febExpenses, 'February', 'feb')}
                            {renderExpensesForMonth(janExpenses, 'January', 'jan')}
                        </View>
                    )}

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
        backgroundColor: '#427D9D',
        padding: 10,
        marginTop: 10,
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
    monthHeader: {
        flex: 1, 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: 10,
        marginTop: 10,
        // Remove the backgroundColor to have no background for the month title
    },
    monthName: {
        width: '40%',
        fontSize: 16,
        color: '#DDF2FD',
        fontStyle: 'italic',
    },
    totalSpending: {
        width: '60%',
        textAlign: 'right',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#DDF2FD',
    },
    chartContainer: {
        padding: 20,
        backgroundColor: '#427D9D',
        borderRadius: 10,
        margin: 20,
    },
});

export default Dashboard;
