const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const signinRouter = require("./routes/signinRouter");
const signupRouter = require("./routes/signupRouter");
const chartRouter = require("./routes/chartRouter");
const tokenRouter = require("./routes/tokenRouter"); // 추가: 토큰 갱신 라우터

require("dotenv").config();
const port = process.env.PORT || 5555;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors());
app.use("/api/auth", tokenRouter);

app.use("/api/auth", signinRouter);
app.use("/api/signup", signupRouter);
app.use("/api/melon-chart", chartRouter);
app.use("/api/auth", tokenRouter); // 추가: 토큰 갱신 요청을 처리

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});
