const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// 토큰 갱신 API 엔드포인트
router.post("/token", (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ result: "fail", message: "토큰이 없습니다." });
    }

    try {
        const payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

        const accessToken = jwt.sign({ id: payload.id, email: payload.email }, process.env.ACCESS_SECRET, {
            expiresIn: "15m",
        });

        res.json({
            result: "success",
            data: { accessToken, ...payload },
        });
    } catch (error) {
        console.error("토큰 갱신 실패:", error.message);
        res.status(401).json({ result: "fail", message: "토큰이 유효하지 않습니다." });
    }
});

module.exports = router;
