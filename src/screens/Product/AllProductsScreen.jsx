import React, { useMemo, useState } from "react";
import {
    View,
    Text,
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

// ==========================================
// NORMALIZE TEXT
// ==========================================

const normalizeText = (value) =>
    String(value || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

// ==========================================
// SCREEN
// ==========================================

const AllProductsScreen = ({ navigation, route }) => {

    // ==========================================
    // PRODUCTS
    // ==========================================

    const {
        products,
        loading,
    } = useNewestProductsViewModel();

    // ==========================================
    // FAVORITE
    // ==========================================

    const {
        favoriteIds,
        toggleFavorite,
    } = useFavorite();

    // ==========================================
    // SEARCH
    // ==========================================

    const [searchText, setSearchText] = useState(
        route?.params?.searchText || ""
    );

    // ==========================================
    // CATEGORY
    // ==========================================

    const [selectedCategory, setSelectedCategory] =
        useState("Tất cả");

    // ==========================================
    // FILTER PRODUCTS
    // ==========================================

    const filteredProducts = useMemo(() => {

        const keyword = normalizeText(searchText);

        return products.filter((item) => {

            // -----------------------------
            // SEARCH
            // -----------------------------

            const searchContent = normalizeText(
                `
                ${item?.name || ""}
                ${item?.brand?.name || ""}
                ${item?.category?.name || ""}
                `
            );

            const matchesSearch =
                !keyword ||
                searchContent.includes(keyword);

            // -----------------------------
            // CATEGORY
            // -----------------------------

            const matchesCategory =
                selectedCategory === "Tất cả" ||
                item?.category?.name === selectedCategory;

            return (
                matchesSearch &&
                matchesCategory
            );
        });

    }, [
        products,
        searchText,
        selectedCategory,
    ]);

    // ==========================================
    // CLEAR SEARCH
    // ==========================================

    const handleClearSearch = () => {
        setSearchText("");
    };

    // ==========================================
    // CLEAR FILTER
    // ==========================================

    const clearFilters = () => {
        setSearchText("");
        setSelectedCategory("Tất cả");
    };

    // ==========================================
    // LOADING
    // ==========================================

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

    // ==========================================
    // RENDER
    // ==========================================

    return (
        <SafeAreaView
            style={styles.container}
            edges={["top"]}
        >

            {/* HEADER */}

            <ProductHeader
                navigation={navigation}
            />

            {/* SEARCH */}

            <SearchBar
                value={searchText}
                onChangeText={setSearchText}
                onClear={handleClearSearch}
                onSearch={() => { }}
                hasActiveFilters={
                    Boolean(
                        searchText.trim() ||
                        selectedCategory !== "Tất cả"
                    )
                }
            />

            {/* CATEGORY */}

            <ProductFilterBar
                total={filteredProducts.length}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
            />

            {/* ==========================================
                PRODUCT LIST
            ========================================== */}

            <FlatList
                data={filteredProducts}

                keyExtractor={(item) =>
                    item._id
                }

                numColumns={2}

                showsVerticalScrollIndicator={false}

                // Quan trọng
                style={styles.flatList}

                // Không căn giữa theo chiều dọc
                contentContainerStyle={styles.list}

                columnWrapperStyle={styles.row}

                renderItem={({ item }) => (
                    <ProductCard
                        item={item}
                        favoriteIds={favoriteIds}
                        onToggleFavorite={
                            toggleFavorite
                        }
                    />
                )}

                // ==========================================
                // EMPTY
                // ==========================================

                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>

                        <Text style={styles.emptyTitle}>
                            Không tìm thấy sản phẩm
                        </Text>

                        {searchText.trim() ? (
                            <Text style={styles.emptyText}>
                                Không có sản phẩm phù hợp với từ khóa
                                {" "}
                                "{searchText}"
                            </Text>
                        ) : (
                            <Text style={styles.emptyText}>
                                Không có sản phẩm trong danh mục này
                            </Text>
                        )}

                    </View>
                )}
            />

        </SafeAreaView>
    );
};

export default AllProductsScreen;

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({

    // ==========================================
    // CONTAINER
    // ==========================================

    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },

    // ==========================================
    // LOADING
    // ==========================================

    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    // ==========================================
    // FLATLIST
    // ==========================================

    flatList: {
        flex: 1,
    },

    list: {
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 30,

        // Không được dùng:
        // flexGrow: 1
        // justifyContent: "center"
    },

    // ==========================================
    // ROW
    // ==========================================

    row: {
        justifyContent: "space-between",
        marginBottom: 16,
    },

    // ==========================================
    // EMPTY
    // ==========================================

    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 30,
        paddingTop: 80,
    },

    emptyTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: COLORS.black,
        marginBottom: 8,
        textAlign: "center",
    },

    emptyText: {
        fontSize: 14,
        color: "#777",
        textAlign: "center",
        lineHeight: 22,
    },

});