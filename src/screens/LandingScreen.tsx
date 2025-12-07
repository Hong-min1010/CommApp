// src/screens/LandingScreen.tsx
import React, { useEffect, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  Easing,
} from "react-native";

type Props = {
  navigation: any; // 필요하면 여기 나중에 네이티브 스택 타입으로 바꿔도 됨
};

export default function LandingScreen({ navigation }: Props) {
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(20)).current;

  const iconOpacity = useRef(new Animated.Value(0)).current;
  const iconScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // 텍스트 페이드 + 위로 슬라이드
    Animated.timing(textOpacity, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();

    Animated.timing(textTranslateY, {
      toValue: 0,
      duration: 600,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();

    // 아이콘 등장 + 살짝 통통 튀는 애니메이션
    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.timing(iconOpacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.spring(iconScale, {
          toValue: 1,
          friction: 5,
          tension: 80,
          useNativeDriver: true,
        }),
      ]),
      Animated.loop(
        Animated.sequence([
          Animated.timing(iconScale, {
            toValue: 1.03,
            duration: 1200,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(iconScale, {
            toValue: 1,
            duration: 1200,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();

    // ✅ 1.5초 뒤 Main 화면으로 이동
    const timer = setTimeout(() => {
      navigation.replace("Signin");
      // 만약 뒤로가기 눌렀을 때 Landing 다시 보고 싶으면 navigate("Main") 사용
      // navigation.navigate("Main");
    }, 1500);

    // cleanup
    return () => clearTimeout(timer);
  }, [navigation, textOpacity, textTranslateY, iconOpacity, iconScale]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.textWrapper,
            {
              opacity: textOpacity,
              transform: [{ translateY: textTranslateY }],
            },
          ]}
        >
          <Text style={styles.appName}>CommApp</Text>
          <Text style={styles.subtitle}>생각과 경험을 자유롭게 공유하세요.</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.iconWrapper,
            {
              opacity: iconOpacity,
              transform: [{ scale: iconScale }],
            },
          ]}
        >
          <Image
            source={require("../../assets/MainIcon.png")}
            style={styles.iconImage}
            resizeMode="contain"
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  textWrapper: {
    alignItems: "center",
    marginBottom: 40,
  },
  appName: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#4B5563",
    textAlign: "center",
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconImage: {
    width: 300,
    height: 300,
  },
});
