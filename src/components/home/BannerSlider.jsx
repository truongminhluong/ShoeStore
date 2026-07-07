import { useEffect, useRef, useState } from "react";
import { View, FlatList, Image, Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

const banners = [
  {
    id: "1",
    image: require("../../../assets/images/banner1.jpg"),
  },
  {
    id: "2",
    image: require("../../../assets/images/banner2.jpg"),
  },
];

export default function BannerSlider() {
  const flatListRef = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex =
        currentIndex === banners.length - 1 ? 0 : currentIndex + 1;

      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });

      setCurrentIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const onMomentumScrollEnd = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);

    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={banners}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={onMomentumScrollEnd}
        renderItem={({ item }) => (
          <Image source={item.image} style={styles.image} />
        )}
      />

      <View style={styles.dotContainer}>
        {banners.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, currentIndex === index && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },

  image: {
    width: width - 40,
    height: 180,
    borderRadius: 20,
    marginHorizontal: 20,
  },

  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },

  activeDot: {
    width: 20,
    backgroundColor: "#2563EB",
  },
});
