import { useEffect, useMemo, useState } from "react";

import { ScrollView, StyleSheet } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import Header from "../../components/home/Header";
import SearchBar from "../../components/home/SearchBar";
import BannerSlider from "../../components/home/BannerSlider";
import BrandSection from "../../components/home/BrandSection";
import ProductSection from "../../components/home/ProductSection";
import PopularSection from "../../components/home/PopularSection";

import useNotificationViewModel from "../../viewmodels/useNotificationViewModel";

import { useFavorite } from "../../context/FavoriteContext";

import COLORS from "../../constants/colors";
import { products } from "../../data/productData";

const normalizeText = (value) =>
  value
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

export default function HomeScreen({ navigation }) {
  const tabBarHeight = useBottomTabBarHeight();

  // =========================
  // THÔNG BÁO
  // =========================

  const { unreadCount, fetchUnreadCount } = useNotificationViewModel();

  // =========================
  // STATE
  // =========================

  const [searchText, setSearchText] = useState("");

  const [selectedBrand, setSelectedBrand] = useState(null);

  const { favoriteIds, toggleFavorite } = useFavorite();


  // =========================
  // TỰ ĐỘNG KIỂM TRA THÔNG BÁO
  // =========================

  useEffect(() => {
    // Gọi ngay khi HomeScreen được mở
    fetchUnreadCount();

    // Kiểm tra lại mỗi 5 giây
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 5000);

    // Hủy interval khi rời màn hình
    return () => {
      clearInterval(interval);
    };
  }, [fetchUnreadCount]);

  // =========================
  // LỌC SẢN PHẨM
  // =========================

  const filteredProducts = useMemo(() => {
    const keyword = normalizeText(searchText);

    return products.filter((product) => {
      const matchesBrand =
        !selectedBrand ||
        normalizeText(product.brand) === normalizeText(selectedBrand.name);

      const searchContent = normalizeText(
        `${product.name} ${product.brand} ${product.category}`,
      );

      const matchesSearch = !keyword || searchContent.includes(keyword);

      return matchesBrand && matchesSearch;
    });
  }, [searchText, selectedBrand]);

  // =========================
  // CHỌN BRAND
  // =========================

  const handleSelectBrand = (brand) => {
    setSelectedBrand((currentBrand) =>
      currentBrand?.id === brand.id ? null : brand,
    );
  };

  // =========================
  // XÓA BỘ LỌC
  // =========================

  const clearFilters = () => {
    setSearchText("");

    setSelectedBrand(null);
  };

  // =========================
  // TÌM KIẾM SẢN PHẨM
  // =========================

  const handleSearch = () => {
    const keyword = searchText.trim();

    navigation.navigate("AllProducts", {
      searchText: keyword,
    });
    setSearchText("");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: tabBarHeight + 20,
          },
        ]}
      >
        {/* HEADER */}

        <Header navigation={navigation} unreadCount={unreadCount} />

        {/* THANH TÌM KIẾM */}

        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          onClear={() => setSearchText("")}
          onSearch={handleSearch}
          onFilterPress={clearFilters}
          hasActiveFilters={Boolean(searchText.trim() || selectedBrand)}
        />


        {/* BANNER */}

        <BannerSlider />

        {/* BRAND */}

        <BrandSection
          navigation={navigation}
          selectedBrandId={selectedBrand?.id}
          onSelectBrand={handleSelectBrand}
        />

        {/* SẢN PHẨM */}

        <ProductSection
          navigation={navigation}
          products={filteredProducts}
          searchText={searchText}
          selectedBrandName={selectedBrand?.name}
          onClearFilters={clearFilters}
          favoriteIds={favoriteIds}
          onToggleFavorite={toggleFavorite}
        />

        {/* SẢN PHẨM PHỔ BIẾN */}

        <PopularSection />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    flexGrow: 1,
  },
});
