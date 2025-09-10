import { useState, useEffect } from "react";
import { Table, Container, Button } from "react-bootstrap";
import { useAuthStore } from "../stores/authStore";
import { userLikedSong } from "../api/userApi";
import { useSongsListStore } from "../stores/likedSongsList";

const MainContent = ({ onSongSelect }) => {
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Use a Map to track the liked status of each song by its rank
    const [likedSongs, setLikedSongs] = useState(new Map());
    const authUser = useAuthStore((s) => s.authUser);
    const notifyUpdate = useSongsListStore((s) => s.notifyUpdate);

    const fetchChartData = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("http://localhost:5555/api/melon-chart");
            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }
            const data = await response.json();
            setChartData(data);
        } catch (e) {
            setError(e.message);
            // Moved console.error here to be closer to the source of the error
            console.error("Failed to fetch chart data:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChartData();
    }, []);

    const handleLikeClick = async (song) => {
        // Removed unnecessary object destructuring
        if (!authUser) {
            alert("로그인이 필요한 서비스입니다!");
            return;
        }

        const newLikedSongs = new Map(likedSongs);
        const isCurrentlyLiked = newLikedSongs.get(song.rank) || false;

        // Immediate UI update for better user experience
        newLikedSongs.set(song.rank, !isCurrentlyLiked);
        setLikedSongs(newLikedSongs);

        try {
            const response = await userLikedSong(song, authUser.id);
            if (response.status === 200) {
                notifyUpdate(); // Notify store of update on success
            }
        } catch (error) {
            if (error.response) {
                const { message } = error.response.data;
                alert(message);
            } else {
                alert("Server Error: " + error.message);
            }
            // Revert the UI state on error to maintain data consistency
            setLikedSongs(new Map(likedSongs));
        }
    };

    if (loading) {
        return <div className="text-center my-5">차트 데이터를 로딩 중입니다...</div>;
    }

    if (error) {
        return <div className="text-center my-5 text-danger">오류: {error}</div>;
    }

    const handleAlbumImageClick = (song) => {
        onSongSelect(song);
    };

    return (
        <div style={{ paddingBottom: "100px" }}>
            <div>
                <Container className="my-5">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2 className="mb-0" style={{ color: "#3565af", fontSize: "1.5em" }}>
                            TOP 100
                        </h2>
                        <Button
                            onClick={fetchChartData}
                            style={{ backgroundColor: "#3565af", width: "110px", height: "35px", fontSize: "0.8em" }}
                        >
                            Refresh Chart
                        </Button>
                    </div>
                    {chartData.length > 0 ? (
                        <div className="border rounded shadow-sm" style={{ maxHeight: "590px", overflowY: "auto" }}>
                            <Table bordered hover responsive className="mb-0">
                                <thead className="chart-Thead">
                                    <tr>
                                        <th>TOP</th>
                                        <th style={{ width: "80px" }}>앨범사진</th>
                                        <th>곡명</th>
                                        <th>아티스트</th>
                                        <th>Like</th>
                                    </tr>
                                </thead>
                                <tbody style={{ textAlign: "center", alignItems: "center" }}>
                                    {chartData.map((song) => (
                                        <tr key={song.rank} className="chart-all">
                                            <td
                                                onClick={() => handleAlbumImageClick(song)}
                                                style={{ cursor: "pointer" }}
                                            >
                                                {song.rank}
                                            </td>
                                            <td>
                                                <img
                                                    onClick={() => handleAlbumImageClick(song)}
                                                    src={song.albumImage}
                                                    alt={song.albumName}
                                                    style={{ width: "70px", height: "70px", cursor: "pointer" }}
                                                />
                                            </td>
                                            <td
                                                onClick={() => handleAlbumImageClick(song)}
                                                style={{ cursor: "pointer" }}
                                            >
                                                {song.songName}
                                            </td>
                                            <td
                                                onClick={() => handleAlbumImageClick(song)}
                                                style={{ cursor: "pointer" }}
                                            >
                                                {song.artistName}
                                            </td>
                                            <td>
                                                <button
                                                    id={song.rank}
                                                    type="button"
                                                    style={{
                                                        backgroundColor: "white",
                                                        all: "unset",
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={() => handleLikeClick(song)} // Direct song object passed
                                                >
                                                    {likedSongs.get(song.rank) ? "💙" : "♡"}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    ) : (
                        <div className="text-center">차트 데이터가 없습니다.</div>
                    )}
                </Container>
            </div>
        </div>
    );
};

export default MainContent;
