//src/components/dashboard/ExpenseDetailModal.jsx


import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image, ActivityIndicator, ScrollView } from 'react-native';
import { GlobalContext } from '../../context/GlobalContext';

const ExpenseDetailModal = ({ isVisible, onClose, expense }) => {
    const [isImageLoading, setIsImageLoading] = useState(false);
    const { allCategories, allAccounts } = useContext(GlobalContext);

    // Find the category and account names based on their IDs
    const [categoryName, setCategoryName] = useState('');
    const [accountName, setAccountName] = useState('');

    useEffect(() => {
        if (expense) {
            const foundCategory = allCategories.find(category => category.id === expense.categoryId);
            const foundAccount = allAccounts.find(account => account.id === expense.accountId);
            setCategoryName(foundCategory?.categoryName || 'No Category');
            setAccountName(foundAccount?.accountName || 'No Account');
        }
    }, [expense, allCategories, allAccounts]);

    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalContent}>
                {expense ? (
                    <ScrollView>
                        <Text style={styles.modalTitle}>Expense Details</Text>
                        <Text style={styles.modalText}>Amount: ${expense.amount.toFixed(2)}</Text>
                        <Text style={styles.modalText}>Type: {expense.type.toUpperCase()}</Text>
                        <Text style={styles.modalText}>Time: {new Date(expense.time).toLocaleDateString()}</Text>
                        <Text style={styles.modalText}>Description: {expense.description}</Text>
                        <Text style={styles.modalText}>Category: {categoryName}</Text>
                        <Text style={styles.modalText}>Account: {accountName}</Text>
                        {expense.imageLink ? (
                            <>
                                {isImageLoading && <ActivityIndicator size="large" color="#0000ff" />}
                                <Image
                                    source={{ uri: expense.imageLink }}
                                    style={styles.image}
                                    resizeMode="contain"
                                    onLoadStart={() => setIsImageLoading(true)}
                                    onLoadEnd={() => setIsImageLoading(false)}
                                />
                            </>
                        ) : (
                            <Text style={styles.modalText}>No image available</Text>
                        )}
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={onClose}
                        >
                            <Text style={styles.buttonText}>Close</Text>
                        </TouchableOpacity>
                    </ScrollView>
                ) : <Text style={styles.modalText}>No expense selected</Text>}
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContent: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white',
        backgroundColor: '#164863',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#DDF2FD',
    },
    image: {
        width: '100%',
        height: 700, // You can adjust this height as needed
        marginTop: 20,
        marginBottom: 20,
        marginHorizontal: 5,
        borderRadius: 10, // Adjust for rounded corners
    },
    closeButton: {
        padding: 10,
        backgroundColor: '#427D9D',
        borderRadius: 5,
        alignSelf: 'center', // Center the button within the modal
        width: '50%',
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        width: '100%',

    },
    modalText: {
        color: '#DDF2FD',
        fontSize: 18,
        marginBottom: 10,
        marginLeft: 20,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
        width: '100%',
    },
    // ... other styles
});

export default ExpenseDetailModal;
