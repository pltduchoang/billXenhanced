//scr/components/iconLibrary/CategoryIconLibrary.jsx

// scr/components/iconLibrary/CategoryIconLibrary.jsx

import React from 'react';
// Import all your SVG icons
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

const CategoryIconLibrary = {
    'account-heart-outline': AccountHeartOutline,
    "airport": Airport,
    "baguette": Baguette,
    "beach": Beach,
    "bed-outline": BedOutline,
    "bow-arrow": BowArrow,
    "car-wrench": CarWrench,
    "cellphone": Cellphone,
    "church-outline": ChurchOutline,
    "coffee": Coffee,
    "credit-card-fast-outline": CreditCardFastOutline,
    "ev-station": EvStation,
    "flower-tulip-outline": FlowerTulipOutline,
    "forest-outline": ForestOutline,
    "fruit-grapes-outline": FruitGrapesOutline,
    "glass-cocktail": GlassCocktail,
    "hospital-box-outline": HospitalBoxOutline,
    "movie-star": MovieStar,
    "silverware-variant": SilverwareVariant,
    "tshirt-crew": TshirtCrew,
    "watch": Watch,
    }

    export const getCategoryIcon = (iconName, size = 30, color = '#DDF2FD') => {
        const IconComponent = CategoryIconLibrary[iconName];
        return IconComponent ? <IconComponent width={size} height={size} fill={color} /> : null;
    };
