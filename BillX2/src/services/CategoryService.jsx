// services/CategoryService.js
import { firestore } from './Firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, onSnapshot , arrayUnion} from 'firebase/firestore';

const CategoryService = {
    // Subscribe to live updates of categories
    getCategoriesLive: (userId, onCategoriesUpdate) => {
        const categoryCollectionRef = collection(firestore, `users/${userId}/categories`);

        return onSnapshot(categoryCollectionRef, (querySnapshot) => {
            const categories = [];
            querySnapshot.forEach((doc) => {
                categories.push({ id: doc.id, ...doc.data() });
            });
            onCategoriesUpdate(categories); // Callback function to handle the updated data
        });
    },

    // Create a new category
    createCategory: async (userId, categoryData) => {
        const categoryCollectionRef = collection(firestore, `users/${userId}/categories`);
        try {
            const docRef = await addDoc(categoryCollectionRef, {
                ...categoryData,
                createdAt: new Date() // Add a creation timestamp
            });
            return docRef.id;
        } catch (error) {
            console.error("Error adding category: ", error);
        }
    },

    // Get all categories for a user
    getCategories: async (userId) => {
        const categories = [];
        const categoryCollectionRef = collection(firestore, `users/${userId}/categories`);
        try {
            const querySnapshot = await getDocs(categoryCollectionRef);
            querySnapshot.forEach((doc) => {
                categories.push({ id: doc.id, ...doc.data() });
            });
            return categories;
        } catch (error) {
            console.error("Error getting categories: ", error);
        }
    },

    // Update a category
    updateCategory: async (userId, categoryId, updatedData) => {
        const categoryDocRef = doc(firestore, `users/${userId}/categories/${categoryId}`);
        try {
            await updateDoc(categoryDocRef, updatedData);
        } catch (error) {
            console.error("Error updating category: ", error);
        }
    },

    // Delete a category
    deleteCategory: async (userId, categoryId) => {
        const categoryDocRef = doc(firestore, `users/${userId}/categories/${categoryId}`);
        try {
            await deleteDoc(categoryDocRef);
        } catch (error) {
            console.error("Error deleting category: ", error);
        }
    },

    // Method to add an expense ID to a category's records
    addExpenseToCategory: async (userId, categoryId, expenseId) => {
        try {
            const categoryDocRef = doc(firestore, `users/${userId}/categories/${categoryId}`);
            await updateDoc(categoryDocRef, {
                records: arrayUnion(expenseId) // Add the expense ID to the records array
            });
        } catch (error) {
            console.error("Error adding expense to category: ", error);
        }
    }
};

export default CategoryService;
