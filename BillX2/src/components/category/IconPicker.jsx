import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

// Import your SVG icons here
import AccountHeartOutline from '../../icons/category/account-heart-outline.svg';
import Airport from '../../icons/category/airport.svg';
import Baguette from '../../icons/category/baguette.svg';
import Beach from '../../icons/category/beach.svg';
import BedOutline from '../../icons/category/bed-outline.svg';
import BowArrow from '../../icons/category/bow-arrow.svg';
import CarWrench from '../../icons/category/car-wrench.svg';
import Cellphone from '../../icons/category/cellphone.svg';
import ChurchOutline from '../../icons/category/church-outline.svg';
import Coffee from '../../icons/category/coffee.svg';
import CreditCardFastOutline from '../../icons/category/credit-card-fast-outline.svg';
import EvStation from '../../icons/category/ev-station.svg';
import FlowerTulipOutline from '../../icons/category/flower-tulip-outline.svg';
import ForestOutline from '../../icons/category/forest-outline.svg';
import FruitGrapesOutline from '../../icons/category/fruit-grapes-outline.svg';
import GlassCocktail from '../../icons/category/glass-cocktail.svg';
import HospitalBoxOutline from '../../icons/category/hospital-box-outline.svg';
import MovieStar from '../../icons/category/movie-star.svg';
import SilverwareVariant from '../../icons/category/silverware-variant.svg';
import TshirtCrew from '../../icons/category/tshirt-crew.svg';
import Watch from '../../icons/category/watch.svg';

const icons = [
    { name: 'account-heart-outline', component: AccountHeartOutline },
    { name: 'airport', component: Airport },
    { name: 'baguette', component: Baguette },
    { name: 'beach', component: Beach },
    { name: 'bed-outline', component: BedOutline },
    { name: 'bow-arrow', component: BowArrow },
    { name: 'car-wrench', component: CarWrench },
    { name: 'cellphone', component: Cellphone },
    { name: 'church-outline', component: ChurchOutline },
    { name: 'coffee', component: Coffee },
    { name: 'credit-card-fast-outline', component: CreditCardFastOutline },
    { name: 'ev-station', component: EvStation },
    { name: 'flower-tulip-outline', component: FlowerTulipOutline },
    { name: 'forest-outline', component: ForestOutline },
    { name: 'fruit-grapes-outline', component: FruitGrapesOutline },
    { name: 'glass-cocktail', component: GlassCocktail },
    { name: 'hospital-box-outline', component: HospitalBoxOutline },
    { name: 'movie-star', component: MovieStar },
    { name: 'silverware-variant', component: SilverwareVariant },
    { name: 'tshirt-crew', component: TshirtCrew },
    { name: 'watch', component: Watch },
];

const IconPicker = ({ onSelect, currentIcon }) => {
    const [selectedIcon, setSelectedIcon] = useState(currentIcon || icons[0].name);

    useEffect(() => {
        if (!currentIcon) {
            onSelect(icons[0].name); // Select the first icon by default
        }
    }, [currentIcon, onSelect]);

    const handleIconSelect = (iconName) => {
        setSelectedIcon(iconName);
        onSelect(iconName);
    };

    return (
        <View style={styles.container}>
            {icons.map((icon, index) => (
                <TouchableOpacity 
                    key={index} 
                    style={[styles.iconWrapper, selectedIcon === icon.name && styles.selectedIcon]}
                    onPress={() => handleIconSelect(icon.name)}>
                    {/* Conditionally apply the fill color */}
                    <icon.component 
                        width={50} 
                        height={50} 
                        fill={selectedIcon === icon.name ? '#FFFFFF' : '#427D9D'} 
                    />
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
        width: '22%',
        justifyContent: 'center',
        alignItems: 'center',
    },

    // ... other styles
});

export default IconPicker;
