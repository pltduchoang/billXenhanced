// services/AccountService.js
import { firestore } from './Firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, onSnapshot, arrayUnion } from 'firebase/firestore';

const AccountService = {
    // Subscribe to live updates of accounts
    getAccountsLive: (userId, onAccountsUpdate) => {
        const accountCollectionRef = collection(firestore, `users/${userId}/accounts`);

        return onSnapshot(accountCollectionRef, (querySnapshot) => {
            const accounts = [];
            querySnapshot.forEach((doc) => {
                accounts.push({ id: doc.id, ...doc.data() });
            });
            onAccountsUpdate(accounts); // Callback function to handle the updated data
        });
    },

    // Create a new account
    createAccount: async (userId, accountData) => {
        const accountCollectionRef = collection(firestore, `users/${userId}/accounts`);
        try {
            const docRef = await addDoc(accountCollectionRef, {
                ...accountData,
                createdAt: new Date() // Add a creation timestamp
            });
            return docRef.id;
        } catch (error) {
            console.error("Error adding account: ", error);
        }
    },

    // Get all accounts for a user
    getAccounts: async (userId) => {
        const accounts = [];
        const accountCollectionRef = collection(firestore, `users/${userId}/accounts`);
        try {
            const querySnapshot = await getDocs(accountCollectionRef);
            querySnapshot.forEach((doc) => {
                accounts.push({ id: doc.id, ...doc.data() });
            });
            return accounts;
        } catch (error) {
            console.error("Error getting accounts: ", error);
        }
    },

    // Update an account
    updateAccount: async (userId, accountId, updatedData) => {
        const accountDocRef = doc(firestore, `users/${userId}/accounts/${accountId}`);
        try {
            await updateDoc(accountDocRef, updatedData);
        } catch (error) {
            console.error("Error updating account: ", error);
        }
    },

    // Delete an account
    deleteAccount: async (userId, accountId) => {
        const accountDocRef = doc(firestore, `users/${userId}/accounts/${accountId}`);
        try {
            await deleteDoc(accountDocRef);
        } catch (error) {
            console.error("Error deleting account: ", error);
        }
    },

    // Method to add an expense ID to an account's records
    addExpenseToAccount: async (userId, accountId, expenseId) => {
        try {
            const accountDocRef = doc(firestore, `users/${userId}/accounts/${accountId}`);
            await updateDoc(accountDocRef, {
                records: arrayUnion(expenseId) // Add the expense ID to the records array
            });
        } catch (error) {
            console.error("Error adding expense to account: ", error);
        }
    }

};

export default AccountService;
