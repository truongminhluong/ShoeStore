import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
} from "react-native";
import useCategoryViewModel from "../../viewmodels/useCategoryViewModel";

import { Ionicons } from "@expo/vector-icons";

import COLORS from "../../constants/colors";
import FONTS from "../../constants/fonts";

const ProductFilterBar = ({
    total = 0,
    selectedCategory = "Tất cả",
    onSelectCategory,
    onFilterPress,
    onSortPress,
}) => {
    const {
        categories,
        loading,
    } = useCategoryViewModel();
    return (
        <>
            {/* Tiêu đề */}
            <View style={styles.header}>
                <View style={styles.left}>
                    <Text style={styles.title}>
                        Giày Mới Nhất
                    </Text>

                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                            {total}
                        </Text>
                    </View>
                </View>

                <View style={styles.right}>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={onFilterPress}
                    >
                        <Ionicons
                            name="options"
                            size={18}
                            color={COLORS.gray}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={onSortPress}
                    >
                        <Ionicons
                            name="shuffle-outline"
                            size={18}
                            color={COLORS.gray}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Danh mục */}
            <ScrollView
                horizontal
<<<<<<< Updated upstream
                style={{ maxHeight: 75 }}
=======
                style={{ maxHeight: 75, marginBottom: 10 }}
>>>>>>> Stashed changes
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryContainer}
            >

                <TouchableOpacity
                    style={[
                        styles.categoryButton,
                        selectedCategory === "Tất cả" &&
                        styles.activeButton,
                    ]}
                    onPress={() => onSelectCategory("Tất cả")}
                >
                    <Text
                        style={[
                            styles.categoryText,
                            selectedCategory === "Tất cả" &&
                            styles.activeText,
                        ]}
                    >
                        Tất cả
                    </Text>
                </TouchableOpacity>

                {categories.map((item) => (
                    <TouchableOpacity
                        key={item._id}
                        style={[
                            styles.categoryButton,
                            selectedCategory === item.name &&
                            styles.activeButton,
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
        </>
    );
};

export default ProductFilterBar;

const styles = StyleSheet.create({
    header: {
        marginTop: 15,
        paddingHorizontal: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    left: {
        flexDirection: "row",
        alignItems: "center",
    },

    title: {
        fontSize: 30,
        fontFamily: FONTS.bold,
        color: COLORS.black,
        fontWeight: "700",
    },

    badge: {
        marginLeft: 10,

        width: 24,
        height: 24,

        borderRadius: 12,

        backgroundColor: COLORS.primary,

        justifyContent: "center",
        alignItems: "center",
    },

    badgeText: {
        color: COLORS.white,
        fontSize: 11,
        fontFamily: FONTS.bold,
    },

    right: {
        flexDirection: "row",
        alignItems: "center",
    },

    iconButton: {
        width: 40,
        height: 40,

        marginLeft: 8,

        borderRadius: 12,

        backgroundColor: "#EEF1FF",

        justifyContent: "center",
        alignItems: "center",
    },

    categoryContainer: {
        paddingHorizontal: 16,
        marginTop: 18,
        paddingBottom: 8,
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
    activeButton: {
        backgroundColor: COLORS.primary,
    },

    categoryText: {
        fontSize: 14,
        fontFamily: FONTS.medium,
        color: COLORS.black,
    },

    activeText: {
        color: COLORS.white,
        fontFamily: FONTS.bold,
    },
});