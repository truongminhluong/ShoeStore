import React, { useMemo } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import COLORS from "../../constants/colors";
import FONTS from "../../constants/fonts";

export default function BrandProductFilter({
    brandName,
    products = [],
    selectedCategory,
    onSelectCategory,
    onFilterPress,
}) {
    // Lấy danh sách category từ sản phẩm
    const categories = useMemo(() => {
        const map = new Map();

        products.forEach((item) => {
            if (item.category) {
                map.set(item.category._id, item.category);
            }
        });

        return [
            {
                _id: "all",
                name: "Tất cả",
            },
            ...Array.from(map.values()),
        ];
    }, [products]);

    return (
        <View style={styles.container}>


            {/* Category */}

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryContainer}
            >
                {categories.map((item) => (
                    <TouchableOpacity
                        key={item._id}
                        style={[
                            styles.categoryButton,

                            selectedCategory === item.name &&
                            styles.activeCategory,
                        ]}
                        onPress={() =>
                            onSelectCategory(item.name)
                        }
                    >
                        <Text
                            style={[
                                styles.categoryText,

                                selectedCategory === item.name &&
                                styles.activeText,
                            ]}
                        >
                            {item.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>


            {/* Tiêu đề */}

            <View style={styles.header}>
                <View>

                    <Text style={styles.count}>
                        <Text style={{ fontSize: 16, fontWeight: 700, color: "black" }}>Hiển thị : </Text>
                        {products.length} sản phẩm
                    </Text>
                </View>

                {/* <TouchableOpacity
                    style={styles.filterButton}
                    onPress={onFilterPress}
                >
                    <Ionicons
                        name="options-outline"
                        size={18}
                        color={COLORS.primary}
                    />

                    <Text style={styles.filterText}>
                        Lọc
                    </Text>
                </TouchableOpacity> */}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        marginBottom: 10,
    },

    header: {
        paddingHorizontal: 16,

        flexDirection: "row",

        justifyContent: "space-between",

        alignItems: "center",
    },

    title: {
        fontSize: 28,
        fontFamily: FONTS.bold,
        color: COLORS.black,
    },

    count: {
        marginTop: 4,

        color: "#666",

        fontSize: 14,

        fontFamily: FONTS.medium,
    },

    filterButton: {
        flexDirection: "row",

        alignItems: "center",

        backgroundColor: "#EEF3FF",

        borderRadius: 12,

        paddingHorizontal: 14,

        height: 40,
    },

    filterText: {
        marginLeft: 6,

        color: COLORS.primary,

        fontFamily: FONTS.bold,
    },

    categoryContainer: {
        paddingHorizontal: 16,

        paddingTop: 18,

        paddingBottom: 5,
    },

    categoryButton: {
        height: 38,

        paddingHorizontal: 18,

        borderRadius: 20,

        backgroundColor: "#F3F4F6",

        justifyContent: "center",

        alignItems: "center",

        marginRight: 10,
    },

    activeCategory: {
        backgroundColor: COLORS.primary,
    },

    categoryText: {
        color: COLORS.black,

        fontFamily: FONTS.medium,
    },

    activeText: {
        color: COLORS.white,

        fontFamily: FONTS.bold,
    },
});