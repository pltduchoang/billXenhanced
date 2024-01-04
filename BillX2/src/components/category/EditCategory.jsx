// components/category/EditCategory.jsx
import React, { useState, useContext, useEffect  } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Switch , Alert} from 'react-native';
import { GlobalContext } from '../../context/GlobalContext';
import CategoryService from '../../services/CategoryService';

const EditCategory = ({ isVisible, onClose, categoryData }) => {
    const { user, setRefreshPage } = useContext(GlobalContext);
    const [categoryName, setCategoryName] = useState(categoryData.categoryName);
    const [categoryDescription, setCategoryDescription] = useState(categoryData.categoryDescription);
    const [categoryType, setCategoryType] = useState(categoryData.categoryType);
    const [categoryLimit, setCategoryLimit] = useState(categoryData.categoryLimit || '');
    const [isBudget, setIsBudget] = useState(categoryData.categoryLimit !== null);
    const [isBudgetLocked, setIsBudgetLocked] = useState(categoryData.categoryType === 'saving');

    useEffect(() => {
        // Lock or unlock the budget switch based on the category type
        setIsBudgetLocked(categoryType === 'saving');
        if (categoryType === 'saving') {
            setIsBudget(true);
        }
    }, [categoryType]);

    const handleSaveCategory = async () => {
        if (user && user.uid && categoryName.trim()) {
            const updatedCategory = {
                categoryName,
                categoryDescription,
                categoryType,
                categoryLimit: isBudget ? categoryLimit : null,
            };
            await CategoryService.updateCategory(user.uid, categoryData.id, updatedCategory);
            setRefreshPage(prev => prev + 1); // Update refreshPage to trigger a refresh
            onClose(); // Close the modal
        }
    };

    const handleDeleteCategory = async () => {
        Alert.alert(
            "Delete Category",
            "Are you sure you want to delete this category?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                { 
                    text: "OK", 
                    onPress: async () => {
                        if (user && user.uid) {
                            await CategoryService.deleteCategory(user.uid, categoryData.id);
                            setRefreshPage(prev => prev + 1); // Update refreshPage to trigger a refresh
                            onClose(); // Close the modal
                        }
                    }
                }
            ]
        );
    };

    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalView}>
                <Text style={styles.title}>Edit Category</Text>
                
                <TextInput
                    style={styles.input}
                    placeholder="Category Name"
                    value={categoryName}
                    onChangeText={setCategoryName}
                />
                
                <TextInput
                    style={styles.input}
                    placeholder="Category Description"
                    value={categoryDescription}
                    onChangeText={setCategoryDescription}
                />

                <View style={styles.categoryTypeContainer}>
                    <TouchableOpacity
                        style={categoryType === 'spend' ? styles.activeButton : styles.typeButton}
                        onPress={() => setCategoryType('spend')}
                    >
                        <Text style={styles.buttonText}>Spend</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={categoryType === 'saving' ? styles.activeButton : styles.typeButton}
                        onPress={() => setCategoryType('saving')}
                    >
                        <Text style={styles.buttonText}>Saving</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.budgetSwitchContainer}>
                    <Text style={styles.text}>Make Budget / Saving:</Text>
                    <Switch
                        value={isBudget}
                        onValueChange={(value) => {
                            if (!isBudgetLocked) {
                                setIsBudget(value);
                            }
                        }}
                        disabled={isBudgetLocked}
                    />
                </View>

                {isBudget && (
                    <TextInput
                        style={styles.input}
                        placeholder={categoryType === 'spend' ? "Budget Cap" : "Saving Target"}
                        value={categoryLimit.toString()}
                        onChangeText={setCategoryLimit}
                        keyboardType="numeric"
                    />
                )}
                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleSaveCategory}
                    >
                        <Text style={styles.buttonText}>Save Changes</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={styles.button}
                        onPress={onClose}
                    >
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={[styles.button, styles.deleteButton]}
                    onPress={handleDeleteCategory}
                >
                    <Text style={styles.buttonText}>Delete Category</Text>
                </TouchableOpacity>

                
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#164863',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#DDF2FD',
        marginBottom: 20,
    },
    input: {
        width: '80%',
        padding: 10,
        margin: 10,
        backgroundColor: '#DDF2FD',
        borderRadius: 5,
    },
    button: {
        backgroundColor: '#427D9D',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        width: '40%',
        alignItems: 'center',
    },
    typeButton: {
        backgroundColor: '#427D9D',
        padding: 10,
        borderRadius: 5,
        margin: 10,
        width: '40%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    activeButton: {
        backgroundColor: '#164863',
        borderColor: '#9BBEC8',
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        margin: 10,
        alignItems: 'center',
        width: '40%',
    },
    categoryTypeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '90%',
        marginBottom: 20,
    },
    budgetSwitchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '80%',
        marginBottom: 20,
    },
    deleteButton: {
        backgroundColor: '#D9534F', // Red color for delete button
        opacity: 0.8,
        width: '72%',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '80%',
        marginBottom: 10,
        marginTop: 100,
    },
    text: {
        color: '#DDF2FD',
        fontSize: 16,
    },
    // ... other styles
});

export default EditCategory;
