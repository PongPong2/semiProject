const express = require("express");
const router = express.Router();
const signupController = require("../controllers/signupController");

router.post("/", signupController.registerUser); // 기본 경로로 요청이 들어오면 바로 registerUser

module.exports = router;
