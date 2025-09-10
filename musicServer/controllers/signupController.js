const bcrypt = require("bcrypt");
const pool = require("../config/dbPool");
const salt = 10; // 해시 강도, bcrypt 내부에서 2^10만큼 연산 반복해서 암호화 - 일반적으로 10~12

exports.registerUser = async (req, res) => {
    // 회원가입에는 이름, 이메일, 비밀번호, 비밀번호 확인을 입력해야 함
    const { name, email, passwd, repeatPasswd } = req.body;
    console.log("name: ", name, "email: ", email, "passwd: ", passwd, "repeatPasswd: ", repeatPasswd); // 잘 들어오는지 확인

    try {
        // 이메일 중복 확인 (무결성 확보)
        const selectSQL = `SELECT email FROM members WHERE email = ?`;
        const [selectResult] = await pool.query(selectSQL, [email]);
        if (selectResult.length > 0) {
            return res.json({
                result: "fail",
                message: "중복된 이메일입니다!",
            });
        }
        // 비밀번호 일치 확인
        if (passwd !== repeatPasswd) {
            return res.json({
                result: "fail",
                message: "비밀번호가 서로 일치하지 않습니다!",
            });
        }
        // 모두 통과하면 비밀번호 암호화 후 INSERT
        const hashPasswd = await bcrypt.hash(passwd, salt);
        const insertSQL = `INSERT into members (name, email, passwd) VALUES (?, ?, ?)`;
        const [result] = await pool.query(insertSQL, [name, email, hashPasswd]);

        res.json({ result: "success", message: `회원 가입 성공! 회원번호는 ${result.insertId}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ result: "fail", message: "회원 가입 실패: " + error.message });
    }
};
