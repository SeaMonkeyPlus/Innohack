import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { MenuItem } from "../../types/restaurant";

interface FormData {
  name: string;
  phone: string;
  address: string;
  description: string;
  category: string;
  images: string[];
  menuItems: MenuItem[];
}

export default function RestaurantRegister() {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    address: "",
    description: "",
    category: "",
    images: [],
    menuItems: [],
  });

  const [currentMenuItem, setCurrentMenuItem] = useState<Partial<MenuItem>>({
    name: "",
    price: 0,
    description: "",
  });
  const [menuItemImage, setMenuItemImage] = useState<string>("");

  // 이미지 선택
  const pickImage = async (type: "restaurant" | "menu") => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: type === "restaurant",
      quality: 0.8,
    });

    if (!result.canceled) {
      if (type === "restaurant") {
        setFormData({
          ...formData,
          images: [...formData.images, ...result.assets.map((asset) => asset.uri)],
        });
      } else {
        setMenuItemImage(result.assets[0].uri);
      }
    }
  };

  // 가게 이미지 삭제
  const removeRestaurantImage = (index: number) => {
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
      id: Date.now().toString(),
      name: currentMenuItem.name,
      price: currentMenuItem.price,
      description: currentMenuItem.description || "",
    };

    setFormData({
      ...formData,
      menuItems: [...formData.menuItems, newMenuItem],
    });

    // 입력 필드 초기화
    setCurrentMenuItem({ name: "", price: 0, description: "" });
    setMenuItemImage("");

    Alert.alert("성공", "메뉴가 추가되었습니다.");
  };

  // 메뉴 삭제
  const removeMenuItem = (id: string) => {
    setFormData({
      ...formData,
      menuItems: formData.menuItems.filter((item) => item.id !== id),
    });
  };

  // 1단계 유효성 검사
  const validateStep1 = () => {
    if (!formData.name.trim()) {
      Alert.alert("알림", "가게 이름을 입력해주세요.");
      return false;
    }
    if (!formData.phone.trim()) {
      Alert.alert("알림", "전화번호를 입력해주세요.");
      return false;
    }
    if (!formData.address.trim()) {
      Alert.alert("알림", "주소를 입력해주세요.");
      return false;
    }
    if (!formData.category.trim()) {
      Alert.alert("알림", "카테고리를 입력해주세요.");
      return false;
    }
    if (formData.images.length === 0) {
      Alert.alert("알림", "최소 1개 이상의 가게 사진을 추가해주세요.");
      return false;
    }
    return true;
  };

  // 다음 단계로
  const goToNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  // 등록 완료
  const handleSubmit = async () => {
    if (formData.menuItems.length === 0) {
      Alert.alert("알림", "최소 1개 이상의 메뉴를 추가해주세요.");
      return;
    }

    try {
      // ============================================
      // 백엔드 API 연동 (주석 처리)
      // ============================================
      // import { createRestaurant, uploadImages } from "../../services/restaurant-api";
      //
      // // 1. 이미지 업로드 (필요한 경우)
      // const uploadedImageUrls = await uploadImages(formData.images);
      //
      // // 2. 가게 등록 API 호출
      // const newRestaurant = await createRestaurant({
      //   name: formData.name,
      //   phone: formData.phone,
      //   address: formData.address,
      //   description: formData.description,
      //   category: formData.category,
      //   images: uploadedImageUrls, // 업로드된 이미지 URL 사용
      //   menuItems: formData.menuItems.map(item => ({
      //     name: item.name,
      //     price: item.price,
      //     description: item.description,
      //   })),
      // });
      //
      // console.log("등록된 가게:", newRestaurant);

      Alert.alert("성공", "가게 등록이 완료되었습니다!", [
        {
          text: "확인",
          onPress: () => {
            // 등록 완료 후 처리 (예: 홈으로 이동)
            // navigation.navigate('Home');
          },
        },
      ]);
    } catch (error) {
      console.error("가게 등록 오류:", error);
      Alert.alert("오류", "가게 등록에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 1단계: 가게 정보 입력
  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>가게 정보 입력</Text>

      {/* 가게 사진 */}
      <View style={styles.section}>
        <Text style={styles.label}>가게 사진 *</Text>
        <TouchableOpacity style={styles.imagePickerButton} onPress={() => pickImage("restaurant")}>
          <Text style={styles.imagePickerButtonText}>📷 사진 추가</Text>
        </TouchableOpacity>
        <ScrollView horizontal style={styles.imageList} showsHorizontalScrollIndicator={false}>
          {formData.images.map((uri, index) => (
            <View key={index} style={styles.imageItem}>
              <Image source={{ uri }} style={styles.previewImage} />
              <TouchableOpacity style={styles.removeImageButton} onPress={() => removeRestaurantImage(index)}>
                <Text style={styles.removeImageButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* 가게 이름 */}
      <View style={styles.section}>
        <Text style={styles.label}>가게 이름 *</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          placeholder="예: 맛있는 한식당"
        />
      </View>

      {/* 카테고리 */}
      <View style={styles.section}>
        <Text style={styles.label}>카테고리 *</Text>
        <TextInput
          style={styles.input}
          value={formData.category}
          onChangeText={(text) => setFormData({ ...formData, category: text })}
          placeholder="예: 한식, 중식, 일식"
        />
      </View>

      {/* 전화번호 */}
      <View style={styles.section}>
        <Text style={styles.label}>전화번호 *</Text>
        <TextInput
          style={styles.input}
          value={formData.phone}
          onChangeText={(text) => setFormData({ ...formData, phone: text })}
          placeholder="예: 02-1234-5678"
          keyboardType="phone-pad"
        />
      </View>

      {/* 주소 */}
      <View style={styles.section}>
        <Text style={styles.label}>주소 *</Text>
        <TextInput
          style={styles.input}
          value={formData.address}
          onChangeText={(text) => setFormData({ ...formData, address: text })}
          placeholder="예: 서울특별시 강남구 테헤란로 123"
        />
      </View>

      {/* 설명 */}
      <View style={styles.section}>
        <Text style={styles.label}>가게 설명</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          placeholder="가게에 대한 설명을 입력하세요"
          multiline
          numberOfLines={4}
        />
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={goToNextStep}>
        <Text style={styles.nextButtonText}>다음 단계</Text>
      </TouchableOpacity>
    </View>
  );

  // 2단계: 메뉴 등록
  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>메뉴 등록</Text>

      {/* 메뉴 입력 폼 */}
      <View style={styles.menuFormContainer}>
        <Text style={styles.sectionTitle}>새 메뉴 추가</Text>

        <View style={styles.section}>
          <Text style={styles.label}>메뉴 이름 *</Text>
          <TextInput
            style={styles.input}
            value={currentMenuItem.name}
            onChangeText={(text) => setCurrentMenuItem({ ...currentMenuItem, name: text })}
            placeholder="예: 김치찌개"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>가격 (원) *</Text>
          <TextInput
            style={styles.input}
            value={currentMenuItem.price ? currentMenuItem.price.toString() : ""}
            onChangeText={(text) => setCurrentMenuItem({ ...currentMenuItem, price: parseInt(text) || 0 })}
            placeholder="예: 9000"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>메뉴 설명</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={currentMenuItem.description}
            onChangeText={(text) => setCurrentMenuItem({ ...currentMenuItem, description: text })}
            placeholder="메뉴에 대한 설명을 입력하세요"
            multiline
            numberOfLines={3}
          />
        </View>

        <TouchableOpacity style={styles.addMenuButton} onPress={addMenuItem}>
          <Text style={styles.addMenuButtonText}>+ 메뉴 추가</Text>
        </TouchableOpacity>
      </View>

      {/* 추가된 메뉴 목록 */}
      <View style={styles.menuListContainer}>
        <Text style={styles.sectionTitle}>등록된 메뉴 ({formData.menuItems.length}개)</Text>
        {formData.menuItems.map((item) => (
          <View key={item.id} style={styles.menuListItem}>
            <View style={styles.menuListItemInfo}>
              <Text style={styles.menuListItemName}>{item.name}</Text>
              <Text style={styles.menuListItemPrice}>₩{item.price.toLocaleString()}</Text>
              {item.description && <Text style={styles.menuListItemDesc}>{item.description}</Text>}
            </View>
            <TouchableOpacity style={styles.removeMenuButton} onPress={() => removeMenuItem(item.id)}>
              <Text style={styles.removeMenuButtonText}>삭제</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* 버튼 그룹 */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.backButton} onPress={() => setStep(1)}>
          <Text style={styles.backButtonText}>이전</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>등록 완료</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 진행 상태 표시 */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressStep, step >= 1 && styles.progressStepActive]}>
          <Text style={[styles.progressStepText, step >= 1 && styles.progressStepTextActive]}>1</Text>
        </View>
        <View style={[styles.progressLine, step >= 2 && styles.progressLineActive]} />
        <View style={[styles.progressStep, step >= 2 && styles.progressStepActive]}>
          <Text style={[styles.progressStepText, step >= 2 && styles.progressStepTextActive]}>2</Text>
        </View>
      </View>

      {step === 1 ? renderStep1() : renderStep2()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  progressStep: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  progressStepActive: {
    backgroundColor: "#4CAF50",
  },
  progressStepText: {
    fontSize: 18,
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
    marginHorizontal: 10,
  },
  progressLineActive: {
    backgroundColor: "#4CAF50",
  },
  stepContainer: {
    padding: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
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
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  imagePickerButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
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
  nextButton: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  menuFormContainer: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
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
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
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
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 4,
  },
  menuListItemDesc: {
    fontSize: 14,
    color: "#666",
  },
  removeMenuButton: {
    backgroundColor: "#f44336",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  removeMenuButtonText: {
    color: "#fff",
    fontSize: 14,
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
    fontSize: 18,
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
    fontSize: 18,
    fontWeight: "bold",
  },
});
