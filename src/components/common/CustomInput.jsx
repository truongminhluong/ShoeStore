import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

const Input = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={Colors.placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        style={styles.input}
      />
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
    justifyContent: "center",
  },

  input: {
    fontSize: 16,
    color: Colors.text,
  },
});