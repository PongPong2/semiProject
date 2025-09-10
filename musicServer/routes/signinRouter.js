const express = require("express");
const router = express.Router();
const signinController = require("../controllers/signinController");

router.post("/login", signinController.login); // 로그인 요청
router.post("/logout", signinController.logout); // 로그아웃 요청

module.exports = router;
