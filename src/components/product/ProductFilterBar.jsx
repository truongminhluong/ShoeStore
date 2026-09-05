import React from "react";

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import useCategoryViewModel from "../../viewmodels/useCategoryViewModel";

import COLORS from "../../constants/colors";
import FONTS from "../../constants/fonts";

const ProductFilterBar = ({
  total = 0,
  selectedCategory = "Tất cả",
  onSelectCategory,
  onFilterPress,
  onSortPress,
}) => {
  const { categories, loading } = useCategoryViewModel();

  return (
    <>
      {/* ==========================================
                HEADER
            ========================================== */}

      <View style={styles.header}>
        <View style={styles.left}>
          <Text style={styles.title}>Giày Mới Nhất</Text>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>{total}</Text>
          </View>
        </View>

        <View style={styles.right}>
          {/* FILTER */}

          <TouchableOpacity
            style={styles.iconButton}
            onPress={onFilterPress}
            activeOpacity={0.7}
          >
            <Ionicons name="options" size={18} color={COLORS.gray} />
          </TouchableOpacity>

          {/* SORT */}

          <TouchableOpacity
            style={styles.iconButton}
            onPress={onSortPress}
            activeOpacity={0.7}
          >
            <Ionicons name="shuffle-outline" size={18} color={COLORS.gray} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ==========================================
                CATEGORY
            ========================================== */}

      <ScrollView
        horizontal
        style={styles.categoryScroll}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryContainer}
      >
        {/* TẤT CẢ */}

        <TouchableOpacity
          style={[
            styles.categoryButton,
            selectedCategory === "Tất cả" && styles.activeButton,
          ]}
          onPress={() => onSelectCategory("Tất cả")}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.categoryText,
              selectedCategory === "Tất cả" && styles.activeText,
            ]}
          >
            Tất cả
          </Text>
        </TouchableOpacity>

        {/* CÁC DANH MỤC */}

        {!loading &&
          categories?.map((item) => (
            <TouchableOpacity
              key={item._id}
              style={[
                styles.categoryButton,
                selectedCategory === item.name && styles.activeButton,
              ]}
              onPress={() => onSelectCategory(item.name)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === item.name && styles.activeText,
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

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({
  // ==========================================
  // HEADER
  // ==========================================

  header: {
    marginTop: 15,
    paddingHorizontal: 16,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  // ==========================================
  // LEFT
  // ==========================================

  left: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
  },

  // ==========================================
  // TITLE
  // ==========================================

  title: {
    fontSize: 30,
    fontFamily: FONTS.bold,
    fontWeight: "700",
    color: COLORS.black,
  },

  // ==========================================
  // BADGE
  // ==========================================

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

  // ==========================================
  // RIGHT
  // ==========================================

  right: {
    flexDirection: "row",
    alignItems: "center",
  },

  // ==========================================
  // ICON BUTTON
  // ==========================================

  iconButton: {
    width: 40,
    height: 40,

    marginLeft: 8,

    borderRadius: 12,

    backgroundColor: "#EEF1FF",

    justifyContent: "center",
    alignItems: "center",
  },

  // ==========================================
  // CATEGORY SCROLL
  // ==========================================

  categoryScroll: {
    maxHeight: 75,
    marginBottom: 10,
  },

  // ==========================================
  // CATEGORY CONTAINER
  // ==========================================

  categoryContainer: {
    paddingHorizontal: 16,

    marginTop: 18,

    paddingBottom: 8,
  },

  // ==========================================
  // CATEGORY BUTTON
  // ==========================================

  categoryButton: {
    height: 38,

    paddingHorizontal: 18,

    borderRadius: 20,

    backgroundColor: "#F3F4F6",

    justifyContent: "center",
    alignItems: "center",

    marginRight: 10,
  },

  // ==========================================
  // ACTIVE CATEGORY
  // ==========================================

  activeButton: {
    backgroundColor: COLORS.primary,
  },

  // ==========================================
  // CATEGORY TEXT
  // ==========================================

  categoryText: {
    fontSize: 14,

    fontFamily: FONTS.medium,

    color: COLORS.black,
  },

  // ==========================================
  // ACTIVE TEXT
  // ==========================================

  activeText: {
    color: COLORS.white,

    fontFamily: FONTS.bold,
  },
});
