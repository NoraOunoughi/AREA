import React, { useState } from 'react';
import "./login.css"
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../components/firebase/firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "@firebase/auth";
import { LockOpen } from '@material-ui/icons';
import db from "../../components/firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Logo from '../../assets/potter/logo.png';

export default function Login() {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log({ login }, { password });
        loginRequest();
    }

    const loginRequest = async () => {
        try {
            const userInfo = await signInWithEmailAndPassword(
                auth,
                login,
                password);
            alert("Successfully Logged", userInfo);
            loggedState();
        } catch (err) {
            alert(err.message);
        }
    }


    let navigate = useNavigate()

    const loggedState = () => {
            window.localStorage.setItem('logged', 'true');
            window.localStorage.setItem('email', auth.currentUser.email)
            window.localStorage.setItem('uid', auth.currentUser.uid)
            if (auth.currentUser.displayName !== null)
                window.localStorage.setItem('name', auth.currentUser.displayName)
            else if (auth.currentUser.displayName === null)
                window.localStorage.setItem('name', auth.currentUser.email)
            navigate('/home');
            window.location.reload();
    };

    const provider = new GoogleAuthProvider()

    const addGoogleUserToBdd = async () => {
        let uid = auth.currentUser.uid;
        const GoogleUserRef = doc(db, "users", uid);
        const GoogleUserData = await getDoc(GoogleUserRef);
        if (GoogleUserData.data() != null) {
            alert("Successfully Logged");
        } else {
            await setDoc(GoogleUserRef, {
                name: auth.currentUser.displayName,
                email: auth.currentUser.email,
            });
        }
    };

    const signInWithGoogle = () => {
        signInWithPopup(auth, provider)
        .then(async (result) => {
            await addGoogleUserToBdd();
            loggedState();
        }).catch((error) => {
            alert(error.message);
        })
    };

    return (
        <div className="login-Container">
            <div className="login-Contain">
            <span className="login-Title"> <img src={Logo} alt="logo" className="login-logo" />Login</span>
                <form onSubmit={handleSubmit}>
                    <center>
                        <div className="login-login">
                            <input type="text" className="login-search" placeholder="Login..." value={login} onChange={(e) => setLogin(e.target.value)}/>
                        </div>
                        <div className="login-password">
                            <input type="password" id="pass" className="password-search" placeholder="Password..." value={password} onChange={(e) => setPassword(e.target.value)}/>
                        </div>
                        <input type="submit" className="login-button" value="Sign in" ></input>
                    </center>
                </form>
                <div className="login-google" onClick={signInWithGoogle}>
                    <LockOpen/> Login with Google
                </div>
                <Link to="/register" className="link">
                    <li className="login-registerLink">
                        Register Account
                    </li>
                </Link>
            </div>
        </div>
    )
}