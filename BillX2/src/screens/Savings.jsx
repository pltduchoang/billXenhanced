// src/screens/Savings.jsx

import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { GlobalContext } from '../context/GlobalContext';
import SavingsCategoryCard from '../components/saving/SavingsCategoryCard';
import EditCategory from '../components/category/EditCategory'; // Import this

const Savings = () => {
    const { allCategories } = useContext(GlobalContext);
    const [savingsCategories, setSavingsCategories] = useState([]);
    const [budgetCategories, setBudgetCategories] = useState([]);
    const [otherCategories, setOtherCategories] = useState([]);

    const [isEditCategoryModalVisible, setIsEditCategoryModalVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        const savings = allCategories.filter(cat => cat.categoryType === 'saving');
        const budget = allCategories.filter(cat => cat.categoryType === 'spend' && cat.categoryLimit != null);
        const others = allCategories.filter(cat => cat.categoryType === 'spend' && cat.categoryLimit == null);

        setSavingsCategories(savings);
        setBudgetCategories(budget);
        setOtherCategories(others);
    }, [allCategories]);

    // Function to handle long press
    const handleLongPress = (category) => {
        setSelectedCategory(category);
        setIsEditCategoryModalVisible(true);
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Savings</Text>
            {savingsCategories.map(category => (
                <SavingsCategoryCard 
                    key={category.id} 
                    category={category} 
                    type="saving" 
                    onLongPress={() => handleLongPress(category)}
                />
            ))}

            <Text style={styles.title}>Budget</Text>
            {budgetCategories.map(category => (
                <SavingsCategoryCard 
                    key={category.id} 
                    category={category} 
                    type="budget" 
                    onLongPress={() => handleLongPress(category)}
                />
            ))}

            <Text style={styles.title}>Others</Text>
            {otherCategories.map(category => (
                <SavingsCategoryCard 
                    key={category.id} 
                    category={category} 
                    type="other" 
                    onLongPress={() => handleLongPress(category)}
                />
            ))}

            {selectedCategory && (
                <EditCategory
                    isVisible={isEditCategoryModalVisible}
                    onClose={() => setIsEditCategoryModalVisible(false)}
                    categoryData={selectedCategory}
                />
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#164863',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#DDF2FD',
        marginVertical: 10,
    },
    // ... other styles
});

export default Savings;
