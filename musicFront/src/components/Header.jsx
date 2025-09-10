import { Navbar, Nav, Container, Form } from "react-bootstrap";
import { List, Search } from "react-bootstrap-icons";
import { useAuthStore } from "../stores/authStore";
import { apiLogout } from "../api/userApi";

// setShowLogin prop을 추가
const Header = ({ onShowSidebar, setShowLogin, setShowSignUp, currentSong }) => {
    const authUser = useAuthStore((s) => s.authUser); // loginAuthUser를 통해 저장된 값을 가져오기 위해
    const logout = useAuthStore((s) => s.logout);

    // 로그인 버튼 클릭 시 모달을 보이도록 상태 변경
    const handleLoginClick = () => {
        if (setShowLogin) {
            setShowLogin(true);
        }
    };

    // 회원가입
    const handleSignUp = () => {
        if (setShowSignUp) {
            setShowSignUp(true);
        }
    };

    // 로그아웃
    const handleLogout = async () => {
        if (!authUser) return; // 이미 정보가 없으면 리턴
        try {
            const response = await apiLogout({ email: authUser.email }); // 로그아웃 요청 보내기
            if (response.status === 200) {
                logout(); // 스토어에 값 비우기
                alert("로그아웃 성공");
                sessionStorage.removeItem("accessToken"); // 세션에 저장된 토큰 삭제
                localStorage.removeItem("refreshToken");
            }
        } catch (error) {
            if (error.response) {
                const { message } = error.response.data;
                alert(message);
            } else {
                if (error.response) {
                    const { message } = error.response.data;
                    alert(message);
                } else {
                    alert("Server Error: " + error.message);
                }
            }
        }
    };

    const handleSearch = (event) => {
        event.preventDefault();

        const query = event.target.querySelector('input[type="search"]').value;

        if (query) {
            const searchUrl = `https://www.youtube.com/results?search_query=${query}`;
            window.location.href = searchUrl;
        }
    };

    return (
        <Navbar expand="lg" className="main-header p-3" sticky="top">
            <Container fluid>
                <button
                    onClick={onShowSidebar}
                    className="btn btn-icon d-md-none me-2"
                    aria-controls="sidebarOffcanvas"
                >
                    <List size={24} />
                </button>

                <Form className="search-bar d-flex flex-grow-1 me-3" onSubmit={handleSearch}>
                    <Search className="search-icon" />
                    <Form.Control
                        type="search"
                        placeholder="검색"
                        className="me-2 form-control-sm"
                        aria-label="Search"
                    />
                </Form>

                <Navbar.Toggle aria-controls="headerNav" className="ms-auto" />

                <Navbar.Collapse id="headerNav">
                    <Nav className="ms-auto align-items-center">
                        {!authUser && (
                            <>
                                {/* 로그인 버튼에 onClick 핸들러 추가 */}
                                <button
                                    onClick={handleLoginClick}
                                    className="nav-link"
                                    style={{ color: "#3565af", fontWeight: "bold" }}
                                >
                                    로그인
                                </button>
                                {/* 회원가입 버튼도 로그인 모달을 띄우도록 동일한 핸들러 사용 */}
                                <button
                                    onClick={handleSignUp}
                                    className="nav-link"
                                    style={{ color: "#3565af", fontWeight: "bold" }}
                                >
                                    회원가입
                                </button>
                            </>
                        )}
                        {authUser && (
                            <>
                                <button
                                    disabled={true}
                                    className="nav-link"
                                    style={{ color: "#3565af", fontWeight: "bold" }}
                                >
                                    {authUser.name} 님 환영합니다.
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="nav-link"
                                    style={{ color: "#3565af", fontWeight: "bold" }}
                                >
                                    로그아웃
                                </button>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;
