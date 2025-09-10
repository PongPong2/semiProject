import { Form, Row, Col, Button, Modal } from "react-bootstrap";
import { useState, useRef } from "react";
import { apiSignup } from "../api/userApi";

// 회원가입 담당 모달
export default function SignUpModal({ show, setShowSignUp }) {
    const [signupUser, setSignupUser] = useState({ name: "", email: "", passwd: "", repeatPasswd: "" });

    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const passwdRef = useRef(null);
    const repeatPasswdRef = useRef(null);

    const handleChange = async (e) => {
        // e.target => 지금 입력되고 있는 곳의 name에 입력된 value를 formData에 덮어쓰기
        // email에 입력하면 email을 set, passwd에 입력하면 passwd를 set
        setSignupUser({ ...signupUser, [e.target.name]: e.target.value });
    };

    // 유효성 체크
    const check = () => {
        const { name, email, passwd, repeatPasswd } = signupUser;
        if (!name.trim()) {
            alert("이메일을 입력하세요");
            nameRef.current?.focus();
            return false;
        }
        if (!email.trim()) {
            alert("이메일을 입력하세요");
            emailRef.current?.focus();
            return false;
        }
        if (!passwd.trim()) {
            alert("비밀번호를 입력하세요");
            passwdRef.current?.focus();
            return false;
        }
        if (!repeatPasswd.trim()) {
            alert("비밀번호를 한 번 더 입력하세요");
            repeatPasswdRef.current?.focus();
            return false;
        }
        if (passwd !== repeatPasswd) {
            alert("비밀번호가 서로 일치하지 않습니다");
            passwdRef.current?.focus();
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const b = check();
        if (!b) return;

        try {
            const response = await apiSignup(signupUser);

            if (response.status === 200) {
                alert("회원가입 성공!");
            }
            handleReset();
            setShowSignUp(false); // Correctly passing false to the setter function
        } catch (error) {
            alert("서버 오류: " + error.message);
            handleReset();
            setShowSignUp(false); // Correctly passing false to the setter function
        }
    };

    const handleReset = () => {
        setSignupUser({ name: "", email: "", passwd: "", repeatPasswd: "" });
    };

    return (
        // Correctly using the `onHide` prop to handle modal closure
        <Modal show={show} onHide={() => setShowSignUp(false)}>
            <Modal.Header closeButton>
                <Modal.Title style={{ color: "#3565af" }}>Sign Up</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="container py-4">
                    <Form method="post" onSubmit={handleSubmit}>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={2} style={{ color: "#3565af" }}>
                                Name
                            </Form.Label>
                            <Col sm={8}>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={signupUser.name}
                                    ref={nameRef}
                                    placeholder="Name"
                                    onChange={handleChange}
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={2} style={{ color: "#3565af" }}>
                                Email
                            </Form.Label>
                            <Col sm={8}>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={signupUser.email}
                                    ref={emailRef}
                                    placeholder="Email"
                                    onChange={handleChange}
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={2} style={{ color: "#3565af" }}>
                                PW
                            </Form.Label>
                            <Col sm={8}>
                                <Form.Control
                                    type="password"
                                    name="passwd"
                                    value={signupUser.passwd}
                                    ref={passwdRef}
                                    placeholder="Password"
                                    onChange={handleChange}
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={2} style={{ color: "#3565af" }}>
                                PW2
                            </Form.Label>
                            <Col sm={8}>
                                <Form.Control
                                    type="password"
                                    name="repeatPasswd"
                                    value={signupUser.repeatPasswd}
                                    ref={repeatPasswdRef}
                                    placeholder="Password"
                                    onChange={handleChange}
                                />
                            </Col>
                        </Form.Group>
                        <Row>
                            <Col className="d-flex justify-content-center gap-2">
                                <Button
                                    variant="light"
                                    type="submit"
                                    style={{ border: "2px solid #3565af", color: "#3565af" }}
                                >
                                    회원가입
                                </Button>
                                <Button
                                    variant="light"
                                    type="button"
                                    onClick={handleReset}
                                    style={{ border: "2px solid #3565af", color: "#3565af" }}
                                >
                                    다시쓰기
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </Modal.Body>
        </Modal>
    );
}
