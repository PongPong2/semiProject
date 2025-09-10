const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const pool = require("../config/dbPool");

const generateToken = (user, secretKey, expirein) => {
    return jwt.sign(user, secretKey, { expiresIn: expirein });
};

exports.login = async (req, res) => {
    const { email, passwd } = req.body;
    console.log("email: ", email, "passwd: ", passwd);
    console.log(JSON.stringify(email));

    try {
        const selectSQL = `SELECT id, name, email, passwd FROM members WHERE email = ?`;
        const [result] = await pool.query(selectSQL, [email]);

        if (result.length === 0) {
            return res.status(401).json({
                result: "fail",
                message: "아이디가 일치하지 않습니다",
            });
        }
        tmpUser = result[0];

        const isMatch = await bcrypt.compare(passwd, tmpUser.passwd);
        if (!isMatch) {
            return res.status(401).json({
                result: "fail",
                message: "비밀번호가 일치하지 않습니다",
            });
        }

        const { passwd: _, ...userPayload } = tmpUser;
        console.log("userPayload: ", userPayload);

        const accessToken = generateToken(userPayload, process.env.ACCESS_SECRET, "15m");
        const refreshToken = generateToken(userPayload, process.env.REFRESH_SECRET, "1h");
        console.log("accessToken: ", accessToken);
        console.log("refreshToken: ", refreshToken);

        const tokenSQL = `UPDATE members SET refreshToken = ? WHERE email = ?`;
        await pool.query(tokenSQL, [refreshToken, email]);

        res.json({
            result: "success",
            message: "로그인 성공!!",
            // 수정된 부분: refreshToken을 loginResultData 객체에 추가
            loginResultData: { accessToken, refreshToken, ...userPayload },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ result: "fail", message: "회원 인증 실패: " + error.message });
    }
};

exports.logout = async (req, res) => {
    const { email } = req.body;
    console.log("email: ", email);

    if (!email) {
        return res.status(400).json({ result: "fail", message: "유효하지 않은 요청입니다" });
    }

    try {
        const sql = `UPDATE members SET refreshToken = null WHERE email = ?`;
        const [result] = await pool.query(sql, [email]);

        if (result.affectedRows === 0) {
            return res.status(400).json({ result: "fail", message: "유효하지 않은 요청입니다" });
        }

        res.json({ result: "success", message: "로그아웃 완료" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ result: "fail", message: "로그아웃 실패: " + error.message });
    }
};
