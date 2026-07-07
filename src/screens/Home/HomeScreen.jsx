import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import Header from "../../components/home/Header";
import SearchBar from "../../components/home/SearchBar";
import BannerSlider from "../../components/home/BannerSlider";
import BrandSection from "../../components/home/BrandSection";
import ProductSection from "../../components/home/ProductSection";
import PopularSection from "../../components/home/PopularSection";

import COLORS from "../../constants/colors";

export default function HomeScreen() {
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top"]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: tabBarHeight + 20,
          },
        ]}
      >
        <Header />

        <SearchBar />

        <BannerSlider />

        <BrandSection />

        <ProductSection />

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