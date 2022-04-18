import "./discord.css";
import axios from "axios";
import { getDoc, doc } from "firebase/firestore";
import db from "../../components/firebase/firebase";
import DiscordLogo from '../../assets/discord.png';
import React, { useState, useEffect } from "react";

export default function Discord() {

  const [userId] = useState(window.localStorage.getItem('uid'));
  // Si const [urlOauth, setUrlOauth] = useState("");
  // setUrlOauth refresh la page et on perde l'authorize url
  // sans setter pas de refresh et utiliser urlOaurh = "http://localhost......."
  var [urlOauth] = useState("");

  useEffect(() => {
    const getDiscordToken = async () => {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef)
      if (docSnap.exists) {
        const data = docSnap.data();
        console.log("Document data:", data);
        if (data.discordToken !== undefined) {
          console.log("Document discordToken:", data.discordToken);
          // Redirige to spotify area si connecté
          window.location.href = "/discord/area"
        }
      }
    }
    // Don't need await here useEffect handle it
    getDiscordToken()
  });

  const OauthDiscord = async () => {
    try {
      const response = await axios.get("http://localhost:8080/discord/oauth2/authorize")
      urlOauth = response.data.message;
      window.location.href = urlOauth;
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="discord">
      <div className="discord-container">
       <button className="myButton-discord" onClick={() => OauthDiscord()}>
          <img src={DiscordLogo} alt="logo" className="discord-logo" />Login Discord
        </button>
      </div>
      {/*<a href="http://localhost:8080/discord/oauth2/authorize">  <div className="myButton"> Login Discord </div></a> {/* IMPLEMNTATION DU CALL API SUR UN BOUTON */}
    </div>
  );
}