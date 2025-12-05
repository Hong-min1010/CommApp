import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";

interface CommentProps {
  author: string;
  content: string;
  createdAtText: string;
  isMine?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  style?: ViewStyle;
}

export default function Comment({
  author,
  content,
  createdAtText,
  isMine = false,
  onEdit,
  onDelete,
  style,
}: CommentProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.author}>{author}</Text>
        <View style={styles.right}>
          <Text style={styles.date}>{createdAtText}</Text>
          {isMine && (
            <>
              {onEdit && (
                <TouchableOpacity onPress={onEdit}>
                  <Text style={styles.action}>수정</Text>
                </TouchableOpacity>
              )}
              {onDelete && (
                <TouchableOpacity onPress={onDelete}>
                  <Text style={[styles.action, styles.delete]}>삭제</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </View>
      <Text style={styles.content}>{content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  author: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  date: {
    fontSize: 11,
    color: "#9CA3AF",
    marginRight: 4,
  },
  action: {
    fontSize: 11,
    color: "#6B7280",
    marginLeft: 4,
  },
  delete: {
    color: "#EF4444",
  },
  content: {
    fontSize: 13,
    color: "#111827",
  },
});
