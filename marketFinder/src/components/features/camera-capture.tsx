import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import React, { useRef, useState } from "react";
import {
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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function CameraCapture() {
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

  const cameraRef = useRef<CameraView>(null);
  const pan = useRef(new Animated.ValueXY()).current;
  const size = useRef(new Animated.ValueXY({ x: cropArea.width, y: cropArea.height })).current;

  // 권한 확인
  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>카메라 권한이 필요합니다</Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>권한 허용</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // 사진 촬영
  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
        });
        if (photo) {
          setCapturedImage(photo.uri);
          setIsSelecting(true);
        }
      } catch (error) {
        console.error("사진 촬영 오류:", error);
        Alert.alert("오류", "사진 촬영에 실패했습니다.");
      }
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

  // 영역 선택 완료
  const confirmCrop = async () => {
    if (!capturedImage) return;

    try {
      // ============================================
      // 백엔드 API 연동 (주석 처리)
      // ============================================
      // import { analyzeImage } from "../../services/restaurant-api";
      //
      // // 이미지 분석 API 호출
      // const result = await analyzeImage(capturedImage, {
      //   x: cropArea.x,
      //   y: cropArea.y,
      //   width: cropArea.width,
      //   height: cropArea.height,
      // });
      //
      // if (result.success && result.restaurants && result.restaurants.length > 0) {
      //   // 분석 성공 - 결과 페이지로 이동
      //   console.log("분석 결과:", result);
      //   Alert.alert("분석 완료", `${result.restaurants.length}개의 음식점을 찾았습니다!`, [
      //     {
      //       text: "확인",
      //       onPress: () => {
      //         // 결과 페이지로 이동
      //         // navigation.navigate('SearchResults', {
      //         //   restaurants: result.restaurants,
      //         //   detectedItems: result.detectedItems
      //         // });
      //       },
      //     },
      //   ]);
      // } else {
      //   Alert.alert("알림", result.message || "관련 정보를 찾을 수 없습니다.");
      // }

      // 현재: 테스트용 알림
      Alert.alert(
        "완료",
        `선택한 영역이 전송됩니다.\n크기: ${Math.round(cropArea.width)}x${Math.round(cropArea.height)}`
      );
    } catch (error) {
      console.error("전송 오류:", error);
      Alert.alert("오류", "이미지 분석에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 드래그 핸들러 (영역 이동)
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        const newX = Math.max(0, Math.min(SCREEN_WIDTH - cropArea.width, gesture.moveX - cropArea.width / 2));
        const newY = Math.max(0, Math.min(SCREEN_HEIGHT - cropArea.height, gesture.moveY - cropArea.height / 2));
        setCropArea((prev) => ({ ...prev, x: newX, y: newY }));
      },
    })
  ).current;

  // 크기 조절 핸들러
  const resizeResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        const newWidth = Math.max(100, Math.min(SCREEN_WIDTH - cropArea.x, gesture.moveX - cropArea.x));
        const newHeight = Math.max(100, Math.min(SCREEN_HEIGHT - cropArea.y, gesture.moveY - cropArea.y));
        setCropArea((prev) => ({ ...prev, width: newWidth, height: newHeight }));
      },
    })
  ).current;

  // 촬영 화면
  if (!capturedImage) {
    return (
      <View style={styles.container}>
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          <View style={styles.cameraOverlay}>
            <View style={styles.topBar}>
              <TouchableOpacity style={styles.iconButton} onPress={toggleCameraFacing}>
                <Text style={styles.iconButtonText}>🔄</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.bottomBar}>
              <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                <View style={styles.captureButtonInner} />
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

        {/* 선택 영역 박스 */}
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
          {...panResponder.panHandlers}
        >
          <View style={styles.cropCorner} />
          <View style={[styles.cropCorner, styles.cropCornerTopRight]} />
          <View style={[styles.cropCorner, styles.cropCornerBottomLeft]} />
          <View style={[styles.cropCorner, styles.cropCornerBottomRight]} {...resizeResponder.panHandlers}>
            <View style={styles.resizeHandle} />
          </View>

          <Text style={styles.cropHint}>영역을 드래그하여 이동</Text>
        </View>
      </View>

      {/* 하단 버튼 */}
      <View style={styles.controlBar}>
        <TouchableOpacity style={styles.controlButton} onPress={retakePicture}>
          <Text style={styles.controlButtonText}>다시 찍기</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.controlButton, styles.confirmButton]} onPress={confirmCrop}>
          <Text style={[styles.controlButtonText, styles.confirmButtonText]}>확인</Text>
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
});
