import React, { useMemo, useState } from "react";
import {
    View,
    StyleSheet,
    FlatList,
    ActivityIndicator,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import COLORS from "../../constants/colors";

import { useFavorite } from "../../context/FavoriteContext";

import useNewestProductsViewModel from "../../viewmodels/useNewestProductsViewModel";

import ProductCard from "../../components/home/ProductCard";

import ProductHeader from "../../components/product/ProductHeader";
import BannerSlider from "../../components/home/BannerSlider";
import BrandProductFilter from "../../components/brand/BrandProductFilter";

export default function AllProductsByBrandScreen({
    navigation,
    route,
}) {
    const brand = route?.params?.brand;
    const safeBrandName = brand?.name || "Thương hiệu";
    const safeBrandId = brand?._id;

    const { products, loading } =
        useNewestProductsViewModel();

    const {
        favoriteIds,
        toggleFavorite,
    } = useFavorite();

    const [selectedCategory, setSelectedCategory] =
        useState("Tất cả");

    // =============================
    // Chỉ lấy sản phẩm của hãng
    // =============================

    const brandProducts = useMemo(() => {
        if (!Array.isArray(products)) {
            return [];
        }

        return products.filter((item) => {
            if (!item) return false;
            return safeBrandId ? item.brand?._id === safeBrandId : false;
        });
    }, [products, safeBrandId]);

    // =============================
    // Lọc category
    // =============================

    const filteredProducts = useMemo(() => {
        if (selectedCategory === "Tất cả") {
            return brandProducts;
        }

        return brandProducts.filter(
            (item) =>
                item.category?.name ===
                selectedCategory
        );
    }, [
        brandProducts,
        selectedCategory,
    ]);

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
        <SafeAreaView
            style={styles.container}
            edges={["top"]}
        >
            <ProductHeader
                navigation={navigation}
                title={safeBrandName}
            />

            <FlatList
                data={filteredProducts}
                keyExtractor={(item, index) => item?._id || `brand-product-${index}`}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.list}
                ListHeaderComponent={
                    <>
                        <BannerSlider />

                        <BrandProductFilter
                            brandName={safeBrandName}
                            products={brandProducts}
                            selectedCategory={
                                selectedCategory
                            }
                            onSelectCategory={
                                setSelectedCategory
                            }
                        />
                    </>
                }
                renderItem={({ item }) => (
                    <View style={{ flex: 1, marginHorizontal: 16 }}>
                        <ProductCard
                            style={{}}
                            item={item}
                            favoriteIds={favoriteIds}
                            onToggleFavorite={
                                toggleFavorite
                            }
                        />
                    </View>
                )}
            />
        </SafeAreaView>
    );
}

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
        paddingBottom: 30,
    },

    row: {
        justifyContent: "space-between",
        marginBottom: 18,
    },
});