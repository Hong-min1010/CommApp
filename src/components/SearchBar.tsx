import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  NativeSyntheticEvent,
  Image,
  TextInputSubmitEditingEventData,
} from "react-native";

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  errorMessage?: string;
  touched?: boolean;
  onBlur?: () => void;
  onFocus?: () => void;
};

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onSubmit,
  placeholder = "게시글 제목을 입력해주세요.",
  errorMessage,
  touched,
  onBlur,
  onFocus,
}) => {
  const handleSubmitEditing = (
    _e: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => {
    onSubmit?.();
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.iconBox}>
        <Image
          source={require("../../assets/SearchIcon.png")}
          style={styles.iconImage}
          resizeMode="contain"
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          style={[
            styles.input,
            touched && errorMessage ? styles.inputError : undefined,
          ]}
          returnKeyType="search"
          onSubmitEditing={handleSubmitEditing}
          onBlur={onBlur}
          onFocus={onFocus}
        />
      </View>
      {touched && !!errorMessage && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
    backgroundColor: "#FFFFFF",
  },
  iconBox: {
    position: "absolute",
    left: 24,
    top: 22,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  iconText: {
    fontSize: 20,
    color: "#111827",
  },
  iconImage: {
    width: 20,
    height: 20,
  },
  inputContainer: {
    width: "100%",
    justifyContent: "center",
  },
  input: {
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingLeft: 44,
    paddingRight: 12,
    fontSize: 14,
    color: "#111827",
    backgroundColor: "#FFFFFF",
  },
  inputError: {
    borderColor: "#EF4444",
  },
  errorText: {
    marginTop: 4,
    marginLeft: 4,
    fontSize: 12,
    color: "#EF4444",
  },
});
