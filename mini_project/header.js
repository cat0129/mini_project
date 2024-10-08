// header.js
document.addEventListener('DOMContentLoaded', () => {
    // 헤더 컴포넌트 정의
    const headerComponent = {
        template: `
            <header class="header">
                <div class="title">
                    <a href="main.html">
                        <img src="images/고양이로고.jpg" alt="고양이 마트 로고" class="logo">
                        <label style="cursor:pointer;">고양이 마트</label>
                    </a>
                    <div class="gnb">
                        <a href="board.html" class="board-link">게시판</a>
                        <a href="signin.html" class="signin-link" v-if="!isLogged">회원가입</a>
                        <a href="userInfo.html" class="admin-link" v-if="isAdmin & isLogged">회원관리</a>
                        <a href="login.html" class="login-link" v-if="!isLogged">로그인</a>
                        <a href="cart.html" class="login-link" v-if="isLogged">장바구니</a>
                        <a href="mypage.html" class="login-link" v-if="isLogged" @click="fnUser(sessionStorage.getItem('id'))">내 정보</a>
                        <a href="main.html" class="login-link" v-if="isLogged" @click="fnLogout">로그아웃</a>
                    </div>
                </div>
            </header>
            <nav>
                <ul>
                    <li><a href="food.html">사료/간식</a>
                        <ul>
                            <li><a href="food.html">사료</a></li>
                            <li><a href="food.html">간식</a></li>
                            <li><a href="food.html">영양제</a></li>
                        </ul>
                    </li>
                    <li><a href="plate.html">식기/급수기</a>
                        <ul>
                            <li><a href="plate.html">식기</a></li>
                            <li><a href="plate.html">급수기</a></li>
                            <li><a href="plate.html">사료보관통</a></li>
                        </ul>
                    </li>
                    <li><a href="shower.html">목욕용품</a>
                        <ul>
                            <li><a href="shower.html">샴푸/린스</a></li>
                            <li><a href="shower.html">브러쉬</a></li>
                            <li><a href="shower.html">드라이룸</a></li>
                        </ul>
                    </li>
                    <li><a href="toilet.html">위생용품</a>
                        <ul>
                            <li><a href="toilet.html">화장실</a></li>
                            <li><a href="toilet.html">모래</a></li>
                            <li><a href="toilet.html">매트/삽</a></li>
                        </ul>
                    </li>
                    <li><a href="toy.html">장난감</a>
                        <ul>
                            <li><a href="toy.html">인형</a></li>
                            <li><a href="toy.html">낚시대</a></li>
                            <li><a href="toy.html">캣닢볼</a></li>
                        </ul>
                    </li>
                    <li><a href="furniture.html">캣타워/가구</a>
                        <ul>
                            <li><a href="furniture.html">캣타워</a></li>
                            <li><a href="furniture.html">캣휠</a></li>
                            <li><a href="furniture.html">스크래쳐</a></li>
                        </ul>
                    </li>
                </ul>
            </nav>
        `,
        data() {
            return {
                isLogged: false,
                isAdmin: false
            };
        },
        methods: {
            fnLogged() {
                this.isLogged = sessionStorage.getItem('id') !== null;
            },
            fnLogout() {
                // 세션 스토리지에서 로그인 상태 제거
                sessionStorage.removeItem('id');
                this.isLogged = false;
                this.isAdmin = false;
                // 메인 페이지로 리디렉션
                setTimeout(() => {
                    location.href = 'main.html';
                }, 1000);  // 1초 후 리디렉션
            },
            fnAdmin() {
                // 'A' 권한이 있을 때만 관리자 링크 보이기
                this.isAdmin = sessionStorage.getItem("authority") === 'A';
            },
            fnUser(id){
                setTimeout(() => {
                    location.href = 'mypage.html';
                }, 1000);
            }
        }
        ,
        created() {
            this.fnLogged();
            this.fnAdmin();
        }
    };

    // Vue 앱을 생성
    const app = Vue.createApp(headerComponent);
    
    // 문서의 body에 직접 헤더를 삽입
    const headerElement = document.createElement('div');  // 'header' 요소를 'div'로 생성
    headerElement.id = 'header';
    document.body.prepend(headerElement); // 페이지의 시작 부분에 삽입
    
    // Vue 앱을 #header 요소에 마운트
    app.mount('#header');
});
