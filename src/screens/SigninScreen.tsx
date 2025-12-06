import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InputBox from "../components/InputBox";
import { ScrollView } from "react-native";

type Props = {
  navigation: any;
};

export default function SigninScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  const isLoginEnabled = email.length > 0 && password.length > 0;

  const handleLogin = () => {
    setEmailError(null);

    if(!emailRegex.test(email)) {
      setEmailError("올바른 이메일 형식으로 입력해주세요.");
      return;
    }
    console.log("login", email, password);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.safeArea}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps='handled'
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
                  styles.loginButton,
                  !isLoginEnabled && styles.loginButtonDisabled,
                ]}
                disabled={!isLoginEnabled}
                onPress={handleLogin}
                activeOpacity={0.8}
              >
                <Text style={styles.loginButtonText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.signupButton}
                onPress={() => navigation.navigate("SignUp")}
                activeOpacity={0.8}
              >
                <Text style={styles.ButtonText}>회원가입</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.googleButton}
                activeOpacity={0.8}
              >
                <View style={styles.googleInner}>
                  <View style={styles.googleIconBox}>
                    <Image
                      source={require("../../assets/GoogleIcon.png")}
                      style={styles.iconStyle}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={styles.ButtonText}>구글 계정으로 로그인하기</Text>
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
    borderColor: 'black',
    borderStyle: 'solid',
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
    backgroundColor: "#4CAF7D",
    alignItems: "center",
    justifyContent: "center",
  },
  ButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  googleButton: {
    marginTop: 16,
    height: 52,
    borderRadius: 12,
    backgroundColor: "#8a8a8aff",
    alignItems: "center",
    justifyContent: "center",
  },
  googleInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
  errorText : {
    color: 'red'
  },
  iconStyle : {
    width: 20,
    height: 20,
  }
});
