// src/components/PostCard.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";

type PostCardProps = {
  title: string;
  contents: string;
  author: string;
  createdAtText: string; // 예: "12" (날짜 or 시간)
  commentCount?: number;
  onPress?: (event: GestureResponderEvent) => void;
};

const PostCard: React.FC<PostCardProps> = ({
  title,
  contents,
  author,
  createdAtText,
  commentCount = 0,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={onPress}
    >
      {/* 상단 Title 영역 */}
      <View style={styles.titleBox}>
        <Text style={styles.titleText} numberOfLines={1}>
          {title}
        </Text>
      </View>

      {/* 본문 미리보기 영역 */}
      <View style={styles.contentBox}>
        <Text style={styles.contentText} numberOfLines={2}>
          {contents}
        </Text>
      </View>

      {/* 하단 작성자 / 날짜 / 댓글 */}
      <View style={styles.footer}>
        <Text style={styles.authorText} numberOfLines={1}>
          {author}
        </Text>

        <View style={styles.footerRight}>
          <Text style={styles.dateText}>{createdAtText}</Text>

          <View style={styles.commentBox}>
            {/* 말풍선 아이콘은 일단 텍스트로 */}
            <Text style={styles.commentIcon}>💬</Text>
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
    width: "48%", // 두 칼럼 그리드용
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
    backgroundColor: "#F5F1E5", // Figma의 연노랑 배경 느낌
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
    fontSize: 12,
    marginRight: 2,
  },
  commentCount: {
    fontSize: 12,
    color: "#111827",
  },
});
