import { ActivityIndicator, View } from "react-native";

import AuthNavigator from "./AuthNavigator";
import MainNavigator from "./MainNavigator";

import { ENABLE_MAIN_TABS_PREVIEW } from "../constants/dev-preview";
import { useAuth } from "../context/AuthContext";

export default function RootNavigator() {
  const {
    token,
    loading,
  } = useAuth();

  if (loading && !ENABLE_MAIN_TABS_PREVIEW) {
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

  return token || ENABLE_MAIN_TABS_PREVIEW ? (
    <MainNavigator />
  ) : (
    <AuthNavigator />
  );
}
