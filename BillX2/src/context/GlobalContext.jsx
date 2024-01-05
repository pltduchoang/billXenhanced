import React, { createContext, useState } from 'react';

// Create a context
export const GlobalContext = createContext();

// Create a provider component
export const ContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [refreshPage, setRefreshPage] = useState(0);
    const [allCategories, setAllCategories] = useState([]);
    const [allAccounts, setAllAccounts] = useState([]);

    // Current year and month states
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

    // States for expenses for each month of the year
    const [janExpenses, setJanExpenses] = useState([]);
    const [febExpenses, setFebExpenses] = useState([]);
    const [marExpenses, setMarExpenses] = useState([]);
    const [aprExpenses, setAprExpenses] = useState([]);
    const [mayExpenses, setMayExpenses] = useState([]);
    const [junExpenses, setJunExpenses] = useState([]);
    const [julExpenses, setJulExpenses] = useState([]);
    const [augExpenses, setAugExpenses] = useState([]);
    const [sepExpenses, setSepExpenses] = useState([]);
    const [octExpenses, setOctExpenses] = useState([]);
    const [novExpenses, setNovExpenses] = useState([]);
    const [decExpenses, setDecExpenses] = useState([]);

    // Function to update user state
    const updateUser = (userData) => {
        setUser(userData);
    };

    // Functions to update expenses for each month
    const updateMonthlyExpenses = (month, expenses) => {
        switch (month + 1) {
            case 1:
                setJanExpenses(expenses);
                break;
            case 2:
                setFebExpenses(expenses);
                break;
            case 3:
                setMarExpenses(expenses);
                break;
            case 4:
                setAprExpenses(expenses);
                break;
            case 5:
                setMayExpenses(expenses);
                break;
            case 6:
                setJunExpenses(expenses);
                break;
            case 7:
                setJulExpenses(expenses);
                break;
            case 8:
                setAugExpenses(expenses);
                break;
            case 9:
                setSepExpenses(expenses);
                break;
            case 10:
                setOctExpenses(expenses);
                break;
            case 11:
                setNovExpenses(expenses);
                break;
            case 12:
                setDecExpenses(expenses);
                break;
            default:
                break;
        }
    };

    return (
        <GlobalContext.Provider value={{
            user, updateUser, 
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
            updateMonthlyExpenses
        }}>
            {children}
        </GlobalContext.Provider>
    );
};