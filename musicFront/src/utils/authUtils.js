import axios from "axios";

export const checkTokenExpiration = (token) => {
    try {
        //header.payload.signature
        const patload = JSON.parse(atob(token.split(".")[1]));
        const expTime = patload.exp * 1000; //exp: 유효시간 초단위

        return expTime < Date.now();
        //1시까지 <  2시 => 유효시간이 지난 경우 : True
        //3시까지 >  2시 => 유효시간이 남은 경우 : False
    } catch (error) {
        console.error("잘못된 토큰 포맷 에러: ", error);
        return true;
    }
};

// refreshToken으로 서버에 요청 보내기
export const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
        console.log("refreshToken 없음");
        return null;
    }
    // refreshToken을 보내 서버에서 검증받은 후 새 억세스토큰을 받자
    try {
        const response = await axios.post(`http://localhost:7777/api/auth/refresh`, { refreshToken });
        const newAccessToken = await response.data?.accessToken;
        return newAccessToken;
    } catch (error) {
        console.error("refreshToken error: ", error);
        return null;
    }
};
