# 구글맵 API 설정 가이드

이 프로젝트에서 구글맵을 사용하려면 Google Maps API 키가 필요합니다.

## 1. Google Cloud Console에서 API 키 발급

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 프로젝트를 생성하거나 기존 프로젝트 선택
3. "API 및 서비스" > "라이브러리"로 이동
4. 다음 API를 활성화:
   - Maps SDK for Android
   - Maps SDK for iOS
   - Maps JavaScript API (웹용)
5. "API 및 서비스" > "사용자 인증 정보"로 이동
6. "사용자 인증 정보 만들기" > "API 키" 선택
7. 생성된 API 키를 복사

## 2. iOS 설정

`app.json` 파일에 API 키 추가:

```json
{
  "expo": {
    "ios": {
      "config": {
        "googleMapsApiKey": "YOUR_IOS_API_KEY"
      }
    }
  }
}
```

## 3. Android 설정

`app.json` 파일에 API 키 추가:

```json
{
  "expo": {
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "YOUR_ANDROID_API_KEY"
        }
      }
    }
  }
}
```

## 4. 웹 설정

웹에서는 별도의 구글맵 라이브러리(`@react-google-maps/api`)를 사용합니다.

### 환경 변수 설정

1. 프로젝트 루트에 `.env` 파일 생성:
```bash
cp .env.example .env
```

2. `.env` 파일에 API 키 입력:
```
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_WEB_API_KEY
```

**중요**: `.env` 파일은 절대 Git에 커밋하지 마세요! (이미 .gitignore에 포함되어 있습니다)

## 5. 전체 app.json 예시

```json
{
  "expo": {
    "name": "marketFinder",
    "slug": "marketfinder",
    // ... 기타 설정
    "ios": {
      "config": {
        "googleMapsApiKey": "YOUR_IOS_API_KEY"
      }
    },
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "YOUR_ANDROID_API_KEY"
        }
      }
    },
    "web": {
      "config": {
        "googleMapsApiKey": "YOUR_WEB_API_KEY"
      }
    }
  }
}
```

## 6. 언어 설정

현재 구현된 코드는 `LanguageContext`를 통해 선택된 언어를 관리합니다. 
지도의 언어는 다음과 같이 변경됩니다:

- 사용자가 언어 선택 버튼에서 언어를 선택
- `LanguageContext`의 `selectedLanguage` 상태가 업데이트
- `MapViewComponent`가 언어 변경을 감지하고 지도를 새로고침

## 7. 테스트

```bash
# iOS 시뮬레이터에서 실행
npm run ios

# Android 에뮬레이터에서 실행
npm run android

# 웹 브라우저에서 실행
npm run web
```

## 주의사항

- API 키는 공개 저장소에 커밋하지 마세요
- 프로덕션 환경에서는 환경 변수나 시크릿 관리 도구를 사용하세요
- API 키에 적절한 제한사항(애플리케이션 제한, API 제한)을 설정하세요
- 무료 할당량을 초과하면 비용이 발생할 수 있으니 주의하세요

## 지원 언어

현재 지원하는 9개 언어:
- 🇰🇷 한국어 (Korean)
- 🇺🇸 영어 (English)
- 🇯🇵 일본어 (Japanese)
- 🇨🇳 중국어 (Chinese)
- 🇪🇸 스페인어 (Spanish)
- 🇫🇷 프랑스어 (French)
- 🇩🇪 독일어 (German)
- 🇻🇳 베트남어 (Vietnamese)
- 🇹🇭 태국어 (Thai)

각 언어를 선택하면 지도의 레이블과 인터페이스 언어가 변경됩니다.
