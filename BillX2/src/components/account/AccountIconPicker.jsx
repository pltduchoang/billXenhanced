import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { getAccountIcon } from '../iconLibrary/AccountIconLibrary'; // Adjust the path as necessary

const accountIcons = [
    'account-credit-card-outline',
    'cash',
    'checkbook',
    'credit-card-outline',
    'finance',
    'invoice-text-outline',
    'safe',
    'wallet-bifold-outline',
];

const AccountIconPicker = ({ onSelect, currentIcon }) => {
    const [selectedIcon, setSelectedIcon] = useState(currentIcon || accountIcons[0]);

    useEffect(() => {
        if (!currentIcon || currentIcon === '') {
            onSelect(accountIcons[0]); // Select the first icon by default
        }
    }, [currentIcon, onSelect]);

    const handleIconSelect = (iconName) => {
        setSelectedIcon(iconName);
        onSelect(iconName);
    };

    return (
        <View style={styles.container}>
            {accountIcons.map((iconName, index) => (
                <TouchableOpacity 
                    key={index} 
                    style={[styles.iconWrapper, selectedIcon === iconName && styles.selectedIcon]}
                    onPress={() => handleIconSelect(iconName)}>
                    {getAccountIcon(iconName, 50, selectedIcon === iconName ? '#FFFFFF' : '#427D9D')}
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 20,
        padding: 10,
        backgroundColor: '#164863',
    },
    iconWrapper: {
        padding: 10,
        margin: 5,
        width: '22%', // Approximately 4 icons per row
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedIcon: {

    },
    // ... other styles you may need
});

export default AccountIconPicker;
