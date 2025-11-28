# 프로젝트 폴더 구조

React Native Expo 프로젝트의 개선된 폴더 구조입니다.

## 📁 폴더 구조

```
marketFinder/
├── app/                      # Expo Router (라우팅 전용)
│   ├── (tabs)/              # 탭 네비게이션 그룹
│   │   ├── _layout.tsx      # 탭 레이아웃
│   │   ├── index.tsx        # 홈 화면
│   │   └── explore.tsx      # Explore 화면
│   ├── _layout.tsx          # 루트 레이아웃
│   └── modal.tsx            # 모달 화면
│
├── src/                      # 소스 코드
│   ├── components/          # 컴포넌트
│   │   ├── common/         # 공통 컴포넌트
│   │   │   ├── themed-text.tsx
│   │   │   ├── themed-view.tsx
│   │   │   ├── parallax-scroll-view.tsx
│   │   │   ├── hello-wave.tsx
│   │   │   ├── external-link.tsx
│   │   │   └── haptic-tab.tsx
│   │   ├── ui/             # UI 컴포넌트
│   │   │   ├── collapsible.tsx
│   │   │   ├── icon-symbol.tsx
│   │   │   └── icon-symbol.ios.tsx
│   │   └── features/       # 기능별 컴포넌트 (추후 추가)
│   │
│   ├── hooks/              # 커스텀 훅
│   │   ├── use-color-scheme.ts
│   │   ├── use-color-scheme.web.ts
│   │   └── use-theme-color.ts
│   │
│   ├── services/           # API 서비스 (추후 추가)
│   ├── utils/              # 유틸리티 함수 (추후 추가)
│   ├── constants/          # 상수 및 설정
│   │   └── theme.ts
│   ├── types/              # TypeScript 타입 정의 (추후 추가)
│   └── styles/             # 공통 스타일 (추후 추가)
│
├── assets/                  # 정적 파일
│   └── images/             # 이미지 파일
│
├── scripts/                 # 스크립트
├── tsconfig.json           # TypeScript 설정
├── package.json            # 프로젝트 의존성
└── app.json                # Expo 설정
```

## 🎯 TypeScript 경로 별칭

`tsconfig.json`에 다음 경로 별칭이 설정되어 있습니다:

```typescript
{
  "@components/*": ["src/components/*"],
  "@hooks/*": ["src/hooks/*"],
  "@services/*": ["src/services/*"],
  "@utils/*": ["src/utils/*"],
  "@constants/*": ["src/constants/*"],
  "@types/*": ["src/types/*"],
  "@styles/*": ["src/styles/*"],
  "@assets/*": ["assets/*"]
}
```

## 💡 사용 예시

### 컴포넌트 import
```typescript
// ❌ 이전 방식
import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';

// ✅ 새로운 방식
import { ThemedText } from '@components/common/themed-text';
import { useColorScheme } from '@hooks/use-color-scheme';
```

### 컴포넌트 분류 가이드

#### `src/components/common/`
- 프로젝트 전반에서 재사용되는 공통 컴포넌트
- 예: ThemedText, ThemedView, Button 등

#### `src/components/ui/`
- UI 라이브러리처럼 사용되는 범용 컴포넌트
- 예: Collapsible, IconSymbol, Modal 등

#### `src/components/features/`
- 특정 기능에 종속된 컴포넌트
- 예: ProductCard, UserProfile, MapView 등

## 📋 폴더별 역할

### `app/`
- Expo Router의 파일 기반 라우팅 전용
- 화면(Screen) 컴포넌트만 포함
- 비즈니스 로직은 최소화

### `src/components/`
- 재사용 가능한 모든 컴포넌트
- common, ui, features로 분류하여 관리

### `src/hooks/`
- 커스텀 React 훅
- 로직 재사용 및 상태 관리

### `src/services/`
- API 통신 로직
- 외부 서비스 연동 코드

### `src/utils/`
- 순수 함수 형태의 유틸리티
- 날짜 포맷, 문자열 처리 등

### `src/constants/`
- 앱 전역 상수
- 테마, 설정값 등

### `src/types/`
- TypeScript 타입 정의
- 인터페이스, 타입 별칭 등

### `src/styles/`
- 공통 스타일 정의
- 테마, 색상, 폰트 등

## 🚀 새 기능 추가 시 가이드

### 1. 새 화면 추가
```
app/(tabs)/new-screen.tsx  # 새 화면 생성
```

### 2. API 서비스 추가
```typescript
// src/services/api.ts
export const fetchData = async () => {
  // API 호출 로직
};
```

### 3. 커스텀 훅 추가
```typescript
// src/hooks/use-custom-hook.ts
export const useCustomHook = () => {
  // 훅 로직
};
```

### 4. 공통 컴포넌트 추가
```typescript
// src/components/common/new-component.tsx
export const NewComponent = () => {
  // 컴포넌트 로직
};
```

## 📝 개발 팁

1. **import 경로는 항상 별칭 사용**
   - 상대 경로(`../../`) 대신 별칭(`@components/`) 사용

2. **컴포넌트는 적절한 폴더에 배치**
   - 범용성에 따라 common, ui, features 중 선택

3. **비즈니스 로직은 hooks나 services로 분리**
   - 컴포넌트는 UI 렌더링에 집중

4. **타입 정의는 types 폴더에 집중**
   - 공통 타입은 `src/types/`에 정의

## ✨ 장점

- ✅ **명확한 구조**: 파일의 역할과 위치를 쉽게 파악
- ✅ **확장성**: 프로젝트 규모가 커져도 유지보수 용이
- ✅ **재사용성**: 컴포넌트와 로직의 재사용 극대화
- ✅ **협업 용이**: 팀원 간 코드 위치 합의 쉬움
- ✅ **테스트 용이**: 각 모듈을 독립적으로 테스트 가능
