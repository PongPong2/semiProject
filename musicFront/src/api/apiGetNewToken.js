import axios from "axios";

// 새로운 accessToken을 요청하는 API 함수
export const apiGetNewToken = async (data) => {
    try {
        const response = await axios.post("http://localhost:5555/api/auth/token", data);
        return response;
    } catch (error) {
        console.error("토큰 갱신 실패:", error);
        throw error;
    }
};
