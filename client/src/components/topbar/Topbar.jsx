import React from 'react'
import "./topbar.css"
import { NotificationsActive, Language, Settings, Warning, ArrowDownward, Android } from '@material-ui/icons';
import { useNavigate } from "react-router-dom"
import { auth } from '../../components/firebase/firebase';
import { signOut } from "@firebase/auth";
import Logo from '../../assets/potter/logo.png';
import Icon from '../../assets/icon.png';
import Ravenclaw_Icon from '../../assets/potter/house_logo/ravenclaw.png';
import Gryffindor_Icon from '../../assets/potter/house_logo/gryffindor.png';
import Hufflepuff_Icon from '../../assets/potter/house_logo/hufflepuff.png';
import Slytherin_Icon from '../../assets/potter/house_logo/slytherin.png';
import db from "../../components/firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { Home } from '@material-ui/icons';

export default function Topbar() {
    const [isShow, setIsShow] = React.useState(true);
    const [isShowDl, setIsShowDl] = React.useState(true);
    const [isPict, setIsPict] = React.useState(true);
    const [isHouse, setIsHouse] = React.useState(true);
    const user_name = localStorage.getItem('name');
    let navigate = useNavigate()

    const Hufflepuff = "hufflepuff";
    const Ravenclaw = "ravenclaw";
    const Slytherin = "slytherin";
    const Gryffindor = "gryffindor";

    const handleDropdown = () => {
        if (!isShow) {
            setIsShow(true);
        }
        else if (isShow) {
            setIsShow(false);
            setIsPict(true);
            setIsHouse(true);
        }
    };

    const handleDropdown2 = () => {
        if (!isShowDl) {
            setIsShowDl(true);
        }
        else if (isShowDl) {
            setIsShowDl(false);
        }
    };

    const handlePicture = () => {
        if (!isPict) {
            setIsPict(true);
        }
        else if (isPict) {
            setIsPict(false);
            setIsShow(true);
            setIsHouse(true);
        }
    };

    const chooseHouse = () => {
        if (!isHouse) {
            setIsHouse(true);
        }
        else if (isHouse) {
            setIsHouse(false);
            setIsPict(true);
            setIsShow(true);
        }
    }

    const chooseGryffindor = () => {
        let uid = auth.currentUser.uid;
        const house = doc(db, "users", uid);
        updateDoc(house, {
            house: Gryffindor,
        });
        setIsHouse(true);
    }

    const chooseSlytherin = () => {
        let uid = auth.currentUser.uid;
        const house = doc(db, "users", uid);
        updateDoc(house, {
            house: Slytherin,
        });
        setIsHouse(true);
    }

    const chooseHufflepuff = () => {
        let uid = auth.currentUser.uid;
        const house = doc(db, "users", uid);
        updateDoc(house, {
            house: Hufflepuff,
        });
        setIsHouse(true);
    }

    const chooseRavenclaw = () => {
        let uid = auth.currentUser.uid;
        const house = doc(db, "users", uid);
        updateDoc(house, {
            house: Ravenclaw,
        });
        setIsHouse(true);
    }

    const Logout = async () => {
        window.localStorage.removeItem('logged');
        window.localStorage.removeItem('email');
        window.localStorage.removeItem('uid');
        window.localStorage.removeItem('name');
        window.localStorage.removeItem('house');
        await signOut(auth);
        alert('logged out');
        navigate('/');
        window.location.reload();
    };
    

    const DownloadFct = async () => {
        window.location.href = "/client.apk"
    };


    return (
        <div className="topbar">
            <div className="topbar-Wrapper">
                <div className="topbar-Left">
                <span className="topbar-Logo"> <img src={Logo} alt="topbar-Logo" className="topbar-Avatar" /> <span className="topbar-Title"> Area Potter</span></span>
                </div>
                <div className="topbar-Right">
                    <div className="topbar-Icons">
                        <NotificationsActive />
                    </div>
                    <div className="topbar-Icons">
                        <Language />
                    </div>
                    <div className="topbar-Icons">
                        <button type="button" className="topbar-dropDownbutton" onClick={handleDropdown2}>
                            <ArrowDownward/>
                        </button>
                        <div className="topbar-dropdown" hidden={isShowDl}>
                            <button className="topbar-dropButton" onClick={DownloadFct}>
                            <Android/> Download APK
                            </button>
                        </div>
                    </div>
                    <div className="topbar-Icons">
                        <button type="button" className="topbar-dropDownbutton" onClick={handleDropdown}>
                            <Settings/>
                        </button>
                        <div className="topbar-dropdown" hidden={isShow}>
                            <button className="topbar-dropButton" onClick={chooseHouse}>
                                <Home/> House
                            </button>
                            <button className="topbar-dropButton" onClick={Logout}>
                            <Warning/> Logout
                            </button>
                        </div>
                        <div className="topbar-houseDiv" hidden={isHouse}>
                            House
                            <div className="topbar-houseWrapper">
                                <button className="topbar-houseButton" onClick={chooseGryffindor}><img src={Gryffindor_Icon} className="topbar-housePicture" alt="profile" /></button>
                                <button className="topbar-houseButton" onClick={chooseSlytherin}><img src={Slytherin_Icon} className="topbar-housePicture" alt="profile" /></button>
                                <button className="topbar-houseButton" onClick={chooseHufflepuff}><img src={Hufflepuff_Icon} className="topbar-housePicture" alt="profile" /></button>
                                <button className="topbar-houseButton" onClick={chooseRavenclaw}><img src={Ravenclaw_Icon} className="topbar-housePicture" alt="profile" /></button>
                            </div>
                        </div>
                    </div>
                    <div className="topbar-Icons">
                        <button className="topbar-IconsButton" onClick={handlePicture}><img src={Icon} className="topbar-Picture" alt="profile" /></button>
                        <div className="topbar-iconsdown" hidden={isPict}>
                            <div className="topbar-iconsDiv">
                                Hello, {user_name}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}