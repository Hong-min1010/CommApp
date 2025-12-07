import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ViewToken,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchBar from "../components/SearchBar";
import PostCard from "../components/PostCard";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebaseconfig";
import { RouteProp } from "@react-navigation/native";
import ToastMessage from "../components/ToastMessage";

import {
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

type Post = {
  id: string;
  title: string;
  contents: string;
  author: string;
};

type RootStackParamList = {
  Main:
    | {
        toastMessage?: string;
        toastType?: "success" | "error";
      }
    | undefined;
};

type Props = {
  navigation: any;
  route: RouteProp<RootStackParamList, "Main">;
  nickname?: string;
};

export default function MainScreen({
  navigation,
  route,
  nickname = "Name",
}: Props) {
  const [keyword, setKeyword] = useState("");
  const [viewedCount, setViewedCount] = useState(0);
  const [displayName, setDisplayName] = useState(nickname);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>(
    {}
  );
  const commentUnsubsRef = useRef<(() => void)[]>([]);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToastType(type);
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 1500);
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setDisplayName(
        user.displayName || (user.email ? user.email.split("@")[0] : nickname)
      );
    } else {
      setDisplayName(nickname);
    }
  }, [nickname]);

  useEffect(() => {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, orderBy("createdAt", "desc"));

    const unsubscribePosts = onSnapshot(
      q,
      (snapshot) => {
        const nextPosts: Post[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as any;
          return {
            id: docSnap.id,
            title: data.title ?? "",
            contents: data.contents ?? "",
            author: data.authorName ?? nickname ?? "익명",
          };
        });
        setPosts(nextPosts);
        setIsLoading(false);

        commentUnsubsRef.current.forEach((unsub) => unsub());
        commentUnsubsRef.current = [];

        nextPosts.forEach((post) => {
          const commentsRef = collection(db, "posts", post.id, "comments");
          const cq = query(commentsRef, orderBy("createdAt", "asc"));

          const unsub = onSnapshot(
            cq,
            (cSnap) => {
              setCommentCounts((prev) => ({
                ...prev,
                [post.id]: cSnap.size,
              }));
            },
            (error) => {
              setCommentCounts((prev) => ({
                ...prev,
                [post.id]: prev[post.id] ?? 0,
              }));
            }
          );

          commentUnsubsRef.current.push(unsub);
        });

        setCommentCounts((prev) => {
          const merged = { ...prev };
          nextPosts.forEach((p) => {
            if (merged[p.id] == null) merged[p.id] = 0;
          });
          return merged;
        });
      },
      (error) => {
        setIsLoading(false);
        showToast("게시글을 불러오지 못했습니다.", "error");
      }
    );

    return () => {
      unsubscribePosts();
      commentUnsubsRef.current.forEach((unsub) => unsub());
      commentUnsubsRef.current = [];
    };
  }, [nickname]);

  useEffect(() => {
    if (route.params?.toastMessage) {
      showToast(route.params.toastMessage, route.params.toastType || "success");
      navigation.setParams({ toastMessage: undefined, toastType: undefined });
    }
  }, [route.params, navigation]);

  const filteredPosts = useMemo(() => {
    if (!keyword.trim()) return posts;
    const lower = keyword.toLowerCase();
    return posts.filter((post) => post.title.toLowerCase().includes(lower));
  }, [keyword, posts]);

  const totalCount = filteredPosts.length;
  const progress = totalCount === 0 ? 0 : Math.min(1, viewedCount / totalCount);

  const handleSearchSubmit = () => {
    console.log("search keyword:", keyword);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate("Signin");
    } catch (error) {
      showToast("로그아웃에 실패했습니다.", "error");
    }
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
      if (viewableItems.length === 0) return;
      const maxIndex = viewableItems.reduce((max, item) => {
        const idx = item.index ?? 0;
        return idx > max ? idx : max;
      }, 0);

      setViewedCount(maxIndex + 1);
    }
  ).current;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerHello}>Hello,</Text>
            <Text style={styles.headerName}>{displayName}</Text>
          </View>
          <TouchableOpacity
            style={styles.logoutButton}
            activeOpacity={0.7}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>로그아웃</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.searchWrapper}>
          <SearchBar
            value={keyword}
            onChangeText={setKeyword}
            onSubmit={handleSearchSubmit}
            placeholder="게시글 제목을 입력해주세요."
          />
        </View>
        <View style={styles.gaugeWrapper}>
          <View style={styles.gaugeBackground}>
            <View style={[styles.gaugeFill, { width: `${progress * 100}%` }]} />
          </View>
        </View>
        <View style={styles.topActionRow}>
          <View style={{ flex: 1 }} />
          <TouchableOpacity
            style={styles.createButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("Create")}
          >
            <Text style={styles.createButtonText}>게시글 작성</Text>
          </TouchableOpacity>
        </View>
        {isLoading ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Text>게시글을 불러오는 중입니다...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredPosts}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <PostCard
                title={item.title}
                contents={item.contents}
                author={item.author}
                commentCount={commentCounts[item.id] ?? 0}
                onPress={() => {
                  navigation.navigate("Detail", { postId: item.id });
                }}
              />
            )}
            showsVerticalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            ListEmptyComponent={
              <View style={{ paddingVertical: 40, alignItems: "center" }}>
                <Text>등록된 게시글이 없습니다.</Text>
              </View>
            }
          />
        )}
      </View>
      <ToastMessage
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
      />
    </SafeAreaView>
  );
}

const HEADER_HEIGHT = 90;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    height: HEADER_HEIGHT,
    backgroundColor: "#4CAF7D",
    paddingHorizontal: 24,
    paddingBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  headerHello: {
    fontSize: 18,
    color: "#FFFFFF",
  },
  headerName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  searchWrapper: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  gaugeWrapper: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  gaugeBackground: {
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
  },
  gaugeFill: {
    height: "100%",
    backgroundColor: "#7C83FF",
    borderRadius: 2,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  topActionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 8,
  },
  createButton: {
    paddingHorizontal: 16,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#4CAF7D",
    alignItems: "center",
    justifyContent: "center",
  },
  createButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
