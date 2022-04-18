import "./spotify.scss";
import axios from "axios";
// import { auth } from '../../components/firebase/firebase';
import { getDoc, doc } from "firebase/firestore";
import db from "../../components/firebase/firebase";
import React, { useState, useEffect } from "react";
import SpotifyLogo from '../../assets/spotify.png';

export default function Spotify() {
  const [userId] = useState(window.localStorage.getItem('uid'));
  // Si const [urlOauth, setUrlOauth] = useState("");
  // setUrlOauth refresh la page et on perde l'authorize url
  // sans setter pas de refresh et utiliser urlOaurh = "http://localhost......."
  var [urlOauth] = useState("");
  
  // Équivalent à componentDidMount plus componentDidUpdate :
  useEffect(() => {
    const getSpotifyToken = async () => {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef)
      if (docSnap.exists) {
        const data = docSnap.data();
        console.log("Document data:", data);
        if (data.spotifyToken !== undefined) {
          console.log("Document spotifyToken:", data.spotifyToken);
          // Redirige to spotify area si connecté
          window.location.href = "/spotify/area"
        }
      }
    }
    // Don't need await here useEffect handle it
    getSpotifyToken()
  });

  const OauthSpotify = async () => {
    try {
      const response = await axios.get("http://localhost:8080/spotify/oauth2/authorize")
      urlOauth = response.data.message;
      window.location.href = urlOauth;
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="spotify">
      <div className="spotify-container">
        <button className="myButton-spotify" onClick={() => OauthSpotify()}>
          <img src={SpotifyLogo} alt="logo" className="spotify-logo" /> Login Spotify
        </button>
      </div>
    </div>
  );
} 