// src/context/GlobalContext.jsx
import React, { createContext, useState } from 'react';

// Create a context
export const GlobalContext = createContext();

// Create a provider component
export const ContextProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Holds user data
    const [refreshPage, setRefreshPage] = useState(0); // Trigger for page refresh
    const [thisMonthExpense, setThisMonthExpense] = useState([]);
    const [lastMonthExpense, setLastMonthExpense] = useState([]);

    // Add allCategories and allAccounts state
    const [allCategories, setAllCategories] = useState([]);
    const [allAccounts, setAllAccounts] = useState([]);

    // Function to update the user state
    const updateUser = (userData) => {
        setUser(userData);
    };

    const updateThisMonthExpense = (expenses) => {
        setThisMonthExpense(expenses);
    };

    const updateLastMonthExpense = (expenses) => {
        setLastMonthExpense(expenses);
    };


    return (
        <GlobalContext.Provider value={{ 
            user, updateUser, 
            refreshPage, setRefreshPage,
            thisMonthExpense, updateThisMonthExpense,
            lastMonthExpense, updateLastMonthExpense,
            allCategories, setAllCategories, // Add these
            allAccounts, setAllAccounts // And these
        }}>
            {children}
        </GlobalContext.Provider>
    );
};