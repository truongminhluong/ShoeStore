import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";

import COLORS from "../../constants/colors";
import FONTS from "../../constants/fonts";

const ProductFavoriteItem = ({ item, onRemove }) => {
    return (
        <View style={styles.card}>
            <Image
                source={{ uri: item.image }}
                style={styles.image}
            />

            <TouchableOpacity
                style={styles.favoriteButton}
                onPress={() => onRemove(item.id)}
            >
                <Ionicons
                    name="heart"
                    size={18}
                    color="#E53935"
                />
            </TouchableOpacity>

            <View style={styles.body}>
                <Text style={styles.brand}>
                    {item.brand}
                </Text>

                <Text
                    numberOfLines={2}
                    style={styles.name}
                >
                    {item.name}
                </Text>

                <View style={styles.bottom}>
                    <Text style={styles.price}>
                        {item.price}
                    </Text>

                    <TouchableOpacity style={styles.cartButton}>
                        <Feather
                            name="shopping-cart"
                            size={16}
                            color={COLORS.white}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default ProductFavoriteItem;

const styles = StyleSheet.create({
    card: {
        width: "48%",
        backgroundColor: COLORS.white,
        borderRadius: 14,
        marginBottom: 18,
        overflow: "hidden",
        elevation: 2,
    },

    image: {
        width: "100%",
        height: 140,
        resizeMode: "cover",
    },

    favoriteButton: {
        position: "absolute",
        top: 10,
        right: 10,

        width: 34,
        height: 34,

        borderRadius: 17,

        backgroundColor: COLORS.white,

        justifyContent: "center",
        alignItems: "center",
    },

    body: {
        padding: 12,
    },

    brand: {
        // fontSize: 12,
        // color: COLORS.gray,
        // fontFamily: FONTS.medium,
        // fontWeight: "600",
        // textTransform: "uppercase",
        fontSize: 12,
        color: "#999",
        fontWeight: "600",
        textTransform: "uppercase",
    },

    name: {
        fontSize: 20,
        color: COLORS.black,
        fontFamily: FONTS.bold,
        fontWeight: "700",
        marginTop: 6,
        minHeight: 56,
    },

    bottom: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    price: {
        color: COLORS.primary,
        fontSize: 18,
        fontFamily: FONTS.bold,
        fontWeight: "700",
    },

    cartButton: {
        width: 34,
        height: 34,
        borderRadius: 8,
        backgroundColor: COLORS.primary,
        justifyContent: "center",
        alignItems: "center",
    },
});