import { useMemo, useState, useEffect } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import Header from "../../components/home/Header";
import SearchBar from "../../components/home/SearchBar";
import BannerSlider from "../../components/home/BannerSlider";
import BrandSection from "../../components/home/BrandSection";
import ProductSection from "../../components/home/ProductSection";
import PopularSection from "../../components/home/PopularSection";
// import { getFavorites, addFavorite, removeFavorite } from "../../services/favoriteService";
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

export default function HomeScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const [searchText, setSearchText] = useState("");
  const [selectedBrand, setSelectedBrand] = useState(null);
  const { favoriteIds, toggleFavorite } = useFavorite();
  // const [favoriteIds, setFavoriteIds] = useState([]);

  //
  // useEffect(() => {
  //   loadFavorites();
  // }, []);

  // const loadFavorites = async () => {
  //   try {
  //     const favorite = await getFavorites();

  //     const ids = favorite.data.products.map((item) => item._id);

  //     setFavoriteIds(ids);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const handleToggleFavorite = async (productId) => {
  //   try {
  //     const isFavorite = favoriteIds.includes(productId);

  //     if (isFavorite) {
  //       await removeFavorite(productId);

  //       setFavoriteIds((prev) =>
  //         prev.filter((id) => id !== productId)
  //       );
  //     } else {
  //       await addFavorite(productId);

  //       setFavoriteIds((prev) => [...prev, productId]);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  //


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

  const handleSelectBrand = (brand) => {
    setSelectedBrand((currentBrand) =>
      currentBrand?.id === brand.id ? null : brand,
    );
  };

  const clearFilters = () => {
    setSearchText("");
    setSelectedBrand(null);
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
        <Header />

        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          onClear={() => setSearchText("")}
          onFilterPress={clearFilters}
          hasActiveFilters={Boolean(searchText.trim() || selectedBrand)}
        />

        <BannerSlider />

        <BrandSection
          selectedBrandId={selectedBrand?.id}
          onSelectBrand={handleSelectBrand}
        />

        <ProductSection
          products={filteredProducts}
          searchText={searchText}
          selectedBrandName={selectedBrand?.name}
          onClearFilters={clearFilters}
          favoriteIds={favoriteIds}
          onToggleFavorite={toggleFavorite}
        />

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
