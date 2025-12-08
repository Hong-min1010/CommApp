# CommApp

## 🚩 개요
- **프로젝트 이름** : CommApp
- **프로젝트 기간** : 2025.12.04 ~ 2025.12.07

<br>

## 🛠️ 기술 스택
![React Native](https://img.shields.io/badge/React_Native-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Expo](https://img.shields.io/badge/Expo-000000?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)

<br>

# ✨ 기능 테스트 시나리오

## **실행 방법**
압축 파일을 다운로드 받은 후 VS Code에서 폴더를 열고,  
터미널에서 아래 명령어를 실행하면 앱이 실행됩니다.

1) npm install
2) npx expo start

## **1. 회원가입**
  1\) '회원가입' 버튼을 터치 회원가입 화면에 접속합니다.

  2\) Email, Name(닉네임), Password, ConfirmPassword를 입력해주세요.
  - Email 입력 시, 이메일 형식에 맞추어 작성해주세요.
  <br/>(영문자(a–z, A–Z), 숫자(0–9), 일부 특수문자(._%+-)만 사용 가능)

  3\) '회원가입' 버튼 터치 시 회원가입이 완료되고 로그인 화면으로 이동합니다.


## **2. 로그인**
1\) Email과 Password 입력 후 로그인 버튼을 눌러주세요.

2\) 로그인 성공 시, Main 화면으로 이동합니다.
- 로그인 실패 시, 하단에 ToastMessage 안내문이 나옵니다. (Main 화면으로 이동하지 않습니다.)
 
## **3. 게시글 목록조회 기능**
1\) 로그인 후 이동한 Main 화면에서 게시글을 전체 조회할 수 있으며, 
<br/>좌측 상단에서 현재 로그인 한 사용자의 닉네임을 확인할 수 있습니다.

2\) SearchBar 하단에 있는 게시글 작성 버튼 터치 시, 게시글 작성 화면으로 이동합니다.

3\) 게시글 터치 시, 해당 게시글의 상세조회 페이지로 이동합니다.

## **4. 게시글 검색 기능**
1\) Main 화면 기준 상단 검색바에서 제목을 검색하여 게시글을 찾고 검색 결과 게시글 선택 시, 해당 게시글 상세 페이지로 이동합니다.
  - 검색바 입력 시, 하단에 실시간으로 필터링 되어 게시글이 렌더링 됩니다.

## **5. 게시글 작성 기능**
1\) Main 화면의 우측 상단에 게시글 작성 버튼 터치 시, 게시글 작성 페이지로 이동합니다.
- 뒤로가기 버튼 터치 시, Home 화면으로 이동합니다.

2\) 게시글 제목, 내용은 필수로 작성해야합니다.
  - 첨부파일(이미지)는 선택사항입니다.

3\) 내용을 모두 입력 후 '작성완료' 버튼 터치 시, 게시글 작성이 완료됩니다.
완료 후, Main 페이지로 이동합니다.

## **6. 게시글 상세조회 기능**
1\) Main 화면에 있는 게시글 터치 시, 해당 게시글의 상세 페이지로 이동합니다.
- 수정 버튼 터치 시, 게시글 수정 페이지로 이동합니다. 
- 삭제 버튼 터치 시, 삭제 confirm 창이 표시됩니다.
- 뒤로가기 버튼 터치 시, Main 화면으로 이동합니다.
- 게시글 하단에 댓글 작성하기를 통해 댓글을 등록 할 수 있습니다.

## **7. 댓글 수정 및 삭제 기능**
1\) 게시글 상세 화면에서 하단에 본인이 작성 한 댓글을 수정 / 삭제 버튼을 통해 수정 또는 삭제를 할 수 있습니다.

## **8. 게시글 수정 기능**
1\) 제목, 내용, 이미지를 수정 후 '수정완료' 버튼을 눌러주세요.
- 카테고리, 제목, 내용은 필수값입니다.
- 이미지를 삭제할 수 있습니다.

2\) 수정 완료 버튼 터치 시, 수정이 완료되며 수정 완료 된 게시글의 상세 페이지로 이동합니다.

## **8. 게시글 삭제 기능**
1\) 게시글 상세 페이지에서 삭제 버튼 터치 후,
<br>"정말 이 게시글을 삭제하시겠습니까?" 안내문에서 삭제버튼 터치 시, 삭제 후 Main 화면으로 이동합니다.

## **9. 로그아웃 기능**
1\) '로그아웃' 버튼 터치 시, 로그아웃되며 로그인 화면으로 이동합니다.