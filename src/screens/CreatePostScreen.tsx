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
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InputBox from "../components/InputBox";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import { auth, db, storage } from "../../firebaseconfig";
import { getStorage } from "firebase/storage";
import ToastMessage from "../components/ToastMessage";

console.log("🔎 storageBucket(runtime):", getStorage().app.options.storageBucket);

type Props = {
  navigation: any;
};

export default function CreatePostScreen({ navigation }: Props) {
  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      setToastType("error");
      setToastMessage("이미지를 첨부하려면 갤러리 접근 권한이 필요합니다.");
      setToastVisible(true);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uploadImageToStorage = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const filename = `posts/${Date.now()}_${Math.random()
        .toString(36)
        .slice(2)}.jpg`;

      const storageRef = ref(storage, filename);

      await uploadBytes(storageRef, blob);

      const downloadUrl = await getDownloadURL(storageRef);
      return downloadUrl;
    } catch (error: any) {
      setToastType("error");
      setToastMessage("이미지 업로드 중 오류가 발생했습니다.");
      setToastVisible(true);
      throw error;
    }
  };
  


  const handleSubmit = async () => {
    if (!title.trim()) {
      setToastType("error");
      setToastMessage("제목을 입력해주세요.");
      setToastVisible(true);
      return;
    }
    if (!contents.trim()) {
      setToastType("error");
      setToastMessage("내용을 입력해주세요.");
      setToastVisible(true);
      return;
    }

    try {
      setIsSubmitting(true);

      let imageUrl: string | null = null;

      if (imageUri) {
        imageUrl = await uploadImageToStorage(imageUri);
      }

      const user = auth.currentUser;

      if (!user) {
        setToastType("error");
        setToastMessage("로그인 후에만 게시글을 작성할 수 있습니다.");
        setToastVisible(true);
        return;
      }

      const authorName = user?.displayName || "사용자";

      await addDoc(collection(db, "posts"), {
        title: title.trim(),
        contents: contents.trim(),
        imageUrl,
        createdAt: serverTimestamp(),
        authorId: user ? user.uid : null,
        commentCount: 0,
        authorName,
      });

      setToastType("success");
      setToastMessage("게시글이 등록되었습니다.");
      setToastVisible(true);

      setTimeout(() => {
        setToastVisible(false);
        navigation.goBack();
      }, 1200);
    } catch (error) {
      setToastType("error");
      setToastMessage("게시글 등록 중 오류가 발생했습니다.");
      setToastVisible(true);
    } finally {
      setIsSubmitting(false);
    }
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

          <Text style={styles.headerTitle}>게시글 작성</Text>
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
              placeholder="내용을 입력해주세요. (300자 이내)"
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
              style={styles.contentsInput}
              maxLength={300}
            />
          </View>

          <TouchableOpacity
            style={styles.imageAttachBox}
            activeOpacity={0.8}
            onPress={handlePickImage}
          >
            {imageUri ? (
              <>
                <Image
                  source={{ uri: imageUri }}
                  style={styles.previewImage}
                  resizeMode="cover"
                />
              </>
            ) : (
              <>
                <Image
                  source={require("../../assets/ImageIcon.png")}
                  style={styles.cameraIcon}
                  resizeMode="contain"
                />
                <Text style={styles.imageAttachText}>이미지 첨부(선택)</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.bottomButtonWrapper}>
            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && { opacity: 0.7 }]}
              activeOpacity={0.8}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>작성 완료</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
        <ToastMessage
          visible={toastVisible}
          message={toastMessage}
          type={toastType}
        />
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
    overflow: "hidden",
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
  previewImage: {
    width: "100%",
    height: "100%",
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
  backIcon: {
    width: 20,
    height: 20,
  },
});
