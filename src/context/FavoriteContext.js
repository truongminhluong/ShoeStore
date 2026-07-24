import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import {
    getFavorites,
    addFavorite,
    removeFavorite,
    clearFavorites,
} from "../services/favoriteService";

const FavoriteContext = createContext({
    favorites: [],
    favoriteIds: [],
    loading: false,
    fetchFavorites: async () => { },
    addToFavorite: async () => { },
    removeFromFavorite: async () => { },
    toggleFavorite: async () => { },
    clearAllFavorites: async () => { },
});

export const FavoriteProvider = ({ children }) => {
    const [favoriteIds, setFavoriteIds] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(false);

    // ===========================
    // LẤY DANH SÁCH YÊU THÍCH
    // ===========================

    const fetchFavorites = async () => {
        try {
            setLoading(true);

            const response = await getFavorites();

            const products = Array.isArray(response?.data?.products)
                ? response.data.products
                : Array.isArray(response?.products)
                    ? response.products
                    : Array.isArray(response?.data)
                        ? response.data
                        : Array.isArray(response)
                            ? response
                            : [];

            setFavorites(products);

            setFavoriteIds(
                products.map((item) => item._id)
            );

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    // ===========================
    // THÊM YÊU THÍCH
    // ===========================

    const addToFavorite = async (productId) => {
        try {
            await addFavorite(productId);

            await fetchFavorites();
        } catch (error) {
            console.log(error);
        }
    };

    // ===========================
    // XOÁ YÊU THÍCH
    // ===========================

    const removeFromFavorite = async (productId) => {
        try {
            await removeFavorite(productId);

            await fetchFavorites();
        } catch (error) {
            console.log(error);
        }
    };
    // ===========================
    // CLEAR FAVORITES
    // ===========================

    const clearAllFavorites = async () => {
        try {
            await clearFavorites();

            setFavorites([]);
            setFavoriteIds([]);

        } catch (error) {
            console.log(error.response?.data || error.message);
        }
    };

    // ===========================
    // TOGGLE
    // ===========================

    const toggleFavorite = async (productId) => {
        if (favoriteIds.includes(productId)) {
            await removeFromFavorite(productId);
        } else {
            await addToFavorite(productId);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    return (
        <FavoriteContext.Provider
            value={{
                favorites,
                favoriteIds,
                loading,

                fetchFavorites,

                addToFavorite,
                removeFromFavorite,
                toggleFavorite,

                clearAllFavorites,
            }}
        >
            {children}
        </FavoriteContext.Provider>
    );


};

export const useFavorite = () => useContext(FavoriteContext);