import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InputBox from "../components/InputBox";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebaseconfig";
import ToastMessage from "../components/ToastMessage";

type Props = {
  navigation: any;
};

export default function SignupScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] =
    useState<"success" | "error">("error");
  const showToast = (message: string, type: "success" | "error" = "error") => {
    setToastType(type);
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 1500);
  };

  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  const isSignUpEnabled =
    email.length > 0 &&
    name.length > 0 &&
    password.length > 0 &&
    confirmPassword.length > 0;

  const handleSignUp = async () => {
    setEmailError(null);

    if (!emailRegex.test(email)) {
      const msg = "올바른 이메일 형식으로 입력해주세요.";
      setEmailError(msg);
      showToast(msg, "error");
      return;
    }

    if (password.length < 6) {
      showToast("비밀번호는 최소 6자 이상이어야 합니다.", "error");
      return;
    }

    if (password !== confirmPassword) {
      showToast("비밀번호가 서로 일치하지 않습니다.", "error");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await updateProfile(user, {
        displayName: name,
      });
      navigation.navigate("Signin", {
        toastMessage: "회원가입이 완료되었습니다.",
        toastType: "success",
      });
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        showToast("이미 사용 중인 이메일입니다.", "error");
      } else if (error.code === "auth/invalid-email") {
        showToast("유효하지 않은 이메일입니다.", "error");
      } else {
        showToast(
          "회원가입 중 오류가 발생했습니다. 다시 시도해주세요.",
          "error"
        );
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.safeArea}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.navigate("Signin")}
                activeOpacity={0.8}
              >
                <Image
                  source={require("../../assets/BackIcon.png")}
                  style={styles.backIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <View style={styles.iconCircle}>
                <Image
                  source={require("../../assets/MainIcon.png")}
                  style={styles.iconImage}
                  resizeMode="contain"
                />
              </View>
            </View>
            <View style={styles.formContainer}>
              <Text style={styles.title}>Signup</Text>
              <View style={styles.fieldBlock}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputRow}>
                  <View style={styles.iconBox}>
                    <Image
                      source={require("../../assets/EmailIcon.png")}
                      style={styles.fieldIcon}
                      resizeMode="contain"
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <InputBox
                      value={email}
                      onChangeText={setEmail}
                      placeholder="이메일을 입력해주세요."
                      inputStyle={{
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                        borderLeftWidth: 0,
                        height: 48,
                      }}
                    />
                  </View>
                </View>
                {emailError && (
                  <Text style={styles.errorText}>{emailError}</Text>
                )}
              </View>
              <View style={styles.fieldBlock}>
                <Text style={styles.label}>Name</Text>
                <View style={styles.inputRow}>
                  <View style={styles.iconBox}>
                    <Image
                      source={require("../../assets/NameIcon.png")}
                      style={styles.fieldIcon}
                      resizeMode="contain"
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <InputBox
                      value={name}
                      onChangeText={setName}
                      placeholder="이름을 입력해주세요."
                      inputStyle={{
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                        borderLeftWidth: 0,
                        height: 48,
                      }}
                    />
                  </View>
                </View>
              </View>
              <View style={styles.fieldBlock}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputRow}>
                  <View style={styles.iconBox}>
                    <Image
                      source={require("../../assets/PasswordIcon.png")}
                      style={styles.fieldIcon}
                      resizeMode="contain"
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <InputBox
                      value={password}
                      onChangeText={setPassword}
                      placeholder="비밀번호를 입력해주세요."
                      secureTextEntry
                      inputStyle={{
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                        borderLeftWidth: 0,
                        height: 48,
                      }}
                    />
                  </View>
                </View>
              </View>
              <View style={styles.fieldBlock}>
                <Text style={styles.label}>ConfirmPassword</Text>
                <View style={styles.inputRow}>
                  <View style={styles.iconBox}>
                    <Image
                      source={require("../../assets/PasswordIcon.png")}
                      style={styles.fieldIcon}
                      resizeMode="contain"
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <InputBox
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      placeholder="비밀번호를 다시 입력해주세요."
                      secureTextEntry
                      inputStyle={{
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                        borderLeftWidth: 0,
                        height: 48,
                      }}
                    />
                  </View>
                </View>
              </View>
              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  !isSignUpEnabled && styles.primaryButtonDisabled,
                ]}
                disabled={!isSignUpEnabled}
                onPress={handleSignUp}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>회원가입 완료</Text>
              </TouchableOpacity>
            </View>
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

const HEADER_HEIGHT = 180;

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
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    left: 16,
    top: 16,
    width: 32,
    height: 32,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#111827",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    fontSize: 18,
    color: "#111827",
  },
  scrollContent: {
    flexGrow: 1,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  iconImage: {
    width: 120,
    height: 120,
  },
  formContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  fieldBlock: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#111827",
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    width: 48,
    height: 48,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    backgroundColor: "#4CAF7D",
    borderWidth: 1,
    borderColor: "black",
    borderRightWidth: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  fieldIcon: {
    width: 20,
    height: 20,
  },
  errorText: {
    marginTop: 4,
    color: "red",
    fontSize: 12,
  },
  primaryButton: {
    marginTop: 24,
    height: 52,
    borderRadius: 12,
    backgroundColor: "#4CAF7D",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonDisabled: {
    backgroundColor: "#A7D5B9",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  googleButton: {
    marginTop: 16,
    height: 52,
    borderRadius: 12,
    backgroundColor: "#8A8A8A",
    alignItems: "center",
    justifyContent: "center",
  },
  googleInner: {
    flexDirection: "row",
    alignItems: "center",
  },
  googleIconBox: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  googleButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  backIcon: {
    width: 20,
    height: 20,
  },
});
