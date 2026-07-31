import React, { useMemo, useState } from "react";
import {
    StyleSheet,
    FlatList,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import COLORS from "../../constants/colors";

import ProductHeader from "../../components/product/ProductHeader";
import ProductFilterBar from "../../components/product/ProductFilterBar";
import ProductCard from "../../components/home/ProductCard";

import useNewestProductsViewModel from "../../viewmodels/useNewestProductsViewModel";

import { useFavorite } from "../../context/FavoriteContext";

const AllProductsScreen = ({ navigation }) => {

    const { products, loading } =
        useNewestProductsViewModel();

    const {
        favoriteIds,
        toggleFavorite,
    } = useFavorite();

    const [selectedCategory, setSelectedCategory] =
        useState("Tất cả");

    // Lọc sản phẩm
    const filteredProducts = useMemo(() => {
        if (selectedCategory === "Tất cả") {
            return products;
        }

        return products.filter(
            (item) =>
                item.category?.name === selectedCategory
        );
    }, [products, selectedCategory]);

    if (loading) {
        return (
            <SafeAreaView style={styles.loading}>
                <ActivityIndicator
                    size="large"
                    color={COLORS.primary}
                />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>

            <ProductHeader navigation={navigation} />

            <ProductFilterBar
                total={products.length}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
            // onFilterPress={() => { }}
            // onSortPress={() => { }}
            />

            <FlatList
                data={filteredProducts}
                keyExtractor={(item) => item._id}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.list}
                columnWrapperStyle={styles.row}
                renderItem={({ item }) => (
                    <ProductCard
                        item={item}
                        favoriteIds={favoriteIds}
                        onToggleFavorite={toggleFavorite}
                    />
                )}
            />

        </SafeAreaView>
    );
};

export default AllProductsScreen;

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },

    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    list: {
        paddingHorizontal: 16,
        paddingBottom: 30,
    },

    row: {
        justifyContent: "space-between",
        marginBottom: 16,
    },

});