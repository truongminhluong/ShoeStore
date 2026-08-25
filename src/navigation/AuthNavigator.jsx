import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/Auth/LoginScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";
import ForgotPasswordScreen from "../screens/Auth/ForgotPasswordScreen";
import MainNavigator from "./MainNavigator";
import VerifyOTPScreen from "../screens/Auth/VerifyOTPScreen";
import ResetPasswordScreen from "../screens/Auth/ResetPasswordScreen";

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />

      <Stack.Screen name="Register" component={RegisterScreen} />

      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />

      <Stack.Screen name="VerifyOTP" component={VerifyOTPScreen} />

      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />

      <Stack.Screen name="Main" component={MainNavigator} />
    </Stack.Navigator>
  );
}
