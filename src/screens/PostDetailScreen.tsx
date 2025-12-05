// src/screens/PostDetailScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  navigation: any;
};

type Comment = {
  id: string;
  author: string;
  isMine: boolean; // 내 게시글 작성자 여부
  content: string;
  dateText: string;
};

export default function PostDetailScreen({ navigation }: Props) {
  // 더미 게시글 데이터
  const [post] = useState({
    title: "여긴 제목입니다.",
    author: "Name",
    dateText: "20**.**.**",
    body:
      "여긴 본문입니다. 여긴 본문입니다.\n여긴 본문입니다. 여긴 본문입니다.\n여긴 본문입니다. 여긴 본문입니다. 여긴……",
    hasImage: true,
  });

  // 더미 댓글 데이터
  const [comments] = useState<Comment[]>([
    {
      id: "1",
      author: "내 게시글 작성자",
      isMine: true,
      content: "댓글입니다.",
      dateText: "20**.**.**",
    },
    {
      id: "2",
      author: "작성자",
      isMine: false,
      content: "댓글입니다.",
      dateText: "20**.**.**",
    },
  ]);

  const [newComment, setNewComment] = useState("");

  const handlePostEdit = () => {
    console.log("edit post");
  };

  const handlePostDelete = () => {
    console.log("delete post");
  };

  const handleCommentSubmit = () => {
    console.log("submit comment:", newComment);
    setNewComment("");
  };

  const handleCommentEdit = (id: string) => {
    console.log("edit comment:", id);
  };

  const handleCommentDelete = (id: string) => {
    console.log("delete comment:", id);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.safeArea}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* 상단 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Image
              source={require("../../assets/BackIcon.png")}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>게시글 상세 조회</Text>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* 제목 + 수정/삭제 */}
          <View style={styles.titleRow}>
            <Text style={styles.titleText}>{post.title}</Text>

            <View style={styles.postActionRow}>
              <TouchableOpacity
                style={[styles.badgeButton, styles.badgeEdit]}
                onPress={handlePostEdit}
                activeOpacity={0.8}
              >
                <Text style={styles.badgeButtonText}>수정</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.badgeButton, styles.badgeDelete]}
                onPress={handlePostDelete}
                activeOpacity={0.8}
              >
                <Text style={styles.badgeButtonText}>삭제</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.divider} />

          {/* 작성자 / 날짜 */}
          <View style={styles.metaRow}>
            <Text style={styles.metaAuthor}>{post.author}</Text>
            <Text style={styles.metaDate}>{post.dateText}</Text>
          </View>

          <View style={styles.divider} />

          {/* 본문 */}
          <View style={styles.bodyBlock}>
            <Text style={styles.bodyText}>{post.body}</Text>
          </View>

          {/* 이미지가 있을 경우 */}
          {post.hasImage && (
            <View style={styles.imageBox}>
              <View style={styles.imageInner}>
                <Image
                  source={require("../../assets/ImageIcon.png")}
                  style={styles.imagePlaceholderIcon}
                  resizeMode="contain"
                />
              </View>
            </View>
          )}

          {/* 구분선 */}
          <View style={[styles.divider, { marginTop: 24 }]} />

          {/* 댓글 헤더 */}
          <View style={styles.commentHeaderRow}>
            <Text style={styles.commentHeaderText}>
              댓글 {comments.length}
            </Text>
          </View>

          {/* 댓글 작성 영역 */}
          <View style={styles.commentInputRow}>
            <View style={styles.commentInputWrapper}>
              <TextInput
                value={newComment}
                onChangeText={setNewComment}
                placeholder="댓글 작성하기"
                placeholderTextColor="#9CA3AF"
                style={styles.commentInput}
              />
            </View>
            <TouchableOpacity
              style={styles.commentSubmitButton}
              onPress={handleCommentSubmit}
              activeOpacity={0.8}
            >
              <Text style={styles.commentSubmitText}>등록</Text>
            </TouchableOpacity>
          </View>

          {/* 댓글 리스트 */}
          <View style={styles.commentList}>
            {comments.map((comment) => (
              <View key={comment.id} style={styles.commentCard}>
                {/* 상단: 작성자 / 날짜 / (내 댓글일 경우 수정/삭제) */}
                <View style={styles.commentTopRow}>
                  <View style={styles.commentAuthorRow}>
                    <Text style={styles.commentAuthorLabel}>
                      {comment.isMine ? "내 게시글 작성자" : "작성자"}
                    </Text>
                  </View>

                  <View style={styles.commentRightRow}>
                    {comment.isMine && (
                      <View style={styles.commentActionRow}>
                        <TouchableOpacity
                          style={[styles.badgeButton, styles.badgeEdit]}
                          onPress={() => handleCommentEdit(comment.id)}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.badgeButtonText}>수정</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.badgeButton, styles.badgeDelete]}
                          onPress={() => handleCommentDelete(comment.id)}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.badgeButtonText}>삭제</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                    <Text style={styles.commentDate}>{comment.dateText}</Text>
                  </View>
                </View>

                {/* 내용 */}
                <View style={styles.commentContentBlock}>
                  <Text style={styles.commentContentText}>
                    {comment.content}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* 아래 여백 */}
          <View style={{ height: 24 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const HEADER_HEIGHT = 72;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  /* Header */
  header: {
    height: HEADER_HEIGHT,
    backgroundColor: "#4CAF7D",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  backButtonText: {
    fontSize: 18,
    color: "#111827",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    marginRight: 40,
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  /* Scroll */
  scroll: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  /* Post title + actions */
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  titleText: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  postActionRow: {
    flexDirection: "row",
    gap: 6,
  },

  divider: {
    height: 1,
    backgroundColor: "#D1D5DB",
    marginVertical: 8,
  },

  /* Meta */
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  metaAuthor: {
    fontSize: 14,
    color: "#111827",
  },
  metaDate: {
    fontSize: 14,
    color: "#111827",
  },

  /* Body */
  bodyBlock: {
    marginTop: 12,
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#111827",
  },

  /* Image */
  imageBox: {
    marginTop: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  imageInner: {
    height: 160,
    borderRadius: 16,
    backgroundColor: "#F5F1E5",
    alignItems: "center",
    justifyContent: "center",
  },
  imagePlaceholderIcon: {
    width: 72,
    height: 72,
  },

  /* 댓글 헤더 */
  commentHeaderRow: {
    marginTop: 24,
    marginBottom: 8,
  },
  commentHeaderText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },

  /* 댓글 입력 */
  commentInputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  commentInputWrapper: {
    flex: 1,
    marginRight: 8,
  },
  commentInput: {
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#111827",
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#111827",
    backgroundColor: "#FFFFFF",
  },
  commentSubmitButton: {
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#4CAF7D",
    alignItems: "center",
    justifyContent: "center",
  },
  commentSubmitText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  /* 댓글 리스트 */
  commentList: {
    marginTop: 4,
  },
  commentCard: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingVertical: 12,
  },
  commentTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  commentAuthorRow: {},
  commentAuthorLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },
  commentRightRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentActionRow: {
    flexDirection: "row",
    marginRight: 8,
    gap: 6,
  },
  commentDate: {
    fontSize: 12,
    color: "#6B7280",
  },
  commentContentBlock: {
    marginTop: 6,
  },
  commentContentText: {
    fontSize: 13,
    color: "#111827",
  },

  /* 공용 작은 배지 버튼 (수정/삭제) */
  badgeButton: {
    minWidth: 44,
    height: 26,
    borderRadius: 13,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeEdit: {
    backgroundColor: "#86C98F",
  },
  badgeDelete: {
    backgroundColor: "#B85C5C",
  },
  badgeButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  backIcon : {
    width:20,
    height: 20,
  }
});
