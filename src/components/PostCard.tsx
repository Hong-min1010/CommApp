import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";
import { Image } from "react-native";

type PostCardProps = {
  title: string;
  contents: string;
  author: string;
  commentCount?: number;
  onPress?: (event: GestureResponderEvent) => void;
};

const PostCard: React.FC<PostCardProps> = ({
  title,
  contents,
  author,
  commentCount = 0,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={styles.titleBox}>
        <Text style={styles.titleText} numberOfLines={1}>
          {title}
        </Text>
      </View>

      <View style={styles.contentBox}>
        <Text style={styles.contentText} numberOfLines={2}>
          {contents}
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.authorText} numberOfLines={1}>
          {author}
        </Text>

        <View style={styles.footerRight}>
          <View style={styles.commentBox}>
            <Image
              source={require("../../assets/CommentIcon.png")}
              style={styles.commentIcon}
              resizeMode="contain"
            />
            <Text style={styles.commentCount}>{commentCount}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PostCard;

const styles = StyleSheet.create({
  card: {
    width: "48%",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#111827",
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    marginBottom: 16,
  },
  titleBox: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#D1D5DB",
  },
  titleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  contentBox: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: "#F5F1E5",
  },
  contentText: {
    fontSize: 12,
    color: "#111827",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  authorText: {
    flex: 1,
    fontSize: 12,
    color: "#111827",
  },
  footerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    color: "#111827",
    marginRight: 4,
  },
  commentBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentIcon: {
    width: 12,
    height: 12,
  },
  commentCount: {
    fontSize: 12,
    color: "#111827",
  },
});
