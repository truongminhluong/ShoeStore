import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import AuthProvider from "./src/context/AuthContext";
import { CartProvider } from "./src/context/CartContext";
import RootNavigator from "./src/navigation/RootNavigator";
import { FavoriteProvider } from "./src/context/FavoriteContext";

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <FavoriteProvider>
          <CartProvider>
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </CartProvider>
        </FavoriteProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

