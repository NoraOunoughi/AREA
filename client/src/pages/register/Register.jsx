import "./register.css"
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from "@firebase/auth";
import { auth } from '../../components/firebase/firebase';
import { Link, useNavigate } from 'react-router-dom';
import db from "../../components/firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import Logo from '../../assets/potter/logo.png';
import { ArrowBack } from '@material-ui/icons';


export default function Register() {
    let navigate = useNavigate()
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log({ login }, { password });
        registerRequest();
    };

    const registerRequest = async () => {
        try {
            const user = await createUserWithEmailAndPassword(
                auth,
                login,
                password);
            alert("Successfully registered", user);
            const newUserRef = doc(db, "users", auth.currentUser.uid);
            await setDoc(newUserRef, {
                name: login,
                email: auth.currentUser.email,
            });
            logginPage();
        } catch (err) {
            alert(err.message);
        }
    };

    const logginPage = () => {
        navigate('/');
        window.location.reload();
    };

    // var email = auth.currentUser.email;

    return (
        <div className="register-Container">
            <div className="register-Contain">
                <span className="register-Title"> <img src={Logo} alt="logo" className="register-logo" />Register</span>
                <form onSubmit={handleSubmit}>
                    <center>
                        <div className="register">
                            <input type="email" className="register-search" placeholder="Login..." value={login} onChange={(e) => setLogin(e.target.value)} />
                        </div>
                        <div className="pswd">
                            <input type="password" id="pass" className="register-search" placeholder="Password..." value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <input type="submit" className="register-button" value="Register"></input>
                    </center>
                </form>
                <Link to="/" className="link">
                    <li className="register-loginLink">
                        <ArrowBack/> Login Account
                    </li>
                </Link>
            </div>
        </div>
    )
}