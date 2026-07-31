import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import COLORS from "../../constants/colors";
import FONTS from "../../constants/fonts";

const ProductHeader = ({
    navigation,
    title = "Ryde", // mặc định
}) => {
    return (
        <View style={styles.container}>
            {/* Quay lại */}
            <TouchableOpacity
                style={styles.iconButton}
                onPress={() => navigation.goBack()}
            >
                <Ionicons
                    name="arrow-back"
                    size={22}
                    color={COLORS.black}
                />
            </TouchableOpacity>

            {/* Tiêu đề */}
            <Text style={styles.logo}>
                {title}
            </Text>

            {/* Giỏ hàng */}
            <TouchableOpacity
                style={styles.iconButton}
                onPress={() => navigation.navigate("Orders")}>
                <Ionicons
                    name="cart-outline"
                    size={22}
                    color={COLORS.black}
                />
            </TouchableOpacity>
        </View>
    );
};

export default ProductHeader;

const styles = StyleSheet.create({
    container: {
        height: 65,

        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

        paddingHorizontal: 18,

        backgroundColor: COLORS.background,
    },

    logo: {
        color: COLORS.primary,
        fontWeight: "700",
        fontSize: 22,
        fontWeight: "bold",
    },

    iconButton: {
        width: 40,
        height: 40,

        justifyContent: "center",
        alignItems: "center",
    },
});