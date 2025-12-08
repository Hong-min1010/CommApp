import React, { useEffect, useState } from "react";
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
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RouteProp } from "@react-navigation/native";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  increment,
  runTransaction,
} from "firebase/firestore";
import { auth, db } from "../../firebaseconfig";

import ConfirmModal from "../components/ConfirmModal";
import ToastMessage from "../components/ToastMessage";

type RootStackParamList = {
  Detail: {
    postId: string;
    toastMessage?: string;
    toastType?: "success" | "error";
  };
};

type Props = {
  navigation: any;
  route: RouteProp<RootStackParamList, "Detail">;
};

type Post = {
  id: string;
  title: string;
  contents: string;
  authorName?: string;
  authorId?: string | null;
  imageUrl?: string | null;
  createdAt?: any;
};

type Comment = {
  id: string;
  authorName: string;
  authorId: string | null;
  content: string;
  createdAt?: any;
};

const formatDateTime = (ts: any | undefined) => {
  if (!ts) return "";
  try {
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hour = String(d.getHours()).padStart(2, "0");
    const minute = String(d.getMinutes()).padStart(2, "0");
    return `${month}-${day} ${hour}:${minute}`;
  } catch {
    return "";
  }
};

export default function PostDetailScreen({ navigation, route }: Props) {
  const { postId } = route.params;

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingPost, setLoadingPost] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState("");
  const [deletePostModalVisible, setDeletePostModalVisible] = useState(false);
  const [deleteCommentModalVisible, setDeleteCommentModalVisible] =
    useState(false);
  const [commentToDelete, setCommentToDelete] = useState<Comment | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] =
    useState<"success" | "error">("success");

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToastType(type);
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 1500);
  };

  const currentUser = auth.currentUser;

  useEffect(() => {
    if (route.params?.toastMessage) {
      showToast(route.params.toastMessage, route.params.toastType || "success");
      navigation.setParams({
        ...route.params,
        toastMessage: undefined,
        toastType: undefined,
      } as any);
    }
  }, [route.params, navigation]);

  useEffect(() => {
    const postRef = doc(db, "posts", postId);
    const unsub = onSnapshot(
      postRef,
      (snap) => {
        if (!snap.exists()) {
          if (navigation.canGoBack()) navigation.goBack();
          return;
        }
        const data = snap.data() as any;

        let authorName: string = "작성자";
        const user = auth.currentUser;

        if (typeof data.authorName === "string" && data.authorName.trim() !== "") {
          authorName = data.authorName;
        } else if (user && data.authorId === user.uid && user.displayName) {
          authorName = user.displayName;
        }

        setPost({
          id: snap.id,
          title: data.title ?? "",
          contents: data.contents ?? "",
          authorName,
          authorId: data.authorId ?? data.author ?? null,
          imageUrl: data.imageUrl ?? null,
          createdAt: data.createdAt,
        });
        setLoadingPost(false);
      },
      (error) => {
        setLoadingPost(false);
        if (navigation.canGoBack()) navigation.goBack();
      }
    );
    return () => unsub();
  }, [postId, navigation]);

  useEffect(() => {
    const commentsRef = collection(db, "posts", postId, "comments");
    const q = query(commentsRef, orderBy("createdAt", "asc"));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const items: Comment[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as any;
          return {
            id: docSnap.id,
            authorName: data.authorName ?? "작성자",
            authorId: data.authorId ?? null,
            content: data.content ?? "",
            createdAt: data.createdAt,
          };
        });
        setComments(items);
        setLoadingComments(false);
      },
      (error) => {
        setLoadingComments(false);
      }
    );
    return () => unsub();
  }, [postId]);

  const handlePostEdit = () => {
    if (!post) return;

    navigation.navigate("Edit", {
      postId: post.id,
      title: post.title,
      contents: post.contents,
      imageUrl: post.imageUrl ?? null,
    });
  };

  const handlePostDelete = () => {
    if (!post) return;
    setDeletePostModalVisible(true);
  };

  const handleConfirmDeletePost = async () => {
    if (!post) return;
    setDeletePostModalVisible(false);

    try {
      const postRef = doc(db, "posts", post.id);
      await deleteDoc(postRef);

      navigation.navigate("Main", {
        toastMessage: "게시글이 삭제되었습니다.",
        toastType: "success",
      });
    } catch (error) {
      showToast("게시글 삭제 중 오류가 발생했습니다.", "error");
    }
  };

  const handleCancelDeletePost = () => {
    setDeletePostModalVisible(false);
  };

  const handleCommentSubmit = async () => {
    const trimmed = newComment.trim();
    if (!trimmed) return;

    if (!currentUser) {
      setToastType("error");
      setToastMessage("로그인 후 댓글을 작성할 수 있습니다.");
      setToastVisible(true);
      return;
    }

    const authorName = currentUser.displayName || "사용자";

    setIsSubmittingComment(true);

    try {
      const commentsRef = collection(db, "posts", postId, "comments");
      const postRef = doc(db, "posts", postId);

      await addDoc(commentsRef, {
        content: trimmed,
        authorId: currentUser.uid,
        authorName,
        createdAt: serverTimestamp(),
      });

      await updateDoc(postRef, {
        commentCount: increment(1),
      });

      setNewComment("");
    } catch (error) {
      showToast("댓글 등록 중 오류가 발생했습니다.", "error");
    } finally {
      setIsSubmittingComment(false);
    }
  };
  const handleCommentEditPress = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditingCommentText(comment.content);
  };

  const handleCancelEditComment = () => {
    setEditingCommentId(null);
    setEditingCommentText("");
  };

  const handleConfirmEditComment = async () => {
    if (!editingCommentId) return;
    const trimmed = editingCommentText.trim();
    if (!trimmed) {
      showToast("댓글 내용을 입력해주세요.", "error");
      return;
    }

    try {
      const commentRef = doc(db, "posts", postId, "comments", editingCommentId);
      await updateDoc(commentRef, { content: trimmed });
      setEditingCommentId(null);
      setEditingCommentText("");
      showToast("댓글이 수정되었습니다.", "success");
    } catch (error) {
      showToast("댓글 수정 중 오류가 발생했습니다.", "error");
    }
  };

  const handleCommentDeletePress = (comment: Comment) => {
    setCommentToDelete(comment);
    setDeleteCommentModalVisible(true);
  };

  const handleConfirmDeleteComment = async () => {
    if (!commentToDelete) return;
    if (!currentUser) {
      showToast("로그인 후 이용 가능합니다.", "error");
      return;
    }

    const commentId = commentToDelete.id;
    setDeleteCommentModalVisible(false);

    try {
      const commentRef = doc(db, "posts", postId, "comments", commentId);
      const postRef = doc(db, "posts", postId);

      await deleteDoc(commentRef);

      await runTransaction(db, async (tx) => {
        const snap = await tx.get(postRef);
        const data = snap.data() as any | undefined;
        const current =
          typeof data?.commentCount === "number" ? data.commentCount : 0;
        const next = Math.max(0, current - 1);
        tx.update(postRef, { commentCount: next });
      });

      if (editingCommentId === commentId) {
        setEditingCommentId(null);
        setEditingCommentText("");
      }

      showToast("댓글이 삭제되었습니다.", "success");
    } catch (error) {
      showToast("댓글 삭제 중 오류가 발생했습니다.", "error");
    } finally {
      setCommentToDelete(null);
    }
  };

  const handleCancelDeleteComment = () => {
    setDeleteCommentModalVisible(false);
    setCommentToDelete(null);
  };

  const isMyPost = post && currentUser && post.authorId === currentUser.uid;

  if (loadingPost || !post) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator />
          <Text style={{ marginTop: 8 }}>게시글을 불러오는 중입니다...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const dateText = formatDateTime(post.createdAt);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.safeArea}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
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
          <View style={styles.titleRow}>
            <Text style={styles.titleText}>{post.title}</Text>

            {isMyPost && (
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
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.metaRow}>
            <Text style={styles.metaAuthor}>{post.authorName}</Text>
            <Text style={styles.metaDate}>{dateText}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.bodyBlock}>
            <Text style={styles.bodyText}>{post.contents}</Text>
          </View>

          {post.imageUrl ? (
            <View style={styles.imageBox}>
              <Image
                source={{ uri: post.imageUrl }}
                style={styles.postImage}
                resizeMode="cover"
              />
            </View>
          ) : null}

          <View style={[styles.divider, { marginTop: 24 }]} />

          <View style={styles.commentHeaderRow}>
            <Text style={styles.commentHeaderText}>
              댓글 {loadingComments ? "..." : comments.length}
            </Text>
          </View>

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
              style={[
                styles.commentSubmitButton,
                isSubmittingComment && { opacity: 0.7 },
              ]}
              onPress={handleCommentSubmit}
              activeOpacity={0.8}
              disabled={isSubmittingComment}
            >
              {isSubmittingComment ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.commentSubmitText}>등록</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.commentList}>
            {comments.map((comment) => {
              const mine =
                currentUser && comment.authorId === currentUser.uid;
              const isEditing = editingCommentId === comment.id;

              return (
                <View key={comment.id} style={styles.commentCard}>
                  <View style={styles.commentTopRow}>
                    <View style={styles.commentAuthorRow}>
                      <Text style={styles.commentAuthorLabel}>
                        {comment.authorName}
                      </Text>
                    </View>
                    <View style={styles.commentRightRow}>
                      {mine && !isEditing && (
                        <View style={styles.commentActionRow}>
                          <TouchableOpacity
                            style={[styles.badgeButton, styles.badgeEdit]}
                            onPress={() => handleCommentEditPress(comment)}
                            activeOpacity={0.8}
                          >
                            <Text style={styles.badgeButtonText}>수정</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.badgeButton, styles.badgeDelete]}
                            onPress={() => handleCommentDeletePress(comment)}
                            activeOpacity={0.8}
                          >
                            <Text style={styles.badgeButtonText}>삭제</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                      <Text style={styles.commentDate}>
                        {formatDateTime(comment.createdAt)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.commentContentBlock}>
                    {isEditing ? (
                      <>
                        <TextInput
                          value={editingCommentText}
                          onChangeText={setEditingCommentText}
                          style={styles.commentEditInput}
                          multiline
                        />
                        <View style={styles.commentEditButtonRow}>
                          <TouchableOpacity
                            style={[
                              styles.commentEditButton,
                              styles.commentEditCancelButton,
                            ]}
                            onPress={handleCancelEditComment}
                            activeOpacity={0.8}
                          >
                            <Text style={styles.commentEditCancelText}>
                              취소
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.commentEditButton,
                              styles.commentEditSaveButton,
                            ]}
                            onPress={handleConfirmEditComment}
                            activeOpacity={0.8}
                          >
                            <Text style={styles.commentEditSaveText}>
                              저장
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </>
                    ) : (
                      <Text style={styles.commentContentText}>
                        {comment.content}
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>

          <View style={{ height: 24 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      <ConfirmModal
        visible={deletePostModalVisible}
        title="게시글 삭제"
        message="정말 이 게시글을 삭제하시겠습니까?"
        confirmText="삭제"
        cancelText="취소"
        onConfirm={handleConfirmDeletePost}
        onCancel={handleCancelDeletePost}
      />

      <ConfirmModal
        visible={deleteCommentModalVisible}
        title="댓글 삭제"
        message="정말 이 댓글을 삭제하시겠습니까?"
        confirmText="삭제"
        cancelText="취소"
        onConfirm={handleConfirmDeleteComment}
        onCancel={handleCancelDeleteComment}
      />

      <ToastMessage
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
      />
    </SafeAreaView>
  );
}

const HEADER_HEIGHT = 72;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
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
  headerTitle: {
    flex: 1,
    textAlign: "center",
    marginRight: 40,
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  backIcon: {
    width: 20,
    height: 20,
  },
  scroll: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
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
  bodyBlock: {
    marginTop: 12,
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#111827",
  },
  imageBox: {
    marginTop: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  postImage: {
    width: "100%",
    height: 200,
  },
  commentHeaderRow: {
    marginTop: 24,
    marginBottom: 8,
  },
  commentHeaderText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
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
  commentEditInput: {
    borderWidth: 1,
    borderColor: "#4CAF7D",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: "#111827",
    backgroundColor: "#FFFFFF",
  },
  commentEditButtonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 6,
    gap: 8,
  },
  commentEditButton: {
    paddingHorizontal: 10,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  commentEditCancelButton: {
    backgroundColor: "#E5E7EB",
  },
  commentEditSaveButton: {
    backgroundColor: "#4CAF7D",
  },
  commentEditCancelText: {
    fontSize: 12,
    color: "#111827",
  },
  commentEditSaveText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "600",
  },
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
});
