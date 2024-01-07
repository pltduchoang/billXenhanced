// componets/dashboard/AddExpense.jsx

import React, { useState, useContext, useEffect } from 'react';
import { Modal, View, ScrollView, Text, TextInput, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ExpenseService from '../../services/ExpenseService';
import { GlobalContext } from '../../context/GlobalContext';
import storage from '@react-native-firebase/storage';


import { getCategoryIcon } from '../iconLibrary/CategoryIconLibrary'
import { getAccountIcon } from '../iconLibrary/AccountIconLibrary';


const AddExpense = ({ isVisible, onClose, allCategory, allAccount }) => {
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('spend'); // Default to 'spend'
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [time, setTime] = useState(new Date());
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);

    const [isLoading, setIsLoading] = useState(false);

    const { user, refreshPage, setRefreshPage, currentYear } = useContext(GlobalContext);


    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [selectedAccountId, setSelectedAccountId] = useState('');

    // Separate categories into 'saving' and 'other' categories
    const [savingCategories, setSavingCategories] = useState([]);
    const [otherCategories, setOtherCategories] = useState([]);

    useEffect(() => {
        // Reset state when modal opens
        setAmount('');
        setType('spend');
        setTime(new Date());
        setDescription('');
        setImage(null);
        // Set default category and account if available
        setSelectedCategoryId(allCategory.length > 0 ? allCategory[0].id : '');
        setSelectedAccountId(allAccount.length > 0 ? allAccount[0].id : '');


    }, [isVisible, allCategory, allAccount]);

    
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
    const handleAddExpense = async () => {
        setIsLoading(true);
        const imageUrl = await uploadImage(image);
        const newExpense = {
            amount: parseFloat(amount),
            type,
            time: time.toISOString(),
            imageLink: imageUrl || null,
            description,
            categoryId: selectedCategoryId,
            accountId: selectedAccountId,
        };
        if (isSavingCategory && type !== 'spend') {
            alert("For 'saving' category, the type must be 'spend'");
            setIsLoading(false);
            return;
        }
        const year = time.getFullYear();
        await ExpenseService.createExpense(user.uid, year ,newExpense);
        setIsLoading(false);
        setRefreshPage(refreshPage + 1); // Refresh the page
        onClose(); // Close the modal
    };

    // Handle close
    const handleCancel = () => {
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

    //select saving category logic
    // Add a new state to track if the selected category is 'saving'
    const [isSavingCategory, setIsSavingCategory] = useState(false);

    

    useEffect(() => {
        const savingCategories = allCategory.filter(category => category.categoryType === 'saving');
        const otherCategories = allCategory.filter(category => category.categoryType !== 'saving');
        setSavingCategories(savingCategories);
        setOtherCategories(otherCategories);
    }, [allCategory]);


    // Rename the function to handleCategorySelection
    const handleCategorySelection = (id) => {
        const category = allCategory.find(c => c.id === id);
        if (category && category.categoryType === 'saving') {
            setType('spend'); // Lock the type to 'spend' if 'saving' category is selected
            setIsSavingCategory(true);
        } else {
            setIsSavingCategory(false);
        }
        setSelectedCategoryId(id); // Correctly using the useState setter here
    };

    return (
        <Modal visible={isVisible} animationType="slide" onRequestClose={onClose}>
            <View style={styles.modalView}>
                {isLoading ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color="#DDF2FD" />
                    </View>
                    ) : (
                        <ScrollView>
                            <Text style={styles.title}>Add Expense</Text>

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
                                    <Text style={styles.imageText}>No image selected</Text>
                                )}
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
                                                onPress={() => handleCategorySelection(category.id)}
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
                                                onPress={() => handleCategorySelection(category.id)}
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
                                <TouchableOpacity style={styles.button} onPress={handleAddExpense}>
                                    <Text style={styles.buttonText}>Save</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.button} onPress={handleCancel}>
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
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
        padding: 10,
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
        borderRadius: 5,
        color: '#DDF2FD',
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
        marginBottom: 50,
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
    },
    dateText: {
        margin: 30,
        fontSize: 20,
        color: '#9BBEC8',
    },
    sectionFrame: {
        borderRadius: 10,
        paddingVertical: 20,
        marginBottom: 50,
        borderColor: '#DDF2FD',
        borderWidth: 1,
        position: 'relative',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#9BBEC8',
        margin: 10,
        position: 'absolute',
        top: -25,
        left: 10,
        backgroundColor: '#164863',
        paddingHorizontal: 10,
    },
    image: {
        alignItems: 'center',
        borderRadius: 10,
    },
    imageText: {
        fontSize: 16,
        color: '#DDF2FD',
        marginBottom: 50,
        textAlign: 'center',
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

export default AddExpense;
