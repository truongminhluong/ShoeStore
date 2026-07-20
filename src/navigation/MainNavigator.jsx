import { createNativeStackNavigator } from "@react-navigation/native-stack";

import BottomTabs from "./BottomTabs";
import ProductDetailScreen from "../screens/Product/ProductDetailScreen";

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Các màn hình chính có Bottom Tab */}
      <Stack.Screen
        name="MainTabs"
        component={BottomTabs}
      />

      {/* Màn hình chi tiết sản phẩm */}
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
      />
    </Stack.Navigator>
  );
}