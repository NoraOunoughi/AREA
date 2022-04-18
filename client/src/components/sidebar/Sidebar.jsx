import React from 'react'
import "./sidebar.css";
import { Home, MusicVideo, MailOutline, Chat, GitHub, MusicNote, WbSunny, ArrowRight, ArrowDropDown } from '@material-ui/icons';
import { Link } from 'react-router-dom';

export default function Sidebar() {
    const [isHomeActive, setiIsHomeActive] = React.useState(true);
    const [isSocialActive, setiIsSocialActive] = React.useState(true);
    const [isToolsActive, setiIsToolsActive] = React.useState(true);

    const handleIsHomeActive = () => {
        if (!isHomeActive) {
            setiIsHomeActive(true);
        }
        else if (isHomeActive) {
            setiIsHomeActive(false);
        }
    };

    const handleIsSocialActive = () => {
        if (!isSocialActive) {
            setiIsSocialActive(true);
        }
        else if (isSocialActive) {
            setiIsSocialActive(false);
        }
    };

    const handleIsToolsActive = () => {
        if (!isToolsActive) {
            setiIsToolsActive(true);
        }
        else if (isToolsActive) {
            setiIsToolsActive(false);
        }
    };

    return (
        <div className="sidebar">
            <div className="sidebarWrapper">
                <div className="sidebarMenu">
                    <h3 className="sidebarTitle" onClick={handleIsHomeActive}>
                        <div hidden={!isHomeActive}>Welcome <ArrowRight className="arrowRight"/></div>
                        <div hidden={isHomeActive}>Welcome <ArrowDropDown className="arrowDown"/></div>
                    </h3>
                    <ul className="sidebarList" hidden={isHomeActive}>
                        <Link to="/home" className="link">
                            <li className="sidebarListItemHome">
                                <Home className="sidebarIcon" />
                                Home
                            </li>
                        </Link>
                    </ul>
                </div>
                <div className="sidebarMenu">
                    <div className="sidebarShadow"></div>
                    <h3 className="sidebarTitle" onClick={handleIsSocialActive} >
                        <div hidden={!isSocialActive}>Social <ArrowRight className="arrowRight"/></div>
                        <div hidden={isSocialActive}>Social <ArrowDropDown className="arrowDown"/></div>
                    </h3>
                    <ul className="sidebarList" hidden={isSocialActive}>
                        <Link to="/discord" className="link">
                            <li className="sidebarListItemDiscord">
                                <Chat className="sidebarIcon" />
                                Discord
                            </li>
                        </Link>
                        <Link to="/youtube" className="link">
                            <li className="sidebarListItemYoutube">
                                <MusicVideo className="sidebarIcon" />
                                Youtube
                            </li>
                        </Link>
                        <Link to="/spotify" className="link">
                            <li className="sidebarListItemSpotify">
                                <MusicNote className="sidebarIcon" />
                                Spotify
                            </li>
                        </Link>
                    </ul>
                </div>
                <div className="sidebarMenu">
                <div className="sidebarShadow"></div>
                    <h3 className="sidebarTitle" onClick={handleIsToolsActive}>
                        <div hidden={!isToolsActive}>Tools <ArrowRight className="arrowRight"/></div>
                        <div hidden={isToolsActive}>Tools <ArrowDropDown className="arrowDown"/></div>
                    </h3>
                    <ul className="sidebarList" hidden={isToolsActive}>
                        <Link to="/gmail" className="link">
                            <li className="sidebarListItemGmail">
                                <MailOutline className="sidebarIcon" />
                                Gmail
                            </li>
                        </Link>
                        <Link to="/weather" className="link">
                            <li className="sidebarListItemWeather">
                                <WbSunny className="sidebarIcon" />
                                Weather
                            </li>
                        </Link>
                        <Link to="/github" className="link">
                            <li className="sidebarListItemGithub">
                                <GitHub className="sidebarIcon" />
                                Github
                            </li>
                        </Link>
                    </ul>
                </div>
            </div>
        </div>
    )
}