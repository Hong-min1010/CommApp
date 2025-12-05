import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
} from "react-native";

interface InputBoxProps extends TextInputProps {
  label?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
}

export default function InputBox({
  label,
  containerStyle,
  inputStyle,
  ...textInputProps
}: InputBoxProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          textInputProps.multiline && styles.multilineInput,
          inputStyle,
        ]}
        placeholderTextColor="#9CA3AF"
        {...textInputProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: "#111827",
    fontWeight: "500",
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: "#111827",
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    backgroundColor: "#FFFFFF",
  },
  multilineInput: {
    height: 120,
    textAlignVertical: "top",
    paddingTop: 10,
  },
});
