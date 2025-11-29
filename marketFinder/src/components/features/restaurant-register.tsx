import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { MenuItem, Shop } from "../../types/shop";
import { LanguageSelector } from "./language-selector";

interface FormData {
  name: string;
  phone: string;
  address: string;
  description: string;
  category: string;
  openingHours: string;
  latitude: number;
  longitude: number;
  images: string[];
  menuItems: MenuItem[];
}

const VERIFICATION_CODE = "0000"; // 임시 검증 코드

export default function RestaurantRegister() {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    address: "",
    description: "",
    category: "",
    openingHours: "",
    latitude: 0,
    longitude: 0,
    images: [],
    menuItems: [],
  });

  const [currentMenuItem, setCurrentMenuItem] = useState<Partial<MenuItem>>({
    name: "",
    price: 0,
    description: "",
  });

  // 검증 코드 확인
  const handleVerifyCode = () => {
    if (verificationCode === VERIFICATION_CODE) {
      setIsVerified(true);
      Alert.alert("성공", "검증이 완료되었습니다. 가게 등록을 진행하세요.");
    } else {
      Alert.alert("오류", "잘못된 검증 코드입니다. 다시 시도해주세요.");
      setVerificationCode("");
    }
  };

  // 현재 위치 가져오기
  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("권한 필요", "위치 권한이 필요합니다.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setFormData({
        ...formData,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      Alert.alert("성공", "현재 위치가 설정되었습니다.");
    } catch (error) {
      Alert.alert("오류", "위치를 가져올 수 없습니다.");
    }
  };

  // 이미지 선택
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setFormData({
        ...formData,
        images: [...formData.images, ...result.assets.map((asset) => asset.uri)],
      });
    }
  };

  // 이미지 삭제
  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  // 메뉴 추가
  const addMenuItem = () => {
    if (!currentMenuItem.name || !currentMenuItem.price) {
      Alert.alert("알림", "메뉴 이름과 가격을 입력해주세요.");
      return;
    }

    const newMenuItem: MenuItem = {
      name: currentMenuItem.name,
      price: currentMenuItem.price,
      description: currentMenuItem.description,
    };

    setFormData({
      ...formData,
      menuItems: [...formData.menuItems, newMenuItem],
    });

    setCurrentMenuItem({ name: "", price: 0, description: "" });
    Alert.alert("성공", "메뉴가 추가되었습니다.");
  };

  // 메뉴 삭제
  const removeMenuItem = (index: number) => {
    setFormData({
      ...formData,
      menuItems: formData.menuItems.filter((_, i) => i !== index),
    });
  };

  // 1단계 유효성 검사 (기본 정보)
  const validateStep1 = () => {
    if (!formData.name.trim()) {
      Alert.alert("필수 입력", "가게 이름을 입력해주세요.");
      return false;
    }
    return true;
  };

  // 2단계 유효성 검사 (위치 정보)
  const validateStep2 = () => {
    if (formData.latitude === 0 && formData.longitude === 0) {
      Alert.alert("필수 입력", "가게 위치를 설정해주세요.");
      return false;
    }
    return true;
  };

  // 다음 단계로
  const goToStep2 = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const goToStep3 = () => {
    if (validateStep2()) {
      setStep(3);
    }
  };

  // 등록 완료
  const handleSubmit = async () => {
    try {
      // 이미지 검증
      if (formData.images.length === 0) {
        Alert.alert("필수 입력", "최소 1개의 가게 사진을 추가해주세요.");
        return;
      }

      setIsLoading(true);

      // FormData 생성
      const apiFormData = new FormData();
      apiFormData.append("name", formData.name);
      apiFormData.append("call_number", formData.phone || "");

      // 이미지 파일을 각각 추가 (predictFoodImage와 동일한 방식)
      console.log("Adding images to FormData:", formData.images.length);

      for (let i = 0; i < formData.images.length; i++) {
        const imageUri = formData.images[i];
        const filename = `shop_photo_${i}.jpg`;

        // 웹 환경인 경우 Blob으로 변환 (predictFoodImage와 동일)
        if (imageUri.startsWith("data:") || imageUri.startsWith("blob:")) {
          console.log(`Converting web blob to file ${i}:`, imageUri.substring(0, 50));
          const response = await fetch(imageUri);
          const blob = await response.blob();
          apiFormData.append("files", blob, filename);
        } else {
          // React Native 환경
          const fileData = {
            uri: imageUri,
            type: "image/jpeg",
            name: filename,
          };
          console.log(`Adding native file ${i}:`, fileData);
          apiFormData.append("files", fileData as any);
        }
      }

      const apiUrl = process.env.EXPO_PUBLIC_REGISTER_API_URL;
      if (!apiUrl) {
        throw new Error("API URL이 설정되지 않았습니다.");
      }

      console.log("Sending data to:", apiUrl);
      console.log("Data:", {
        name: formData.name,
        call_number: formData.phone || "",
        filesCount: formData.images.length,
      });

      // API 요청 (Content-Type 헤더 제거 - FormData 사용 시 자동 설정됨)
      const response = await fetch(apiUrl, {
        method: "POST",
        body: apiFormData,
      });

      console.log("Response status:", response.status);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "등록에 실패했습니다.");
      }

      console.log("등록 성공:", result);

      // 폼 초기화
      setFormData({
        name: "",
        phone: "",
        address: "",
        description: "",
        category: "",
        openingHours: "",
        latitude: 0,
        longitude: 0,
        images: [],
        menuItems: [],
      });
      setStep(1);
      setIsVerified(false);
      setVerificationCode("");
      setIsLoading(false);

      // 홈으로 이동
      router.push("/");
    } catch (error) {
      console.error("가게 등록 오류:", error);
      setIsLoading(false);
      Alert.alert("오류", error instanceof Error ? error.message : "가게 등록에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 검증 화면
  const renderVerificationScreen = () => (
    <View style={styles.verificationContainer}>
      <View style={styles.verificationBox}>
        <Text style={styles.verificationIcon}>🔐</Text>
        <Text style={styles.verificationTitle}>가게 등록 인증</Text>
        <Text style={styles.verificationSubtitle}>가게 등록을 위해 검증 코드를 입력해주세요</Text>

        <View style={styles.codeInputContainer}>
          <TextInput
            style={styles.codeInput}
            value={verificationCode}
            onChangeText={setVerificationCode}
            placeholder="검증 코드 입력"
            placeholderTextColor="#999"
            keyboardType="number-pad"
            maxLength={4}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={[styles.verifyButton, !verificationCode && styles.verifyButtonDisabled]}
          onPress={handleVerifyCode}
          disabled={!verificationCode}
        >
          <Text style={styles.verifyButtonText}>확인</Text>
        </TouchableOpacity>

        <Text style={styles.verificationHint}>※ 관리자로부터 받은 4자리 코드를 입력하세요</Text>
      </View>
    </View>
  );

  // 1단계: 기본 정보
  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>📝 기본 정보</Text>

      {/* 필수: 가게 이름 */}
      <View style={styles.section}>
        <Text style={styles.label}>
          가게 이름 <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          placeholder="예: 할매 호떡집"
          placeholderTextColor="#999"
        />
      </View>

      {/* 선택: 카테고리 */}
      <View style={styles.section}>
        <Text style={styles.label}>카테고리</Text>
        <TextInput
          style={styles.input}
          value={formData.category}
          onChangeText={(text) => setFormData({ ...formData, category: text })}
          placeholder="예: 떡·디저트, 한식, 분식"
          placeholderTextColor="#999"
        />
      </View>

      {/* 선택: 전화번호 */}
      <View style={styles.section}>
        <Text style={styles.label}>전화번호</Text>
        <TextInput
          style={styles.input}
          value={formData.phone}
          onChangeText={(text) => setFormData({ ...formData, phone: text })}
          placeholder="예: 051-245-1234"
          keyboardType="phone-pad"
          placeholderTextColor="#999"
        />
      </View>

      {/* 선택: 주소 */}
      <View style={styles.section}>
        <Text style={styles.label}>주소</Text>
        <TextInput
          style={styles.input}
          value={formData.address}
          onChangeText={(text) => setFormData({ ...formData, address: text })}
          placeholder="예: 부산 중구 신창동4가 14-3"
          placeholderTextColor="#999"
        />
      </View>

      {/* 선택: 영업시간 */}
      <View style={styles.section}>
        <Text style={styles.label}>영업시간</Text>
        <TextInput
          style={styles.input}
          value={formData.openingHours}
          onChangeText={(text) => setFormData({ ...formData, openingHours: text })}
          placeholder="예: 09:00 - 19:00"
          placeholderTextColor="#999"
        />
      </View>

      {/* 선택: 설명 */}
      <View style={styles.section}>
        <Text style={styles.label}>가게 설명</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          placeholder="가게에 대한 설명을 입력하세요"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          placeholderTextColor="#999"
        />
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={goToStep2}>
        <Text style={styles.nextButtonText}>다음 단계 →</Text>
      </TouchableOpacity>
    </View>
  );

  // 2단계: 위치 및 사진
  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>📍 위치 및 사진</Text>

      {/* 필수: 위치 정보 */}
      <View style={styles.section}>
        <Text style={styles.label}>
          가게 위치 <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.locationContainer}>
          <View style={styles.locationInfo}>
            {formData.latitude !== 0 && formData.longitude !== 0 ? (
              <>
                <Text style={styles.locationText}>위도: {formData.latitude.toFixed(6)}</Text>
                <Text style={styles.locationText}>경도: {formData.longitude.toFixed(6)}</Text>
                <Text style={styles.locationSuccess}>✓ 위치 설정 완료</Text>
              </>
            ) : (
              <Text style={styles.locationPlaceholder}>위치를 설정해주세요</Text>
            )}
          </View>
          <TouchableOpacity style={styles.locationButton} onPress={getCurrentLocation}>
            <Text style={styles.locationButtonText}>📍 현재 위치</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.helpText}>※ 현재 위치 버튼을 눌러 가게 위치를 설정하세요</Text>
      </View>

      {/* 선택: 가게 사진 */}
      <View style={styles.section}>
        <Text style={styles.label}>가게 사진</Text>
        <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
          <Text style={styles.imagePickerButtonText}>📷 사진 추가</Text>
        </TouchableOpacity>
        {formData.images.length > 0 && (
          <ScrollView horizontal style={styles.imageList} showsHorizontalScrollIndicator={false}>
            {formData.images.map((uri, index) => (
              <View key={index} style={styles.imageItem}>
                <Image source={{ uri }} style={styles.previewImage} />
                <TouchableOpacity style={styles.removeImageButton} onPress={() => removeImage(index)}>
                  <Text style={styles.removeImageButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}
        <Text style={styles.imageCount}>총 {formData.images.length}장</Text>
      </View>

      {/* 버튼 그룹 */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.backButton} onPress={() => setStep(1)}>
          <Text style={styles.backButtonText}>← 이전</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={goToStep3}>
          <Text style={styles.nextButtonText}>다음 단계 →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // 3단계: 메뉴 등록
  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>🍽️ 메뉴 등록 (선택)</Text>

      {/* 메뉴 입력 폼 */}
      <View style={styles.menuFormContainer}>
        <Text style={styles.sectionTitle}>새 메뉴 추가</Text>

        <View style={styles.section}>
          <Text style={styles.label}>메뉴 이름</Text>
          <TextInput
            style={styles.input}
            value={currentMenuItem.name}
            onChangeText={(text) => setCurrentMenuItem({ ...currentMenuItem, name: text })}
            placeholder="예: 씨앗호떡"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>가격 (원)</Text>
          <TextInput
            style={styles.input}
            value={currentMenuItem.price ? currentMenuItem.price.toString() : ""}
            onChangeText={(text) => setCurrentMenuItem({ ...currentMenuItem, price: parseInt(text) || 0 })}
            placeholder="예: 2000"
            keyboardType="numeric"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>메뉴 설명</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={currentMenuItem.description}
            onChangeText={(text) => setCurrentMenuItem({ ...currentMenuItem, description: text })}
            placeholder="예: 해바라기씨, 호박씨 듬뿍"
            multiline
            numberOfLines={2}
            textAlignVertical="top"
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity style={styles.addMenuButton} onPress={addMenuItem}>
          <Text style={styles.addMenuButtonText}>+ 메뉴 추가</Text>
        </TouchableOpacity>
      </View>

      {/* 추가된 메뉴 목록 */}
      {formData.menuItems.length > 0 && (
        <View style={styles.menuListContainer}>
          <Text style={styles.sectionTitle}>등록된 메뉴 ({formData.menuItems.length}개)</Text>
          {formData.menuItems.map((item, index) => (
            <View key={index} style={styles.menuListItem}>
              <View style={styles.menuListItemInfo}>
                <Text style={styles.menuListItemName}>{item.name}</Text>
                <Text style={styles.menuListItemPrice}>{item.price.toLocaleString()}원</Text>
                {item.description && <Text style={styles.menuListItemDesc}>{item.description}</Text>}
              </View>
              <TouchableOpacity style={styles.removeMenuButton} onPress={() => removeMenuItem(index)}>
                <Text style={styles.removeMenuButtonText}>삭제</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* 버튼 그룹 */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.backButton} onPress={() => setStep(2)}>
          <Text style={styles.backButtonText}>← 이전</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>✓ 등록 완료</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // 메인 렌더링
  if (!isVerified) {
    return renderVerificationScreen();
  }

  return (
    <View style={styles.container}>
      {/* 로딩 오버레이 */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>등록 중...</Text>
          </View>
        </View>
      )}

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 진행 상태 표시 */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressStep, step >= 1 && styles.progressStepActive]}>
            <Text style={[styles.progressStepText, step >= 1 && styles.progressStepTextActive]}>1</Text>
          </View>
          <View style={[styles.progressLine, step >= 2 && styles.progressLineActive]} />
          <View style={[styles.progressStep, step >= 2 && styles.progressStepActive]}>
            <Text style={[styles.progressStepText, step >= 2 && styles.progressStepTextActive]}>2</Text>
          </View>
          <View style={[styles.progressLine, step >= 3 && styles.progressLineActive]} />
          <View style={[styles.progressStep, step >= 3 && styles.progressStepActive]}>
            <Text style={[styles.progressStepText, step >= 3 && styles.progressStepTextActive]}>3</Text>
          </View>
        </View>

        <View style={styles.stepLabelsContainer}>
          <Text style={[styles.stepLabel, step === 1 && styles.stepLabelActive]}>기본정보</Text>
          <Text style={[styles.stepLabel, step === 2 && styles.stepLabelActive]}>위치/사진</Text>
          <Text style={[styles.stepLabel, step === 3 && styles.stepLabelActive]}>메뉴</Text>
        </View>

        {step === 1 ? renderStep1() : step === 2 ? renderStep2() : renderStep3()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  languageSelectorContainer: {
    position: "absolute",
    top: 50,
    left: 16,
    zIndex: 1000,
  },
  verificationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  verificationBox: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 40,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  verificationIcon: {
    fontSize: 72,
    marginBottom: 20,
  },
  verificationTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  verificationSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  codeInputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  codeInput: {
    borderWidth: 2,
    borderColor: "#4CAF50",
    borderRadius: 12,
    padding: 18,
    fontSize: 24,
    textAlign: "center",
    fontWeight: "bold",
    color: "#333",
    letterSpacing: 8,
  },
  verifyButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 12,
    marginBottom: 20,
  },
  verifyButtonDisabled: {
    backgroundColor: "#ccc",
  },
  verifyButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  verificationHint: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    fontStyle: "italic",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 30,
    paddingHorizontal: 40,
  },
  progressStep: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  progressStepActive: {
    backgroundColor: "#4CAF50",
  },
  progressStepText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#999",
  },
  progressStepTextActive: {
    color: "#fff",
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 8,
  },
  progressLineActive: {
    backgroundColor: "#4CAF50",
  },
  stepLabelsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  stepLabel: {
    fontSize: 12,
    color: "#999",
    fontWeight: "500",
  },
  stepLabelActive: {
    color: "#4CAF50",
    fontWeight: "700",
  },
  stepContainer: {
    padding: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 24,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  required: {
    color: "#f44336",
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
    color: "#333",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  helpText: {
    fontSize: 12,
    color: "#666",
    marginTop: 6,
    fontStyle: "italic",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  locationInfo: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  locationText: {
    fontSize: 13,
    color: "#666",
    marginBottom: 2,
  },
  locationSuccess: {
    fontSize: 13,
    color: "#4CAF50",
    fontWeight: "600",
    marginTop: 4,
  },
  locationPlaceholder: {
    fontSize: 14,
    color: "#999",
  },
  locationButton: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  locationButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  imagePickerButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  imagePickerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  imageList: {
    marginTop: 10,
  },
  imageItem: {
    marginRight: 10,
    position: "relative",
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageButton: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#f44336",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  removeImageButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  imageCount: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },
  nextButton: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  menuFormContainer: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  addMenuButton: {
    backgroundColor: "#2196F3",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  addMenuButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  menuListContainer: {
    marginBottom: 20,
  },
  menuListItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  menuListItemInfo: {
    flex: 1,
  },
  menuListItemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  menuListItemPrice: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 4,
  },
  menuListItemDesc: {
    fontSize: 13,
    color: "#666",
  },
  removeMenuButton: {
    backgroundColor: "#f44336",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  removeMenuButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
  backButton: {
    flex: 1,
    backgroundColor: "#9e9e9e",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  submitButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  loadingContainer: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
});
