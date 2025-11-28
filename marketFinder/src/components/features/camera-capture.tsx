import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Image,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSearch } from "../../contexts/search-context";
import { useLanguage } from "../../contexts/language-context";
import { useTranslation } from "@hooks/use-translation";
import { predictFoodImage } from "../../services/market-api";
import { LanguageSelector } from "./language-selector";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function CameraCapture() {
  const router = useRouter();
  const { t } = useTranslation();
  const { setSearchData, selectedMarketId } = useSearch();
  const { selectedLanguage } = useLanguage();
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cropArea, setCropArea] = useState<CropArea>({
    x: SCREEN_WIDTH * 0.1,
    y: SCREEN_HEIGHT * 0.2,
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_HEIGHT * 0.4,
  });
  const [isSelecting, setIsSelecting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const cameraRef = useRef<CameraView>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // cropArea의 최신 값을 항상 참조하기 위한 ref
  const cropAreaRef = useRef(cropArea);

  // cropArea가 변경될 때마다 ref 업데이트
  useEffect(() => {
    cropAreaRef.current = cropArea;
  }, [cropArea]);

  // 화면 포커스될 때마다 상태 초기화
  useFocusEffect(
    useCallback(() => {
      // 화면 포커스 시 상태 초기화
      setIsLoading(false);
      setCapturedImage(null);
      setIsSelecting(false);

      return () => {
        // 화면을 떠날 때 정리
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
      };
    }, [])
  );

  // 드래그 시작 위치 저장
  const dragStart = useRef({ x: 0, y: 0, cropX: 0, cropY: 0, cropWidth: 0, cropHeight: 0 });

  // 중앙 영역 드래그 핸들러 (위치 이동)
  const centerPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (_, gesture) => {
        const current = cropAreaRef.current;
        dragStart.current = {
          x: gesture.x0,
          y: gesture.y0,
          cropX: current.x,
          cropY: current.y,
          cropWidth: current.width,
          cropHeight: current.height,
        };
      },
      onPanResponderMove: (_, gesture) => {
        const deltaX = gesture.moveX - dragStart.current.x;
        const deltaY = gesture.moveY - dragStart.current.y;
        const newX = Math.max(
          0,
          Math.min(SCREEN_WIDTH - dragStart.current.cropWidth, dragStart.current.cropX + deltaX)
        );
        const newY = Math.max(
          0,
          Math.min(SCREEN_HEIGHT - dragStart.current.cropHeight, dragStart.current.cropY + deltaY)
        );
        setCropArea((prev) => ({ ...prev, x: newX, y: newY }));
      },
    })
  ).current;

  // 모서리 리사이즈 핸들러 생성 함수
  const createCornerResponder = (corner: "tl" | "tr" | "bl" | "br") => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (_, gesture) => {
        const current = cropAreaRef.current;
        dragStart.current = {
          x: gesture.x0,
          y: gesture.y0,
          cropX: current.x,
          cropY: current.y,
          cropWidth: current.width,
          cropHeight: current.height,
        };
      },
      onPanResponderMove: (_, gesture) => {
        const deltaX = gesture.moveX - dragStart.current.x;
        const deltaY = gesture.moveY - dragStart.current.y;

        let newX = dragStart.current.cropX;
        let newY = dragStart.current.cropY;
        let newWidth = dragStart.current.cropWidth;
        let newHeight = dragStart.current.cropHeight;

        if (corner === "tl") {
          // 좌상단
          newX = Math.max(
            0,
            Math.min(dragStart.current.cropX + dragStart.current.cropWidth - 100, dragStart.current.cropX + deltaX)
          );
          newY = Math.max(
            0,
            Math.min(dragStart.current.cropY + dragStart.current.cropHeight - 100, dragStart.current.cropY + deltaY)
          );
          newWidth = dragStart.current.cropWidth - (newX - dragStart.current.cropX);
          newHeight = dragStart.current.cropHeight - (newY - dragStart.current.cropY);
        } else if (corner === "tr") {
          // 우상단
          newY = Math.max(
            0,
            Math.min(dragStart.current.cropY + dragStart.current.cropHeight - 100, dragStart.current.cropY + deltaY)
          );
          newWidth = Math.max(
            100,
            Math.min(SCREEN_WIDTH - dragStart.current.cropX, dragStart.current.cropWidth + deltaX)
          );
          newHeight = dragStart.current.cropHeight - (newY - dragStart.current.cropY);
        } else if (corner === "bl") {
          // 좌하단
          newX = Math.max(
            0,
            Math.min(dragStart.current.cropX + dragStart.current.cropWidth - 100, dragStart.current.cropX + deltaX)
          );
          newWidth = dragStart.current.cropWidth - (newX - dragStart.current.cropX);
          newHeight = Math.max(
            100,
            Math.min(SCREEN_HEIGHT - dragStart.current.cropY, dragStart.current.cropHeight + deltaY)
          );
        } else if (corner === "br") {
          // 우하단
          newWidth = Math.max(
            100,
            Math.min(SCREEN_WIDTH - dragStart.current.cropX, dragStart.current.cropWidth + deltaX)
          );
          newHeight = Math.max(
            100,
            Math.min(SCREEN_HEIGHT - dragStart.current.cropY, dragStart.current.cropHeight + deltaY)
          );
        }

        setCropArea({ x: newX, y: newY, width: newWidth, height: newHeight });
      },
    });
  };

  const tlResponder = useRef(createCornerResponder("tl")).current;
  const trResponder = useRef(createCornerResponder("tr")).current;
  const blResponder = useRef(createCornerResponder("bl")).current;
  const brResponder = useRef(createCornerResponder("br")).current;

  // 권한 자동 요청 - 모든 Hook 다음에 배치
  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission]);

  // 권한 로딩 중
  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.permissionText}>{t.camera.initializing}</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>{t.camera.permissionRequired}</Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>{t.camera.allowPermission}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // 시장 선택 확인
  if (!selectedMarketId) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.noMarketIcon}>📍</Text>
          <Text style={styles.permissionText}>{t.camera.selectMarket}</Text>
          <Text style={styles.noMarketSubText}>{t.camera.selectMarketHint}</Text>
          <TouchableOpacity style={styles.permissionButton} onPress={() => router.push("/(tabs)")}>
            <Text style={styles.permissionButtonText}>{t.camera.goHome}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // 사진 촬영
  const takePicture = async () => {
    if (!cameraRef.current) {
      Alert.alert(t.common.error, t.camera.cameraNotReady);
      return;
    }

    try {
      setIsLoading(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
      });
      if (photo && photo.uri) {
        setCapturedImage(photo.uri);
        setIsSelecting(true);
      } else {
        Alert.alert(t.common.error, t.camera.photoFailed);
      }
    } catch (error) {
      console.error("사진 촬영 오류:", error);
      Alert.alert(t.common.error, t.camera.photoFailed);
    } finally {
      setIsLoading(false);
    }
  };

  // 카메라 전환
  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  // 재촬영
  const retakePicture = () => {
    setCapturedImage(null);
    setIsSelecting(false);
    setCropArea({
      x: SCREEN_WIDTH * 0.1,
      y: SCREEN_HEIGHT * 0.2,
      width: SCREEN_WIDTH * 0.8,
      height: SCREEN_HEIGHT * 0.4,
    });
  };

  // 분석 취소
  const cancelAnalysis = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  };

  // 영역 선택 완료
  const confirmCrop = async () => {
    if (!capturedImage) return;

    // 새 AbortController 생성
    abortControllerRef.current = new AbortController();

    try {
      setIsLoading(true);

      // 이미지 분석 API 호출
      const result = await predictFoodImage(capturedImage, selectedLanguage.code, selectedMarketId);

      // 취소되지 않았다면 결과 처리
      if (!abortControllerRef.current.signal.aborted) {
        if (result && result.chosen_label && result.shops && result.shops.length > 0) {
          // 언어에 맞는 label 선택
          const displayLabel =
            selectedLanguage.code === "en" && result.label_translated ? result.label_translated : result.chosen_label;

          // 분석 성공 - 검색 결과와 설명 데이터 저장 및 홈 탭으로 이동
          setSearchData(displayLabel, capturedImage, result);

          // 홈 탭으로 이동
          router.push("/(tabs)");

          // 초기화
          setCapturedImage(null);
          setIsSelecting(false);
          setCropArea({
            x: SCREEN_WIDTH * 0.1,
            y: SCREEN_HEIGHT * 0.2,
            width: SCREEN_WIDTH * 0.8,
            height: SCREEN_HEIGHT * 0.4,
          });
        } else {
          Alert.alert(t.common.error, t.camera.noShopsFound);
          setIsLoading(false);
        }
      }
    } catch (error: any) {
      if (error.name === "AbortError" || abortControllerRef.current?.signal.aborted) {
        // 취소된 경우 아무것도 하지 않음
        console.log("분석이 취소되었습니다");
      } else {
        console.error("전송 오류:", error);
        Alert.alert(t.common.error, t.camera.analysisFailed);
        setIsLoading(false);
      }
    } finally {
      abortControllerRef.current = null;
    }
  };

  // 촬영 화면
  if (!capturedImage) {
    return (
      <View style={styles.container}>
        {/* Language Selector - Fixed at top left */}
        <View style={styles.languageSelectorContainer}>
          <LanguageSelector />
        </View>

        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          <View style={styles.cameraOverlay}>
            <View style={styles.topBar}>
              <TouchableOpacity style={styles.iconButton} onPress={toggleCameraFacing}>
                <Text style={styles.iconButtonText}>🔄</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.bottomBar}>
              <TouchableOpacity style={styles.captureButton} onPress={takePicture} disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator size="large" color="#fff" />
                ) : (
                  <View style={styles.captureButtonInner} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      </View>
    );
  }

  // 영역 선택 화면
  return (
    <View style={styles.container}>
      <Image source={{ uri: capturedImage }} style={styles.previewImage} resizeMode="contain" />

      {/* 어두운 오버레이 */}
      <View style={styles.overlay}>
        {/* 선택 영역 외부 어두운 부분 */}
        <View style={[styles.overlayTop, { height: cropArea.y }]} />
        <View style={{ flexDirection: "row", height: cropArea.height }}>
          <View style={[styles.overlaySide, { width: cropArea.x }]} />
          <View style={{ width: cropArea.width, height: cropArea.height }} />
          <View style={[styles.overlaySide, { flex: 1 }]} />
        </View>
        <View style={[styles.overlayBottom, { flex: 1 }]} />

        {/* 선택 영역 박스 - 중앙 영역 (이동용) */}
        <View
          style={[
            styles.cropBox,
            {
              left: cropArea.x,
              top: cropArea.y,
              width: cropArea.width,
              height: cropArea.height,
            },
          ]}
        >
          {/* 중앙 영역 - 드래그하면 이동 */}
          <View style={styles.cropCenter} {...centerPanResponder.panHandlers}>
            <Text style={styles.cropHint}>{t.camera.dragToMove}</Text>
          </View>

          {/* 네 모서리 핸들 - 드래그하면 크기 조절 */}
          <View style={[styles.cornerHandle, styles.cornerTL]} {...tlResponder.panHandlers} />
          <View style={[styles.cornerHandle, styles.cornerTR]} {...trResponder.panHandlers} />
          <View style={[styles.cornerHandle, styles.cornerBL]} {...blResponder.panHandlers} />
          <View style={[styles.cornerHandle, styles.cornerBR]} {...brResponder.panHandlers} />
        </View>
      </View>

      {/* 로딩 오버레이 */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>{t.camera.analyzing}</Text>
            <TouchableOpacity style={styles.cancelButton} onPress={cancelAnalysis}>
              <Text style={styles.cancelButtonText}>{t.common.cancel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 하단 버튼 */}
      <View style={styles.controlBar}>
        <TouchableOpacity style={styles.controlButton} onPress={retakePicture} disabled={isLoading}>
          <Text style={styles.controlButtonText}>{t.common.retake}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.controlButton, styles.confirmButton]}
          onPress={confirmCrop}
          disabled={isLoading}
        >
          <Text style={[styles.controlButtonText, styles.confirmButtonText]}>{t.common.confirm}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "space-between",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 20,
    paddingTop: 50,
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "center",
    paddingBottom: 40,
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  iconButtonText: {
    fontSize: 24,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  permissionText: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  permissionButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  permissionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayTop: {
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  overlaySide: {
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  overlayBottom: {
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  cropBox: {
    position: "absolute",
    borderWidth: 2,
    borderColor: "#4CAF50",
    borderStyle: "dashed",
  },
  cropCorner: {
    position: "absolute",
    width: 20,
    height: 20,
    borderColor: "#4CAF50",
    borderWidth: 3,
    top: -2,
    left: -2,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  cropCornerTopRight: {
    left: undefined,
    right: -2,
    borderLeftWidth: 0,
    borderRightWidth: 3,
  },
  cropCornerBottomLeft: {
    top: undefined,
    bottom: -2,
    borderTopWidth: 0,
    borderBottomWidth: 3,
  },
  cropCornerBottomRight: {
    top: undefined,
    left: undefined,
    right: -2,
    bottom: -2,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 3,
    borderBottomWidth: 3,
  },
  resizeHandle: {
    width: 30,
    height: 30,
    backgroundColor: "#4CAF50",
    borderRadius: 15,
    position: "absolute",
    right: -15,
    bottom: -15,
  },
  cropHint: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -60 }, { translateY: -10 }],
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  controlBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  controlButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    backgroundColor: "#666",
    minWidth: 120,
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
  },
  controlButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  confirmButtonText: {
    fontWeight: "bold",
  },
  noMarketIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  noMarketSubText: {
    fontSize: 14,
    color: "#ccc",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 20,
  },
  cropCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cornerHandle: {
    position: "absolute",
    width: 40,
    height: 40,
    backgroundColor: "#4CAF50",
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#fff",
  },
  cornerTL: {
    top: -20,
    left: -20,
  },
  cornerTR: {
    top: -20,
    right: -20,
  },
  cornerBL: {
    bottom: -20,
    left: -20,
  },
  cornerBR: {
    bottom: -20,
    right: -20,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loadingContainer: {
    alignItems: "center",
  },
  loadingText: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 1,
  },
  cancelButton: {
    marginTop: 30,
    paddingHorizontal: 40,
    paddingVertical: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  languageSelectorContainer: {
    position: "absolute",
    top: 50,
    left: 16,
    zIndex: 1000,
  },
});
