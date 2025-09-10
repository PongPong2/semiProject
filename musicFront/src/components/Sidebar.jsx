const Sidebar = () => {
    return (
        <>
            <a href="/" className="sidebar-logo">
                {" "}
                DCU Music{" "}
            </a>
            <ul className="sidebar-nav mt-4">
                <li>
                    <a href="https://www.melon.com/search/artist/index.htm?q=%EC%95%84%ED%8B%B0%EC%8A%A4%ED%8A%B8&section=&searchGnbYn=Y&kkoSpl=N&kkoDpType=">
                        아티스트
                    </a>
                </li>
                <li>
                    <a href="https://www.melon.com/search/song/index.htm?q=%EA%B5%AD%EB%82%B4&section=&searchGnbYn=Y&kkoSpl=Y&kkoDpType=&mwkLogType=T">
                        국내음악
                    </a>
                </li>
                <li>
                    <a href="https://www.billboard.com/charts/hot-100/">해외음악</a>
                </li>
                <li>
                    <a href="https://www.melon.com/genre/song_list.htm?classicMenuId=DP0100">장르음악</a>
                </li>
                <li>
                    <a href="https://www.youtube.com/">뮤직비디오</a>
                </li>
            </ul>
        </>
    );
};

export default Sidebar;
