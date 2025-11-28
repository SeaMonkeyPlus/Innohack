export const translations = {
  ko: {
    // Tab Navigation
    tabs: {
      camera: "촬영",
      home: "홈",
      register: "등록",
    },

    // Common
    common: {
      loading: "로딩 중...",
      error: "오류",
      success: "성공",
      confirm: "확인",
      cancel: "취소",
      delete: "삭제",
      retake: "다시 찍기",
      back: "이전",
      next: "다음 단계",
      count: "개",
      won: "원",
    },

    // Market
    market: {
      title: "부산 전통시장",
      nearby: "주변 전통시장",
      selectMarket: "선택하기",
      viewDetails: "자세히 보기",
      noResults: "검색 결과가 없습니다",
      tryAgain: "다른 시장을 선택하거나 다시 촬영해보세요",
      change: "변경",
      loadingMarkets: "시장 정보를 불러오는 중...",
      loadingShops: "가게 정보를 불러오는 중...",
      loadFailed: "시장 정보를 불러오는데 실패했습니다.",
      retry: "다시 시도",
      mapLoadFailed: "지도를 불러올 수 없습니다",
      useWeb: "웹 버전을 사용해주세요",
      searchResults: "검색 결과",
    },

    // Shop
    shop: {
      count: "개 가게",
      details: "상세 정보",
      description: "상세 설명",
      address: "주소",
      openingHours: "영업시간",
      phone: "전화번호",
      rating: "평점",
      category: "카테고리",
      products: "판매 상품",
      loading: "상품 정보를 불러오는 중...",
      noProducts: "등록된 상품이 없습니다",
      collapse: "접기",
    },

    // Product
    product: {
      count: "개 상품",
    },

    // Camera
    camera: {
      initializing: "카메라를 초기화하는 중...",
      permissionRequired: "카메라 권한이 필요합니다",
      allowPermission: "권한 허용",
      selectMarket: "시장을 먼저 선택해주세요",
      selectMarketHint: "홈 화면에서 시장을 선택한 후\n카메라를 사용할 수 있습니다",
      goHome: "홈으로 이동",
      analyzing: "AI 분석중",
      dragToMove: "드래그하여 이동",
      noShopsFound: "해당 음식을 판매하는 가게를 찾을 수 없습니다",
      analysisFailed: "이미지 분석에 실패했습니다. 다시 시도해주세요.",
      cameraNotReady: "카메라가 준비되지 않았습니다.",
      photoFailed: "사진 촬영에 실패했습니다.",
    },

    // Restaurant Registration
    register: {
      verification: {
        title: "가게 등록 인증",
        subtitle: "가게 등록을 위해 검증 코드를 입력해주세요",
        placeholder: "검증 코드 입력",
        verify: "확인",
        hint: "※ 관리자로부터 받은 4자리 코드를 입력하세요",
        success: "검증이 완료되었습니다. 가게 등록을 진행하세요.",
        failed: "잘못된 검증 코드입니다. 다시 시도해주세요.",
      },
      step1: {
        title: "기본 정보",
        name: "가게 이름",
        namePlaceholder: "예: 할매 호떡집",
        category: "카테고리",
        categoryPlaceholder: "예: 떡·디저트, 한식, 분식",
        phone: "전화번호",
        phonePlaceholder: "예: 051-245-1234",
        address: "주소",
        addressPlaceholder: "예: 부산 중구 신창동4가 14-3",
        openingHours: "영업시간",
        openingHoursPlaceholder: "예: 09:00 - 19:00",
        description: "가게 설명",
        descriptionPlaceholder: "가게에 대한 설명을 입력하세요",
        nameRequired: "가게 이름을 입력해주세요.",
      },
      step2: {
        title: "위치 및 사진",
        location: "가게 위치",
        latitude: "위도",
        longitude: "경도",
        locationSet: "위치 설정 완료",
        setLocation: "위치를 설정해주세요",
        currentLocation: "현재 위치",
        locationHint: "※ 현재 위치 버튼을 눌러 가게 위치를 설정하세요",
        photos: "가게 사진",
        addPhoto: "사진 추가",
        photoCount: "총",
        photoCountUnit: "장",
        locationRequired: "가게 위치를 설정해주세요.",
        locationSuccess: "현재 위치가 설정되었습니다.",
        locationFailed: "위치를 가져올 수 없습니다.",
        permissionRequired: "위치 권한이 필요합니다.",
      },
      step3: {
        title: "메뉴 등록 (선택)",
        addMenu: "새 메뉴 추가",
        menuName: "메뉴 이름",
        menuNamePlaceholder: "예: 씨앗호떡",
        price: "가격 (원)",
        pricePlaceholder: "예: 2000",
        menuDescription: "메뉴 설명",
        menuDescriptionPlaceholder: "예: 해바라기씨, 호박씨 듬뿍",
        addMenuItem: "메뉴 추가",
        registeredMenus: "등록된 메뉴",
        menuRequired: "메뉴 이름과 가격을 입력해주세요.",
        menuAdded: "메뉴가 추가되었습니다.",
      },
      steps: {
        basic: "기본정보",
        location: "위치/사진",
        menu: "메뉴",
      },
      complete: "등록 완료",
      success: "가게 등록이 완료되었습니다!",
      failed: "가게 등록에 실패했습니다. 다시 시도해주세요.",
    },

    // Map
    map: {
      loading: "지도 로딩 중...",
      error: "지도를 불러오는 중 오류가 발생했습니다.",
      checkApiKey: "Google Maps API 키를 확인해주세요.",
    },
  },

  en: {
    // Tab Navigation
    tabs: {
      camera: "Camera",
      home: "Home",
      register: "Register",
    },

    // Common
    common: {
      loading: "Loading...",
      error: "Error",
      success: "Success",
      confirm: "Confirm",
      cancel: "Cancel",
      delete: "Delete",
      retake: "Retake",
      back: "Back",
      next: "Next",
      count: "",
      won: "",
    },

    // Market
    market: {
      title: "Busan Traditional Markets",
      nearby: "Nearby Traditional Markets",
      selectMarket: "Select",
      viewDetails: "View Details",
      noResults: "No results found",
      tryAgain: "Please select another market or take another photo",
      change: "Change",
      loadingMarkets: "Loading market information...",
      loadingShops: "Loading shop information...",
      loadFailed: "Failed to load market information.",
      retry: "Retry",
      mapLoadFailed: "Unable to load map",
      useWeb: "Please use web version",
      searchResults: "Search Results",
    },

    // Shop
    shop: {
      count: " shops",
      details: "Details",
      description: "Description",
      address: "Address",
      openingHours: "Opening Hours",
      phone: "Phone",
      rating: "Rating",
      category: "Category",
      products: "Products",
      loading: "Loading products...",
      noProducts: "No products registered",
      collapse: "Collapse",
    },

    // Product
    product: {
      count: " products",
    },

    // Camera
    camera: {
      initializing: "Initializing camera...",
      permissionRequired: "Camera permission required",
      allowPermission: "Allow Permission",
      selectMarket: "Please select a market first",
      selectMarketHint: "Select a market from the home screen\nbefore using the camera",
      goHome: "Go to Home",
      analyzing: "Analyzing with AI",
      dragToMove: "Drag to move",
      noShopsFound: "No shops found selling this food",
      analysisFailed: "Image analysis failed. Please try again.",
      cameraNotReady: "Camera is not ready",
      photoFailed: "Failed to take photo",
    },

    // Restaurant Registration
    register: {
      verification: {
        title: "Shop Registration Verification",
        subtitle: "Please enter the verification code to register a shop",
        placeholder: "Enter verification code",
        verify: "Verify",
        hint: "※ Enter the 4-digit code from the administrator",
        success: "Verification completed. Please proceed with registration.",
        failed: "Invalid verification code. Please try again.",
      },
      step1: {
        title: "Basic Information",
        name: "Shop Name",
        namePlaceholder: "e.g., Grandma's Hotteok",
        category: "Category",
        categoryPlaceholder: "e.g., Dessert, Korean Food",
        phone: "Phone Number",
        phonePlaceholder: "e.g., 051-245-1234",
        address: "Address",
        addressPlaceholder: "e.g., 14-3 Sinchang-dong 4-ga, Jung-gu, Busan",
        openingHours: "Opening Hours",
        openingHoursPlaceholder: "e.g., 09:00 - 19:00",
        description: "Shop Description",
        descriptionPlaceholder: "Enter a description of the shop",
        nameRequired: "Please enter the shop name.",
      },
      step2: {
        title: "Location & Photos",
        location: "Shop Location",
        latitude: "Latitude",
        longitude: "Longitude",
        locationSet: "Location set",
        setLocation: "Please set the location",
        currentLocation: "Current Location",
        locationHint: "※ Press the current location button to set the shop location",
        photos: "Shop Photos",
        addPhoto: "Add Photo",
        photoCount: "Total",
        photoCountUnit: " photos",
        locationRequired: "Please set the shop location.",
        locationSuccess: "Current location has been set.",
        locationFailed: "Unable to get location.",
        permissionRequired: "Location permission required.",
      },
      step3: {
        title: "Menu Registration (Optional)",
        addMenu: "Add New Menu",
        menuName: "Menu Name",
        menuNamePlaceholder: "e.g., Seed Hotteok",
        price: "Price",
        pricePlaceholder: "e.g., 2000",
        menuDescription: "Menu Description",
        menuDescriptionPlaceholder: "e.g., With sunflower and pumpkin seeds",
        addMenuItem: "Add Menu",
        registeredMenus: "Registered Menus",
        menuRequired: "Please enter menu name and price.",
        menuAdded: "Menu has been added.",
      },
      steps: {
        basic: "Basic",
        location: "Location",
        menu: "Menu",
      },
      complete: "Complete",
      success: "Shop registration completed!",
      failed: "Shop registration failed. Please try again.",
    },

    // Map
    map: {
      loading: "Loading map...",
      error: "An error occurred while loading the map.",
      checkApiKey: "Please check your Google Maps API key.",
    },
  },
};

export type TranslationKey = keyof typeof translations.ko;
