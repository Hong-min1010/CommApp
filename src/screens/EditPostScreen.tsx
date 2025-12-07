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
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RouteProp } from "@react-navigation/native";
import InputBox from "../components/InputBox";
import { doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../firebaseconfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";

type RootStackParamList = {
  Edit: {
    postId: string;
    title: string;
    contents: string;
    imageUrl: string | null;
  };
};

type Props = {
  navigation: any;
  route: RouteProp<RootStackParamList, "Edit">;
};

export default function EditPostScreen({ navigation, route }: Props) {
  const {
    postId,
    title: initialTitle,
    contents: initialContents,
    imageUrl: initialImageUrl,
  } = route.params;

  const [title, setTitle] = useState(initialTitle);
  const [contents, setContents] = useState(initialContents);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(
    initialImageUrl
  );
  const [localImageUri, setLocalImageUri] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasImage = !!(localImageUri || currentImageUrl);

  const handleChangeImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("권한 필요", "이미지를 첨부하려면 갤러리 접근 권한이 필요합니다.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setLocalImageUri(result.assets[0].uri);
    }
  };

  const handleDeleteImage = () => {
    setLocalImageUri(null);
    setCurrentImageUrl(null);
  };

  const uploadImageIfNeeded = async (): Promise<string | null> => {
    if (localImageUri) {
      const response = await fetch(localImageUri);
      const blob = await response.blob();

      const filename = `posts/${Date.now()}_${Math.random()
        .toString(36)
        .slice(2)}.jpg`;

      const storageRef = ref(storage, filename);
      await uploadBytes(storageRef, blob);
      const downloadUrl = await getDownloadURL(storageRef);
      return downloadUrl;
    }

    return currentImageUrl;
  };

  const handleUpdate = async () => {
    const trimmedTitle = title.trim();
    const trimmedContents = contents.trim();

    if (!trimmedTitle) {
      Alert.alert("알림", "제목을 입력해주세요.");
      return;
    }
    if (!trimmedContents) {
      Alert.alert("알림", "내용을 입력해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);

      const newImageUrl = await uploadImageIfNeeded();

      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        title: trimmedTitle,
        contents: trimmedContents,
        imageUrl: newImageUrl,
      });

      navigation.goBack();
    } catch (error) {
      console.log("update post error:", error);
      Alert.alert("알림", "게시글 수정 중 오류가 발생했습니다.");
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

          <TouchableOpacity
            style={styles.imageAttachBox}
            activeOpacity={0.8}
            onPress={handleChangeImage}
          >
            {hasImage ? (
              <Image
                source={{
                  uri: localImageUri ? localImageUri : (currentImageUrl as string),
                }}
                style={styles.previewImage}
                resizeMode="cover"
              />
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

          {hasImage && (
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
          )}

          <View style={styles.bottomButtonWrapper}>
            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && { opacity: 0.7 }]}
              activeOpacity={0.8}
              onPress={handleUpdate}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>수정 완료</Text>
              )}
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
  headerTitle: {
    flex: 1,
    textAlign: "center",
    marginRight: 44,
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
    marginBottom: 24,
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
  imageButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
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
    marginTop: 16,
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
});
