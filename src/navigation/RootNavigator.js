import { ActivityIndicator, View } from "react-native";

import AuthNavigator from "./AuthNavigator";
import MainNavigator from "./MainNavigator";

import { useAuth } from "../context/AuthContext";

export default function RootNavigator() {
  const {
    token,
    loading,
  } = useAuth();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return token ? (
    <MainNavigator />
  ) : (
    <AuthNavigator />
  );
}