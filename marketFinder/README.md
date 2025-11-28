# MarketFinder 🏪

부산의 전통시장을 찾고 탐색하는 React Native 앱입니다.

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. Google Maps API 키 설정

#### API 키 발급
1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. "APIs & Services" → "Credentials"로 이동
4. 다음 API를 활성화:
   - Maps JavaScript API (Web용)
   - Maps SDK for iOS (iOS용)
   - Maps SDK for Android (Android용)

#### 플랫폼별 API 키 생성

**Web용 API 키**
- Application restrictions: HTTP referrers
- Website restrictions: 개발/프로덕션 도메인 추가

**iOS용 API 키**
- Application restrictions: iOS apps
- Bundle identifier: `com.marketfinder.app`

**Android용 API 키**
- Application restrictions: Android apps
- Package name: `com.marketfinder.app`
- SHA-1 fingerprint 추가 필요

#### 환경 변수 설정

1. `.env` 파일 생성:
```bash
cp .env.example .env
```

2. `.env` 파일에 API 키 입력:
```env
# Web용 API Key
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_web_api_key_here

# iOS용 API Key
EXPO_PUBLIC_GOOGLE_MAPS_IOS_API_KEY=your_ios_api_key_here

# Android용 API Key
EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_API_KEY=your_android_api_key_here
```

**⚠️ 주의**: `.env` 파일은 절대 Git에 커밋하지 마세요!

### 3. 앱 실행

```bash
npx expo start
```

실행 후 다음 옵션을 선택할 수 있습니다:
- **a**: Android 에뮬레이터에서 실행
- **i**: iOS 시뮬레이터에서 실행
- **w**: 웹 브라우저에서 실행

## 프로젝트 구조

```
marketFinder/
├── app/                    # 라우팅 및 화면
│   └── (tabs)/            # 탭 네비게이션
├── src/
│   ├── components/        # 재사용 가능한 컴포넌트
│   │   ├── common/       # 공통 컴포넌트
│   │   ├── features/     # 기능별 컴포넌트
│   │   └── ui/           # UI 컴포넌트
│   ├── types/            # TypeScript 타입 정의
│   ├── contexts/         # React Context
│   ├── hooks/            # 커스텀 훅
│   └── services/         # API 서비스
├── assets/               # 이미지, 폰트 등
├── app.config.js         # Expo 설정 (환경 변수 사용)
└── .env.example          # 환경 변수 템플릿
```

## 주요 기능

- 📍 Google Maps 기반 전통시장 지도
- 🏪 시장별 상세 정보
- 🛍️ 가게 및 상품 정보
- 🌐 다국어 지원 (한국어, 영어, 일본어, 중국어)
- 📱 iOS, Android, Web 크로스 플랫폼 지원

## 기술 스택

- **Framework**: React Native with Expo
- **Navigation**: Expo Router
- **Maps**: Google Maps (react-native-maps, @react-google-maps/api)
- **Language**: TypeScript
- **State Management**: React Context API

## 보안 사항

- 모든 API 키는 환경 변수로 관리
- `.env` 파일은 `.gitignore`에 포함
- Git history에서 민감한 정보 제거 완료

## 문제 해결

### Google Maps가 표시되지 않는 경우
1. `.env` 파일에 올바른 API 키가 설정되어 있는지 확인
2. Google Cloud Console에서 해당 API가 활성화되어 있는지 확인
3. API 키의 제한 사항(도메인, 패키지명 등)이 올바른지 확인
4. 앱을 재시작: `npx expo start --clear`

### 빌드 오류
```bash
# 캐시 삭제 후 재시작
npx expo start --clear

# node_modules 재설치
rm -rf node_modules
npm install
```

## 라이선스

This project is licensed under the MIT License.

## 기여

Pull Request를 환영합니다! 주요 변경사항은 먼저 이슈를 열어 논의해주세요.
