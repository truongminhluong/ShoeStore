import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import HomeScreen from "../screens/Home/HomeScreen";
import FavoriteScreen from "../screens/Favorite/FavoriteScreen";
import CartScreen from "../screens/Cart/CartScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor: "#111827",
        tabBarInactiveTintColor: "#9CA3AF",

        tabBarStyle: {
          height: 65 + insets.bottom, // thêm khoảng cách phía dưới
          paddingBottom: insets.bottom + 8,
          paddingTop: 8,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },

        tabBarIcon: ({ focused, color }) => {
          let iconName;

          switch (route.name) {
            case "Home":
              iconName = focused ? "home" : "home-outline";
              break;

            case "Favorite":
              iconName = focused ? "heart" : "heart-outline";
              break;

            case "Cart":
              iconName = focused ? "cart" : "cart-outline";
              break;

            case "Profile":
              iconName = focused ? "person" : "person-outline";
              break;
          }

          return (
            <Ionicons 
              name={iconName} 
              size={24} 
              color={color} 
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Favorite" component={FavoriteScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}