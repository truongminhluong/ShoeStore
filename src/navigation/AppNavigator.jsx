import { NavigationContainer } from "@react-navigation/native";

import AuthNavigator from "./AuthNavigator";
import { CartProvider } from "../context/CartContext";

export default function AppNavigator() {
  return (
    <CartProvider>
      <NavigationContainer>
        <AuthNavigator />
      </NavigationContainer>
    </CartProvider>
  );
}