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

export default function EditPostScreen({ navigation }: Props) {
  const [title, setTitle] = useState("현재 제목");
  const [contents, setContents] = useState("현재 내용");
  const [hasImage, setHasImage] = useState(true);

  const handleUpdate = () => {
    console.log("update post", { title, contents, hasImage });
  };

  const handleChangeImage = () => {
    console.log("change image");
  };

  const handleDeleteImage = () => {
    setHasImage(false);
    console.log("delete image");
  };

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

          <Text style={styles.headerTitle}>게시글 수정</Text>
        </View>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.fieldBlock}>
            <Text style={styles.label}>제목</Text>
            <InputBox
              value={title}
              onChangeText={setTitle}
              placeholder="제목을 입력해주세요."
              inputStyle={styles.titleInput}
            />
          </View>
          <View style={styles.fieldBlock}>
            <Text style={styles.label}>내용</Text>
            <TextInput
              value={contents}
              onChangeText={setContents}
              placeholder="내용을 입력해주세요."
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
              style={styles.contentsInput}
            />
          </View>
          {hasImage && (
            <View style={styles.imageBox}>
              <View style={styles.imageInner}>
                <Image
                  source={require("../../assets/ImageIcon.png")}
                  style={styles.imageIcon}
                  resizeMode="contain"
                />
              </View>
            </View>
          )}
          <View style={styles.imageButtonRow}>
            <TouchableOpacity
              style={[styles.imageButton, styles.imageButtonEdit]}
              onPress={handleChangeImage}
              activeOpacity={0.8}
            >
              <Text style={styles.imageButtonText}>이미지 수정</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.imageButton, styles.imageButtonDelete]}
              onPress={handleDeleteImage}
              activeOpacity={0.8}
            >
              <Text style={styles.imageButtonText}>이미지 삭제</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bottomButtonWrapper}>
            <TouchableOpacity
              style={styles.submitButton}
              activeOpacity={0.8}
              onPress={handleUpdate}
            >
              <Text style={styles.submitButtonText}>수정 완료</Text>
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
  scroll: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
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
  imageBox: {
    marginTop: 8,
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
  imageIcon: {
    width: 72,
    height: 72,
  },
  imageButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  imageButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  imageButtonEdit: {
    marginRight: 8,
    backgroundColor: "#86C98F",
  },
  imageButtonDelete: {
    marginLeft: 8,
    backgroundColor: "#B85C5C",
  },
  imageButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  bottomButtonWrapper: {
    marginTop: 40,
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
