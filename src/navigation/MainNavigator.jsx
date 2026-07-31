import { createNativeStackNavigator } from "@react-navigation/native-stack";

import BottomTabs from "./BottomTabs";
import ProductDetailScreen from "../screens/Product/ProductDetailScreen";
import CheckoutScreen from "../screens/Checkout/CheckoutScreen";
import OrderSuccessScreen from "../screens/Order/OrderSuccessScreen";
import OrderScreen from "../screens/Order/OrderScreen";
import AddressScreen from "../screens/Address/AddressScreen";
import AddAddressScreen from "../screens/Address/AddAddressScreen";
import VnpayPaymentScreen from "../screens/Payment/VnpayPaymentScreen";
import PaymentResultScreen from "../screens/Payment/PaymentResultScreen";
import NotificationScreen from "../screens/Notification/NotificationScreen";
import CreateReviewScreen from "../screens/Review/CreateReviewScreen";
import OrderDetailScreen from "../screens/Order/OrderDetailScreen";
import AllProductsScreen from "../screens/Product/AllProductsScreen";
import AllProductsByBrandScreen from "../screens/Product/AllProductsByBrandScreen";

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

      <Stack.Screen
        name="VnpayPayment"
        component={VnpayPaymentScreen}
        options={{
          headerShown: false,
        }}
      />

      {/* Màn hình kết quả thanh toán */}
      <Stack.Screen name="PaymentResult" component={PaymentResultScreen} />

      {/* Màn hình thông báo */}
      <Stack.Screen name="Notifications" component={NotificationScreen} />

      {/* Màn hình tạo đánh giá */}
      <Stack.Screen
        name="CreateReview"
        component={CreateReviewScreen}
        options={{
          headerShown: false,
        }}
      />

      {/* Màn hình chi tiết đơn hàng */}
      <Stack.Screen
        name="OrderDetail"
        component={OrderDetailScreen}
        options={{
          headerShown: false,
        }}
      />
      {/* Màn hình tất cả sản phẩm */}
      <Stack.Screen
        name="AllProducts"
        component={AllProductsScreen}
        options={{
          title: "Tất cả sản phẩm",
        }}
      />
      {/* Màn hình tất cả sản phẩm theo danh mục */}
      <Stack.Screen
        name="AllProductsByBrand"
        component={AllProductsByBrandScreen}
        options={{
          title: "Sản phẩm theo hãng",
        }}
      />
    </Stack.Navigator>
  );
}
