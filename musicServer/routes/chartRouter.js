const express = require("express");
const router = express.Router();
const chartController = require("../controllers/chartController");

router.delete("/delsong/:likedSongId/:userId", chartController.deleteSong);

router.get("/", chartController.getChart); // 실시간 차트 불러오기
router.post("/liked", chartController.likedSong); // 노래에 좋아요 눌렸을 때
router.get("/getsongs", chartController.getLikedSongs); // 좋아요 눌린 노래 가져오기

module.exports = router;
