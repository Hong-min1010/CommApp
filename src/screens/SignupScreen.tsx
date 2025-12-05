// src/screens/SignUpScreen.tsx
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

type Props = {
  navigation: any;
};

export default function SignupScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);

  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  const isSignUpEnabled =
    email.length > 0 &&
    name.length > 0 &&
    password.length > 0 &&
    confirmPassword.length > 0;

  const handleSignUp = () => {
    setEmailError(null);

    if (!emailRegex.test(email)) {
      setEmailError("올바른 이메일 형식으로 입력해주세요.");
      return;
    }

    if (password !== confirmPassword) {
      // 필요하면 나중에 별도 에러 상태로 관리해도 됨
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    // TODO: Firebase Auth 회원가입 연결 예정
    console.log("signup", { email, name, password, confirmPassword });
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
            {/* 상단 초록 영역 + 로고 + 뒤로가기 버튼 */}
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

              <View style={styles.iconCircle}>
                <Image
                  source={require("../../assets/MainIcon.png")}
                  style={styles.iconImage}
                  resizeMode="contain"
                />
              </View>
            </View>

            {/* 폼 영역 */}
            <View style={styles.formContainer}>
              {/* 타이틀 */}
              <Text style={styles.title}>Signup</Text>

              {/* Email */}
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

              {/* Name */}
              <View style={styles.fieldBlock}>
                <Text style={styles.label}>Name</Text>
                <View style={styles.inputRow}>
                  <View style={styles.iconBox}>
                    <Image
                      // 사람 아이콘으로 된 이미지 파일로 교체해서 사용하면 됨
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

              {/* Password */}
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

              {/* Confirm Password */}
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

              {/* 회원가입 완료 버튼 */}
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

              {/* 구글 로그인 버튼 */}
              <TouchableOpacity style={styles.googleButton} activeOpacity={0.8}>
                <View style={styles.googleInner}>
                  <View style={styles.googleIconBox}>
                    <Image
                      source={require("../../assets/GoogleIcon.png")}
                      style={styles.fieldIcon}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={styles.googleButtonText}>
                    구글 계정으로 로그인하기
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
  backIcon : {
    width:20,
    height: 20,
  }
});
