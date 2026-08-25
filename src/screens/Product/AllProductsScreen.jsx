import React, { useMemo, useState } from "react";
import {
    View, Text, TouchableOpacity, ScrollView,
    StyleSheet,
    FlatList,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import COLORS from "../../constants/colors";

import ProductHeader from "../../components/product/ProductHeader";
import ProductFilterBar from "../../components/product/ProductFilterBar";
import ProductCard from "../../components/home/ProductCard";
import SearchBar from "../../components/home/SearchBar";

import useNewestProductsViewModel from "../../viewmodels/useNewestProductsViewModel";

import { useFavorite } from "../../context/FavoriteContext";

const normalizeText = (value) =>
    String(value || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

const AllProductsScreen = ({ navigation, route }) => {

    const { products, loading } =
        useNewestProductsViewModel();

    const {
        favoriteIds,
        toggleFavorite,
    } = useFavorite();

    // =========================
    // SEARCH TEXT
    // =========================

    const [searchText, setSearchText] = useState(
        route?.params?.searchText || ""
    );

    const [selectedCategory, setSelectedCategory] =
        useState("Tất cả");


    const filteredProducts = useMemo(() => {
        const keyword = normalizeText(searchText);

        return products.filter((item) => {

            // =========================
            // TÌM KIẾM
            // =========================

            const searchContent = normalizeText(`
            ${item?.name || ""}
            ${item?.brand?.name || ""}
            ${item?.category?.name || ""}
        `);

            const matchesSearch =
                !keyword ||
                searchContent.includes(keyword);

            // =========================
            // CATEGORY
            // =========================

            const matchesCategory =
                selectedCategory === "Tất cả" ||
                item?.category?.name === selectedCategory;

            return matchesSearch && matchesCategory;
        });

    }, [
        products,
        searchText,
        selectedCategory,
    ]);

    // =========================
    // XÓA SEARCH
    // =========================

    const handleClearSearch = () => {
        setSearchText("");
    };


    // =========================
    // XÓA TOÀN BỘ FILTER
    // =========================

    const clearFilters = () => {

        setSearchText("");

        setSelectedCategory("Tất cả");
    };


    // =========================
    // LOADING
    // =========================

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

            {/* SEARCH */}

            <SearchBar

                value={searchText}
                onChangeText={setSearchText}
                onClear={handleClearSearch}

                onFilterPress={clearFilters}

                hasActiveFilters={
                    Boolean(
                        searchText.trim() ||
                        selectedCategory !== "Tất cả"
                    )
                }
            />


            <ProductFilterBar
                total={products.length}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
            // onFilterPress={() => { }}
            // onSortPress={() => { }}
            />



            {/* KHÔNG TÌM THẤY */}

            {filteredProducts.length === 0 ? (

                <View style={styles.emptyContainer}>

                    <Text style={styles.emptyTitle}>
                        Không tìm thấy sản phẩm
                    </Text>

                    {/* <Text style={styles.emptyText}>
                        Không có sản phẩm phù hợp với từ khóa "{searchText}"
                    </Text> */}

                </View>

            ) : (

                <FlatList
                    data={filteredProducts}

                    keyExtractor={(item) =>
                        item._id
                    }

                    numColumns={2}

                    showsVerticalScrollIndicator={false}

                    contentContainerStyle={
                        styles.list
                    }

                    columnWrapperStyle={
                        styles.row
                    }

                    renderItem={({ item }) => (

                        <ProductCard
                            item={item}

                            favoriteIds={
                                favoriteIds
                            }

                            onToggleFavorite={
                                toggleFavorite
                            }
                        />

                    )}
                />

            )}
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
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 30,
        // paddingTop: 30,
    },

    emptyTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: COLORS.black,
        marginBottom: 8,
    },

    emptyText: {
        fontSize: 14,
        color: "#777",
        textAlign: "center",
        lineHeight: 22,
    },

});