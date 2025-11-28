// 웹과 네이티브에서 다른 컴포넌트 사용
import { Platform } from "react-native";

// 웹에서는 web 버전을, 네이티브에서는 native 버전을 import
export { MapViewComponent } from Platform.OS === "web" ? "./index.web" : "./index.native";

