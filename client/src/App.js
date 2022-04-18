import "./app.css"

import Topbar from "./components/topbar/Topbar";
import Sidebar from "./components/sidebar/Sidebar";
import Home from "./pages/home/Home";
import Github from "./pages/github/Github";
import Discord from "./pages/discord/Discord";
import Spotify from "./pages/spotify/Spotify";
import SpotifyCallback from "./pages/spotify/SpotifyCallback";
import Weather from "./pages/weather/Weather";
import Gmail from "./pages/gmail/Gmail";
import Youtube from "./pages/youtube/Youtube";
import Login from "./pages/login/Login"
import Register from "./pages/register/Register";
import GithubCallback from "./pages/github/GithubCallback";
import GithubArea from "./pages/github/GithubArea";
import DiscordArea from "./pages/discord/DiscordArea";
import DiscordCallback from "./pages/discord/DiscordCallback";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SpotifyArea from "./pages/spotify/SpotifyArea";
import YoutubeArea from "./pages/youtube/YoutubeArea";
import Download from "./pages/download/DownloadAPK";
import GmailArea from "./pages/gmail/GmailArea";
import GmailCallback from "./pages/gmail/GmailCallback";
import YoutubeCallback from "./pages/youtube/YoutubeCallback";

function App() {
    var logged = window.localStorage.getItem('logged')
    var yt = window.localStorage.getItem('yt')


    console.log(window.localStorage.getItem('logged'));

    return (
        <BrowserRouter> {
            !logged ?
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
                :
                <div>
                    <Topbar />
                    <div className="container">
                        <Sidebar />
                        <Routes>
                            <Route path="/home" element={<Home />} />
                            
                            <Route path="/spotify" element={<Spotify />} />
                            <Route path="/spotify/callback" element={<SpotifyCallback />} />
                            <Route path="/spotify/area" element={<SpotifyArea />} />
                            
                            <Route path="/github" element={<Github />} />
                            <Route path="/github/area" element={<GithubArea />} />
                            <Route path="/github/callback" element={<GithubCallback />} />
                           
                            <Route path="/gmail" element={<Gmail />} />

                            <Route path="/gmail/area" element={<GmailArea />} />

                            
                            <Route path="/discord" element={<Discord />} />
                            <Route path="/discord/area" element={<DiscordArea />} />
                            <Route path="/discord/callback" element={<DiscordCallback />} />
                            
                            <Route path="/client.apk" element={<Download />} />

                            <Route path="/weather" element={<Weather />} />
                            
                            <Route path="/youtube" element={<Youtube />} />                            
                            <Route path="/google/callback" element={!yt ? <GmailCallback/>
                                                                      : <YoutubeCallback/>} />
                            <Route path="/youtube/area" element={<YoutubeArea />} />

                        </Routes>
                    </div>
                </div>
        }
        </BrowserRouter>
    );
}

export default App;