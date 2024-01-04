// src/components/category/AddCategory.jsx

import React, { useState, useContext } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { GlobalContext } from '../../context/GlobalContext';
import CategoryService from '../../services/CategoryService';

const AddCategory = ({ isVisible, onClose }) => {
    const { user, setRefreshPage } = useContext(GlobalContext);
    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');
    const [categoryType, setCategoryType] = useState('spend');
    const [isBudgetEnabled, setIsBudgetEnabled] = useState(false);
    const [categoryLimit, setCategoryLimit] = useState('');

    const handleAddCategory = async () => {
        if (user && user.uid && categoryName.trim()) {
            const newCategory = {
                categoryName,
                categoryDescription,
                categoryType,
                categoryLimit: isBudgetEnabled ? parseFloat(categoryLimit) || 0 : null,
            };
            await CategoryService.createCategory(user.uid, newCategory);
            setCategoryName('');
            setCategoryDescription('');
            setCategoryLimit('');
            setIsBudgetEnabled(false);
            setRefreshPage(prev => prev + 1); // Update refreshPage to trigger a refresh
            onClose(); // Close the modal
        }
    };

    const handleCategoryTypeChange = (type) => {
        setCategoryType(type);
        if (type === 'saving') {
            setIsBudgetEnabled(true); // Force the switch on for saving type
        }
    };

    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalView}>
                <Text style={styles.title}>Add New Category</Text>

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

                <View style={styles.buttonRow}>
                    <TouchableOpacity 
                        style={categoryType === 'spend' ? styles.activeButton : styles.typeButton}
                        onPress={() => handleCategoryTypeChange('spend')}
                    >
                        <Text style={styles.buttonText}>Spend</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={categoryType === 'saving' ? styles.activeButton : styles.typeButton}
                        onPress={() => handleCategoryTypeChange('saving')}
                    >
                        <Text style={styles.buttonText}>Saving</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.switchRow}>
                    <Text style={styles.switchLabel}>
                        {categoryType === 'spend' ? 'Set Budget Cap' : 'Set Saving Target'}
                    </Text>
                    <Switch 
                        value={isBudgetEnabled} 
                        onValueChange={setIsBudgetEnabled}
                        disabled={categoryType === 'saving'}
                    />
                </View>

                {isBudgetEnabled && (
                    <TextInput
                        style={styles.input}
                        placeholder={categoryType === 'spend' ? 'Budget Cap' : 'Saving Target'}
                        keyboardType="numeric"
                        value={categoryLimit}
                        onChangeText={setCategoryLimit}
                    />
                )}

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleAddCategory}
                >
                    <Text style={styles.buttonText}>Add Category</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                    style={styles.button}
                    onPress={onClose}
                >
                    <Text style={styles.buttonText}>Cancel</Text>
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
    typeButton: {
        backgroundColor: '#427D9D',
        padding: 10,
        borderRadius: 5,
        margin: 10,
        width: '40%',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#427D9D',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        width: '60%',
        alignItems: 'center',
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
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 20,
    },
    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    switchLabel: {
        color: '#DDF2FD',
        fontSize: 16,
        marginRight: 10,
    },
    // ... other styles
});

export default AddCategory;
