# start-page

---

## 서비스 소개

---

**start-page**(이하, 시작 페이지)는 RSS 피드 구독과 사용자에 의한 일부 커스터마이즈가 가능한 웹 애플리케이션으로, 웹 브라우저의 기본 시작 페이지를 대체하기 위해 개발했습니다.

## 목차

---

- [start-page](#start-page)
  - [서비스 소개](#서비스-소개)
  - [목차](#목차)
  - [기획 배경 및 상세 소개](#기획-배경-및-상세-소개)
  - [프로젝트 구조](#프로젝트-구조)
  - [기능 명세 및 상세 화면](#기능-명세-및-상세-화면)
    - [1. 기본 화면](#1-기본-화면)
    - [2. 구독 화면](#2-구독-화면)
  - [기술 스택](#기술-스택)
    - [Front-End](#front-end)
    - [DBMS](#dbms)
    - [DevOps](#devops)
  - [기술적 고민](#기술적-고민)
  - [느낀 점](#느낀-점)
  - [프로젝트 실행 방법](#프로젝트-실행-방법)

## 기획 배경 및 상세 소개

---

- 전 회사에서 사용했던 주요 기술 스택인 Next.js의 연습 목적의 프로젝트로 시작했으나, 이전에 진행했던 프로젝트들은 프로그래밍 언어, 라이브러리의 숙달 목적이 강했기 때문에 실제로 누구나 사용 가능한 프로덕트를 만들어내는 것을 주요 목표로 삼았습니다.
- 하루에 가장 많이 사용하는 프로그램이 웹 브라우저인 만큼 이를 활용할 수 있는 프로덕트가 뭐가 있을지 탐색을 진행했고, 프로젝트 기획 당시 사용하던 웹 브라우저의 기본 시작 페이지에 대해 활용도가 떨어진다는 불만을 품고 있었기 때문에 이를 대체할 수 있는 프로덕트를 만들어내는 것을 목표로 삼았습니다.
- RSS 피드는 시작 페이지에 원하는 정보만 표시하기 위해 도입한 것으로, 평소에 참조하던 개발 블로그를 포함해 다양한 출처의 글들을 읽기 위해 추가했으며 원하는 글을 좀 더 편하게 찾을 수 있도록 일부 필터링 기능을 제공합니다.
- 검색창의 경우 시작 페이지라는 컨셉에 맞게 해당되는 검색 엔진의 검색 결과로 바로 이동할 수 있도록 구현했으며, 사용자가 자신의 입맛에 맞게 커스터마이징하여 원하는 검색 엔진을 등록할 수 있도록 구현했습니다.

[목차](#목차)

## 프로젝트 구조

---

<details>
<summary>상세 내용</summary>
📦start-page <br />
 ┣ 📂app <br />
 ┃ ┣ 📂api <br />
 ┃ ┃ ┣ 📂auth <br />
 ┃ ┃ ┃ ┗ 📂[...nextauth] <br />
 ┃ ┃ ┃ ┃ ┣ 📜route.ts <br />
 ┃ ┃ ┃ ┃ ┗ 📜setting.ts <br />
 ┃ ┃ ┣ 📂data <br />
 ┃ ┃ ┃ ┣ 📂export <br />
 ┃ ┃ ┃ ┃ ┗ 📜route.ts <br />
 ┃ ┃ ┃ ┗ 📂import <br />
 ┃ ┃ ┃ ┃ ┗ 📜route.ts <br />
 ┃ ┃ ┣ 📂feeds <br />
 ┃ ┃ ┃ ┣ 📂[feedsSetId] <br />
 ┃ ┃ ┃ ┃ ┣ 📂[feedId] <br />
 ┃ ┃ ┃ ┃ ┃ ┗ 📜route.ts <br />
 ┃ ┃ ┃ ┃ ┗ 📜route.ts <br />
 ┃ ┃ ┃ ┣ 📂new <br />
 ┃ ┃ ┃ ┃ ┗ 📜route.ts <br />
 ┃ ┃ ┃ ┗ 📜route.ts <br />
 ┃ ┃ ┣ 📂register <br />
 ┃ ┃ ┃ ┗ 📜route.ts <br />
 ┃ ┃ ┣ 📂search_engines <br />
 ┃ ┃ ┃ ┗ 📜route.ts <br />
 ┃ ┃ ┗ 📂sources <br />
 ┃ ┃ ┃ ┣ 📂[sourceId] <br />
 ┃ ┃ ┃ ┃ ┗ 📜route.ts <br />
 ┃ ┃ ┃ ┣ 📂check <br />
 ┃ ┃ ┃ ┃ ┗ 📜route.ts <br />
 ┃ ┃ ┃ ┗ 📜route.ts <br />
 ┃ ┣ 📂main <br />
 ┃ ┃ ┣ 📂LoginInfoArea <br />
 ┃ ┃ ┃ ┣ 📜LoginHandleButton.tsx <br />
 ┃ ┃ ┃ ┣ 📜LoginInfoAreaView.tsx <br />
 ┃ ┃ ┃ ┣ 📜UserInfo.tsx <br />
 ┃ ┃ ┃ ┣ 📜UserSettingMenu.tsx <br />
 ┃ ┃ ┃ ┗ 📜index.tsx <br />
 ┃ ┃ ┣ 📂PostHandleOptions <br />
 ┃ ┃ ┃ ┣ 📜SubscriptionOptions.tsx <br />
 ┃ ┃ ┃ ┗ 📜index.tsx <br />
 ┃ ┃ ┣ 📂hooks <br />
 ┃ ┃ ┃ ┣ 📜useFeedsCaches.ts <br />
 ┃ ┃ ┃ ┣ 📜useFilteredFeeds.ts <br />
 ┃ ┃ ┃ ┗ 📜useObserveElement.ts <br />
 ┃ ┃ ┣ 📂utils <br />
 ┃ ┃ ┃ ┗ 📜index.ts <br />
 ┃ ┃ ┣ 📜MainView.tsx <br />
 ┃ ┃ ┣ 📜PageButton.tsx <br />
 ┃ ┃ ┗ 📜index.tsx <br />
 ┃ ┣ 📂reset_password <br />
 ┃ ┃ ┗ 📂[token] <br />
 ┃ ┃ ┃ ┣ 📂ResetPasswordView <br />
 ┃ ┃ ┃ ┃ ┣ 📜ClientButtonSets.tsx <br />
 ┃ ┃ ┃ ┃ ┗ 📜index.tsx <br />
 ┃ ┃ ┃ ┣ 📂common <br />
 ┃ ┃ ┃ ┃ ┗ 📂ResetResultView <br />
 ┃ ┃ ┃ ┃ ┃ ┣ 📜ClientButton.tsx <br />
 ┃ ┃ ┃ ┃ ┃ ┗ 📜index.tsx <br />
 ┃ ┃ ┃ ┣ 📂error <br />
 ┃ ┃ ┃ ┃ ┗ 📜page.tsx <br />
 ┃ ┃ ┃ ┣ 📂success <br />
 ┃ ┃ ┃ ┃ ┗ 📜page.tsx <br />
 ┃ ┃ ┃ ┗ 📜page.tsx <br />
 ┃ ┣ 📂root <br />
 ┃ ┃ ┗ 📜providers.tsx <br />
 ┃ ┣ 📜globals.css <br />
 ┃ ┣ 📜layout.tsx <br />
 ┃ ┗ 📜page.tsx <br />
 ┣ 📂common <br />
 ┃ ┣ 📜capsuledConditions.ts <br />
 ┃ ┣ 📜constants.ts <br />
 ┃ ┗ 📜helpers.ts <br />
 ┣ 📂components <br />
 ┃ ┣ 📂authentication <br />
 ┃ ┃ ┣ 📂LoginView <br />
 ┃ ┃ ┃ ┣ 📂assets <br />
 ┃ ┃ ┃ ┃ ┣ 📜btn_google_signin_light_pressed_web@2x.png <br />
 ┃ ┃ ┃ ┃ ┣ 📜kakao_login_medium_narrow.png <br />
 ┃ ┃ ┃ ┃ ┗ 📜naver_login.png <br />
 ┃ ┃ ┃ ┣ 📜.DS_Store <br />
 ┃ ┃ ┃ ┗ 📜index.tsx <br />
 ┃ ┃ ┣ 📂PasswordResetView <br />
 ┃ ┃ ┃ ┣ 📜AuthenticateEmail.tsx <br />
 ┃ ┃ ┃ ┣ 📜CheckUserInfo.tsx <br />
 ┃ ┃ ┃ ┣ 📜EmailAuthenticated.tsx <br />
 ┃ ┃ ┃ ┗ 📜index.tsx <br />
 ┃ ┃ ┣ 📂RegisterView <br />
 ┃ ┃ ┃ ┗ 📜index.tsx <br />
 ┃ ┃ ┣ 📂common <br />
 ┃ ┃ ┃ ┣ 📜CancelSubmitButtonSets.tsx <br />
 ┃ ┃ ┃ ┗ 📜TextInput.tsx <br />
 ┃ ┃ ┣ 📂hooks <br />
 ┃ ┃ ┃ ┗ 📜useChangeModalView.ts <br />
 ┃ ┃ ┣ 📜Layout.tsx <br />
 ┃ ┃ ┗ 📜index.tsx <br />
 ┃ ┣ 📂card <br />
 ┃ ┃ ┣ 📂hooks <br />
 ┃ ┃ ┃ ┣ 📜useCheckIfDataIsNew.ts <br />
 ┃ ┃ ┃ ┣ 📜useClientSideDate.ts <br />
 ┃ ┃ ┃ ┗ 📜useDerivedStateFromProps.ts <br />
 ┃ ┃ ┣ 📜CardView.tsx <br />
 ┃ ┃ ┣ 📜Checkbox.tsx <br />
 ┃ ┃ ┗ 📜index.tsx <br />
 ┃ ┣ 📂common <br />
 ┃ ┃ ┣ 📜BlankSubscription.tsx <br />
 ┃ ┃ ┣ 📜Button.tsx <br />
 ┃ ┃ ┣ 📜SelectDiv.tsx <br />
 ┃ ┃ ┗ 📜Spinner.tsx <br />
 ┃ ┣ 📂editSearchEngines <br />
 ┃ ┃ ┣ 📜EngineDataEditor.tsx <br />
 ┃ ┃ ┣ 📜TableRow.tsx <br />
 ┃ ┃ ┗ 📜index.tsx <br />
 ┃ ┣ 📂feeds <br />
 ┃ ┃ ┣ 📂CancelSubscription <br />
 ┃ ┃ ┃ ┣ 📂hooks <br />
 ┃ ┃ ┃ ┃ ┗ 📜useCancelSubscription.ts <br />
 ┃ ┃ ┃ ┣ 📜CancelSubscriptionView.tsx <br />
 ┃ ┃ ┃ ┗ 📜index.tsx <br />
 ┃ ┃ ┣ 📂FilterBySource <br />
 ┃ ┃ ┃ ┣ 📜FilterBySourceView.tsx <br />
 ┃ ┃ ┃ ┣ 📜SubscriptionOption.tsx <br />
 ┃ ┃ ┃ ┗ 📜index.tsx <br />
 ┃ ┃ ┣ 📂FilterByText <br />
 ┃ ┃ ┃ ┣ 📜FilterByTextView.tsx <br />
 ┃ ┃ ┃ ┗ 📜index.tsx <br />
 ┃ ┃ ┣ 📂SubscribeNew <br />
 ┃ ┃ ┃ ┣ 📜SubscriptionForm.tsx <br />
 ┃ ┃ ┃ ┗ 📜index.tsx <br />
 ┃ ┃ ┣ 📂common <br />
 ┃ ┃ ┃ ┣ 📜ListItemBox.tsx <br />
 ┃ ┃ ┃ ┗ 📜ModalTemplate.tsx <br />
 ┃ ┃ ┣ 📂utils <br />
 ┃ ┃ ┃ ┗ 📜helpers.ts <br />
 ┃ ┃ ┗ 📜SubscriptionDialogBox.tsx <br />
 ┃ ┣ 📂feedsList <br />
 ┃ ┃ ┗ 📜index.tsx <br />
 ┃ ┣ 📂modal <br />
 ┃ ┃ ┗ 📜index.tsx <br />
 ┃ ┣ 📂search <br />
 ┃ ┃ ┣ 📂hooks <br />
 ┃ ┃ ┃ ┗ 📜useHandleInputFill.ts <br />
 ┃ ┃ ┣ 📂utils <br />
 ┃ ┃ ┃ ┣ 📜constants.ts <br />
 ┃ ┃ ┃ ┗ 📜helpers.ts <br />
 ┃ ┃ ┗ 📜index.tsx <br />
 ┃ ┣ 📜.DS_Store <br />
 ┃ ┗ 📜Seo.tsx <br />
 ┣ 📂controllers <br />
 ┃ ┣ 📂feeds <br />
 ┃ ┃ ┣ 📂feedsSetId <br />
 ┃ ┃ ┃ ┗ 📜feedId.ts <br />
 ┃ ┃ ┣ 📂new <br />
 ┃ ┃ ┃ ┣ 📜index.ts <br />
 ┃ ┃ ┃ ┗ 📜utils.ts <br />
 ┃ ┃ ┗ 📜index.ts <br />
 ┃ ┣ 📂searchEngines <br />
 ┃ ┃ ┗ 📜index.ts <br />
 ┃ ┣ 📂sources <br />
 ┃ ┃ ┗ 📜helpers.ts <br />
 ┃ ┣ 📜common.ts <br />
 ┃ ┣ 📜mongodb.ts <br />
 ┃ ┣ 📜requestControllers.ts <br />
 ┃ ┗ 📜utils.ts <br />
 ┣ 📂hooks <br />
 ┃ ┣ 📜useDetectSystemTheme.ts <br />
 ┃ ┣ 📜useFilters.ts <br />
 ┃ ┣ 📜useGetRawCookie.ts <br />
 ┃ ┣ 📜useOutsideClickClose.ts <br />
 ┃ ┗ 📜useResizeEvent.ts <br />
 ┣ 📂public <br />
 ┃ ┣ 📂fonts <br />
 ┃ ┃ ┣ 📜Pretendard-Bold.subset.woff <br />
 ┃ ┃ ┣ 📜Pretendard-Bold.subset.woff2 <br />
 ┃ ┃ ┣ 📜Pretendard-Regular.subset.woff <br />
 ┃ ┃ ┗ 📜Pretendard-Regular.subset.woff2 <br />
 ┃ ┣ 📜favicon.ico <br />
 ┃ ┗ 📜vercel.svg <br />
 ┣ 📜.DS_Store <br />
 ┣ 📜.dockerignore <br />
 ┣ 📜.env.development <br />
 ┣ 📜.env.production <br />
 ┣ 📜.eslintrc.json <br />
 ┣ 📜.gitignore <br />
 ┣ 📜.pnp.cjs <br />
 ┣ 📜.pnp.loader.mjs <br />
 ┣ 📜.prettierrc.js <br />
 ┣ 📜.yarnrc.yml <br />
 ┣ 📜Dockerfile.development <br />
 ┣ 📜Dockerfile.production <br />
 ┣ 📜README.md <br />
 ┣ 📜ecosystem.development.js <br />
 ┣ 📜ecosystem.production.js <br />
 ┣ 📜next-env.d.ts <br />
 ┣ 📜next.config.js <br />
 ┣ 📜package.json <br />
 ┣ 📜postcss.config.js <br />
 ┣ 📜tailwind.config.js <br />
 ┣ 📜tsconfig.json <br />
 ┗ 📜yarn.lock <br />
</details>

[목차](#목차)

## 기능 명세 및 상세 화면

---

### 1. 기본 화면

---

기본화면 스크린샷(비로그인, 비구독 상태)
검색창 옵션, 사용자 정보 메뉴 각각 기본 화면에 합성

시작 페이지에 처음 접속하면 표시되는 화면입니다.
기본 상태에서는 사용할 수 있는 기능이 제한되며, 로그인 또는 비로그인 상태로 **검색엔진 편집** 혹은 **구독 추가** 기능을 사용할 경우 DB에 데이터를 기록해 **동기화** 기능을 사용할 수 있습니다.

- 기능 일람
    1. 검색창
        - 검색어를 입력해 해당 검색엔진의 검색 결과로 이동할 수 있습니다.
    2. 검색창 옵션: 원하는 검색엔진 선택 가능
        - 목록에서 원하는 검색엔진을 선택할 수 있습니다.
        - **편집** 버튼과 관련된 기능은 아래 **2. 구독 화면**을 참조해주시기 바랍니다.
    3. 구독 추가
        - 구독할 사이트의 주소를 입력한 뒤 **추가** 버튼을 누르면 해당 사이트의 RSS 피드를 구독할 수 있습니다.
        - 구독할 사이트의 주소 혹은 RSS 피드 주소 모두 입력 가능합니다.
        - 해당 사이트에서 RSS 피드 기능을 지원하지 않을 경우 구독이 불가능하며, RSS 피드를 지원하는 경우에도 오류가 발생할 경우 **문의하기** 버튼을 통해 문의해주시면 감사드리겠습니다.
    4. Guest 버튼
        - 비로그인 상태에서는 'Guest'로 표시되며, 로그인 상태에서는 로그인한 사용자 이메일 주소가 표시됩니다.
        - 해당 버튼을 클릭할 경우 스크린샷과 같이 사용자 정보 관리 메뉴가 표시됩니다.
    5. 설명서 버튼
        - 설명서 버튼을 클릭할 경우 본 리드미 페이지로 이동해 사용 방법을 확인하실 수 있습니다.
    6. 문의하기 버튼
        - 관리자에게 연락할 수 있는 버튼입니다.
        - 사용자 컴퓨터에 설치된 기본 메일 클라이언트를 통해 바로 이메일을 보내실 수 있습니다.
        - 메일 클라이언트 이용이 불가할 경우 **support@godcl.app**으로 접수해주시면 감사드리겠습니다.
    7. 테마 버튼
        - 시작 페이지의 테마를 설정할 수 있는 버튼입니다.
        - 가장 왼쪽 버튼부터 차례대로 **라이트 모드 고정**, **시스템 설정에 따름**, **다크 모드 고정**에 해당됩니다.
    8. **로그인** 버튼
        - OAuth를 통해 시작 페이지와 연결할 수 있는 버튼입니다.
        - 시작 페이지는 사용자 이메일 주소 외 다른 개인정보를 수집하지 않습니다.

[목차](#목차)

### 2. 구독 화면

---

구독 화면은 **구독 추가**버튼을 통해 구독한 사이트가 있는 경우 표시되는 화면입니다.
사용자는 로그인 혹은 비로그인 상태에서 **검색엔진 편집** 혹은 **구독 추가** 기능을 이용했을 때 DB를 통한 **동기화** 기능을 이용할 수 있습니다.

1. 검색창 편집: 새 데이터 입력란까지 표시된 상태로 스크린샷
    - 사용자는 원하는 대로 검색엔진 목록을 자유롭게 편집할 수 있습니다.
    - 추가하길 원하는 사이트에서 검색을 수행한 뒤 기본으로 추가된 예제와 같이 검색어를 제외한 주소를 추가하시면 됩니다.
    - 모바일 디바이스(스마트폰 등)에서 시작 페이지를 이용하시는 경우 검색창 편집 기능은 사용하실 수 없습니다.
    1. 추가 버튼
    2. 새 데이터 입력란
    3. 기존 데이터란
    4. 취소, 저장 버튼
2. 피드 갱신 버튼: 갱신 상태 표시 문구 표시된 상태로 스크린샷
    - 구독 대상 사이트에 새로운 피드가 존재하는지 확인하고, 필요시 전체 목록을 갱신하는 버튼입니다.
    - 갱신 절차가 진행중일 때 스크린샷과 같이 버튼 왼쪽에 상태 문구가 표시됩니다.
3. 구독 취소 버튼: 구독 취소 화면 표시된 상태로 스크린샷
    - 더 이상 구독하길 원하지 않는 사이트의 구독을 해제할 수 있는 기능입니다.
4. 필터 기능
    - 조건에 따라 피드를 필터링할 수 있는 기능입니다.
    - 현재 지원하는 필터는 아래와 같습니다.(이하 필터 작동된 상태로 스크린샷 추가, 일부는 옵션 선택 화면 추가)
    1. 즐겨찾기 필터
        - 즐겨찾기 설정한 피드만 볼 수 있는 필터입니다.
        - 필터가 작동된 경우 버튼이 어둡게 표시됩니다.
    2. 출처별 필터: 적용 화면 및 필터 작동된 상태로 각각 스크린샷
        - 특정 출처만 선택해 볼 수 있는 필터로, 즐겨찾기 필터와 마찬가지로 필터가 작동된 경우 버튼이 어둡게 표시됩니다.
        - 기본 상태는 모든 출처가 선택된 상태이며, 원하지 않는 출처의 선택을 해제한 뒤 '저장' 버튼을 눌러 필터링을 적용할 수 있습니다.
        - 초기화 버튼을 눌러 필터링을 해제할 수 있습니다.
    3. 검색어 필터: 필터 작동된 상태로 스크린샷
        - 피드의 제목 또는 본문에 포함된 키워드를 검색해 해당 키워드를 포함하는 피드만 볼 수 있는 필터입니다.
        - 피드의 제목 또는 본문이 해당 키워드를 정확히 포함하고 있어야 검색이 가능하며, 두 글자 이상만 입력이 가능합니다.
    4. 정렬 필터: 필터 작동된 상태 + 목록 열린 상태로 스크린샷
        - 피드를 **최신순**, **오래된 순**, **출처 순**으로 정렬할 수 있는 필터입니다.
        - **출처 순** 정렬의 경우 사용자가 추가한 출처 순서대로 최신 피드부터 차례대로 표시해줍니다.
5. 피드 카드
    1. 카드 클릭
        - 피드 카드를 클릭하면 해당 사이트의 원본 글로 이동할 수 있습니다.
    2. 즐겨찾기 버튼
        - 제목 옆의 별 모양 아이콘으로, 클릭할 경우 피드 즐겨찾기 목록에 등록할 수 있습니다.
    3. 읽음 표시 버튼
        - 기본적으로 카드를 클릭해 피드 본문으로 이동할 경우 해당 피드는 '읽음' 처리되어 카드 배경이 어둡게 처리되고 읽음 표시 버튼이 활성화됩니다.
        - 피드를 완전히 읽지 못했거나 다시 읽을 필요성이 있다고 느껴질 경우 읽음 표시 버튼을 클릭해 '읽지 않음' 처리하거나 필요 없는 피드의 읽음 표시 버튼을 클릭해 '읽음' 처리할 수 있습니다.
    4. New 표시
        - 발행된지 72시간 이내의 피드에 한해 New 키워드가 표시됩니다.
6. 회원 정보 버튼: 메뉴 열린 상태로 스크린샷
    - 기본적인 기능은 **1. 기본 화면**을 참조해주시기 바랍니다.
    - 시작 페이지의 동기화 기능은 DB를 기반으로 이루어지고 있습니다. 만약 OAuth를 통해 로그인하지 않은 경우 브라우저 쿠키를 기반으로 DB를 이용하므로, json 파일을 통해 다른 브라우저와 제한적인 동기화 기능을 사용할 수 있습니다.
    1. 사용자 데이터 내보내기
        - 사용자의 모든 데이터(검색 엔진 목록, 구독 출처 목록, 현재까지 구독한 피드 목록)를 json 파일로 내보내는 기능입니다.
        - 파일은 기본적으로 'export.json'이라는 이름으로 내보내집니다.
    2. 사용자 데이터 불러오기
        - json 파일로 내보낸 사용자 데이터를 불러오는 기능입니다.
        - 형식에 맞지 않는 json 파일을 사용할 경우 오류가 발생합니다.
    3. 데이터 이전
        - 비로그인 상태로 시작 페이지를 이용하다 OAuth를 사용하길 원하는 사용자들을 위한 기능으로, 브라우저에 저장된 쿠키를 읽어와 해당 쿠키의 데이터를 그대로 가져오는 기능입니다.
        - 브라우저에 저장된 쿠키가 없을 경우 해당 기능을 이용하실 수 없습니다.
7. 로그아웃 버튼

[목차](#목차)

## 기술 스택

---

### Front-End

- Next.js
    - Next.js 연습용 프로젝트로 시작했던 만큼 본 프로젝트는 Next.js를 통해 개발되었습니다.
    - 연습 목적이 아니더라도 SSR을 통해 SPA 특유의 빈 화면을 처리할 수 있다는 점, React.js와 달리 라이브러리 없이도 일부 기능들이 빌트인으로 통합되어 있다는 점 등의 장점을 고려하면 채택할 가치가 있다고 판단했습니다.
    - 최초에는 전 회사에서 사용하던 Next.js 12버전의 pages 라우터로 개발되었으나, 중간부터 Next.js 14버전의 app 라우터로 전환했습니다.
- TypeScript
    - 일부 라이브러리의 설정 파일(e.g. next.config.js, postcss.config.js 등)을 제외하고 모든 코드는 TypeScript로 작성되었습니다.
- @tanstack/React-Query
    - 모바일 레이아웃의 무한 스크롤, 데스크톱 레이아웃의 페이지네이션 등의 로직에 사용됐습니다.
    - 기존에는 GET 요청을 useQuery 훅으로 처리하였으나, Next.js 14 버전 이후부터는 대부분 Next.js에 내장된 fetch API를 이용했습니다.
    - react-query를 완전히 걷어내지 않은 이유는 캐시 기능을 통해 클라이언트에서 서버로의 일부 요청을 절감할 수 있었기 때문입니다.
- Next-auth
    - OAuth 연결과 React 생명주기와의 통합을 위해 Next-auth 라이브러리를 채택했습니다.
- Tailwind-CSS
    - CSS-in-JS와의 차이점을 비교하기 위해 채택했습니다.

### DBMS

- MongoDB
    - 기존에는 MySQL을 사용해왔던 만큼 NoSQL DB에 대한 호기심을 충족시키기 위해 MongoDB를 채택했습니다.
    - 비로그인 상태의 동기화 문제를 처리하기 위해 json 파일의 불러오기/내보내기 방식을 채택했는데, 자료 구조가 유사한 만큼 각각의 기능을 구현하고 통합하는데 MySQL에 비해 유리하다고 판단했습니다.
    - mongoose.js 라이브러리를 통해 MongoDB Atlas로의 요청을 처리하고 있습니다.

### DevOps

- Docker, Docker-compose
    - 현재 시작 페이지는 Oracle Cloud Infrastructure(OCI) 서비스를 통해 배포 중입니다.
    - 하나의 서버에 여러 서비스를 배포하고, 쉽게 관리할 수 있도록 컨테이너화하여 배포하기 위해 Docker 및 Docker-compose를 도입했습니다.

[목차](#목차)

## 기술적 고민

---

추가 예정

[목차](#목차)

## 느낀 점

---

추가 예정

[목차](#목차)

## 프로젝트 실행 방법

---

- 프로젝트 클론

```bash
  # 현재 디렉토리에 클론하는 경우
  $ https://github.com/godcl1623/start-page.git .

  # 하위 디렉토리에 클론하는 경우
  $ https://github.com/godcl1623/start-page.git ./start-page
```

- 프로젝트 실행
    - 환경 변수가 없어 원활한 실행을 보장할 수 없습니다.

    ```bash
    # yarn berry 활성화
    corepack enable
    yarn set version stable
    yarn install

    # 필요 패키지 설치
    yarn

    # develop 서버 실행
    yarn dev
    ```

[목차](#목차)
