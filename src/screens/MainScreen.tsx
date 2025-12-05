// src/screens/MainScreen.tsx
import React, { useMemo, useState, useRef, useEffect } from "react";
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
import PostCard from "../components/Contents/PostCard";

type Post = {
  id: string;
  title: string;
  contents: string;
  author: string;
  createdAtText: string; // 예: "12"
  commentCount: number;
};

// 임시 더미 데이터
const DUMMY_POSTS: Post[] = [
  { id: "1", title: "Title", contents: "Contents", author: "Name", createdAtText: "12", commentCount: 3 },
  { id: "2", title: "Title", contents: "Contents", author: "Name", createdAtText: "12", commentCount: 1 },
  { id: "3", title: "Title", contents: "Contents", author: "Name", createdAtText: "12", commentCount: 3 },
  { id: "4", title: "Title", contents: "Contents", author: "Name", createdAtText: "12", commentCount: 1 },
  { id: "5", title: "Title", contents: "Contents", author: "Name", createdAtText: "12", commentCount: 3 },
  { id: "6", title: "Title", contents: "Contents", author: "Name", createdAtText: "12", commentCount: 1 },
  { id: "7", title: "Title", contents: "Contents", author: "Name", createdAtText: "12", commentCount: 3 },
  { id: "8", title: "Title", contents: "Contents", author: "Name", createdAtText: "12", commentCount: 1 },
  { id: "9", title: "Title", contents: "Contents", author: "Name", createdAtText: "12", commentCount: 3 },
  { id: "10", title: "Title", contents: "Contents", author: "Name", createdAtText: "12", commentCount: 1 },
  { id: "11", title: "Title", contents: "Contents", author: "Name", createdAtText: "12", commentCount: 3 },
  { id: "12", title: "Title", contents: "Contents", author: "Name", createdAtText: "12", commentCount: 1 },
  { id: "13", title: "Title", contents: "Contents", author: "Name", createdAtText: "12", commentCount: 3 },
  { id: "14", title: "Title55", contents: "Contents", author: "Name", createdAtText: "12", commentCount: 1 },
  { id: "15", title: "Title56", contents: "Contents", author: "Name", createdAtText: "12", commentCount: 3 },
  { id: "16", title: "Title5", contents: "Contents", author: "Name", createdAtText: "12", commentCount: 1 },
];

type Props = {
  navigation: any;
  nickname?: string; // 없으면 기본 "Name"
};

export default function MainScreen({ navigation, nickname = "Name" }: Props) {
  const [keyword, setKeyword] = useState("");
  const [viewedCount, setViewedCount] = useState(0); // 지금까지 본 게시글 개수

  const filteredPosts = useMemo(() => {
    if (!keyword.trim()) return DUMMY_POSTS;
    const lower = keyword.toLowerCase();
    return DUMMY_POSTS.filter((post) =>
      post.title.toLowerCase().includes(lower)
    );
  }, [keyword]);

  const totalCount = filteredPosts.length;

  // 지금까지 본(최대 index) / 전체 개수 로 게이지 계산
  const progress =
    totalCount === 0 ? 0 : Math.min(1, viewedCount / totalCount);

  const handleSearchSubmit = () => {
    console.log("search keyword:", keyword);
  };

  // 화면에 보이는 아이템이 바뀔 때마다 호출
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
      if (viewableItems.length === 0) return;

      // 현재 화면에 보이는 아이템 중 가장 큰 index = 현재 위치
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
        {/* 상단 초록색 Header */}
        <View style={styles.header}>
          <Text style={styles.headerHello}>Hello,</Text>
          <Text style={styles.headerName}>{nickname}</Text>
        </View>

        {/* SearchBar */}
        <View style={styles.searchWrapper}>
          <SearchBar
            value={keyword}
            onChangeText={setKeyword}
            onSubmit={handleSearchSubmit}
            placeholder="게시글 제목을 입력해주세요."
          />
        </View>

        {/* 게이지 바 */}
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

        {/* 게시글 그리드 */}
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
              createdAtText={item.createdAtText}
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

  /* Header */
  header: {
    height: HEADER_HEIGHT,
    backgroundColor: "#4CAF7D",
    paddingHorizontal: 24,
    justifyContent: "flex-end",
    paddingBottom: 16,
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

  /* SearchBar */
  searchWrapper: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  /* Gauge */
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

  /* Count text */
  countWrapper: {
    alignItems: "center",
    marginTop: 12,
  },
  countText: {
    fontSize: 14,
    color: "#111827",
  },

  /* Post list */
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
