import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";

interface ContentBoxProps {
  title: string;
  contents: string;
  author: string;
  commentCount: number;
  onPress?: () => void;
  style?: ViewStyle;
}

export default function ContentBox({
  title,
  contents,
  author,
  commentCount,
  onPress,
  style,
}: ContentBoxProps) {
  const Wrapper: React.ComponentType<any> = onPress ? TouchableOpacity : View;

  return (
    <Wrapper style={[styles.card, style]} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {title}
        </Text>
      </View>
      <View style={styles.body}>
        <Text
          style={styles.contents}
          numberOfLines={3}
          ellipsizeMode="tail"
        >
          {contents}
        </Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.author} numberOfLines={1}>
          {author}
        </Text>
        <Text style={styles.meta}>💬 {commentCount}</Text>
      </View>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 150,
    borderWidth: 1,
    borderColor: "#111827",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    marginBottom: 16,
  },
  header: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  body: {
    flex: 1,
    backgroundColor: "#F7F3E7",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  contents: {
    fontSize: 13,
    color: "#111827",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#FFFFFF",
  },
  author: {
    fontSize: 12,
    color: "#111827",
  },
  meta: {
    fontSize: 12,
    color: "#6B7280",
  },
});
