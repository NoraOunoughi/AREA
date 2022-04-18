import "./youtube.scss";
import axios from "axios";
// import { auth } from '../../components/firebase/firebase';
import { getDoc, doc } from "firebase/firestore";
import db from "../../components/firebase/firebase";
import React, { useState, useEffect } from "react";
import youtubeLogo from '../../assets/youtube.png';

export default function Youtube() {
  const [userId] = useState(window.localStorage.getItem('uid'));
  // Si const [urlOauth, setUrlOauth] = useState("");
  // setUrlOauth refresh la page et on perde l'authorize url
  // sans setter pas de refresh et utiliser urlOaurh = "http://localhost......."
  var [urlOauth] = useState("");
  
  // Équivalent à componentDidMount plus componentDidUpdate :
  useEffect(() => {
    const getyoutubeToken = async () => {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef)
      if (docSnap.exists) {
        const data = docSnap.data();
        console.log("Document data:", data);
        if (data.googleToken !== undefined) {
          console.log("Document youtubeToken:", data.googleToken);
          // Redirige to youtube area si connecté
          window.location.href = "/youtube/area"
        }
      }
    }
    // Don't need await here useEffect handle it
    getyoutubeToken()
  });

  const Oauthyoutube = async () => {
    window.localStorage.setItem('yt', 'true');
    try {
      const response = await axios.get("http://localhost:8080/google/oauth2/authorize")
      urlOauth = response.data.message;
      window.location.href = urlOauth;
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="youtube">
      <div className="youtube-container">
        <button className="myButton-youtube" onClick={() => Oauthyoutube()}>
          <img src={youtubeLogo} alt="logo" className="youtube-logo" /> Login youtube
        </button>
      </div>
    </div>
  );
} 