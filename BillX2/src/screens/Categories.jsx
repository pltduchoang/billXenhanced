// src/screens/Categories.jsx
import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { GlobalContext } from '../context/GlobalContext';
import CategoryCard from '../components/category/CategoryCard';
import CategoryService from '../services/CategoryService';
import AddCategory from '../components/category/AddCategory';
import EditCategory from '../components/category/EditCategory';
import CategoryDetails from '../components/category/CategoryDetails';

const Categories = () => {
    const { 
        user, refreshPage, setRefreshPage, 
        allCategories, 
        allAccounts, 
        currentYear,
        currentMonth,
        janExpenses, febExpenses, marExpenses, aprExpenses, mayExpenses, 
        junExpenses, julExpenses, augExpenses, sepExpenses, octExpenses, 
        novExpenses, decExpenses
    } = useContext(GlobalContext);    
    
    const [categories, setCategories] = useState([]);


    useEffect(() => {
        const fetchCategories = async () => {
            if (user && user.uid) {
                const fetchedCategories = await CategoryService.getCategories(user.uid);
                // Check if user has no categories and create default category if necessary
                if (fetchedCategories.length === 0) {
                    await createDefaultCategory(user.uid);
                    setRefreshPage(refreshPage + 1); // Update refreshPage to trigger a refresh
                } else {
                    setCategories(fetchedCategories);
                }
            }
        };

        fetchCategories();
    }, [user, refreshPage]);

    const createDefaultCategory = async (userId) => {
        const defaultCategoryData = {
            categoryName: "General",
            categoryDescription: "Default category for uncategorized expenses",
            categoryType: "spend",
            categoryLimit: null,
            records: [],
            categoryIcon: "default",
            // Add any other necessary fields for the category
        };
        await CategoryService.createCategory(userId, defaultCategoryData);
        // Fetch categories again after creating the default category
        const fetchedCategories = await CategoryService.getCategories(userId);
        setCategories(fetchedCategories);
    };

    // Logic to add a new category
    const [isAddCategoryModalVisible, setIsAddCategoryModalVisible] = useState(false);

    const handleOpenAddCategoryModal = () => {
        setIsAddCategoryModalVisible(true);
    };

    const handleCloseAddCategoryModal = () => {
        setIsAddCategoryModalVisible(false);
    };


    // Logic to edit a category
    const [isEditCategoryModalVisible, setIsEditCategoryModalVisible] = useState(false); // State for EditCategory modal visibility
    const [selectedCategory, setSelectedCategory] = useState(null); // State for the category to edit

    // Function to handle opening the EditCategory modal
    const handleEditCategory = (category) => {
        setSelectedCategory(category);
        setIsEditCategoryModalVisible(true);
    };

    const handleCloseEditCategoryModal = () => {
        setIsEditCategoryModalVisible(false);
        setSelectedCategory(null);
    };

    // Logic to view category details
    const [selectedCategoryDetail, setSelectedCategoryDetail] = useState(null);
    const [isDetailsVisible, setIsDetailsVisible] = useState(false); // State for showing category details

    const handleShowDetails = (category) => {
        setSelectedCategoryDetail(category);
        setIsDetailsVisible(true);
    };

    const handleCloseDetails = () => {
        setIsDetailsVisible(false);
        setSelectedCategoryDetail(null);
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Categories</Text>
            {categories
            .filter(category => category.categoryType !== 'saving')
            .map(category => (
                <CategoryCard 
                    key={category.id} 
                    category={category}
                    allMonthlyExpense={{
                        janExpenses, febExpenses, marExpenses, aprExpenses, mayExpenses, 
                        junExpenses, julExpenses, augExpenses, sepExpenses, octExpenses, 
                        novExpenses, decExpenses
                    }}
                    onEdit={handleEditCategory}
                    onPress={handleShowDetails}
                    currentMonth={currentMonth}
                />
            ))}
            <TouchableOpacity style={styles.addButton} onPress={handleOpenAddCategoryModal}>
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>

            <AddCategory
                isVisible={isAddCategoryModalVisible}
                onClose={handleCloseAddCategoryModal}
            />

            {selectedCategory && (
                <EditCategory
                    isVisible={isEditCategoryModalVisible}
                    onClose={handleCloseEditCategoryModal}
                    categoryData={selectedCategory}
                />
            )}

            {selectedCategoryDetail && (
                <CategoryDetails
                    isVisible={isDetailsVisible}
                    onClose={handleCloseDetails}
                    category={selectedCategoryDetail}
                />
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#164863',
    },
    addButton: {
        backgroundColor: '#427D9D',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 10,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    addButtonText: {
        fontSize: 24,
        color: '#DDF2FD',
        fontWeight: 'bold',
    },
    title: {
        color: '#DDF2FD',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 10,
    },
    // ... other styles
});

export default Categories;

