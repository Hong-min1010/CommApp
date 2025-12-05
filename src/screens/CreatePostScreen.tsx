// src/screens/CreatePostScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InputBox from "../components/InputBox";

type Props = {
  navigation: any;
};

export default function CreatePostScreen({ navigation }: Props) {
  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");

  const handleSubmit = () => {
    // TODO: 실제 게시글 작성 로직 연동 (예: Firebase / API)
    console.log("create post", { title, contents });
  };

  const handlePickImage = () => {
    // TODO: 이미지 선택 로직 (ImagePicker 등)
    console.log("pick image");
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

          <Text style={styles.headerTitle}>게시글 작성</Text>
        </View>

        {/* 내용 영역 + 버튼까지 모두 스크롤 */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* 제목 */}
          <View style={styles.fieldBlock}>
            <Text style={styles.label}>제목</Text>
            <InputBox
              value={title}
              onChangeText={setTitle}
              placeholder="제목을 입력해주세요."
              inputStyle={styles.titleInput}
            />
          </View>

          {/* 내용 */}
          <View style={styles.fieldBlock}>
            <Text style={styles.label}>내용</Text>
            <TextInput
              value={contents}
              onChangeText={setContents}
              placeholder="내용을 입력해주세요. (300자 이내)"
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
              style={styles.contentsInput}
            />
          </View>

          {/* 이미지 첨부 영역 */}
          <TouchableOpacity
            style={styles.imageAttachBox}
            activeOpacity={0.8}
            onPress={handlePickImage}
          >
            <Image
              source={require("../../assets/ImageIcon.png")}
              style={styles.cameraIcon}
              resizeMode="contain"
            />
            <Text style={styles.imageAttachText}>이미지 첨부</Text>
          </TouchableOpacity>

          {/* 하단 작성 완료 버튼 (스크롤 안에 위치) */}
          <View style={styles.bottomButtonWrapper}>
            <TouchableOpacity
              style={styles.submitButton}
              activeOpacity={0.8}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>작성 완료</Text>
            </TouchableOpacity>
          </View>
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
    marginRight: 12,
  },
  backButtonText: {
    fontSize: 18,
    color: "#111827",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    marginRight: 44,
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  /* Scroll area */
  scroll: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32, // 아래 여백
  },

  /* Fields */
  fieldBlock: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#111827",
    marginBottom: 8,
  },
  titleInput: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#111827",
    paddingHorizontal: 12,
  },
  contentsInput: {
    minHeight: 140,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#111827",
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#111827",
  },

  /* Image attach */
  imageAttachBox: {
    marginTop: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#9CA3AF",
    height: 160,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  cameraIcon: {
    width: 48,
    height: 48,
    marginBottom: 8,
  },
  imageAttachText: {
    fontSize: 14,
    color: "#111827",
  },
  bottomButtonWrapper: {
    marginBottom: 12,
  },
  submitButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: "#4CAF7D",
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  backIcon : {
    width:20,
    height: 20,
  }
});
