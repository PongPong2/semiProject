import { useState, useEffect } from "react";
import { Offcanvas } from "react-bootstrap";
import { useAuthStore } from "./stores/authStore";
import { apiGetNewToken } from "./api/apiGetNewToken";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import MainContent from "./components/MainContent";
import RightSidebar from "./components/RightSidebar";
import Player from "./components/Player";
import LoginModal from "./components/LoginModal";
import SignUpModal from "./components/SignUpModal";

function App() {
    const [showSidebar, setShowSidebar] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showSignUp, setShowSignUp] = useState(false);
    const [playerSong, setPlayerSong] = useState(null);

    const loginAuthUser = useAuthStore((s) => s.loginAuthUser);

    const loginAuthFromToken = async (refreshToken) => {
        try {
            const response = await apiGetNewToken({ refreshToken });
            const { result, data } = response.data;
            if (result === "success") {
                const { accessToken, ...userPayload } = data;
                sessionStorage.setItem("accessToken", accessToken);
                loginAuthUser({ ...userPayload, accessToken });
            } else {
                localStorage.removeItem("refreshToken");
                sessionStorage.removeItem("accessToken");
            }
        } catch (error) {
            console.error("Failed to refresh token:", error);
            localStorage.removeItem("refreshToken");
            sessionStorage.removeItem("accessToken");
        }
    };

    // This useEffect hook is the only one responsible for restoring login state.
    // It runs once when the component mounts.
    useEffect(() => {
        const refreshToken = localStorage.getItem("refreshToken");

        if (refreshToken && refreshToken !== "undefined") {
            loginAuthFromToken(refreshToken);
        }
    }, []); // Empty dependency array ensures this effect runs only once.

    const handleSidebarClose = () => setShowSidebar(false);
    const handleSidebarShow = () => setShowSidebar(true);

    const handleSongSelect = (onSongSelect) => {
        setPlayerSong(onSongSelect);
    };

    return (
        <>
            <Header onShowSidebar={handleSidebarShow} setShowLogin={setShowLogin} setShowSignUp={setShowSignUp} />

            <div className="container-fluid">
                <div className="row">
                    <nav id="sidebar" className="col-md-2 d-none d-md-block p-4">
                        <Sidebar />
                    </nav>

                    <Offcanvas show={showSidebar} onHide={handleSidebarClose} placement="start">
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title
                                style={{
                                    color: "#3565af",
                                    fontWeight: "bold",
                                    fontSize: "2.5em",
                                }}
                            >
                                메뉴
                            </Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <Sidebar />
                        </Offcanvas.Body>
                    </Offcanvas>

                    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                        <div className="row">
                            <div className="col-lg-8">
                                <MainContent onSongSelect={handleSongSelect} />
                            </div>
                            <LoginModal show={showLogin} setShowLogin={setShowLogin} />
                            <SignUpModal show={showSignUp} setShowSignUp={setShowSignUp} />
                            <div className="col-lg-4">
                                <RightSidebar currentSong={playerSong} />
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            <Player currentSong={playerSong} />
            <ToastContainer />
        </>
    );
}

export default App;
