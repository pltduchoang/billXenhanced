import { firestore } from './Firebase';
import { collection, query, where, getDocs, addDoc, doc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';

const ExpenseService = {
    // Function to get the reference to the expense subcollection for a specific year
    getExpenseCollectionRef: (userId, year) => {
        return collection(firestore, `users/${userId}/expenses/${year}/expenses`);
    },

    // Subscribe to live updates of expenses for a specific year
    getExpensesLive: (userId, year, onExpensesUpdate) => {
        const expenseCollectionRef = this.getExpenseCollectionRef(userId, year);

        return onSnapshot(expenseCollectionRef, (querySnapshot) => {
            const expenses = [];
            querySnapshot.forEach((doc) => {
                const expense = { id: doc.id, ...doc.data() };
                expenses.push(expense);
            });
            onExpensesUpdate(expenses); // Callback function to handle the updated data
        });
    },

    // Create a new expense in a specific year
    createExpense: async (userId, year, expenseData) => {
        const expenseCollectionRef = this.getExpenseCollectionRef(userId, year);
        try {
            const docRef = await addDoc(expenseCollectionRef, expenseData);
            return docRef.id; // Return the new expense ID
        } catch (error) {
            console.error("Error adding expense: ", error);
        }
    },

    // Get all expenses for a user in a specific year
    getExpenses: async (userId, year) => {
        const expenses = [];
        const expenseCollectionRef = this.getExpenseCollectionRef(userId, year);
        try {
            const querySnapshot = await getDocs(expenseCollectionRef);
            querySnapshot.forEach((doc) => {
                expenses.push({ id: doc.id, ...doc.data() });
            });
            return expenses;
        } catch (error) {
            console.error("Error getting expenses: ", error);
        }
    },

    // Update an expense in a specific year
    updateExpense: async (userId, year, expenseId, updatedData) => {
        const expenseDocRef = doc(firestore, `users/${userId}/expenses/${year}/expenses/${expenseId}`);
        try {
            await updateDoc(expenseDocRef, updatedData);
        } catch (error) {
            console.error("Error updating expense: ", error);
        }
    },

    // Delete an expense in a specific year
    deleteExpense: async (userId, year, expenseId) => {
        const expenseDocRef = doc(firestore, `users/${userId}/expenses/${year}/expenses/${expenseId}`);
        try {
            await deleteDoc(expenseDocRef);
        } catch (error) {
            console.error("Error deleting expense: ", error);
        }
    }
};

export default ExpenseService;
