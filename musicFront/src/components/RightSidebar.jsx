import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useAuthStore } from "../stores/authStore";
import { getLikedSongs, deleteLikedSong } from "../api/userApi";
import { useSongsListStore } from "../stores/likedSongsList";

const RightSidebar = ({ onSongSelect }) => {
    const [randomSongs, setRandomSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const authUser = useAuthStore((s) => s.authUser);
    const [likedSongs, setLikedSongs] = useState(null);
    const lastUpdated = useSongsListStore((s) => s.lastUpdated);
    const notifyUpdate = useSongsListStore((s) => s.notifyUpdate);

    // 차트 데이터 불러오기
    useEffect(() => {
        fetchChartData();
    }, []);

    // 좋아요 목록 불러오기
    useEffect(() => {
        if (authUser) {
            loadLikedSongs();
        }
    }, [authUser, lastUpdated]);

    const loadLikedSongs = async () => {
        try {
            const response = await getLikedSongs(authUser.id);
            setLikedSongs(response.data.data);
        } catch (error) {
            if (error.response) {
                const { message } = error.response.data;
                alert(message);
            } else {
                alert("Server Error: " + error.message);
            }
        }
    };

    // 좋아요 삭제
    const handleRemoveSong = async (likedSongId, userId) => {
        try {
            await deleteLikedSong(likedSongId, userId);
            notifyUpdate();
        } catch (error) {
            if (error.response) {
                const { message } = error.response.data;
                alert(message);
            } else {
                alert("Server Error: " + error.message);
            }
        }
    };

    // 차트 불러오기
    const fetchChartData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("http://localhost:5555/api/melon-chart");
            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }
            const data = await response.json();
            selectRandomSongs(data);
        } catch (e) {
            console.error("Failed to fetch chart data:", e);
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    // 랜덤 노래 6개 선택
    const selectRandomSongs = (dataArray) => {
        if (dataArray.length === 0) {
            setRandomSongs([]);
            return;
        }
        const shuffled = [...dataArray].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 6);
        setRandomSongs(selected);
    };

    if (error) {
        return <div>오류가 발생했습니다: {error}</div>;
    }

    const handleAlbumImageClick = (song) => {
        if (typeof onSongSelect === "function") {
            onSongSelect(song);
        }

        const searchQuery = `${song.songName}`;

        if (searchQuery) {
            window.location.href = `https://www.youtube.com/results?search_query=${searchQuery}`;
        }
    };

    return (
        <div className="collapse d-md-block" id="recommendCollapse" style={{ marginTop: "3em" }}>
            <div className="recommend-section mb-5">
                <div className="section-header">
                    <h5>Like Music</h5>
                </div>

                {!authUser && (
                    <div style={{ color: "#3565af", maxHeight: "220px", overflowY: "auto", padding: "1em" }}>
                        <p>Please Login</p>
                    </div>
                )}

                {authUser && (!likedSongs || likedSongs.length === 0) && (
                    <div style={{ color: "#3565af", maxHeight: "220px", overflowY: "auto", padding: "1em" }}>
                        <p>Please Like</p>
                    </div>
                )}

                {authUser && likedSongs && likedSongs.length > 0 && (
                    <div
                        id="div-music"
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gap: "1em",
                            color: "#3565af",
                            maxHeight: "220px",
                            overflowY: "auto",
                            padding: "0.5em",
                        }}
                    >
                        {likedSongs.map((song) => (
                            <div
                                className="music-card"
                                key={song.id}
                                style={{
                                    position: "relative",
                                    color: "#3565af",
                                    fontWeight: "bold",
                                    fontSize: "0.9em",
                                }}
                            >
                                {/* 삭제 버튼 */}
                                <button
                                    onClick={() => handleRemoveSong(song.id, authUser.id)}
                                    style={{
                                        position: "absolute",
                                        top: "5px",
                                        right: "5px",
                                        border: "none",
                                        background: "transparent",
                                        color: "#ff4d4f",
                                        fontWeight: "bold",
                                        fontSize: "1em",
                                        cursor: "pointer",
                                    }}
                                >
                                    ×
                                </button>

                                <img
                                    src={song.album_image}
                                    className="circular"
                                    alt={`${song.song_name} 앨범 커버`}
                                    style={{ marginTop: "1em", width: "70%", height: "60%" }}
                                />

                                <div
                                    className="card-title"
                                    style={{ color: "#3565af", fontWeight: "bold", fontSize: "0.9em" }}
                                >
                                    {song.song_name}
                                </div>
                                <div
                                    className="card-artist"
                                    style={{ color: "#3565af", fontWeight: "bold", fontSize: "0.9em" }}
                                >
                                    {song.artist_name}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <hr style={{ border: "2px solid #3565af" }} />

                <div className="section-header">
                    <h5>Random Songs</h5>
                    <Button
                        onClick={fetchChartData}
                        style={{ backgroundColor: "#3565af", width: "110px", height: "35px", fontSize: "0.8em" }}
                    >
                        Refresh
                    </Button>
                </div>

                <div
                    id="div-music"
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        color: "#3565af",
                    }}
                >
                    {randomSongs.map((song, index) => (
                        <div
                            className="music-card"
                            key={index}
                            style={{
                                color: "#3565af",
                                fontWeight: "bold",
                                fontSize: "0.9em",
                            }}
                        >
                            <img
                                onClick={() => handleAlbumImageClick(song)}
                                src={song.albumImage}
                                className="circular"
                                alt={`${song.songName} 앨범 커버`}
                                style={{ marginTop: "1em", width: "70%", height: "60%" }}
                            />
                            <div
                                className="card-title"
                                style={{ color: "#3565af", fontWeight: "bold", fontSize: "0.9em" }}
                            >
                                {song.songName}
                            </div>
                            <div
                                className="card-artist"
                                style={{ color: "#3565af", fontWeight: "bold", fontSize: "0.9em" }}
                            >
                                {song.artistName}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RightSidebar;
