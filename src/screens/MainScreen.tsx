import React, { useMemo, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ViewToken,
  TouchableOpacity,
} from "react-native";
import SearchBar from "../components/SearchBar";
import PostCard from "../components/PostCard";

type Post = {
  id: string;
  title: string;
  contents: string;
  author: string;
  commentCount: number;
};

const DUMMY_POSTS: Post[] = [
  { id: "1", title: "Title", contents: "Contents", author: "Name", commentCount: 3 },
  { id: "2", title: "Title", contents: "Contents", author: "Name", commentCount: 1 },
  { id: "3", title: "Title", contents: "Contents", author: "Name", commentCount: 3 },
  { id: "4", title: "Title", contents: "Contents", author: "Name", commentCount: 1 },
  { id: "5", title: "Title", contents: "Contents", author: "Name", commentCount: 3 },
  { id: "6", title: "Title", contents: "Contents", author: "Name", commentCount: 1 },
  { id: "7", title: "Title", contents: "Contents", author: "Name", commentCount: 3 },
  { id: "8", title: "Title", contents: "Contents", author: "Name", commentCount: 1 },
  { id: "9", title: "Title", contents: "Contents", author: "Name", commentCount: 3 },
  { id: "10", title: "Title", contents: "Contents", author: "Name", commentCount: 1 },
  { id: "11", title: "Title", contents: "Contents", author: "Name", commentCount: 3 },
  { id: "12", title: "Title", contents: "Contents", author: "Name", commentCount: 1 },
  { id: "13", title: "Title", contents: "Contents", author: "Name", commentCount: 3 },
  { id: "14", title: "Title55", contents: "Contents", author: "Name", commentCount: 1 },
  { id: "15", title: "Title56", contents: "Contents", author: "Name", commentCount: 3 },
  { id: "16", title: "Title5", contents: "Contents", author: "Name", commentCount: 1 },
];

type Props = {
  navigation: any;
  nickname?: string;
};

export default function MainScreen({ navigation, nickname = "Name" }: Props) {
  const [keyword, setKeyword] = useState("");
  const [viewedCount, setViewedCount] = useState(0);

  const filteredPosts = useMemo(() => {
    if (!keyword.trim()) return DUMMY_POSTS;
    const lower = keyword.toLowerCase();
    return DUMMY_POSTS.filter((post) =>
      post.title.toLowerCase().includes(lower)
    );
  }, [keyword]);

  const totalCount = filteredPosts.length;

  const progress =
    totalCount === 0 ? 0 : Math.min(1, viewedCount / totalCount);

  const handleSearchSubmit = () => {
    console.log("search keyword:", keyword);
  };

  const handleLogout = async () => {
    try {
      navigation.replace("SignIn");
    } catch (error) {
      console.log("logout error:", error);
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
            <Text style={styles.headerName}>{nickname}</Text>
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
              commentCount={item.commentCount}
              onPress={() => {
                console.log("press post:", item.id);
              }}
            />
          )}
          showsVerticalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
        />
      </View>
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
  countWrapper: {
    alignItems: "center",
    marginTop: 12,
  },
  countText: {
    fontSize: 14,
    color: "#111827",
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
