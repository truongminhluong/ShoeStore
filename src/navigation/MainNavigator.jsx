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
import VoucherScreen from "../screens/Voucher/VoucherScreen";
import AccountScreen from "../screens/Profile/AccountScreen";

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainTabs" component={BottomTabs} />

      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />

      <Stack.Screen name="Checkout" component={CheckoutScreen} />

      <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />

      <Stack.Screen name="Orders" component={OrderScreen} />

      <Stack.Screen name="Address" component={AddressScreen} />

      <Stack.Screen name="AddAddress" component={AddAddressScreen} />

      <Stack.Screen
        name="VnpayPayment"
        component={VnpayPaymentScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen name="PaymentResult" component={PaymentResultScreen} />

      <Stack.Screen name="Notifications" component={NotificationScreen} />

      <Stack.Screen name="Account" component={AccountScreen} />

      <Stack.Screen
        name="CreateReview"
        component={CreateReviewScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="OrderDetail"
        component={OrderDetailScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="AllProducts"
        component={AllProductsScreen}
        options={{
          title: "Tất cả sản phẩm",
        }}
      />

      <Stack.Screen
        name="AllProductsByBrand"
        component={AllProductsByBrandScreen}
        options={{
          title: "Sản phẩm theo hãng",
        }}
      />

      <Stack.Screen name="Voucher" component={VoucherScreen} />
    </Stack.Navigator>
  );
}
