import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from "react-native";

interface EmailInputProps {
  label?: string;
  value: string;
  onChangeValue: (email: string) => void;

  disabled?: boolean;
  errorText?: string;
  successText?: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
}

const DOMAIN_OPTIONS = [
  "gmail.com",
  "naver.com",
  "hanmail.com",
  "kakao.com",
  "직접입력",
];

const EmailInput: React.FC<EmailInputProps> = ({
  label,
  value,
  onChangeValue,
  disabled = false,
  errorText,
  successText,
  containerStyle,
  labelStyle,
}) => {
  const [localPart, setLocalPart] = useState("");
  const [domainPart, setDomainPart] = useState("");
  const [isCustomDomain, setIsCustomDomain] = useState(false);
  const [customDomain, setCustomDomain] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const customRef = useRef<TextInput | null>(null);

  useEffect(() => {
    if (!value) {
      setLocalPart("");
      setDomainPart("");
      setCustomDomain("");
      setIsCustomDomain(false);
      return;
    }

    const [local, domain] = value.split("@");
    setLocalPart(local || "");

    if (!domain) {
      setDomainPart("");
      setCustomDomain("");
      setIsCustomDomain(false);
      return;
    }

    const isInOptions = DOMAIN_OPTIONS.includes(domain);
    if (isInOptions || domain === "직접입력") {
      setDomainPart(domain);
      setCustomDomain("");
      setIsCustomDomain(false);
    } else {
      setDomainPart("");
      setCustomDomain(domain);
      setIsCustomDomain(true);
    }
  }, [value]);

  const updateEmail = (nextLocal?: string, nextDomain?: string) => {
    const l = (nextLocal ?? localPart).trim();
    const d =
      (nextDomain ?? (isCustomDomain ? customDomain : domainPart)).trim();

    if (!l || !d) {
      onChangeValue("");
      return;
    }
    onChangeValue(`${l}@${d}`);
  };

  const handleLocalChange = (text: string) => {
    setLocalPart(text);
    updateEmail(text, undefined);
  };

  const handleSelectDomain = (d: string) => {
    if (d === "직접입력") {
      setIsCustomDomain(true);
      setDomainPart("");
      setCustomDomain("");
      setDropdownOpen(false);
      setTimeout(() => customRef.current?.focus(), 0);
    } else {
      setIsCustomDomain(false);
      setCustomDomain("");
      setDomainPart(d);
      setDropdownOpen(false);
      updateEmail(undefined, d);
    }
  };

  const handleCustomDomainChange = (text: string) => {
    setCustomDomain(text);
    updateEmail(undefined, text);
  };

  const showSuccess = !!successText;
  const showError = !!errorText && !successText;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}

      <View style={styles.row}>
        <TextInput
          style={[
            styles.input,
            styles.localInput,
            showError && styles.errorBorder,
          ]}
          value={localPart}
          onChangeText={handleLocalChange}
          placeholder="이메일 입력"
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!disabled}
        />

        <Text style={styles.at}>@</Text>

        <View style={styles.domainWrapper}>
          {isCustomDomain ? (
            <View style={styles.customDomainRow}>
              <TextInput
                ref={customRef}
                style={[styles.input, styles.customDomainInput]}
                value={customDomain}
                onChangeText={handleCustomDomainChange}
                placeholder="도메인 입력"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
                editable={!disabled}
              />
              <TouchableOpacity
                onPress={() => {
                  setCustomDomain("");
                  setIsCustomDomain(false);
                  setDropdownOpen(true);
                }}
                style={styles.iconButton}
              >
                <Text style={styles.iconText}>▾</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <TouchableOpacity
                style={[
                  styles.domainButton,
                  showError && styles.errorBorder,
                  disabled && styles.disabledBackground,
                ]}
                onPress={() => !disabled && setDropdownOpen((prev) => !prev)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.domainText,
                    !domainPart && styles.placeholderText,
                  ]}
                  numberOfLines={1}
                >
                  {domainPart || "도메인 선택"}
                </Text>
                <Text style={styles.iconText}>{dropdownOpen ? "▴" : "▾"}</Text>
              </TouchableOpacity>

              {dropdownOpen && (
                <View style={styles.dropdown}>
                  {DOMAIN_OPTIONS.map((d) => (
                    <TouchableOpacity
                      key={d}
                      style={styles.option}
                      onPress={() => handleSelectDomain(d)}
                    >
                      <Text style={styles.optionText}>{d}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </>
          )}
        </View>
      </View>

      {showSuccess && (
        <Text style={[styles.message, styles.successText]}>{successText}</Text>
      )}
      {showError && (
        <Text style={[styles.message, styles.errorText]}>{errorText}</Text>
      )}
    </View>
  );
};

export default EmailInput;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: "#111827",
    fontWeight: "500",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: "#111827",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    fontSize: 14,
    paddingHorizontal: 12,
  },
  localInput: {
    flex: 6,
  },
  at: {
    marginHorizontal: 8,
    fontSize: 16,
    color: "#111827",
  },
  domainWrapper: {
    flex: 7,
    position: "relative",
  },
  domainButton: {
    height: 44,
    borderWidth: 1,
    borderColor: "#111827",
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  domainText: {
    fontSize: 14,
    color: "#111827",
    flex: 1,
    marginRight: 8,
  },
  placeholderText: {
    color: "#9CA3AF",
  },
  iconText: {
    fontSize: 24,
    color: "#111827",
  },
  dropdown: {
    position: "absolute",
    top: 48,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#111827",
    borderRadius: 10,
    // maxHeight: 220,
    zIndex: 10,
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  optionText: {
    fontSize: 14,
    color: "#111827",
  },
  customDomainRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  customDomainInput: {
    flex: 1,
    paddingRight: 36,
  },
  iconButton: {
    position: "absolute",
    right: 10,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    marginTop: 4,
    fontSize: 11,
  },
  successText: {
    color: "#22C55E",
    fontWeight: "600",
  },
  errorText: {
    color: "#EF4444",
    fontWeight: "600",
  },
  errorBorder: {
    borderColor: "#EF4444",
  },
  disabledBackground: {
    backgroundColor: "#F3F4F6",
  },
});
