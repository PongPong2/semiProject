const axios = require("axios");
const cheerio = require("cheerio");
const pool = require("../config/dbPool");

exports.getChart = async (_, res) => {
    const url = "https://www.melon.com/chart/index.htm";
    const headers = {
        "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
    };

    try {
        const response = await axios.get(url, { headers });
        const $ = cheerio.load(response.data);
        const chartList = [];

        $("table > tbody > tr").each((i, element) => {
            const rank = $(element).find(".rank").text().trim();
            const songName = $(element).find(".ellipsis.rank01 a").text().trim();
            const artistName = $(element).find(".ellipsis.rank02 a").first().text().trim();
            const albumName = $(element).find(".ellipsis.rank03 a").text().trim();

            const relativeImageUrl = $(element).find(".image_typeAll img").attr("src");
            const albumImage = relativeImageUrl ? relativeImageUrl : null;

            if (songName && artistName) {
                chartList.push({
                    rank,
                    songName,
                    artistName,
                    albumName,
                    albumImage,
                });
            }
        });

        res.json(chartList);
    } catch (error) {
        console.error("차트 데이터를 가져오는 중 오류 발생:", error);
        res.status(500).json({ error: "Failed to fetch chart data" });
    }
};

exports.likedSong = async (req, res) => {
    // 좋아요 버튼을 통해 전달받는 값들
    const { song, userId } = req.body;
    const { songName, artistName, albumName, albumImage } = song;

    // console.log(userId); // 전달되는 값들 확인
    // console.log(songName);

    try {
        // member 테이블의 PK 조회 후 없으면 리턴
        const selectSQL = `SELECT id FROM members WHERE id = ?`;
        const [selectResult] = await pool.query(selectSQL, [userId]);
        if (selectResult.length == 0) {
            // 전달된 id가 DB에 없을 경우
            return res.json({
                result: "fail",
                message: "잘못된 요청입니다!",
            });
        }

        // 같은 곡을 좋아요 눌렸을 경우 리턴
        const selectSQL2 = `SELECT id FROM user_liked
                            WHERE user_id = ? AND artist_name = ? AND song_name = ?;`;
        const [selectResult2] = await pool.query(selectSQL2, [userId, artistName, songName]);
        if (selectResult2.length > 0) {
            return res.json({
                result: "fail",
                message: "이미 존재하는 곡입니다!",
            });
        }

        // 다 통과하면 저장
        const insertSQL = `INSERT into user_liked (user_id, album_image, album_name, artist_name, song_name)
                     VALUES (?, ?, ?, ?, ?) `;
        await pool.query(insertSQL, [userId, albumImage, albumName, artistName, songName]);

        res.json({ result: "success", message: "좋아요 성공!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ result: "fail", message: "좋아요 실패: " + error.message });
    }
};

exports.getLikedSongs = async (req, res) => {
    const { userId } = req.query;
    console.log("아이디는", userId);

    try {
        const selectSQL = `SELECT * FROM user_liked WHERE user_id = ?`;
        const [result] = await pool.query(selectSQL, [userId]);

        if (result.length == 0) {
            // 저장한 노래가 없으면
            return res.json({ result: "fail", message: "결과 없음" });
        }
        res.json({ data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ result: "fail", message: "불러오기 실패: " + error.message });
    }
};

exports.deleteSong = async (req, res) => {
    const { likedSongId, userId } = req.params;
    const numericLikedSongId = Number(likedSongId);
    const numericUserId = Number(userId);

    // 유효성 검사 수정
    if (isNaN(numericLikedSongId) || numericLikedSongId <= 0 || isNaN(numericUserId) || numericUserId <= 0) {
        return res
            .status(400)
            .json({ message: "유효하지 않은 입력 값입니다. 노래 ID와 사용자 ID는 1 이상이어야 합니다." });
    }

    try {
        const deleteSQL = `
            DELETE FROM user_liked
            WHERE id = ? AND user_id = ?
        `;

        const [result] = await pool.query(deleteSQL, [numericLikedSongId, numericUserId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "삭제할 노래를 찾을 수 없거나 이미 삭제되었습니다." });
        }

        res.status(200).json({ message: "노래가 성공적으로 삭제되었습니다." });
    } catch (error) {
        console.error("좋아요 삭제 중 오류 발생:", error);
        res.status(500).json({ message: "서버 오류로 인해 삭제에 실패했습니다." });
    }
};
