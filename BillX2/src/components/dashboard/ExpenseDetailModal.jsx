//src/components/dashboard/ExpenseDetailModal.jsx

import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image, ActivityIndicator, ScrollView } from 'react-native';
import { GlobalContext } from '../../context/GlobalContext';

const ExpenseDetailModal = ({ isVisible, onClose, expense }) => {
    const [isImageLoading, setIsImageLoading] = useState(false);
    const { allCategories, allAccounts } = useContext(GlobalContext);

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
                        <View style={styles.sectionFrame}>
                            <Text style={styles.sectionTitle}>Amount</Text>
                            <Text style={styles.modalText}>{expense.amount.toFixed(2)}</Text>
                        </View>
                        <View style={styles.sectionFrame}>
                            <Text style={styles.sectionTitle}>Type</Text>
                            <Text style={styles.modalText}>{expense.type.toUpperCase()}</Text>
                        </View>
                        <View style={styles.sectionFrame}>
                            <Text style={styles.sectionTitle}>Time</Text>
                            <Text style={styles.modalText}>{new Date(expense.time).toLocaleDateString()}</Text>
                        </View>
                        <View style={styles.sectionFrame}>
                            <Text style={styles.sectionTitle}>Description</Text>
                            <Text style={styles.modalText}>{expense.description}</Text>
                        </View>
                        <View style={styles.sectionFrame}>
                            <Text style={styles.sectionTitle}>Category</Text>
                            <Text style={styles.modalText}>{categoryName}</Text>
                        </View>
                        <View style={styles.sectionFrame}>
                            <Text style={styles.sectionTitle}>Account</Text>
                            <Text style={styles.modalText}>{accountName}</Text>
                        </View>
                        {expense.imageLink ? (
                            <View style={styles.sectionFrame}>
                                <Text style={styles.sectionTitle}>Receipt</Text>
                                {isImageLoading && <ActivityIndicator size="large" color="#0000ff" />}
                                <Image
                                    source={{ uri: expense.imageLink }}
                                    style={styles.image}
                                    resizeMode="contain"
                                    onLoadStart={() => setIsImageLoading(true)}
                                    onLoadEnd={() => setIsImageLoading(false)}
                                />
                            </View>
                        ) : (
                            <View style={styles.sectionFrame}>
                                <Text style={styles.sectionTitle}>Receipt</Text>
                                <Text style={styles.modalText}>No image available</Text>
                            </View>
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
        padding: 10,
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
        height: 300, // Adjust height to fit the modal appropriately
        marginTop: 20,
        borderRadius: 10,
    },
    closeButton: {
        padding: 10,
        backgroundColor: '#427D9D',
        borderRadius: 5,
        alignSelf: 'center',
        width: '50%',
        marginTop: 20,
    },
    buttonText: {
        color: '#DDF2FD',
        textAlign: 'center',
        fontSize: 16,
    },
    modalText: {
        color: '#DDF2FD',
        fontSize: 18,
        marginBottom: 10,
    },
    sectionFrame: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#9BBEC8',
        marginBottom: 50,
        marginHorizontal: 16,
        padding: 20,
        position: 'relative',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#9BBEC8',
        position: 'absolute',
        top: -20,
        left: 10,
        paddingHorizontal: 10,
        backgroundColor: '#164863',
    },
    // ... other styles
});

export default ExpenseDetailModal;
