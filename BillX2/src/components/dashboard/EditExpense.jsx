// componets/dashboard/AddExpense.jsx
import React, { useState, useContext, useEffect, alert } from 'react';
import { ActivityIndicator, Alert, Modal, View, ScrollView, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ExpenseService from '../../services/ExpenseService';
import { GlobalContext } from '../../context/GlobalContext';
import storage from '@react-native-firebase/storage';

import { getCategoryIcon } from '../iconLibrary/CategoryIconLibrary'
import { getAccountIcon } from '../iconLibrary/AccountIconLibrary';

const EditExpense = ({ isVisible, onClose, allCategory, allAccount, expenseData }) => {
    const [amount, setAmount] = useState(expenseData?.amount.toString() || '');
    const [type, setType] = useState(expenseData?.type || 'spend');
    const [time, setTime] = useState(expenseData ? new Date(expenseData.time) : new Date());
    const [oldTime, setOldTime] = useState(null);
    const [description, setDescription] = useState(expenseData?.description || '');
    const [image, setImage] = useState(expenseData?.imageLink ? { uri: expenseData.imageLink } : null);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);


    const [isLoading, setIsLoading] = useState(false);

    const { user, refreshPage, setRefreshPage } = useContext(GlobalContext);

    const [selectedCategoryId, setSelectedCategoryId] = useState(expenseData?.categoryId || '');
    const [selectedAccountId, setSelectedAccountId] = useState(expenseData?.accountId || '');


    useEffect(() => {
        setIsLoading(true);
        if (expenseData) {
            setAmount(expenseData.amount.toString());
            setType(expenseData.type);
            setTime(new Date(expenseData.time));
            setDescription(expenseData.description);
            setImage(expenseData.imageLink ? { uri: expenseData.imageLink } : null);
            setSelectedCategoryId(expenseData.categoryId || '');
            setSelectedAccountId(expenseData.accountId || '');
            setOldTime(new Date(expenseData.time));
        }
        setIsLoading(false);
    }, [expenseData]);

    //Separate Savings category
    const [savingCategories, setSavingCategories] = useState([]);
    const [otherCategories, setOtherCategories] = useState([]);

    useEffect(() => {
        const savingCats = allCategory.filter(category => category.categoryType === 'saving');
        const otherCats = allCategory.filter(category => category.categoryType !== 'saving');
        setSavingCategories(savingCats);
        setOtherCategories(otherCats);
    }, [allCategory]);


    const handleConfirm = (date) => {
        setTime(date);
        setDatePickerVisibility(false);
    };

    const handleAmountChange = (text) => {
        if (!isNaN(text) && parseFloat(text) >= 0) {
            setAmount(text);
        }
    };

    // Function to upload image to Firebase Storage
    const uploadImage = async (image) => {
        if (!image) return null;
    
        try {
            const uploadUri = image.uri;
            let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
    
            // Add timestamp to file name
            const extension = filename.split('.').pop(); 
            const name = filename.split('.').slice(0, -1).join('.');
            filename = name + Date.now() + '.' + extension;
    
            const storageRef = storage().ref(`receipts/${filename}`);
            await storageRef.putFile(uploadUri);
    
            const url = await storageRef.getDownloadURL();
            return url;
        } catch (error) {
            console.error("Error uploading image: ", error);
            // Handle the error, perhaps set a state to show an error message
            return null;
        }
    };

    

    // Add logic to handle adding the expense here
    const handleSaveExpense = async () => {
        setIsLoading(true);
        const selectedCategory = allCategory.find(c => c.id === selectedCategoryId);
        if (selectedCategory && selectedCategory.categoryType === 'saving' && type !== 'spend') {
            alert("For 'saving' category, the type must be 'spend'");
            setIsLoading(false);
            return;
        }
        const imageUrl = image && image.uri !== expenseData.imageLink ? await uploadImage(image) : expenseData.imageLink;
    
        const updatedExpense = {
            amount: parseFloat(amount),
            type,
            time: time.toISOString(),
            imageLink: imageUrl,
            description,
            categoryId: selectedCategoryId,
            accountId: selectedAccountId,
        };
        // check if the old year and new year are the same
        const oldYear = oldTime && oldTime.getFullYear();
        const newYear = time.getFullYear();
        if (oldYear !== newYear) {
            // delete the old expense
            await ExpenseService.deleteExpense(user.uid, oldYear ,expenseData.id);
            // create the new expense
            await ExpenseService.createExpense(user.uid, newYear, updatedExpense);
        } else {
            // update the expense
            await ExpenseService.updateExpense(user.uid, newYear, expenseData.id, updatedExpense);
        };
        setIsLoading(false);
        setRefreshPage(refreshPage + 1); // Refresh the page
        onClose(); // Close the modal
    };

    // Handle close
    const handleCancel = () => {
        setAmount('');
        setType('spend');
        setTime(new Date());
        setImage(null);
        setDescription('');
        onClose();
    };

    const handleLaunchCamera = () => {
        const options = {
            saveToPhotos: true,
            mediaType: 'photo',
            includeBase64: false,
        };

        launchCamera(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled camera picker');
            } else if (response.errorCode) {
                console.log('Camera error: ', response.errorMessage);
            } else {
                setImage(response.assets[0]);
            }
        });
    };

    const handleLaunchImageLibrary = () => {
        const options = {
            mediaType: 'photo',
            includeBase64: false,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                console.log('ImagePicker Error: ', response.errorMessage);
            } else {
                setImage(response.assets[0]);
            }
        });
    };


    //Delete
    const handleDeleteConfirmation = () => {
        Alert.alert(
            "Delete Expense",
            "Are you sure you want to delete this expense?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { 
                    text: "OK", 
                    onPress: () => handleDeleteExpense() 
                }
            ],
            { cancelable: false }
        );
    };
    
    const handleDeleteExpense = async () => {
        setIsLoading(true);
    
        try {
            // Delete the image from storage first
            if (expenseData.imageLink) {
                await deleteImageFromStorage(expenseData.imageLink);
            }
    
            // Then delete the expense object
            await ExpenseService.deleteExpense(user.uid, oldTime.getFullYear()  ,expenseData.id);
            console.log('Expense Deleted');
    
            setRefreshPage(refreshPage + 1); // Refresh the page
        } catch (error) {
            console.error('Error during expense deletion:', error);
            // Handle any errors (e.g., show an error message to the user)
        } finally {
            setIsLoading(false);
            onClose(); // Close the modal regardless of success or failure
        }
    };

    //delete the image
    const deleteImageFromStorage = async (imageUrl) => {
        if (!imageUrl) return;
    
        const imageRef = storage().refFromURL(imageUrl);
        try {
            await imageRef.delete();
            console.log('Image deleted successfully from storage');
        } catch (error) {
            console.error('Error deleting image from storage:', error);
            // Optionally, you might throw the error to handle it in the calling function
            throw error;
        }
    };
    


    return (
        <Modal visible={isVisible} animationType="slide" onRequestClose={onClose}>
            <View style={styles.modalView}>
                {isLoading ? (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator size="large" color="#DDF2FD" />
                            <Text style={styles.loadingText}>Loading...</Text>
                        </View>
                    ) : (
                        <ScrollView>
                            <Text style={styles.title}>Edit Expense</Text>

                            <View style={styles.sectionFrame}>
                                <Text style={styles.sectionTitle}>Amount</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Amount"
                                    keyboardType="numeric"
                                    value={amount}
                                    onChangeText={handleAmountChange}
                                />
                            </View>
                            
                            <View style={styles.sectionFrame}>
                                <Text style={styles.sectionTitle}>Type</Text>
                                <View style={styles.buttonRow}>
                                    <TouchableOpacity style={type === 'spend' ? styles.activeButton : styles.button} onPress={() => setType('spend')}>
                                        <Text style={styles.buttonText}>Spend</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={type === 'income' ? styles.activeButton : styles.button} onPress={() => setType('income')}>
                                        <Text style={styles.buttonText}>Income</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.sectionFrame}>
                                <Text style={styles.sectionTitle}>Time</Text>
                                <TouchableOpacity onPress={() => setDatePickerVisibility(true)}>
                                    <Text style={styles.dateText}>Select Time: {time.toLocaleString()}</Text>
                                </TouchableOpacity>
                                <DateTimePickerModal
                                    isVisible={isDatePickerVisible}
                                    mode="datetime"
                                    onConfirm={handleConfirm}
                                    onCancel={() => setDatePickerVisibility(false)}
                                />
                            </View>

                            <View style={styles.sectionFrame}>
                                <Text style={styles.sectionTitle}>Image</Text>
                                <View style={styles.buttonRow}>
                                    <TouchableOpacity style={styles.button} onPress={handleLaunchCamera}>
                                        <Text style={styles.buttonText}>Camera</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.button} onPress={handleLaunchImageLibrary}>
                                        <Text style={styles.buttonText}>Gallery</Text>
                                    </TouchableOpacity>
                                </View>
                                {image && (
                                    <TouchableOpacity style={styles.image}>
                                        <Image
                                            source={{ uri: image.uri }}
                                            style={{ width: 400, height: 400, margin: 10 }}
                                        />
                                    </TouchableOpacity>
                                )}
                                {!image && (
                                    <Text style={styles.sectionTitle}>No Image Selected</Text>
                                )
                                }
                            </View>

                            

                            <View style={styles.sectionFrame}>
                                <Text style={styles.sectionTitle}>Description</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Description"
                                    keyboardType="default"
                                    value={description}
                                    onChangeText={(text) => setDescription(text)}
                                />
                            </View>

                            {savingCategories.length > 0 && (
                                <View style={styles.sectionFrame}>
                                    <Text style={styles.sectionTitle}>Saving Category</Text>
                                    <View style={styles.buttonGroup}>
                                        {savingCategories.map(category => (
                                            <TouchableOpacity
                                                key={category.id}
                                                style={selectedCategoryId === category.id ? styles.activeButton : styles.button}
                                                onPress={() => setSelectedCategoryId(category.id)}
                                            >
                                                <View style={styles.buttonIconHolder}>
                                                    <Text style={styles.buttonTextIcon}>{category.categoryName}</Text>
                                                    <View style={styles.icon}>
                                                        {getCategoryIcon(category.categoryIcon, 30, '#DDF2FD')}
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            )}

                            {otherCategories.length > 0 && (
                                <View style={styles.sectionFrame}>
                                    <Text style={styles.sectionTitle}>Other Categories</Text>
                                    <View style={styles.buttonGroup}>
                                        {otherCategories.map(category => (
                                            <TouchableOpacity
                                                key={category.id}
                                                style={selectedCategoryId === category.id ? styles.activeButton : styles.button}
                                                onPress={() => setSelectedCategoryId(category.id)}
                                            >
                                                <View style={styles.buttonIconHolder}>
                                                    <Text style={styles.buttonTextIcon}>{category.categoryName}</Text>
                                                    <View style={styles.icon}>
                                                        {getCategoryIcon(category.categoryIcon, 30, '#DDF2FD')}
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            )}

                            <View style={styles.sectionFrame}>
                                <Text style={styles.sectionTitle}>Account</Text>
                                <View style={styles.buttonGroup}>
                                    {allAccount.map(account => (
                                        <TouchableOpacity
                                            key={account.id}
                                            style={selectedAccountId === account.id ? styles.activeButton : styles.button}
                                            onPress={() => setSelectedAccountId(account.id)}
                                        >
                                            <View style={styles.buttonIconHolder}>
                                                <Text style={styles.buttonTextIcon}>{account.accountName}</Text>
                                                <View style={styles.icon}>
                                                    {getAccountIcon(account.accountIcon, 30, '#DDF2FD')}
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>




                            <View style={styles.buttonRowEnd}>
                                <TouchableOpacity style={styles.button} onPress={handleSaveExpense}>
                                    <Text style={styles.buttonText}>Save</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.button} onPress={handleCancel}>
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={handleDeleteConfirmation}
                            >
                                <Text style={styles.deleteButtonText}>Delete Expense</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    )}
            </View>
        </Modal>
    );
};


const styles = StyleSheet.create({
    modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 0,
        backgroundColor: '#164863',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 10,
        color: '#DDF2FD',
        marginBottom: 50,
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        width: '90%',
        backgroundColor: '#427D9D',
        marginBottom: 50,
        color: '#DDF2FD',
        borderRadius: 5,
    },
    button: {
        backgroundColor: '#427D9D',
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
        alignItems: 'center',
        width: '40%',

    },
    activeButton: {
        backgroundColor: '#164863',
        borderColor: '#9BBEC8',
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
        alignItems: 'center',
        width: '40%',
    },

    buttonText: {
        color: '#DDF2FD',
        fontSize: 16,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 30,
    },
    buttonRowEnd: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    buttonGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 20,
    },
    dateText: {
        margin: 30,
        fontSize: 20,
        color: '#9BBEC8',
    },
    sectionFrame: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#9BBEC8',
        marginBottom: 50,
        marginHorizontal: 16,
        paddingTop: 30,
        position: 'relative',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#9BBEC8',
        position: 'absolute',
        top: -25,
        left: 10,
        paddingHorizontal: 10,
        backgroundColor: '#164863',
    },
    image: {
        alignItems: 'center',
        borderRadius: 10,
    },
    deleteButton: {
        backgroundColor: 'red',
        opacity: 0.7,
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
        alignItems: 'center',
        width: '90%',
        alignSelf: 'center',
    },
    deleteButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    buttonIconHolder: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonTextIcon: {
        flex:8,
        color: '#DDF2FD',
        fontSize: 16,
        marginRight: 10,
    },
    icon: {
        flex: 2,
        width: 30,
        height: 30,
    },
});


export default EditExpense;
