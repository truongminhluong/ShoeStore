import { createNativeStackNavigator } from "@react-navigation/native-stack";

import BottomTabs from "./BottomTabs";
import ProductDetailScreen from "../screens/Product/ProductDetailScreen";
import CheckoutScreen from "../screens/Checkout/CheckoutScreen";
import OrderSuccessScreen from "../screens/Order/OrderSuccessScreen";
import OrderScreen from "../screens/Order/OrderScreen";
import AddressScreen from "../screens/Address/AddressScreen";
import AddAddressScreen from "../screens/Address/AddAddressScreen";

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Các màn hình chính có Bottom Tab */}
      <Stack.Screen name="MainTabs" component={BottomTabs} />

      {/* Màn hình chi tiết sản phẩm */}
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />

      {/* Màn hình thanh toán */}
      <Stack.Screen name="Checkout" component={CheckoutScreen} />

      {/* Màn hình đặt hàng thành công */}
      <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />

      {/* Màn hình danh sách đơn hàng */}
      <Stack.Screen name="Orders" component={OrderScreen} />

      {/* Màn hình danh sách địa chỉ */}
      <Stack.Screen name="Address" component={AddressScreen} />

      {/* Màn hình thêm địa chỉ */}
      <Stack.Screen name="AddAddress" component={AddAddressScreen} />
    </Stack.Navigator>
  );
}
