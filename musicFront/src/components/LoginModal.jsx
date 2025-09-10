import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import { useState, useRef, useEffect } from "react";
import { apiLogin } from "../api/userApi";
import { useAuthStore } from "../stores/authStore";

export default function LoginModal({ show, setShowLogin }) {
    const [loginUser, setLoginUser] = useState({ email: "", passwd: "" });
    const loginAuthUser = useAuthStore((s) => s.loginAuthUser);

    const emailRef = useRef(null);
    const passwdRef = useRef(null);

    useEffect(() => {
        if (show) emailRef.current?.focus();
    }, [show]);

    const handleChange = (e) => {
        setLoginUser({ ...loginUser, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { email, passwd } = loginUser;
        if (!email.trim()) {
            console.log("아이디를 입력하세요");
            emailRef.current?.focus();
            return;
        }
        if (!passwd.trim()) {
            console.log("비밀번호를 입력하세요");
            passwdRef.current?.focus();
            return;
        }

        requestLogin();
    };

    const requestLogin = async () => {
        try {
            const response = await apiLogin(loginUser);

            const { result, message, loginResultData } = response.data;
            console.log("서버에서 받은 응답 데이터:", loginResultData);

            if (result === "success") {
                const { accessToken, refreshToken, ...userPayload } = loginResultData;

                // localStorage에 토큰 저장
                if (refreshToken) {
                    // refreshToken이 유효할 때만 저장
                    localStorage.setItem("refreshToken", refreshToken);
                } else {
                    console.error("서버에서 refreshToken을 받지 못했습니다.");
                }
                sessionStorage.setItem("accessToken", accessToken);

                loginAuthUser({ ...userPayload, accessToken });
                console.log("로그인 성공!");
                setShowLogin(false);
            } else {
                console.log(message);
            }
            resetForm();
        } catch (error) {
            console.error(error);
            const errorMessage = error.response?.data?.message || error.message;
            console.log(errorMessage);
            resetForm();
        }
    };

    const resetForm = () => {
        setLoginUser({ email: "", passwd: "" });
        emailRef.current?.focus();
    };

    return (
        <>
            <Modal show={show} onHide={() => setShowLogin(false)}>
                <Modal.Header closeButton>
                    <Modal.Title style={{ color: "#3565af" }}>Login</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col className="p-4 mx-auto" xs={10} sm={10} md={8}>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label style={{ color: "#3565af" }}>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        ref={emailRef}
                                        onChange={handleChange}
                                        value={loginUser.email}
                                        placeholder="Email"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label style={{ color: "#3565af" }}>PW</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="passwd"
                                        ref={passwdRef}
                                        onChange={handleChange}
                                        value={loginUser.passwd}
                                        placeholder="Password"
                                    />
                                </Form.Group>
                                <div className="d-grid">
                                    <Button
                                        type="submit"
                                        variant="light"
                                        style={{ border: "2px solid #3565af", color: "#3565af" }}
                                    >
                                        Login
                                    </Button>
                                </div>
                            </Form>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        </>
    );
}
