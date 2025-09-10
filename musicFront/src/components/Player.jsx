import {
    Shuffle,
    SkipStartFill,
    PlayCircleFill,
    PauseCircleFill,
    SkipEndFill,
    ArrowRepeat,
    VolumeUp,
    MusicNoteList,
} from "react-bootstrap-icons";

const Player = ({ currentSong }) => {
    const isPlaying = false;

    const handleClick = () => {
        const searchQuery = `${currentSong.songName}`;

        if (searchQuery) {
            window.location.href = `https://www.youtube.com/results?search_query=${searchQuery}`;
        }
    };

    const img =
        "https://search.pstatic.net/sunny/?src=https%3A%2F%2Fus.123rf.com%2F450wm%2Fsn333g%2Fsn333g1805%2Fsn333g180500161%2F101064379-blue-headphones-with-sound-wave-icon-vector-music-concept-sign-on-white-background.jpg&type=sc960_832";
    return (
        <>
            <footer id="player" className="fixed-bottom d-flex align-items-center px-4 py-2">
                <div id="mobile-progress-bar">
                    <div id="mobile-progress"></div>
                </div>
                <div className="player-song-info d-flex align-items-center">
                    <img
                        src={currentSong ? currentSong.albumImage : img}
                        className="rounded-circle me-3"
                        alt="Album Art"
                        id="song-img"
                    />
                    <div style={{ color: "#3565af" }}>
                        <div id="song-artistName" className="fw-bold">
                            {currentSong ? currentSong.songName : "Song Name"}
                        </div>
                        <div id="song-name" style={{ color: "#3565af" }}>
                            {currentSong ? currentSong.artistName : "Artist Name"}
                        </div>
                    </div>
                </div>

                <div className="player-controls d-flex flex-column align-items-center flex-grow-1 mx-5">
                    <div className="control-buttons d-flex align-items-center mb-1">
                        {/* <i> 태그를 컴포넌트로 교체 */}
                        <button className="btn-icon mx-2">
                            <Shuffle />
                        </button>
                        <button className="btn-icon mx-2">
                            <SkipStartFill />
                        </button>
                        <button
                            className="btn-icon btn-play-main mx-2"
                            onClick={() => handleClick(currentSong.songName)}
                        >
                            {/* isPlaying 상태에 따라 아이콘이 바뀌도록 설정 */}
                            {isPlaying ? <PauseCircleFill size={36} /> : <PlayCircleFill size={36} />}
                        </button>
                        <button className="btn-icon mx-2">
                            <SkipEndFill />
                        </button>
                        <button className="btn-icon mx-2">
                            <ArrowRepeat />
                        </button>
                    </div>
                </div>

                <div id="side-music" className="player-volume d-flex align-items-center">
                    <button className="btn-icon" style={{ color: "#3565af" }}>
                        <VolumeUp />
                    </button>
                    <input type="range" className="form-range volume-slider mx-2" style={{ width: "100px" }} />
                    <button className="btn-icon" style={{ color: "#3565af" }}>
                        <MusicNoteList />
                    </button>
                </div>
            </footer>
        </>
    );
};

export default Player;
