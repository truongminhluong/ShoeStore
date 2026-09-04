import { useEffect, useMemo, useState, useCallback } from "react";

import { ScrollView, StyleSheet, RefreshControl } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import Header from "../../components/home/Header";
import SearchBar from "../../components/home/SearchBar";
import BannerSlider from "../../components/home/BannerSlider";
import BrandSection from "../../components/home/BrandSection";
import ProductSection from "../../components/home/ProductSection";
import PopularSection from "../../components/home/PopularSection";

import useNotificationViewModel from "../../viewmodels/useNotificationViewModel";
import useNewestProductsViewModel from "../../viewmodels/useNewestProductsViewModel";

import { useFavorite } from "../../context/FavoriteContext";

const normalizeText = (value) =>
  String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

export default function HomeScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [selectedBrand, setSelectedBrand] = useState(null);

  const tabBarHeight = useBottomTabBarHeight();

  const { unreadCount, fetchUnreadCount } = useNotificationViewModel();

  const {
    products: newestProducts,
    loading: newestProductsLoading,
    refresh: refreshNewestProducts,
  } = useNewestProductsViewModel();

  const { favoriteIds, toggleFavorite } = useFavorite();

  // ================================
  // NOTIFICATION
  // ================================

  useEffect(() => {
    fetchUnreadCount();

    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  // ================================
  // PULL TO REFRESH
  // ================================

  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);

      await Promise.all([fetchUnreadCount(), refreshNewestProducts()]);

    } catch (error) {
      console.log(
        "❌ Lỗi refresh Home:",
        error?.response?.data || error?.message,
      );
    } finally {
      setRefreshing(false);
    }
  }, [fetchUnreadCount, refreshNewestProducts]);

  // ================================
  // FILTER PRODUCT
  // ================================

  const filteredProducts = useMemo(() => {
    const keyword = normalizeText(searchText);

    return newestProducts.filter((product) => {
      const brandName =
        typeof product?.brand === "string"
          ? product.brand
          : product?.brand?.name || "";

      const categoryName =
        typeof product?.category === "string"
          ? product.category
          : product?.category?.name || "";

      const matchesBrand =
        !selectedBrand ||
        normalizeText(brandName) === normalizeText(selectedBrand?.name);

      const searchContent = normalizeText(
        `${product?.name || ""} ${brandName} ${categoryName}`,
      );

      const matchesSearch = !keyword || searchContent.includes(keyword);

      return matchesBrand && matchesSearch;
    });
  }, [newestProducts, searchText, selectedBrand]);

  // ================================
  // BRAND
  // ================================

  const handleSelectBrand = (brand) => {
    setSelectedBrand((currentBrand) =>
      currentBrand?.id === brand.id ? null : brand,
    );
  };

  // ================================
  // CLEAR FILTER
  // ================================

  const clearFilters = () => {
    setSearchText("");
    setSelectedBrand(null);
  };

  // ================================
  // SEARCH
  // ================================

  const handleSearch = () => {
    const keyword = searchText.trim();

    navigation.navigate("AllProducts", {
      searchText: keyword,
    });

    setSearchText("");
  };

  // ================================
  // UI
  // ================================

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: tabBarHeight + 20,
          },
        ]}
      >
        {/* HEADER */}
        <Header navigation={navigation} unreadCount={unreadCount} />

        {/* SEARCH */}
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

        {/* HÀNG MỚI VỀ */}
        <ProductSection
          navigation={navigation}
          products={filteredProducts}
          loading={newestProductsLoading}
          favoriteIds={favoriteIds}
          onToggleFavorite={toggleFavorite}
        />

        {/* POPULAR */}
        <PopularSection />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  content: {
    paddingTop: 4,
  },
});
