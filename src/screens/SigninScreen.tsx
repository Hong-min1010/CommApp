import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import InputBox from "../components/InputBox";
import ToastMessage from "../components/ToastMessage";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseconfig";
import { RouteProp } from "@react-navigation/native";

type Props = {
  navigation: any;
  route: RouteProp<RootStackParamList, "Signin">;
};

type RootStackParamList = {
  Signin:
    | {
        toastMessage?: string;
        toastType?: "success" | "error";
      }
    | undefined;
};

export default function SigninScreen({ navigation, route }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  const isLoginEnabled = email.length > 0 && password.length > 0;

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToastType(type);
    setToastMessage(message);
    setToastVisible(true);

    setTimeout(() => {
      setToastVisible(false);
    }, 1500);
  };

  useEffect(() => {
    if (route.params?.toastMessage) {
      showToast(
        route.params.toastMessage,
        route.params.toastType || "success"
      );
      navigation.setParams({ toastMessage: undefined, toastType: undefined });
    }
  }, [route.params, navigation]);

  const handleLogin = async () => {
    setEmailError(null);
    setLoginError(null);

    if (!emailRegex.test(email)) {
      const msg = "올바른 이메일 형식으로 입력해주세요.";
      setEmailError(msg);
      showToast(msg, "error");
      return;
    }

    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("로그인 성공:", user.email, user.uid);
      navigation.reset({
        index: 0,
        routes: [
          {
            name: "Main",
            params: {
              toastMessage: "로그인에 성공했습니다.",
              toastType: "success",
            },
          },
        ],
      });
    } catch (error: any) {
      console.log("로그인 오류:", error.code, error.message);

      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        const msg = "이메일 또는 비밀번호가 올바르지 않습니다.";
        setLoginError(msg);
        showToast(msg, "error");
      } else if (error.code === "auth/invalid-email") {
        const msg = "유효하지 않은 이메일 형식입니다.";
        setLoginError(msg);
        showToast(msg, "error");
      } else {
        const msg = "로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
        setLoginError(msg);
        showToast(msg, "error");
      }
    } finally {
      setLoading(false);
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
              <View style={styles.iconCircle}>
                <Image
                  source={require("../../assets/MainIcon.png")}
                  style={styles.iconImage}
                  resizeMode="contain"
                />
              </View>
            </View>
            <View style={styles.formContainer}>
              <Text style={styles.signinTitle}>Signin</Text>
              <View style={styles.fieldBlock}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputRow}>
                  <View style={styles.iconBox}>
                    <Image
                      source={require("../../assets/EmailIcon.png")}
                      style={styles.iconStyle}
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
                {emailError && <Text style={styles.errorText}>{emailError}</Text>}
              </View>
              <View style={styles.fieldBlock}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputRow}>
                  <View style={styles.iconBox}>
                    <Image
                      source={require("../../assets/PasswordIcon.png")}
                      style={styles.iconStyle}
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
              {loginError && <Text style={styles.errorText}>{loginError}</Text>}
              <TouchableOpacity
                style={[
                  styles.loginButton,
                  (!isLoginEnabled || loading) && styles.loginButtonDisabled,
                ]}
                disabled={!isLoginEnabled || loading}
                onPress={handleLogin}
                activeOpacity={0.8}
              >
                <Text style={styles.loginButtonText}>
                  {loading ? "로그인 중..." : "로그인"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.signupButton}
                onPress={() => navigation.navigate("Signup")}
                activeOpacity={0.8}
              >
                <Text style={styles.ButtonText}>회원가입</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <ToastMessage
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
      />
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
  signinTitle: {
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
    marginRight: 0,
  },
  iconText: {
    fontSize: 18,
    color: "#FFFFFF",
  },
  textInput: {
    flex: 1,
    height: 48,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    borderWidth: 1,
    borderColor: "#111827",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    fontSize: 14,
  },
  loginButton: {
    marginTop: 16,
    height: 52,
    borderRadius: 12,
    backgroundColor: "#4CAF7D",
    alignItems: "center",
    justifyContent: "center",
  },
  loginButtonDisabled: {
    backgroundColor: "#A7D5B9",
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  findRow: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
  },
  findText: {
    fontSize: 12,
    color: "#111827",
  },
  signupButton: {
    marginTop: 32,
    height: 52,
    borderRadius: 12,
    backgroundColor: "#888888ff",
    alignItems: "center",
    justifyContent: "center",
  },
  ButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: "red",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
});
