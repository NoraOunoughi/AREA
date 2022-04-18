import "./github.scss";
import axios from "axios";
import { getDoc, doc } from "firebase/firestore";
import db from "../../components/firebase/firebase";
import React, { useState, useEffect } from "react";
import githubLogo from '../../assets/logo_github.png';

export default function Github() {

  const [userId] = useState(window.localStorage.getItem('uid'));

  console.log(userId);
  var [urlOauth] = useState("");

  useEffect(() => {
    const getGithubToken = async () => {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef)
      if (docSnap.exists) {
        const data = docSnap.data();
        console.log("Document data:", data);
        if (data.githubToken !== undefined) {
          console.log("Document githubToken:", data.githubToken);
          // Redirige to spotify area si connecté
          window.location.href = "/github/area"
        }
      }
    }
    // Don't need await here useEffect handle it
    getGithubToken()
  });

  const OauthGithub = async () => {
    try {
      const response = await axios.get("http://localhost:8080/github/oauth2/authorize")
      urlOauth = response.data.message;
      window.location.href = urlOauth;
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="github">
      <div className="github-container">
        <button className="myButton-github" onClick={() => OauthGithub()}>
          <img src={githubLogo} alt="logo" className="github-logo" /> Login Github
        </button>
      </div>
    </div>
  );
} 