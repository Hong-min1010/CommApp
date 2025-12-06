// src/components/ToastMessage.tsx
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, ViewStyle } from "react-native";

type ToastType = "success" | "error";

type ToastMessageProps = {
  visible: boolean;
  message: string;
  type?: ToastType;
};

const ToastMessage: React.FC<ToastMessageProps> = ({
  visible,
  message,
  type = "success",
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 20,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, opacity, translateY]);

  const containerStyle: ViewStyle = {
    backgroundColor: type === "success" ? "#4CAF7D" : "#B85C5C",
  };

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.toast,
        containerStyle,
        { opacity, transform: [{ translateY }] },
      ]}
    >
      <Text style={styles.toastText}>{message}</Text>
  </Animated.View>
  );
};

export default ToastMessage;

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    left: 24,
    right: 24,
    bottom: 40,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  toastText: {
    fontSize: 14,
    color: "#FFFFFF",
  },
});
